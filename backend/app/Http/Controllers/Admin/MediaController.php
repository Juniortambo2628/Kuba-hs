<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\SiteSetting;
use App\Services\ImageOptimizationService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Str;
use Spatie\MediaLibrary\MediaCollections\Models\Media;

class MediaController extends Controller
{
    public function __construct(
        private readonly ImageOptimizationService $images
    ) {}

    /**
     * Unified upload — handles both model-bound (user/provider) and generic CMS uploads.
     *
     * Model-bound: requires model_type + model_id, validates ownership, stores in model collection.
     * Generic CMS: stores in a shared 'admin_uploads' collection via SiteSetting container.
     *
     * All uploads go through Spatie MediaLibrary with image optimization.
     */
    public function upload(Request $request): JsonResponse
    {
        $request->validate([
            'file' => 'required|file|max:10240',
            'type' => 'nullable|string',
            'collection' => 'nullable|string',
            'model_type' => 'nullable|string',
            'model_id' => 'nullable|string',
        ]);

        $file = $request->file('file');
        $type = $request->input('type', 'cms');
        $preset = $this->images->presetFromAdminType($type);

        if ($request->filled('model_type') && $request->filled('model_id')) {
            return $this->uploadToModel($request, $file, $preset);
        }

        return $this->uploadGeneric($file, $preset, $type);
    }

    /**
     * Upload to a specific Eloquent model with ownership validation.
     */
    private function uploadToModel(Request $request, $file, string $preset): JsonResponse
    {
        $modelClass = 'App\\Models\\'.Str::studly($request->model_type);

        if (! class_exists($modelClass)) {
            return response()->json(['error' => 'Invalid model type'], 422);
        }

        $model = $modelClass::findOrFail($request->model_id);

        $user = Auth::user();
        if (! $user->isAdmin()) {
            if ($model instanceof \App\Models\User && $model->id !== $user->id) {
                return response()->json(['error' => 'Unauthorized'], 403);
            }
            if ($model instanceof \App\Models\Provider && $model->user_id !== $user->id) {
                return response()->json(['error' => 'Unauthorized'], 403);
            }
            if ($model instanceof \App\Models\ProviderService && $model->provider->user_id !== $user->id) {
                return response()->json(['error' => 'Unauthorized'], 403);
            }
        }

        $collection = $request->input('collection', Str::plural($request->model_type));

        $media = $model->addMedia($file)->toMediaCollection($collection);
        $this->images->optimizeMedia($media, $preset);

        $this->clearRelatedCache($model);

        return response()->json([
            'url' => $media->getFullUrl(),
            'id' => $media->id,
        ]);
    }

    /**
     * Generic CMS upload — stores via SiteSetting as Spatie container.
     */
    private function uploadGeneric($file, string $preset, string $type): JsonResponse
    {
        $container = SiteSetting::firstOrCreate(
            ['key' => 'media_container'],
            ['value' => 'Generic media container for CMS uploads']
        );

        $collection = match ($type) {
            'avatar' => 'avatars',
            'logo' => 'logos',
            'category_thumbnail' => 'thumbnails',
            default => 'admin_uploads',
        };

        $media = $container->addMedia($file)->toMediaCollection($collection);
        $this->images->optimizeMedia($media, $preset);

        return response()->json([
            'url' => $media->getFullUrl(),
            'id' => $media->id,
        ]);
    }

    /**
     * Delete a media item by its Spatie media ID.
     */
    public function destroy(string $id): JsonResponse
    {
        $media = Media::find($id);

        if (! $media) {
            return response()->json(['error' => 'Media not found'], 404);
        }

        $media->delete();

        return response()->json(['message' => 'Media deleted successfully']);
    }

    private function clearRelatedCache($model): void
    {
        if ($model instanceof \App\Models\Service) {
            \Illuminate\Support\Facades\Cache::forget('api_categories_all');
        }
        if ($model instanceof \App\Models\Provider) {
            \Illuminate\Support\Facades\Cache::forget('api_providers_latest');
            \Illuminate\Support\Facades\Cache::forget('api_top_providers');
        }
    }
}

<?php

namespace App\Http\Controllers;

use App\Services\ImageOptimizationService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Str;

class MediaController extends Controller
{
    public function __construct(
        private readonly ImageOptimizationService $images
    ) {}

    /**
     * Handle generic media upload for authorized models.
     */
    public function upload(Request $request): JsonResponse
    {
        $request->validate([
            'file' => 'required|image|max:10240',
            'collection' => 'required|string',
            'model_type' => 'required|string',
            'model_id' => 'required|string',
        ]);

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

        $media = $model->addMediaFromRequest('file')
            ->toMediaCollection($request->collection);

        $preset = $this->images->presetFromCollection($request->collection, $request->model_type);
        $this->images->optimizeMedia($media, $preset);

        if ($request->collection === 'thumbnail' && $model instanceof \App\Models\Service) {
            Cache::forget('api_categories_all');
        }
        if ($model instanceof \App\Models\Provider) {
            Cache::forget('api_providers_latest');
            Cache::forget('api_top_providers');
        }

        return response()->json([
            'message' => 'File uploaded successfully',
            'url' => $media->getFullUrl(),
            'id' => $media->id,
        ]);
    }

    /**
     * Delete a media item.
     */
    public function destroy($id): JsonResponse
    {
        $media = \Spatie\MediaLibrary\MediaCollections\Models\Media::findOrFail($id);

        $model = $media->model;
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

        $media->delete();

        return response()->json(['message' => 'Media deleted successfully']);
    }
}

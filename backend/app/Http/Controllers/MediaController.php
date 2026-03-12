<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Str;

class MediaController extends Controller
{
    /**
     * Handle generic media upload for authorized models.
     */
    public function upload(Request $request)
    {
        $request->validate([
            'file' => 'required|image|max:10240', // 10MB limit
            'collection' => 'required|string',
            'model_type' => 'required|string',
            'model_id' => 'required|string',
        ]);

        $modelClass = "App\\Models\\" . Str::studly($request->model_type);
        
        if (!class_exists($modelClass)) {
            return response()->json(['error' => 'Invalid model type'], 422);
        }

        $model = $modelClass::findOrFail($request->model_id);

        // Simple authorization check: user must own the model or be admin
        // This is a basic check, can be refined per model
        $user = Auth::user();
        if (!$user->isAdmin()) {
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

        return response()->json([
            'message' => 'File uploaded successfully',
            'url' => $media->getFullUrl(),
            'id' => $media->id
        ]);
    }

    /**
     * Delete a media item.
     */
    public function destroy($id)
    {
        $media = \Spatie\MediaLibrary\MediaCollections\Models\Media::findOrFail($id);

        // Authorization check: user must own the model the media belongs to or be admin
        $model = $media->model;
        $user = Auth::user();

        if (!$user->isAdmin()) {
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

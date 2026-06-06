<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\UserFavorite;
use App\Models\Provider;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class FavoriteController extends Controller
{
    /**
     * List the authenticated user's favorite provider IDs.
     */
    public function index(Request $request): JsonResponse
    {
        $favorites = UserFavorite::where('user_id', $request->user()->id)->get();
        $favoriteIds = $favorites->pluck('provider_id');

        $providers = Provider::whereIn('id', $favoriteIds)
            ->with(['user', 'providerServices.service'])
            ->withCount('reviews')
            ->withAvg('reviews', 'rating')
            ->get();

        return response()->json([
            'data' => $favoriteIds,
            'providers' => \App\Http\Resources\ProviderResource::collection($providers)
        ]);
    }

    /**
     * Toggle a provider as favorite (add if missing, remove if exists).
     */
    public function toggle(Request $request, Provider $provider): JsonResponse
    {
        $userId = $request->user()->id;

        $existing = UserFavorite::where('user_id', $userId)
            ->where('provider_id', $provider->id)
            ->first();

        if ($existing) {
            $existing->delete();
            return response()->json([
                'message' => 'Removed from favorites',
                'is_favorited' => false,
            ]);
        }

        UserFavorite::create([
            'user_id' => $userId,
            'provider_id' => $provider->id,
        ]);

        return response()->json([
            'message' => 'Added to favorites',
            'is_favorited' => true,
        ], 201);
    }
}

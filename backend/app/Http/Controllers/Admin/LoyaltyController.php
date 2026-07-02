<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Resources\LoyaltyPointResource;
use App\Http\Resources\LoyaltyTierResource;
use App\Models\LoyaltyPoint;
use App\Models\LoyaltyTier;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class LoyaltyController extends Controller
{
    /**
     * Get all loyalty tiers.
     */
    public function index(): JsonResponse
    {
        return LoyaltyTierResource::collection(LoyaltyTier::orderBy('min_points')->get());
    }

    /**
     * Create a new loyalty tier.
     */
    public function storeTier(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'min_points' => 'required|integer|min:0',
            'benefits' => 'nullable|array',
            'icon' => 'nullable|string',
            'is_active' => 'boolean',
        ]);

        $tier = LoyaltyTier::create($validated);

        return new LoyaltyTierResource($tier);
    }

    /**
     * Update an existing loyalty tier.
     */
    public function updateTier(Request $request, LoyaltyTier $tier): JsonResponse
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'min_points' => 'required|integer|min:0',
            'benefits' => 'nullable|array',
            'icon' => 'nullable|string',
            'is_active' => 'boolean',
        ]);

        $tier->update($validated);

        return new LoyaltyTierResource($tier);
    }

    /**
     * Delete a loyalty tier.
     */
    public function destroyTier(LoyaltyTier $tier): JsonResponse
    {
        $tier->delete();

        return response()->json(['message' => 'Tier deleted successfully']);
    }

    /**
     * Get recent point transactions.
     */
    public function transactions(Request $request): JsonResponse
    {
        $query = LoyaltyPoint::with('user');

        if ($request->filled('user_id')) {
            $query->where('user_id', $request->user_id);
        }

        return LoyaltyPointResource::collection($query->latest()->paginate(50));
    }

    /**
     * Award points to a user.
     */
    public function awardPoints(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'user_id' => 'required|exists:users,id',
            'points' => 'required|integer|min:1',
            'description' => 'required|string',
            'type' => 'required|in:earn,redeem',
        ]);

        $transaction = LoyaltyPoint::create([
            'user_id' => $validated['user_id'],
            'points' => $validated['points'],
            'description' => $validated['description'],
            'transaction_type' => $validated['type'],
        ]);

        return new LoyaltyPointResource($transaction->load('user'));
    }
}

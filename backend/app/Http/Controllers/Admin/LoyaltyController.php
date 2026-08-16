<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\StoreLoyaltyTierRequest;
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
    public function index() {
        return LoyaltyTierResource::collection(LoyaltyTier::orderBy('min_points')->get());
    }

    /**
     * Create a new loyalty tier.
     */
    public function storeTier(StoreLoyaltyTierRequest $request) {
        $validated = $request->validated();

        $tier = LoyaltyTier::create($validated);

        return new LoyaltyTierResource($tier);
    }

    /**
     * Update an existing loyalty tier.
     */
    public function updateTier(StoreLoyaltyTierRequest $request, LoyaltyTier $tier) {
        $validated = $request->validated();

        $tier->update($validated);

        return new LoyaltyTierResource($tier);
    }

    /**
     * Delete a loyalty tier.
     */
    public function destroyTier(LoyaltyTier $tier) {
        $tier->delete();

        return response()->json(['message' => 'Tier deleted successfully']);
    }

    /**
     * Get recent point transactions.
     */
    public function transactions(Request $request) {
        $query = LoyaltyPoint::with('user');

        if ($request->filled('user_id')) {
            $query->where('user_id', $request->user_id);
        }

        return LoyaltyPointResource::collection($query->latest()->paginate(50));
    }

    /**
     * Award points to a user.
     */
    public function awardPoints(Request $request) {
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

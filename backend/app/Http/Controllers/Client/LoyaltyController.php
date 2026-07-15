<?php

namespace App\Http\Controllers\Client;

use App\Http\Controllers\Controller;
use App\Http\Resources\LoyaltyPointResource;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class LoyaltyController extends Controller
{
    public function index() {
        $user = Auth::user()->load('loyaltyPoints');
        $rewards = \App\Models\LoyaltyTier::where('is_active', true)->orderBy('min_points')->get();

        return response()->json([
            'points' => (int) $user->total_points,
            'tier' => $user->membership_tier,
            'history' => LoyaltyPointResource::collection($user->loyaltyPoints()->latest()->get()),
            'available_rewards' => $rewards,
        ]);
    }

    public function redeem(Request $request) {
        $validated = $request->validate([
            'reward_type' => 'required|string',
            'points' => 'required|integer|min:1',
        ]);

        try {
            $user = Auth::user();
            $result = app(\App\Services\LoyaltyService::class)->redeemPoints(
                $user,
                $validated['points'],
                $validated['reward_type']
            );

            return response()->json([
                'message' => 'Reward redeemed successfully',
                'new_balance' => (int) $user->fresh()->total_points,
                'voucher_code' => $result['voucher_code'],
            ]);
        } catch (\Exception $e) {
            return response()->json(['message' => $e->getMessage()], 400);
        }
    }
}

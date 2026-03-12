<?php

namespace App\Services;

use App\Models\User;
use App\Models\LoyaltyPoint;
use App\Models\Booking;
use Illuminate\Support\Facades\DB;

class LoyaltyService
{
    /**
     * Award points to a user based on a completed booking.
     * Rule: 10 points per 1 USD.
     */
    public function awardPointsForBooking(Booking $booking)
    {
        if ($booking->status !== 'completed') {
            return;
        }

        // Get total amount from payment if available, otherwise fallback to provider service base price
        $amount = 0;
        if ($booking->payment) {
            $amount = $booking->payment->amount;
        } else if ($booking->providerService) {
            $amount = $booking->providerService->base_price;
        }

        if ($amount <= 0) {
            return;
        }

        $points = floor($amount * 10);

        DB::transaction(function () use ($booking, $points) {
            LoyaltyPoint::create([
                'user_id' => $booking->customer_id,
                'points' => $points,
                'description' => "Points earned for booking #{$booking->booking_number}",
                'transaction_type' => 'earn',
            ]);

            // Update user total points if we had a column for it, 
            // but the KI/current models seem to calculate it on the fly or via sum.
            // Let's check User model for any 'points' field.
        });

        return $points;
    }

    /**
     * Award points for leaving a review.
     */
    public function awardPointsForReview(Booking $booking)
    {
        $points = 50; // Flat reward for engagement

        return DB::transaction(function () use ($booking, $points) {
            return LoyaltyPoint::create([
                'user_id' => $booking->customer_id,
                'points' => $points,
                'description' => "Reward for reviewing booking #{$booking->booking_number}",
                'transaction_type' => 'earn',
            ]);
        });
    }

    /**
     * Revert points if a booking is cancelled.
     */
    public function revertPointsForBooking(Booking $booking)
    {
        $earnedEntry = LoyaltyPoint::where('user_id', $booking->customer_id)
            ->where('description', 'LIKE', "%#{$booking->booking_number}%")
            ->where('transaction_type', 'earn')
            ->first();

        if (!$earnedEntry) return;

        return DB::transaction(function () use ($booking, $earnedEntry) {
            return LoyaltyPoint::create([
                'user_id' => $booking->customer_id,
                'points' => -$earnedEntry->points,
                'description' => "Points reversed due to booking #{$booking->booking_number} cancellation",
                'transaction_type' => 'redeem', // Treating reversal as a deduction
            ]);
        });
    }

    /**
     * Redeem points for a reward.
     */
    public function redeemPoints(User $user, int $points, string $rewardType)
    {
        $currentPoints = LoyaltyPoint::where('user_id', $user->id)->sum('points');

        if ($currentPoints < $points) {
            throw new \Exception("Insufficient points balance.");
        }

        return DB::transaction(function () use ($user, $points, $rewardType) {
            LoyaltyPoint::create([
                'user_id' => $user->id,
                'points' => -$points,
                'description' => "Redeemed for {$rewardType}",
                'transaction_type' => 'redeem',
            ]);

            // Generate a simple voucher code
            $voucherCode = 'KUBA-' . strtoupper(bin2hex(random_bytes(4)));

            return [
                'points_deducted' => $points,
                'voucher_code' => $voucherCode,
            ];
        });
    }
}

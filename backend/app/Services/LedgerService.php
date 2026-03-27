<?php

namespace App\Services;

use App\Models\Booking;
use App\Models\Payout;
use App\Models\Provider;
use Illuminate\Support\Facades\DB;
use Exception;

class LedgerService
{
    /**
     * Credit a provider for a completed booking.
     */
    public function creditProviderForBooking(Booking $booking): void
    {
        if ($booking->status !== 'completed' || !$booking->provider_id) {
            return;
        }

        // Ideally, we'd check if the booking's payment implies we owe them
        // Let's assume provider gets final_price (could subtract a platform_fee here)
        $amountOwed = $booking->getTotalPriceAttribute();

        if ($amountOwed <= 0) {
            return;
        }

        DB::transaction(function () use ($booking, $amountOwed) {
            $provider = $booking->provider;
            
            // Atomically increment balances
            $provider->increment('balance', $amountOwed);
            $provider->increment('total_earned', $amountOwed);
        });
    }

    /**
     * Provider requests a payout.
     */
    public function requestPayout(Provider $provider, float $amount, ?string $paymentMethod = null): Payout
    {
        if ($amount <= 0) {
            throw new Exception("Payout amount must be greater than zero.");
        }

        if ($provider->balance < $amount) {
            throw new Exception("Insufficient balance to request payout.");
        }

        return DB::transaction(function () use ($provider, $amount, $paymentMethod) {
            // Deduct initially to hold the funds (pending status)
            $provider->decrement('balance', $amount);

            return $provider->payouts()->create([
                'amount' => $amount,
                'status' => 'pending',
                'payment_method' => $paymentMethod ?? 'bank_transfer',
            ]);
        });
    }

    /**
     * Admin processes a payout request.
     */
    public function processPayout(Payout $payout, string $status, ?string $referenceNumber = null, ?string $notes = null): Payout
    {
        if (!in_array($status, ['approved', 'processing', 'paid', 'rejected'])) {
            throw new Exception("Invalid status provided.");
        }

        if ($payout->status === 'paid' || $payout->status === 'rejected') {
            throw new Exception("Payout cannot be modified once fully paid or rejected.");
        }

        DB::transaction(function () use ($payout, $status, $referenceNumber, $notes) {
            if ($status === 'rejected') {
                // Refund the held amount back to provider balance
                $payout->provider->increment('balance', $payout->amount);
            }

            $payout->update([
                'status' => $status,
                'reference_number' => $referenceNumber ?? $payout->reference_number,
                'notes' => $notes ?? $payout->notes,
                'processed_at' => in_array($status, ['paid', 'rejected']) ? now() : $payout->processed_at,
            ]);
        });

        return $payout;
    }
}

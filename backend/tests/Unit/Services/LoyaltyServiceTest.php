<?php

use App\Models\LoyaltyPoint;
use App\Models\User;
use App\Services\LoyaltyService;
use Illuminate\Foundation\Testing\RefreshDatabase;

uses(RefreshDatabase::class);

describe('LoyaltyService', function () {
    beforeEach(function () {
        $this->service = new LoyaltyService;
        $this->customer = User::factory()->create(['role' => 'customer']);
    });

    it('redeems points successfully', function () {
        LoyaltyPoint::create([
            'user_id' => $this->customer->id,
            'points' => 500,
            'description' => 'Earned points',
            'transaction_type' => 'earn',
        ]);

        $result = $this->service->redeemPoints($this->customer, 200, 'free_cleaning');

        expect($result['points_deducted'])->toBe(200);
        expect($result['voucher_code'])->toStartWith('KUBA-');
        expect(LoyaltyPoint::where('user_id', $this->customer->id)->sum('points'))->toBe(300);
    });

    it('throws exception when insufficient points', function () {
        LoyaltyPoint::create([
            'user_id' => $this->customer->id,
            'points' => 50,
            'description' => 'Few points',
            'transaction_type' => 'earn',
        ]);

        $this->service->redeemPoints($this->customer, 200, 'free_cleaning');
    })->throws(\Exception::class, 'Insufficient points balance.');

    it('reverts points when booking is cancelled', function () {
        $booking = \App\Models\Booking::factory()->create([
            'customer_id' => $this->customer->id,
        ]);

        LoyaltyPoint::create([
            'user_id' => $this->customer->id,
            'points' => 500,
            'description' => "Points earned for booking #{$booking->booking_number}",
            'transaction_type' => 'earn',
        ]);

        $result = $this->service->revertPointsForBooking($booking);

        expect($result)->not->toBeNull();
        $totalPoints = LoyaltyPoint::where('user_id', $this->customer->id)->sum('points');
        expect($totalPoints)->toBe(0);
    });

    it('does nothing when reverting non-existent points', function () {
        $booking = \App\Models\Booking::factory()->create([
            'customer_id' => $this->customer->id,
        ]);

        $result = $this->service->revertPointsForBooking($booking);
        expect($result)->toBeNull();
    });
});

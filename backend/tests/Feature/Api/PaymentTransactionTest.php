<?php

use App\Models\Payment;
use App\Models\User;
use App\Models\Provider;

describe('payment transactions API', function () {
    beforeEach(function () {
        $this->customer = User::factory()->create(['role' => 'customer']);
        $this->providerUser = User::factory()->create(['role' => 'provider']);
        $this->provider = Provider::factory()->create(['user_id' => $this->providerUser->id]);
    });

    it('returns customer transactions', function () {
        $booking = \App\Models\Booking::factory()->create([
            'customer_id' => $this->customer->id,
            'provider_id' => $this->provider->id,
        ]);
        Payment::factory()->create([
            'customer_id' => $this->customer->id,
            'provider_id' => $this->provider->id,
            'booking_id' => $booking->id,
            'status' => 'completed',
        ]);

        $response = $this->actingAs($this->customer)
            ->getJson('/api/payments/client/transactions');

        $response->assertOk();
    });

    it('returns provider transactions', function () {
        $booking = \App\Models\Booking::factory()->create([
            'customer_id' => $this->customer->id,
            'provider_id' => $this->provider->id,
        ]);
        Payment::factory()->create([
            'customer_id' => $this->customer->id,
            'provider_id' => $this->provider->id,
            'booking_id' => $booking->id,
            'status' => 'completed',
        ]);

        $response = $this->actingAs($this->providerUser)
            ->getJson('/api/payments/provider/transactions');

        $response->assertOk();
    });

    it('prevents non-provider from accessing provider transactions', function () {
        $response = $this->actingAs($this->customer)
            ->getJson('/api/payments/provider/transactions');

        $response->assertForbidden();
    });
});

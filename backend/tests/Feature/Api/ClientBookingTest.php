<?php

use App\Models\Booking;
use App\Models\Provider;
use App\Models\Service;
use App\Models\ServiceCategory;
use App\Models\User;

describe('client bookings API', function () {
    beforeEach(function () {
        $this->customer = User::factory()->create(['role' => 'customer']);
        $this->provider = Provider::factory()->create();
        $this->category = ServiceCategory::factory()->create();
        $this->service = Service::factory()->create(['category_id' => $this->category->id]);
    });

    it('returns paginated bookings for authenticated customer', function () {
        Booking::factory()->count(3)->create([
            'customer_id' => $this->customer->id,
            'provider_id' => $this->provider->id,
            'service_id' => $this->service->id,
        ]);

        $response = $this->actingAs($this->customer)
            ->getJson('/api/client/bookings');

        $response->assertOk();
    });

    it('returns single booking for authenticated customer', function () {
        $booking = Booking::factory()->create([
            'customer_id' => $this->customer->id,
            'provider_id' => $this->provider->id,
            'service_id' => $this->service->id,
        ]);

        $response = $this->actingAs($this->customer)
            ->getJson("/api/client/bookings/{$booking->id}");

        $response->assertOk();
    });

    it('prevents customer from viewing other customer booking', function () {
        $otherCustomer = User::factory()->create(['role' => 'customer']);
        $booking = Booking::factory()->create([
            'customer_id' => $this->customer->id,
            'provider_id' => $this->provider->id,
            'service_id' => $this->service->id,
        ]);

        $response = $this->actingAs($otherCustomer)
            ->getJson("/api/client/bookings/{$booking->id}");

        $response->assertForbidden();
    });

    it('allows customer to cancel a pending booking', function () {
        $booking = Booking::factory()->create([
            'customer_id' => $this->customer->id,
            'provider_id' => $this->provider->id,
            'service_id' => $this->service->id,
            'status' => 'pending',
        ]);

        $response = $this->actingAs($this->customer)
            ->patchJson("/api/client/bookings/{$booking->id}/cancel", [
                'cancellation_reason' => 'Changed my mind',
            ]);

        $response->assertOk();
        expect($booking->fresh()->status->value)->toBe('cancelled');
    });

    it('prevents cancelling a completed booking', function () {
        $booking = Booking::factory()->create([
            'customer_id' => $this->customer->id,
            'provider_id' => $this->provider->id,
            'service_id' => $this->service->id,
            'status' => 'completed',
        ]);

        $response = $this->actingAs($this->customer)
            ->patchJson("/api/client/bookings/{$booking->id}/cancel");

        $response->assertStatus(422);
    });

    it('prevents customer from cancelling other customer booking', function () {
        $otherCustomer = User::factory()->create(['role' => 'customer']);
        $booking = Booking::factory()->create([
            'customer_id' => $this->customer->id,
            'provider_id' => $this->provider->id,
            'service_id' => $this->service->id,
            'status' => 'pending',
        ]);

        $response = $this->actingAs($otherCustomer)
            ->patchJson("/api/client/bookings/{$booking->id}/cancel");

        $response->assertForbidden();
    });
});

describe('provider bookings API', function () {
    beforeEach(function () {
        $this->user = User::factory()->create(['role' => 'provider']);
        $this->provider = Provider::factory()->create(['user_id' => $this->user->id]);
        $this->customer = User::factory()->create(['role' => 'customer']);
        $this->category = ServiceCategory::factory()->create();
        $this->service = Service::factory()->create(['category_id' => $this->category->id]);
    });

    it('returns paginated bookings for provider', function () {
        Booking::factory()->count(3)->create([
            'customer_id' => $this->customer->id,
            'provider_id' => $this->provider->id,
            'service_id' => $this->service->id,
        ]);

        $response = $this->actingAs($this->user)
            ->getJson('/api/provider/bookings');

        $response->assertOk();
    });

    it('returns single booking for provider', function () {
        $booking = Booking::factory()->create([
            'customer_id' => $this->customer->id,
            'provider_id' => $this->provider->id,
            'service_id' => $this->service->id,
        ]);

        $response = $this->actingAs($this->user)
            ->getJson("/api/provider/bookings/{$booking->id}");

        $response->assertOk();
    });

    it('prevents provider from viewing other provider booking', function () {
        $otherUser = User::factory()->create(['role' => 'provider']);
        $otherProvider = Provider::factory()->create(['user_id' => $otherUser->id]);
        $booking = Booking::factory()->create([
            'customer_id' => $this->customer->id,
            'provider_id' => $this->provider->id,
            'service_id' => $this->service->id,
        ]);

        $response = $this->actingAs($otherUser)
            ->getJson("/api/provider/bookings/{$booking->id}");

        $response->assertForbidden();
    });
});

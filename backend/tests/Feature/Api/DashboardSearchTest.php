<?php

use App\Models\Provider;
use App\Models\User;

describe('dashboard search API', function () {
    beforeEach(function () {
        $this->customer = User::factory()->create([
            'role' => 'customer',
            'first_name' => 'John',
            'last_name' => 'Doe',
        ]);
        $this->providerUser = User::factory()->create([
            'role' => 'provider',
            'first_name' => 'Jane',
            'last_name' => 'Smith',
        ]);
        $this->provider = Provider::factory()->create([
            'user_id' => $this->providerUser->id,
            'business_name' => 'Clean Pro Services',
        ]);
    });

    it('returns empty results for short query', function () {
        $response = $this->actingAs($this->customer)
            ->getJson('/api/dashboard/search?search=ab');

        $response->assertOk();
        $response->assertJson(['data' => []]);
    });

    it('searches bookings for customer', function () {
        $category = \App\Models\ServiceCategory::factory()->create();
        $service = \App\Models\Service::factory()->create([
            'category_id' => $category->id,
            'name' => 'Deep Cleaning',
        ]);
        \App\Models\Booking::factory()->create([
            'customer_id' => $this->customer->id,
            'provider_id' => $this->provider->id,
            'service_id' => $service->id,
            'booking_number' => 'BK-TEST1234',
        ]);

        $response = $this->actingAs($this->customer)
            ->getJson('/api/dashboard/search?search=BK-TEST');

        $response->assertOk();
        $response->assertJsonCount(1, 'data');
    });

    it('searches users for admin', function () {
        $admin = User::factory()->create(['role' => 'admin']);

        $response = $this->actingAs($admin)
            ->getJson('/api/dashboard/search?search=John');

        $response->assertOk();
    });

    it('searches providers for admin', function () {
        $admin = User::factory()->create(['role' => 'admin']);

        $response = $this->actingAs($admin)
            ->getJson('/api/dashboard/search?search=Clean Pro');

        $response->assertOk();
    });

    it('requires authentication', function () {
        $response = $this->getJson('/api/dashboard/search?search=test');

        $response->assertUnauthorized();
    });
});

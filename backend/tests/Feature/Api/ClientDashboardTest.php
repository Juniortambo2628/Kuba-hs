<?php

use App\Models\Booking;
use App\Models\User;

test('client dashboard returns stats', function () {
    $customer = createCustomer();
    Booking::factory()->count(2)->create(['customer_id' => $customer->id, 'status' => 'completed']);
    Booking::factory()->count(1)->create(['customer_id' => $customer->id, 'status' => 'pending']);

    $response = $this->actingAs($customer)->getJson('/api/client/dashboard');

    $response->assertOk()
        ->assertJsonStructure([
            'data' => [
                'total_bookings',
                'active_bookings',
                'completed_bookings',
                'total_spent',
                'recent_activity'
            ]
        ]);
});

test('provider cannot access client dashboard', function () {
    $provider = createProviderUser();

    $response = $this->actingAs($provider)->getJson('/api/client/dashboard');

    $response->assertForbidden();
});

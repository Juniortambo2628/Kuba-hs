<?php

test('admin dashboard returns analytics', function () {
    $admin = createAdmin();

    $response = $this->actingAs($admin)->getJson('/api/admin/dashboard');

    $response->assertOk()
        ->assertJsonStructure([
            'stats' => [
                'users',
                'providers',
                'bookings',
                'completed_bookings',
                'revenue',
            ]
        ]);
});

test('admin analytics endpoint works', function () {
    $admin = createAdmin();

    $response = $this->actingAs($admin)->getJson('/api/admin/analytics?period=monthly');

    $response->assertOk();
});

test('non-admin cannot access admin dashboard', function () {
    $customer = createCustomer();

    $response = $this->actingAs($customer)->getJson('/api/admin/dashboard');

    $response->assertForbidden();
});

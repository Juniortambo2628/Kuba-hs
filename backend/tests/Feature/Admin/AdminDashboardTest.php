<?php

test('admin dashboard returns analytics', function () {
    $admin = createAdmin();

    $response = $this->actingAs($admin)->getJson('/api/admin/dashboard');

    $response->assertOk()
        ->assertJsonStructure([
            'data' => [
                'total_users',
                'total_providers',
                'active_bookings',
                'total_revenue',
                'recent_activity'
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

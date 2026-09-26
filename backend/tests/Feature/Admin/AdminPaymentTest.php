<?php

use App\Models\Payment;

test('admin can list payments', function () {
    $admin = createAdmin();
    Payment::factory()->count(3)->create();

    $response = $this->actingAs($admin)->getJson('/api/admin/payments');

    $response->assertOk();
});

test('admin can view finance charts', function () {
    $admin = createAdmin();
    
    $response = $this->actingAs($admin)->getJson('/api/admin/financials/charts');

    $response->assertOk()
        ->assertJsonStructure([
            'stats' => [
                'total_volume',
                'total_platform_fees',
                'total_provider_payouts',
                'pending_payouts',
            ]
        ]);
});

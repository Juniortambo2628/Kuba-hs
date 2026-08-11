<?php

use App\Models\Payment;

test('admin can list payments', function () {
    $admin = createAdmin();
    Payment::factory()->count(3)->create();

    $response = $this->actingAs($admin)->getJson('/api/admin/payments');

    $response->assertOk();
});

test('admin can view finance overview', function () {
    $admin = createAdmin();
    
    $response = $this->actingAs($admin)->getJson('/api/admin/finance');

    $response->assertOk()
        ->assertJsonStructure([
            'data' => [
                'total_revenue',
                'total_payouts',
                'pending_payouts',
                'platform_fees'
            ]
        ]);
});

test('admin can view finance transactions', function () {
    $admin = createAdmin();
    
    $response = $this->actingAs($admin)->getJson('/api/admin/finance/transactions');

    $response->assertOk();
});

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

test('payment search honours the status filter', function () {
    $admin = createAdmin();
    Payment::factory()->create(['transaction_id' => 'TX-MATCHED', 'status' => 'completed']);
    Payment::factory()->create(['transaction_id' => 'TX-OTHER', 'status' => 'failed']);

    $response = $this->actingAs($admin)->getJson('/api/admin/payments?search=TX-MATCHED&status=failed');

    $response->assertOk();
    expect($response->json('payments.data'))->toBeEmpty();
});

test('payment search still matches a customer name', function () {
    $admin = createAdmin();
    Payment::factory()->create(['transaction_id' => 'TX-UNRELATED']);

    $customer = \App\Models\User::factory()->create(['first_name' => 'Zipporah', 'last_name' => 'Mwangi']);
    Payment::factory()->create(['customer_id' => $customer->id]);

    $response = $this->actingAs($admin)->getJson('/api/admin/payments?search=Zipporah');

    $response->assertOk();
    expect($response->json('payments.data'))->toHaveCount(1);
});

<?php

use App\Models\Payout;
use App\Models\Provider;

test('admin can list payouts', function () {
    $admin = createAdmin();
    Payout::factory()->count(3)->create();

    $response = $this->actingAs($admin)->getJson('/api/admin/finance/payouts');

    $response->assertOk();
});

test('admin can process payout', function () {
    $admin = createAdmin();
    $provider = Provider::factory()->create(['balance' => 1000]);
    $payout = Payout::factory()->create([
        'provider_id' => $provider->id,
        'amount' => 500,
        'status' => 'pending'
    ]);

    $response = $this->actingAs($admin)->postJson("/api/admin/finance/payouts/{$payout->id}/process", [
        'payment_method' => 'mpesa',
        'reference_number' => 'RECEIPT123',
    ]);

    $response->assertOk();
    $this->assertDatabaseHas('payouts', [
        'id' => $payout->id,
        'status' => 'paid',
        'reference_number' => 'RECEIPT123'
    ]);
});

<?php

use App\Models\Payment;
use App\Models\Payout;
use App\Models\Provider;

test('admin can list payouts', function () {
    $admin = createAdmin();
    Payout::factory()->count(3)->create();

    $response = $this->actingAs($admin)->getJson('/api/admin/financials/payouts');

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

    $response = $this->actingAs($admin)->postJson("/api/admin/financials/payouts/{$payout->id}/process", [
        'status' => 'paid',
        'reference_number' => 'RECEIPT123',
    ]);

    $response->assertOk();
    $this->assertDatabaseHas('payouts', [
        'id' => $payout->id,
        'status' => 'paid',
        'reference_number' => 'RECEIPT123'
    ]);
});

test('payout search honours the status filter', function () {
    $admin = createAdmin();
    Payout::factory()->create(['reference_number' => 'REF-MATCHED', 'status' => 'paid']);
    Payout::factory()->create(['reference_number' => 'REF-OTHER', 'status' => 'pending']);

    $response = $this->actingAs($admin)->getJson('/api/admin/financials/payouts?search=REF-MATCHED&status=pending');

    $response->assertOk();
    expect($response->json('data'))->toBeEmpty();
});

test('financial overview reports platform revenue rather than gross booking value', function () {
    $admin = createAdmin();

    Payment::factory()->create(['status' => 'completed', 'platform_fee' => 100]);
    Payment::factory()->create(['status' => 'completed', 'platform_fee' => 150]);
    Payment::factory()->create(['status' => 'pending', 'platform_fee' => 999]);

    // A completed booking worth far more than the fees it produced - the tile
    // is labelled "Total Platform Revenue", so booking value must not leak in.
    \App\Models\Booking::factory()->create(['status' => 'completed', 'final_price' => 50000]);

    $response = $this->actingAs($admin)->getJson('/api/admin/financials/overview');

    $response->assertOk();
    expect((float) $response->json('total_revenue'))->toBe(250.0);
});

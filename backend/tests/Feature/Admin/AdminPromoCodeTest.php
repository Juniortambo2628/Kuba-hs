<?php

use App\Models\PromoCode;

test('admin can manage promo codes', function () {
    $admin = createAdmin();
    $promo = PromoCode::factory()->create();

    // List
    $this->actingAs($admin)->getJson('/api/admin/promo-codes')->assertOk();

    // Create
    $this->actingAs($admin)->postJson('/api/admin/promo-codes', [
        'code' => 'NEW50',
        'discount_type' => 'percentage',
        'discount_value' => 50,
        'is_active' => true,
        'start_date' => now()->format('Y-m-d H:i:s'),
        'end_date' => now()->addMonth()->format('Y-m-d H:i:s'),
    ])->assertCreated();

    // Update status
    $this->actingAs($admin)->patchJson("/api/admin/promo-codes/{$promo->id}/status", [
        'is_active' => false
    ])->assertOk();

    // Delete
    $this->actingAs($admin)->deleteJson("/api/admin/promo-codes/{$promo->id}")->assertOk();
});

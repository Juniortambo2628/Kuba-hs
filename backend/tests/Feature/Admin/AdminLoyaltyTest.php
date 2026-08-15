<?php

use App\Models\LoyaltyTier;
use App\Models\LoyaltyPoint;

test('admin can manage loyalty tiers', function () {
    $admin = createAdmin();
    $tier = LoyaltyTier::factory()->create();

    // List
    $this->actingAs($admin)->getJson('/api/admin/loyalty/tiers')->assertOk();

    // Create
    $this->actingAs($admin)->postJson('/api/admin/loyalty/tiers', [
        'name' => 'Silver',
        'min_points' => 500,
        'benefits' => ['Discount'],
        'is_active' => true
    ])->assertCreated();

    // Update
    $this->actingAs($admin)->putJson("/api/admin/loyalty/tiers/{$tier->id}", [
        'name' => 'Gold',
        'min_points' => 1000,
        'benefits' => ['More Discount'],
        'is_active' => true
    ])->assertOk();

    // Delete
    $this->actingAs($admin)->deleteJson("/api/admin/loyalty/tiers/{$tier->id}")->assertOk();
});

test('admin can award points to user', function () {
    $admin = createAdmin();
    $user = createCustomer();

    $response = $this->actingAs($admin)->postJson('/api/admin/loyalty/reward', [
        'user_id' => $user->id,
        'points' => 100,
        'description' => 'Bonus points',
        'type' => 'earn'
    ]);

    $response->assertCreated();
    $this->assertDatabaseHas('loyalty_points', [
        'user_id' => $user->id,
        'points' => 100,
        'transaction_type' => 'earn'
    ]);
});

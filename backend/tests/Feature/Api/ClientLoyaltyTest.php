<?php

use App\Models\LoyaltyPoint;
use App\Models\LoyaltyTier;

test('client can view loyalty stats', function () {
    $customer = createCustomer();
    LoyaltyTier::factory()->create(['name' => 'Bronze', 'min_points' => 0]);
    LoyaltyPoint::factory()->create(['user_id' => $customer->id, 'points' => 50, 'transaction_type' => 'earn']);

    $response = $this->actingAs($customer)->getJson('/api/client/loyalty');

    $response->assertOk()
        ->assertJsonStructure([
            'points',
            'tier',
            'history',
            'available_rewards',
        ]);
});

test('client can redeem points', function () {
    $customer = createCustomer();
    LoyaltyPoint::factory()->create(['user_id' => $customer->id, 'points' => 500, 'transaction_type' => 'earn']);

    $response = $this->actingAs($customer)->postJson('/api/client/loyalty/redeem', [
        'points' => 100,
        'reward_type' => 'discount'
    ]);

    $response->assertOk();
    $this->assertDatabaseHas('loyalty_points', [
        'user_id' => $customer->id,
        'points' => -100,
        'transaction_type' => 'redeem'
    ]);
});

test('client cannot redeem more points than they have', function () {
    $customer = createCustomer();
    LoyaltyPoint::factory()->create(['user_id' => $customer->id, 'points' => 50, 'transaction_type' => 'earned']);

    $response = $this->actingAs($customer)->postJson('/api/client/loyalty/redeem', [
        'points' => 100,
        'reward_type' => 'discount'
    ]);

    $response->assertStatus(400);
});

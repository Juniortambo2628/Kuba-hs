<?php

use App\Models\UserFavorite;
use App\Models\Provider;

test('user can list favorites', function () {
    $customer = createCustomer();
    $provider = Provider::factory()->create();
    UserFavorite::factory()->create([
        'user_id' => $customer->id,
        'provider_id' => $provider->id,
    ]);

    $response = $this->actingAs($customer)->getJson('/api/favorites');

    $response->assertOk()
        ->assertJsonCount(1, 'data');
});

test('user can toggle favorite provider', function () {
    $customer = createCustomer();
    $provider = Provider::factory()->create();

    // Toggle ON
    $response = $this->actingAs($customer)->postJson("/api/favorites/{$provider->id}");
    $response->assertOk();
    $this->assertDatabaseHas('user_favorites', [
        'user_id' => $customer->id,
        'provider_id' => $provider->id,
    ]);

    // Toggle OFF
    $response = $this->actingAs($customer)->postJson("/api/favorites/{$provider->id}");
    $response->assertOk();
    $this->assertDatabaseMissing('user_favorites', [
        'user_id' => $customer->id,
        'provider_id' => $provider->id,
    ]);
});

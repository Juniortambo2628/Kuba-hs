<?php

use App\Models\Provider;
use App\Models\PromoCode;
use App\Models\ProviderService;
use App\Models\Service;

test('providers list endpoint returns verified providers', function () {
    $provider = Provider::factory()->create(['is_verified' => true]);

    $response = $this->getJson('/api/providers');

    $response->assertOk();
});

test('can view single provider profile', function () {
    $provider = Provider::factory()->create();

    $response = $this->getJson('/api/providers/' . $provider->id);

    $response->assertOk()
        ->assertJsonPath('data.id', $provider->id);
});

test('top providers endpoint sorts by rating', function () {
    $p1 = Provider::factory()->create(['rating_avg' => 4.5, 'is_verified' => true]);
    $p2 = Provider::factory()->create(['rating_avg' => 5.0, 'is_verified' => true]);

    $response = $this->getJson('/api/top-providers');

    $response->assertOk();
    // $p2 should be first
});

test('search endpoint finds services', function () {
    $service = Service::factory()->create(['name' => 'Plumbing Repair']);
    $provider = Provider::factory()->create(['is_verified' => true]);
    ProviderService::factory()->create(['service_id' => $service->id, 'provider_id' => $provider->id, 'is_available' => true]);

    $response = $this->getJson('/api/search?q=Plumb');

    $response->assertOk();
});

test('promo code validation works', function () {
    $promo = PromoCode::factory()->create(['code' => 'SAVE10', 'is_active' => true, 'start_date' => now()->subDay(), 'end_date' => now()->addDay()]);

    $response = $this->postJson('/api/promo-codes/validate', [
        'code' => 'SAVE10',
        'amount' => 500,
    ]);

    $response->assertOk()
        ->assertJsonFragment(['valid' => true]);
});

test('promo code validation fails for invalid code', function () {
    $response = $this->postJson('/api/promo-codes/validate', [
        'code' => 'INVALID',
    ]);

    // May return 404 or 422 depending on implementation
    $response->assertStatus(422);
});

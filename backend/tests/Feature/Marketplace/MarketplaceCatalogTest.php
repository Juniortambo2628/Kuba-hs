<?php

use App\Models\ServiceCategory;
use App\Models\Service;
use App\Models\ProviderService;
use App\Models\Provider;

test('categories endpoint returns structured catalog', function () {
    $category = ServiceCategory::factory()->create(['name' => 'Cleaning', 'sort_order' => 1]);
    $service = Service::factory()->create(['category_id' => $category->id, 'name' => 'House Cleaning']);
    $provider = Provider::factory()->create();
    ProviderService::factory()->create([
        'service_id' => $service->id,
        'provider_id' => $provider->id,
        'is_available' => true
    ]);

    $response = $this->getJson('/api/categories');

    $response->assertOk()
        ->assertJsonStructure([
            'data' => [
                '*' => [
                    'id', 'name', 'services' => [
                        '*' => ['id', 'name', 'starting_price', 'providers_count']
                    ]
                ]
            ]
        ]);
});

test('featured services endpoint returns available services', function () {
    $providerService = ProviderService::factory()->create(['is_available' => true]);

    $response = $this->getJson('/api/featured-services');

    $response->assertOk()
        ->assertJsonFragment(['id' => $providerService->id]);
});

test('can view single provider service', function () {
    $providerService = ProviderService::factory()->create();

    $response = $this->getJson('/api/featured-services/' . $providerService->id);

    $response->assertOk()
        ->assertJsonPath('data.id', $providerService->id);
});

test('similar providers endpoint works', function () {
    $service = Service::factory()->create();
    $targetService = ProviderService::factory()->create(['service_id' => $service->id, 'is_available' => true]);
    $similarService = ProviderService::factory()->create(['service_id' => $service->id, 'is_available' => true]);

    $response = $this->getJson('/api/featured-services/' . $targetService->id . '/similar');

    $response->assertOk()
        ->assertJsonFragment(['id' => $similarService->id])
        ->assertJsonMissing(['id' => $targetService->id]);
});

test('can fetch category by id', function () {
    $category = ServiceCategory::factory()->create();

    $response = $this->getJson('/api/categories/' . $category->id);

    $response->assertOk()
        ->assertJsonPath('data.id', $category->id);
});

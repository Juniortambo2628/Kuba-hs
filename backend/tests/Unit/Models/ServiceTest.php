<?php

use App\Models\Service;
use App\Models\ServiceCategory;
use Illuminate\Foundation\Testing\RefreshDatabase;

uses(RefreshDatabase::class);

it('has correct fillable attributes', function () {
    $service = new Service;
    expect($service->getFillable())->toContain(
        'category_id', 'name', 'description', 'icon_url', 'is_active', 'is_featured'
    );
});

it('belongs to a category', function () {
    $category = ServiceCategory::factory()->create(['name' => 'Cleaning']);
    $service = Service::factory()->create(['category_id' => $category->id]);
    expect($service->category->id)->toBe($category->id);
});

it('has provider services relationship', function () {
    $service = Service::factory()->create();
    $provider = \App\Models\Provider::factory()->create();
    \App\Models\ProviderService::create([
        'provider_id' => $provider->id,
        'service_id' => $service->id,
        'base_price' => 500,
        'pricing_type' => 'fixed',
    ]);
    expect($service->providerServices)->toHaveCount(1);
});

it('appends slug attribute', function () {
    $service = Service::factory()->create(['name' => 'Deep Cleaning']);
    expect($service->slug)->toBe('deep-cleaning');
});

it('uses uuid as primary key', function () {
    $service = Service::factory()->create();
    expect(strlen($service->id))->toBe(36);
});

it('uses soft deletes', function () {
    $service = Service::factory()->create();
    $serviceId = $service->id;
    $service->delete();
    expect(Service::withTrashed()->find($serviceId))->not->toBeNull();
    expect(Service::find($serviceId))->toBeNull();
});

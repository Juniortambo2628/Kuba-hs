<?php

use App\Models\Service;
use App\Models\ServiceCategory;

test('two categories with the same name get distinct slugs', function () {
    $first = ServiceCategory::factory()->create(['name' => 'Plumbing']);
    $second = ServiceCategory::factory()->create(['name' => 'Plumbing']);

    expect($first->slug)->toBe('plumbing')
        ->and($second->slug)->toBe('plumbing-2')
        ->and($first->slug)->not->toBe($second->slug);
});

test('each same-named category resolves on its own slug', function () {
    $first = ServiceCategory::factory()->create(['name' => 'Plumbing']);
    $second = ServiceCategory::factory()->create(['name' => 'Plumbing']);

    $this->getJson("/api/categories/{$first->slug}")
        ->assertOk()
        ->assertJsonFragment(['id' => $first->id]);

    $this->getJson("/api/categories/{$second->slug}")
        ->assertOk()
        ->assertJsonFragment(['id' => $second->id]);
});

test('a category is still reachable by id', function () {
    $category = ServiceCategory::factory()->create(['name' => 'Electrical Repairs']);

    $this->getJson("/api/categories/{$category->id}")
        ->assertOk()
        ->assertJsonFragment(['id' => $category->id]);
});

test('service slug is the one the frontend builds from the name', function () {
    $service = Service::factory()->create(['name' => 'Deep Cleaning & Polishing']);

    expect($service->slug)->toBe('deep-cleaning-polishing');

    $this->getJson("/api/services/{$service->slug}")->assertOk();
});

test('renaming a service keeps the slug that is already in the url', function () {
    $service = Service::factory()->create(['name' => 'Deep Cleaning']);

    $service->update(['name' => 'Deep Cleaning Deluxe']);

    expect($service->fresh()->slug)->toBe('deep-cleaning');
});

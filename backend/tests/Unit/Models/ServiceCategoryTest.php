<?php

use App\Models\ServiceCategory;
use Illuminate\Foundation\Testing\RefreshDatabase;

uses(RefreshDatabase::class);

it('has correct fillable attributes', function () {
    $category = new ServiceCategory;
    expect($category->getFillable())->toContain(
        'name', 'type', 'parent_category_id', 'description',
        'icon_url', 'image_url', 'sort_order'
    );
});

it('can have a parent category', function () {
    $parent = ServiceCategory::factory()->create(['name' => 'Home']);
    $child = ServiceCategory::factory()->create([
        'name' => 'Cleaning',
        'parent_category_id' => $parent->id,
    ]);
    expect($child->parent->id)->toBe($parent->id);
});

it('can have children categories', function () {
    $parent = ServiceCategory::factory()->create(['name' => 'Home']);
    ServiceCategory::factory()->create(['parent_category_id' => $parent->id, 'name' => 'Cleaning']);
    ServiceCategory::factory()->create(['parent_category_id' => $parent->id, 'name' => 'Plumbing']);
    expect($parent->children)->toHaveCount(2);
});

it('has services relationship', function () {
    $category = ServiceCategory::factory()->create();
    \App\Models\Service::factory()->create(['category_id' => $category->id]);
    \App\Models\Service::factory()->create(['category_id' => $category->id]);
    expect($category->services)->toHaveCount(2);
});

it('appends slug attribute', function () {
    $category = ServiceCategory::factory()->create(['name' => 'Home Services']);
    expect($category->slug)->toBe('home-services');
});

it('uses uuid as primary key', function () {
    $category = ServiceCategory::factory()->create();
    expect(strlen($category->id))->toBe(36);
});

it('uses soft deletes', function () {
    $category = ServiceCategory::factory()->create();
    $categoryId = $category->id;
    $category->delete();
    expect(ServiceCategory::withTrashed()->find($categoryId))->not->toBeNull();
    expect(ServiceCategory::find($categoryId))->toBeNull();
});

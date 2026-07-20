<?php

use App\Models\ServiceCategory;
use App\Models\User;
use App\Enums\UserRole;

describe('Admin Category API', function () {
    beforeEach(function () {
        $admin = User::factory()->create(['role' => UserRole::Admin]);
        $this->actingAs($admin, 'sanctum');
    });

    it('lists all categories', function () {
        ServiceCategory::factory()->count(3)->create();

        $response = $this->getJson('/api/admin/categories');

        $response->assertOk();
        $response->assertJsonStructure([
            'categories' => [
                '*' => ['id', 'name', 'description', 'image_url', 'services'],
            ],
        ]);
    });

    it('creates a category', function () {
        $payload = [
            'name' => 'Home Cleaning',
            'description' => 'Professional home cleaning services',
        ];

        $response = $this->postJson('/api/admin/categories', $payload);

        $response->assertCreated();
        $response->assertJsonFragment(['name' => 'Home Cleaning']);
        $this->assertDatabaseHas('service_categories', ['name' => 'Home Cleaning']);
    });

    it('shows a single category', function () {
        $category = ServiceCategory::factory()->create();

        $response = $this->getJson("/api/admin/categories/{$category->id}");

        $response->assertOk();
        $response->assertJsonStructure([
            'category' => ['id', 'name', 'description', 'image_url', 'services'],
        ]);
    });

    it('updates a category', function () {
        $category = ServiceCategory::factory()->create(['name' => 'Old Name']);

        $response = $this->putJson("/api/admin/categories/{$category->id}", [
            'name' => 'Updated Name',
            'description' => 'Updated description',
        ]);

        $response->assertOk();
        $response->assertJsonFragment(['name' => 'Updated Name']);
        $this->assertDatabaseHas('service_categories', ['id' => $category->id, 'name' => 'Updated Name']);
    });

    it('deletes a category', function () {
        $category = ServiceCategory::factory()->create();

        $response = $this->deleteJson("/api/admin/categories/{$category->id}");

        $response->assertOk();
        $this->assertSoftDeleted('service_categories', ['id' => $category->id]);
    });

    it('validates required fields on create', function () {
        $response = $this->postJson('/api/admin/categories', []);

        $response->assertStatus(422);
        $response->assertJsonValidationErrors(['name', 'description']);
    });
});

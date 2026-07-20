<?php

use App\Models\Service;
use App\Models\ServiceCategory;
use App\Models\User;
use App\Enums\UserRole;

describe('Admin Service API', function () {
    beforeEach(function () {
        $admin = User::factory()->create(['role' => UserRole::Admin]);
        $this->actingAs($admin, 'sanctum');
    });

    it('lists all services', function () {
        $category = ServiceCategory::factory()->create();
        Service::factory()->count(3)->create(['category_id' => $category->id]);

        $response = $this->getJson('/api/admin/services');

        $response->assertOk();
        $response->assertJsonStructure([
            'data' => [
                '*' => ['id', 'name', 'description', 'category_id'],
            ],
        ]);
    });

    it('creates a service', function () {
        $category = ServiceCategory::factory()->create();

        $payload = [
            'category_id' => $category->id,
            'name' => 'Deep Cleaning',
            'description' => 'Thorough deep cleaning service',
        ];

        $response = $this->postJson('/api/admin/services', $payload);

        $response->assertCreated();
        $response->assertJsonFragment(['name' => 'Deep Cleaning']);
        $this->assertDatabaseHas('services', ['name' => 'Deep Cleaning']);
    });

    it('shows a single service', function () {
        $category = ServiceCategory::factory()->create();
        $service = Service::factory()->create(['category_id' => $category->id]);

        $response = $this->getJson("/api/admin/services/{$service->id}");

        $response->assertOk();
        $response->assertJsonStructure(['id', 'name', 'description', 'category_id']);
    });

    it('updates a service', function () {
        $category = ServiceCategory::factory()->create();
        $service = Service::factory()->create(['category_id' => $category->id, 'name' => 'Old Service']);

        $response = $this->putJson("/api/admin/services/{$service->id}", [
            'name' => 'Updated Service',
            'description' => 'Updated description',
        ]);

        $response->assertOk();
        $response->assertJsonFragment(['name' => 'Updated Service']);
        $this->assertDatabaseHas('services', ['id' => $service->id, 'name' => 'Updated Service']);
    });

    it('deletes a service', function () {
        $category = ServiceCategory::factory()->create();
        $service = Service::factory()->create(['category_id' => $category->id]);

        $response = $this->deleteJson("/api/admin/services/{$service->id}");

        $response->assertOk();
        $this->assertSoftDeleted('services', ['id' => $service->id]);
    });

    it('validates required fields on create', function () {
        $response = $this->postJson('/api/admin/services', []);

        $response->assertStatus(422);
        $response->assertJsonValidationErrors(['category_id', 'name', 'description']);
    });
});

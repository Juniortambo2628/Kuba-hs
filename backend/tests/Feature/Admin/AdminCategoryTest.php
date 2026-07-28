<?php

use App\Models\ServiceCategory;
use App\Models\User;

describe('admin categories API', function () {
    beforeEach(function () {
        $this->admin = User::factory()->create(['role' => 'admin']);
    });

    it('returns all categories', function () {
        ServiceCategory::factory()->count(3)->create();

        $response = $this->actingAs($this->admin)
            ->getJson('/api/admin/categories');

        $response->assertOk();
        $response->assertJsonStructure([
            'categories' => [
                '*' => ['id', 'name'],
            ],
        ]);
    });

    it('shows a single category', function () {
        $category = ServiceCategory::factory()->create();

        $response = $this->actingAs($this->admin)
            ->getJson("/api/admin/categories/{$category->id}");

        $response->assertOk();
    });

    it('creates a category', function () {
        $response = $this->actingAs($this->admin)
            ->postJson('/api/admin/categories', [
                'name' => 'New Category',
                'description' => 'A test category',
            ]);

        $response->assertCreated();
        expect(ServiceCategory::where('name', 'New Category')->count())->toBe(1);
    });

    it('validates required fields', function () {
        $response = $this->actingAs($this->admin)
            ->postJson('/api/admin/categories', [
                'name' => '',
                'description' => '',
            ]);

        $response->assertStatus(422);
    });

    it('updates a category', function () {
        $category = ServiceCategory::factory()->create();

        $response = $this->actingAs($this->admin)
            ->putJson("/api/admin/categories/{$category->id}", [
                'name' => 'Updated Category',
                'description' => 'Updated description',
            ]);

        $response->assertOk();
        expect($category->fresh()->name)->toBe('Updated Category');
    });

    it('deletes a category', function () {
        $category = ServiceCategory::factory()->create();

        $response = $this->actingAs($this->admin)
            ->deleteJson("/api/admin/categories/{$category->id}");

        $response->assertOk();
        expect(ServiceCategory::find($category->id))->toBeNull();
    });
});

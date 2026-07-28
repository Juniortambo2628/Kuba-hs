<?php

use App\Models\Service;
use App\Models\ServiceCategory;
use App\Models\User;

describe('admin services API', function () {
    beforeEach(function () {
        $this->admin = User::factory()->create(['role' => 'admin']);
        $this->category = ServiceCategory::factory()->create();
    });

    it('returns paginated services', function () {
        Service::factory()->count(3)->create(['category_id' => $this->category->id]);

        $response = $this->actingAs($this->admin)
            ->getJson('/api/admin/services');

        $response->assertOk();
    });

    it('shows a single service', function () {
        $service = Service::factory()->create(['category_id' => $this->category->id]);

        $response = $this->actingAs($this->admin)
            ->getJson("/api/admin/services/{$service->id}");

        $response->assertOk();
    });

    it('creates a service', function () {
        $response = $this->actingAs($this->admin)
            ->postJson('/api/admin/services', [
                'category_id' => $this->category->id,
                'name' => 'New Service',
                'description' => 'A new test service',
            ]);

        $response->assertCreated();
        expect(Service::where('name', 'New Service')->count())->toBe(1);
    });

    it('validates required fields', function () {
        $response = $this->actingAs($this->admin)
            ->postJson('/api/admin/services', [
                'name' => '',
                'description' => '',
            ]);

        $response->assertStatus(422);
    });

    it('validates category exists', function () {
        $response = $this->actingAs($this->admin)
            ->postJson('/api/admin/services', [
                'category_id' => 'non-existent',
                'name' => 'Test',
                'description' => 'Test',
            ]);

        $response->assertStatus(422);
    });

    it('updates a service', function () {
        $service = Service::factory()->create(['category_id' => $this->category->id]);

        $response = $this->actingAs($this->admin)
            ->putJson("/api/admin/services/{$service->id}", [
                'name' => 'Updated Service',
                'description' => 'Updated description',
            ]);

        $response->assertOk();
        expect($service->fresh()->name)->toBe('Updated Service');
    });

    it('deletes a service without providers', function () {
        $service = Service::factory()->create(['category_id' => $this->category->id]);

        $response = $this->actingAs($this->admin)
            ->deleteJson("/api/admin/services/{$service->id}");

        $response->assertOk();
        expect(Service::find($service->id))->toBeNull();
    });
});

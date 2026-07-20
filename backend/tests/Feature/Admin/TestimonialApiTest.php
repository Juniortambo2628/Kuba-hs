<?php

use App\Models\Testimonial;
use App\Models\User;
use App\Enums\UserRole;

describe('Admin Testimonial API', function () {
    beforeEach(function () {
        $admin = User::factory()->create(['role' => UserRole::Admin]);
        $this->actingAs($admin, 'sanctum');
    });

    it('lists all testimonials paginated', function () {
        Testimonial::factory()->count(3)->create();

        $response = $this->getJson('/api/admin/testimonials');

        $response->assertOk();
        $response->assertJsonStructure([
            'data' => [
                '*' => ['id', 'client_name', 'content', 'rating'],
            ],
        ]);
    });

    it('creates a testimonial', function () {
        $payload = [
            'client_name' => 'Jane Doe',
            'content' => 'Excellent service!',
            'rating' => 5,
        ];

        $response = $this->postJson('/api/admin/testimonials', $payload);

        $response->assertCreated();
        $response->assertJsonFragment(['client_name' => 'Jane Doe']);
        $this->assertDatabaseHas('testimonials', ['client_name' => 'Jane Doe']);
    });

    it('shows a single testimonial', function () {
        $testimonial = Testimonial::factory()->create();

        $response = $this->getJson("/api/admin/testimonials/{$testimonial->id}");

        $response->assertOk();
        $response->assertJsonFragment(['id' => $testimonial->id]);
    });

    it('updates a testimonial', function () {
        $testimonial = Testimonial::factory()->create(['client_name' => 'Old Name']);

        $response = $this->putJson("/api/admin/testimonials/{$testimonial->id}", [
            'client_name' => 'New Name',
            'content' => 'Updated content',
        ]);

        $response->assertOk();
        $response->assertJsonFragment(['client_name' => 'New Name']);
        $this->assertDatabaseHas('testimonials', ['id' => $testimonial->id, 'client_name' => 'New Name']);
    });

    it('deletes a testimonial', function () {
        $testimonial = Testimonial::factory()->create();

        $response = $this->deleteJson("/api/admin/testimonials/{$testimonial->id}");

        $response->assertStatus(204);
        $this->assertDatabaseMissing('testimonials', ['id' => $testimonial->id]);
    });

    it('reorders testimonials', function () {
        $t1 = Testimonial::factory()->create(['order' => 1]);
        $t2 = Testimonial::factory()->create(['order' => 2]);

        $response = $this->postJson('/api/admin/testimonials/reorder', [
            'items' => [
                ['id' => $t1->id, 'order' => 2],
                ['id' => $t2->id, 'order' => 1],
            ],
        ]);

        $response->assertOk();
        $response->assertJsonFragment(['message' => 'Reordered successfully']);
        $this->assertDatabaseHas('testimonials', ['id' => $t1->id, 'order' => 2]);
        $this->assertDatabaseHas('testimonials', ['id' => $t2->id, 'order' => 1]);
    });
});

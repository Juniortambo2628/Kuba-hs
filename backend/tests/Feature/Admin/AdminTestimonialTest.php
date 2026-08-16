<?php

use App\Models\Testimonial;
use App\Models\User;
use Illuminate\Support\Facades\DB;

describe('admin testimonials API', function () {
    beforeEach(function () {
        $this->admin = User::factory()->create(['role' => 'admin']);
    });

    function createTestimonial(array $overrides = []): Testimonial
    {
        $data = array_merge([
            'client_name' => fake()->name(),
            'client_role' => fake()->randomElement(['Homeowner', 'Business Owner']),
            'content' => fake()->paragraph(),
            'rating' => fake()->numberBetween(4, 5),
            'is_active' => true,
            'sort_order' => fake()->numberBetween(1, 20),
        ], $overrides);

        DB::table('testimonials')->insert($data);
        return Testimonial::where('client_name', $data['client_name'])->first();
    }

    it('returns paginated testimonials', function () {
        createTestimonial(['client_name' => 'First']);
        createTestimonial(['client_name' => 'Second']);
        createTestimonial(['client_name' => 'Third']);

        $response = $this->actingAs($this->admin)
            ->getJson('/api/admin/testimonials');

        $response->assertOk();
    });

    it('creates a testimonial', function () {
        $response = $this->actingAs($this->admin)
            ->postJson('/api/admin/testimonials', [
                'client_name' => 'John Customer',
                'content' => 'Amazing service!',
                'rating' => 5,
                'is_active' => true,
            ]);

        $response->assertCreated();
        expect(DB::table('testimonials')->count())->toBe(1);
    });

    it('validates required fields', function () {
        $response = $this->actingAs($this->admin)
            ->postJson('/api/admin/testimonials', [
                'client_name' => '',
                'content' => '',
            ]);

        $response->assertStatus(422);
    });

    it('updates a testimonial', function () {
        $testimonial = createTestimonial(['client_name' => 'Original Name']);

        $response = $this->actingAs($this->admin)
            ->putJson("/api/admin/testimonials/{$testimonial->id}", [
                'client_name' => 'Updated Name',
                'content' => 'Updated content',
            ]);

        $response->assertOk();
        expect($testimonial->fresh()->client_name)->toBe('Updated Name');
    });

    it('deletes a testimonial', function () {
        $testimonial = createTestimonial();

        $response = $this->actingAs($this->admin)
            ->deleteJson("/api/admin/testimonials/{$testimonial->id}");

        $response->assertStatus(204);
        expect(Testimonial::find($testimonial->id))->toBeNull();
    });

    it('reorders testimonials', function () {
        $t1 = createTestimonial(['client_name' => 'First', 'sort_order' => 1]);
        $t2 = createTestimonial(['client_name' => 'Second', 'sort_order' => 2]);

        $response = $this->actingAs($this->admin)
            ->postJson('/api/admin/testimonials/reorder', [
                'items' => [
                    ['id' => $t1->id, 'sort_order' => 2],
                    ['id' => $t2->id, 'sort_order' => 1],
                ],
            ]);

        $response->assertOk();
        expect($t1->fresh()->sort_order)->toBe(2);
        expect($t2->fresh()->sort_order)->toBe(1);
    });
});

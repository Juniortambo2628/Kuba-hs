<?php

use App\Models\FAQ;
use App\Models\Provider;
use App\Models\ProviderService;
use App\Models\Service;
use App\Models\ServiceCategory;
use App\Models\Testimonial;
use App\Models\User;
use Illuminate\Support\Facades\Cache;

beforeEach(function () {
    Cache::flush();
});

describe('Marketplace public API', function () {

    it('returns categories that have active services', function () {
        $category = ServiceCategory::factory()->create(['name' => 'Cleaning', 'type' => 'residential']);
        Service::factory()->create(['category_id' => $category->id, 'is_active' => true]);

        $emptyCategory = ServiceCategory::factory()->create(['name' => 'Empty']);

        $response = $this->getJson('/api/categories');

        $response->assertOk();
        $response->assertJsonCount(1, 'data');
        $response->assertJsonFragment(['name' => 'Cleaning']);
        $response->assertJsonMissing(['name' => 'Empty']);
        $response->assertJsonStructure([
            'data' => [
                '*' => ['id', 'name', 'slug', 'services_count'],
            ],
        ]);
    });

    it('shows a category by UUID', function () {
        $category = ServiceCategory::factory()->create(['name' => 'Plumbing']);

        $response = $this->getJson("/api/categories/{$category->id}");

        $response->assertOk();
        $response->assertJsonFragment(['id' => $category->id, 'name' => 'Plumbing']);
    });

    it('shows a category by slug', function () {
        $category = ServiceCategory::factory()->create(['name' => 'Electrical Repairs']);

        $slug = \Illuminate\Support\Str::slug($category->name);

        $response = $this->getJson("/api/categories/{$slug}");

        $response->assertOk();
        $response->assertJsonFragment(['id' => $category->id]);
    });

    it('returns 404 for a non-existent category', function () {
        $response = $this->getJson('/api/categories/non-existent-uuid');

        $response->assertStatus(404);
    });

    it('returns featured services', function () {
        $user = User::factory()->create(['role' => 'provider']);
        $provider = Provider::factory()->create(['user_id' => $user->id]);
        $category = ServiceCategory::factory()->create();
        $service = Service::factory()->create(['category_id' => $category->id, 'is_active' => true]);
        ProviderService::create([
            'provider_id' => $provider->id,
            'service_id' => $service->id,
            'base_price' => 1500,
            'is_available' => true,
        ]);

        $response = $this->getJson('/api/featured-services');

        $response->assertOk();
        $response->assertJsonCount(1, 'data');
    });

    it('returns active FAQs ordered by sort_order', function () {
        FAQ::create(['question' => 'Q2', 'answer' => 'A2', 'is_active' => true, 'sort_order' => 2]);
        FAQ::create(['question' => 'Q1', 'answer' => 'A1', 'is_active' => true, 'sort_order' => 1]);
        FAQ::create(['question' => 'Inactive', 'answer' => 'A', 'is_active' => false, 'sort_order' => 0]);

        $response = $this->getJson('/api/faqs');

        $response->assertOk();
        $response->assertJsonCount(2, 'data');
        $response->assertJsonStructure([
            'data' => ['*' => ['id', 'question', 'answer']],
        ]);

        $json = $response->json('data');
        expect($json[0]['question'])->toBe('Q1');
        expect($json[1]['question'])->toBe('Q2');
    });

    it('returns active testimonials ordered by sort_order', function () {
        Testimonial::create(['client_name' => 'T2', 'client_role' => 'Owner', 'content' => 'Good', 'rating' => 5, 'is_active' => true, 'sort_order' => 2]);
        Testimonial::create(['client_name' => 'T1', 'client_role' => 'Manager', 'content' => 'Great', 'rating' => 5, 'is_active' => true, 'sort_order' => 1]);
        Testimonial::create(['client_name' => 'Inactive', 'client_role' => 'X', 'content' => 'Hidden', 'rating' => 3, 'is_active' => false, 'sort_order' => 0]);

        $response = $this->getJson('/api/testimonials');

        $response->assertOk();
        $response->assertJsonCount(2, 'data');

        $json = $response->json('data');
        expect($json[0]['client_name'])->toBe('T1');
        expect($json[1]['client_name'])->toBe('T2');
    });
});

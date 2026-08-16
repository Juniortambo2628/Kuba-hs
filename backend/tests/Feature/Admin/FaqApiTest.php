<?php

use App\Models\FAQ;
use App\Models\User;
use App\Enums\UserRole;

describe('Admin FAQ API', function () {
    beforeEach(function () {
        $admin = User::factory()->create(['role' => UserRole::Admin]);
        $this->actingAs($admin, 'sanctum');
    });

    it('lists all faqs ordered by sort_order then id desc', function () {
        FAQ::factory()->create(['question' => 'First', 'sort_order' => 2]);
        FAQ::factory()->create(['question' => 'Second', 'sort_order' => 1]);

        $response = $this->getJson('/api/admin/faqs');

        $response->assertOk();
        $faqs = $response->json();
        expect($faqs[0]['question'])->toBe('Second');
        expect($faqs[1]['question'])->toBe('First');
    });

    it('creates a faq', function () {
        $payload = [
            'question' => 'How do I book?',
            'answer' => 'Simply select a service and choose a time.',
        ];

        $response = $this->postJson('/api/admin/faqs', $payload);

        $response->assertCreated();
        $response->assertJsonFragment(['question' => 'How do I book?']);
        $this->assertDatabaseHas('faqs', ['question' => 'How do I book?']);
    });

    it('shows a single faq', function () {
        $faq = FAQ::factory()->create();

        $response = $this->getJson("/api/admin/faqs/{$faq->id}");

        $response->assertOk();
        $response->assertJsonFragment(['id' => $faq->id]);
    });

    it('updates a faq', function () {
        $faq = FAQ::factory()->create(['question' => 'Old Question']);

        $response = $this->putJson("/api/admin/faqs/{$faq->id}", [
            'question' => 'Updated Question',
            'answer' => 'Updated answer',
        ]);

        $response->assertOk();
        $response->assertJsonFragment(['question' => 'Updated Question']);
        $this->assertDatabaseHas('faqs', ['id' => $faq->id, 'question' => 'Updated Question']);
    });

    it('deletes a faq', function () {
        $faq = FAQ::factory()->create();

        $response = $this->deleteJson("/api/admin/faqs/{$faq->id}");

        $response->assertStatus(204);
        $this->assertDatabaseMissing('faqs', ['id' => $faq->id]);
    });

    it('reorders faqs', function () {
        $faq1 = FAQ::factory()->create(['sort_order' => 1]);
        $faq2 = FAQ::factory()->create(['sort_order' => 2]);

        $response = $this->postJson('/api/admin/faqs/reorder', [
            'items' => [
                ['id' => $faq1->id, 'sort_order' => 2],
                ['id' => $faq2->id, 'sort_order' => 1],
            ],
        ]);

        $response->assertOk();
        $response->assertJsonFragment(['message' => 'Reordered successfully']);
        $this->assertDatabaseHas('faqs', ['id' => $faq1->id, 'sort_order' => 2]);
        $this->assertDatabaseHas('faqs', ['id' => $faq2->id, 'sort_order' => 1]);
    });
});

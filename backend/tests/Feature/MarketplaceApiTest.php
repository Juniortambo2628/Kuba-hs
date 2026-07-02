<?php

describe('public marketplace endpoints', function () {
    it('returns a successful JSON response for categories', function () {
        \App\Models\ServiceCategory::factory()->create([
            'name' => 'Cleaning',
            'type' => 'residential',
        ]);

        $response = $this->getJson('/api/categories');

        $response->assertOk();
        $response->assertJsonStructure([
            '*' => [
                'id',
                'name',
                'slug',
                'services_count',
            ],
        ]);
    });

    it('returns a successful JSON response for faqs', function () {
        \App\Models\FAQ::factory()->create([
            'question' => 'How does it work?',
            'answer' => 'We help you book services.',
            'is_active' => true,
        ]);

        $response = $this->getJson('/api/faqs');

        $response->assertOk();
        $response->assertJsonStructure([
            '*' => [
                'id',
                'question',
                'answer',
            ],
        ]);
    });
});

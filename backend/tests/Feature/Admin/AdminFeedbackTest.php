<?php

use App\Models\Review;

test('admin can list feedback and reviews', function () {
    $admin = createAdmin();
    Review::factory()->create();

    $response = $this->actingAs($admin)->getJson('/api/admin/feedback');

    $response->assertOk();
});

test('admin can delete review', function () {
    $admin = createAdmin();
    $review = Review::factory()->create();

    $response = $this->actingAs($admin)->deleteJson("/api/admin/feedback/{$review->id}");

    $response->assertOk();
    $this->assertSoftDeleted('reviews', [
        'id' => $review->id
    ]);
});

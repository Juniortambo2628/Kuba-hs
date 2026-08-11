<?php

use App\Models\Review;

test('customer can submit review for completed booking', function () {
    $workflow = createBookingWorkflow(['status' => 'completed']);

    $response = $this->actingAs($workflow['customer'])
        ->postJson('/api/reviews', [
            'booking_id' => $workflow['booking']->id,
            'provider_id' => $workflow['provider']->id,
            'rating' => 5,
            'comment' => 'Excellent service'
        ]);

    $response->assertCreated();
    $this->assertDatabaseHas('reviews', [
        'booking_id' => $workflow['booking']->id,
        'rating' => 5,
    ]);
});

test('customer cannot review pending booking', function () {
    $workflow = createBookingWorkflow(['status' => 'pending']);

    $response = $this->actingAs($workflow['customer'])
        ->postJson('/api/reviews', [
            'booking_id' => $workflow['booking']->id,
            'provider_id' => $workflow['provider']->id,
            'rating' => 5,
            'comment' => 'Excellent service'
        ]);

    $response->assertStatus(422); // Or 403, depending on validation rules
});

test('anyone can list reviews for provider', function () {
    $workflow = createBookingWorkflow(['status' => 'completed']);
    Review::factory()->create([
        'booking_id' => $workflow['booking']->id,
        'customer_id' => $workflow['customer']->id,
        'provider_id' => $workflow['provider']->id,
        'rating' => 5,
    ]);

    // Unauthenticated request
    $response = $this->getJson("/api/providers/{$workflow['provider']->id}/reviews");

    $response->assertOk()
        ->assertJsonStructure(['data' => [['id', 'rating', 'comment']]]);
});

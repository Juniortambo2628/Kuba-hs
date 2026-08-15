<?php

use App\Models\Review;

test('provider can view their reviews', function () {
    $workflow = createBookingWorkflow(['status' => 'completed']);
    $providerUser = $workflow['providerUser'];
    
    Review::factory()->create([
        'booking_id' => $workflow['booking']->id,
        'customer_id' => $workflow['customer']->id,
        'provider_id' => $workflow['provider']->id,
        'rating' => 5,
        'comment' => 'Great work!'
    ]);

    $response = $this->actingAs($providerUser)->getJson('/api/provider/reviews');

    $response->assertOk()
        ->assertJsonStructure([
            'reviews' => [
                'data' => [
                    '*' => ['id', 'rating', 'comment']
                ]
            ]
        ]);
});

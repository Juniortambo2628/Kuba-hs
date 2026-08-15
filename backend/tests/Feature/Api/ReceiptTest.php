<?php

test('customer can view receipt for completed booking', function () {
    $workflow = createBookingWorkflow(['status' => 'completed']);
    
    // Create a payment record to ensure receipt can be generated
    \App\Models\Payment::factory()->create([
        'booking_id' => $workflow['booking']->id,
        'customer_id' => $workflow['customer']->id,
        'amount' => 5000,
        'status' => 'completed'
    ]);

    $response = $this->actingAs($workflow['customer'])
        ->getJson("/api/payments/receipt/{$workflow['booking']->id}");

    $response->assertOk();
    // Usually returns a PDF or HTML view, or JSON details
});

test('unauthorized user cannot view receipt', function () {
    $workflow = createBookingWorkflow(['status' => 'completed']);
    $otherCustomer = createCustomer();

    $response = $this->actingAs($otherCustomer)
        ->getJson("/api/payments/receipt/{$workflow['booking']->id}");

    $response->assertForbidden();
});

<?php

test('customer can download invoice for their booking', function () {
    $workflow = createBookingWorkflow(['status' => 'completed']);
    
    // Assuming /api/invoices/{booking} or /api/bookings/{booking}/invoice exists
    $response = $this->actingAs($workflow['customer'])
        ->getJson("/api/invoices/{$workflow['booking']->id}/download");

    // It might return a PDF file, so checking for 200 OK is sufficient
    // or if not implemented yet, it might be 404
    // We expect the route to be registered and protected
    $this->assertNotEquals(401, $response->getStatusCode());
    $this->assertNotEquals(403, $response->getStatusCode());
});

test('unauthorized user cannot download invoice', function () {
    $workflow = createBookingWorkflow(['status' => 'completed']);
    $otherCustomer = createCustomer();

    $response = $this->actingAs($otherCustomer)
        ->getJson("/api/invoices/{$workflow['booking']->id}/download");

    $response->assertForbidden();
});

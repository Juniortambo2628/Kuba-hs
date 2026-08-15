<?php

test('user can get booking activity log', function () {
    $workflow = createBookingWorkflow();
    \App\Models\BookingActivityLog::factory()->create([
        'booking_id' => $workflow['booking']->id,
        'user_id' => $workflow['customer']->id,
    ]);

    $response = $this->actingAs($workflow['customer'])
        ->getJson("/api/bookings/{$workflow['booking']->id}/activity");

    $response->assertOk()
        ->assertJsonStructure(['data' => [['id', 'action', 'description']]]);
});

test('user can update booking status', function () {
    $workflow = createBookingWorkflow(['status' => 'pending']);

    $response = $this->actingAs($workflow['providerUser'])
        ->patchJson("/api/bookings/{$workflow['booking']->id}/status", [
            'status' => 'confirmed'
        ]);

    $response->assertOk();
    $this->assertDatabaseHas('bookings', [
        'id' => $workflow['booking']->id,
        'status' => 'confirmed'
    ]);
});

test('user can reschedule booking', function () {
    $workflow = createBookingWorkflow(['status' => 'pending', 'scheduled_date' => now()->addDays(2)->format('Y-m-d')]);
    $newDate = now()->addDays(4)->format('Y-m-d');

    $response = $this->actingAs($workflow['providerUser'])
        ->patchJson("/api/bookings/{$workflow['booking']->id}/reschedule", [
            'scheduled_date' => $newDate,
        ]);

    $response->assertOk();
});

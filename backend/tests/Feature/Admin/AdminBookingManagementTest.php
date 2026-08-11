<?php

use App\Models\Booking;

test('admin can list all bookings', function () {
    $admin = createAdmin();
    Booking::factory()->count(3)->create();

    $response = $this->actingAs($admin)->getJson('/api/admin/bookings');

    $response->assertOk()
        ->assertJsonStructure(['data', 'links', 'meta']);
});

test('admin can update booking status', function () {
    $admin = createAdmin();
    $booking = Booking::factory()->create(['status' => 'pending']);

    $response = $this->actingAs($admin)->patchJson("/api/admin/bookings/{$booking->id}/status", [
        'status' => 'cancelled',
        'reason' => 'Admin cancellation'
    ]);

    $response->assertOk();
    $this->assertDatabaseHas('bookings', [
        'id' => $booking->id,
        'status' => 'cancelled'
    ]);
});

test('admin can delete booking', function () {
    $admin = createAdmin();
    $booking = Booking::factory()->create();

    $response = $this->actingAs($admin)->deleteJson("/api/admin/bookings/{$booking->id}");

    $response->assertOk();
    $this->assertSoftDeleted('bookings', [
        'id' => $booking->id
    ]);
});

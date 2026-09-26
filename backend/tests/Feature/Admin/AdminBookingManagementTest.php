<?php

use App\Models\Booking;
use App\Models\LoyaltyPoint;

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

test('admin completing a booking awards loyalty points', function () {
    $admin = createAdmin();
    $booking = Booking::factory()->create(['status' => 'confirmed']);

    $response = $this->actingAs($admin)->patchJson("/api/admin/bookings/{$booking->id}/status", [
        'status' => 'completed',
    ]);

    $response->assertOk();

    $earned = LoyaltyPoint::where('user_id', $booking->customer_id)
        ->where('transaction_type', 'earn')
        ->where('description', "LIKE", "%#{$booking->booking_number}%")
        ->get();

    expect($earned)->toHaveCount(1);
    expect((int) $earned->first()->points)->toBe((int) floor($booking->estimated_price * 10));
});

test('admin cancelling a booking reverts previously awarded loyalty points', function () {
    $admin = createAdmin();
    $booking = Booking::factory()->create(['status' => 'completed']);

    LoyaltyPoint::create([
        'user_id' => $booking->customer_id,
        'points' => 500,
        'description' => "Points earned for booking #{$booking->booking_number}",
        'transaction_type' => 'earn',
    ]);

    $response = $this->actingAs($admin)->patchJson("/api/admin/bookings/{$booking->id}/status", [
        'status' => 'cancelled',
    ]);

    $response->assertOk();

    expect(
        LoyaltyPoint::where('user_id', $booking->customer_id)
            ->where('transaction_type', 'redeem')
            ->where('description', "LIKE", "%#{$booking->booking_number}%")
            ->sum('points')
    )->toBe(-500);
});

test('re-asserting the current status does not award points twice', function () {
    $admin = createAdmin();
    $booking = Booking::factory()->create(['status' => 'confirmed']);

    $first = $this->actingAs($admin)->patchJson("/api/admin/bookings/{$booking->id}/status", [
        'status' => 'completed',
    ]);
    $second = $this->actingAs($admin)->patchJson("/api/admin/bookings/{$booking->id}/status", [
        'status' => 'completed',
    ]);

    $first->assertOk();
    $second->assertOk();

    expect(
        LoyaltyPoint::where('user_id', $booking->customer_id)
            ->where('transaction_type', 'earn')
            ->where('description', "LIKE", "%#{$booking->booking_number}%")
            ->count()
    )->toBe(1);
});

<?php

use App\Enums\BookingStatus;
use App\Enums\BookingPaymentStatus;
use App\Models\Booking;
use Illuminate\Foundation\Testing\RefreshDatabase;

uses(RefreshDatabase::class);

it('has correct fillable attributes', function () {
    $booking = new Booking;
    expect($booking->getFillable())->toContain(
        'customer_id', 'provider_id', 'service_id', 'booking_number',
        'scheduled_date', 'scheduled_time', 'scheduled_end_date',
        'started_at', 'completed_at', 'status', 'address_id', 'description',
        'service_type', 'quantity', 'quantity_label', 'estimated_price',
        'final_price', 'payment_status', 'cancellation_reason', 'promo_code_id',
        'discount_amount', 'mpesa_checkout_id', 'payment_method',
        'location_name', 'rescheduled_at'
    );
});

it('casts status to BookingStatus enum', function () {
    $booking = Booking::factory()->create(['status' => 'pending']);
    expect($booking->status)->toBeInstanceOf(BookingStatus::class);
});

it('casts payment_status to BookingPaymentStatus enum', function () {
    $booking = Booking::factory()->create(['payment_status' => 'pending']);
    expect($booking->payment_status)->toBeInstanceOf(BookingPaymentStatus::class);
});

it('casts scheduled_date to datetime', function () {
    $booking = Booking::factory()->create(['scheduled_date' => '2025-01-15']);
    expect($booking->scheduled_date)->toBeInstanceOf(\Carbon\Carbon::class);
});

it('belongs to a customer', function () {
    $booking = Booking::factory()->create();
    expect($booking->customer)->not->toBeNull();
    expect($booking->customer->id)->toBe($booking->customer_id);
});

it('belongs to a provider', function () {
    $booking = Booking::factory()->create();
    expect($booking->provider)->not->toBeNull();
    expect($booking->provider->id)->toBe($booking->provider_id);
});

it('belongs to a service', function () {
    $booking = Booking::factory()->create();
    expect($booking->service)->not->toBeNull();
    expect($booking->service->id)->toBe($booking->service_id);
});

it('has one review', function () {
    $booking = Booking::factory()->create();
    $user = $booking->customer;
    \App\Models\Review::create([
        'booking_id' => $booking->id,
        'customer_id' => $user->id,
        'provider_id' => $booking->provider_id,
        'rating' => 5,
        'comment' => 'Excellent!',
    ]);
    expect($booking->review)->not->toBeNull();
    expect($booking->review->rating)->toBe(5);
});

it('has one payment', function () {
    $booking = Booking::factory()->create();
    \App\Models\Payment::factory()->create([
        'booking_id' => $booking->id,
        'customer_id' => $booking->customer_id,
        'provider_id' => $booking->provider_id,
    ]);
    expect($booking->payment)->not->toBeNull();
});

it('has activity logs relationship', function () {
    $booking = Booking::factory()->create();
    expect($booking->activityLogs)->toHaveCount(0);
});

it('has conversation relationship', function () {
    $booking = Booking::factory()->create();
    \App\Models\Conversation::create([
        'booking_id' => $booking->id,
        'customer_id' => $booking->customer_id,
        'provider_id' => $booking->provider_id,
    ]);
    expect($booking->conversation)->not->toBeNull();
});

it('can filter by status using scope', function () {
    $booking1 = Booking::factory()->create(['status' => 'pending']);
    $booking2 = Booking::factory()->create(['status' => 'completed']);
    $booking3 = Booking::factory()->create(['status' => 'pending']);

    $pending = Booking::byStatus('pending')->get();
    expect($pending)->toHaveCount(2);

    $completed = Booking::byStatus('completed')->get();
    expect($completed)->toHaveCount(1);
});

it('appends image_urls attribute', function () {
    $booking = Booking::factory()->create();
    expect($booking->image_urls)->toBeArray();
});

it('computes total_price attribute', function () {
    $booking = Booking::factory()->create([
        'estimated_price' => 1000,
        'final_price' => null,
    ]);
    expect($booking->total_price)->toBe(1000.0);
});

it('uses uuid as primary key', function () {
    $booking = Booking::factory()->create();
    expect(strlen($booking->id))->toBe(36);
});

it('uses soft deletes', function () {
    $booking = Booking::factory()->create();
    $bookingId = $booking->id;
    $booking->delete();
    expect(Booking::withTrashed()->find($bookingId))->not->toBeNull();
    expect(Booking::find($bookingId))->toBeNull();
});

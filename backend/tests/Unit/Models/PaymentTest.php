<?php

use App\Enums\PaymentStatus;
use App\Models\Payment;
use Illuminate\Foundation\Testing\RefreshDatabase;

uses(RefreshDatabase::class);

it('has correct fillable attributes', function () {
    $payment = new Payment;
    expect($payment->getFillable())->toContain(
        'booking_id', 'customer_id', 'provider_id', 'amount',
        'platform_fee', 'provider_amount', 'payment_method',
        'transaction_id', 'status', 'payment_gateway'
    );
});

it('casts status to PaymentStatus enum', function () {
    $payment = Payment::factory()->create(['status' => 'completed']);
    expect($payment->status)->toBeInstanceOf(PaymentStatus::class);
});

it('belongs to a booking', function () {
    $payment = Payment::factory()->create();
    expect($payment->booking)->not->toBeNull();
    expect($payment->booking->id)->toBe($payment->booking_id);
});

it('belongs to a customer', function () {
    $payment = Payment::factory()->create();
    expect($payment->customer)->not->toBeNull();
    expect($payment->customer->id)->toBe($payment->customer_id);
});

it('belongs to a provider', function () {
    $payment = Payment::factory()->create();
    expect($payment->provider)->not->toBeNull();
    expect($payment->provider->id)->toBe($payment->provider_id);
});

it('uses uuid as primary key', function () {
    $payment = Payment::factory()->create();
    expect(strlen($payment->id))->toBe(36);
});

it('uses soft deletes', function () {
    $payment = Payment::factory()->create();
    $paymentId = $payment->id;
    $payment->delete();
    expect(Payment::withTrashed()->find($paymentId))->not->toBeNull();
    expect(Payment::find($paymentId))->toBeNull();
});

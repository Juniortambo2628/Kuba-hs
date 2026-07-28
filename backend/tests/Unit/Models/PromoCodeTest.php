<?php

use App\Models\PromoCode;
use Illuminate\Foundation\Testing\RefreshDatabase;

uses(RefreshDatabase::class);

it('has correct fillable attributes', function () {
    $promo = new PromoCode;
    expect($promo->getFillable())->toContain(
        'code', 'discount_type', 'discount_value', 'min_booking_amount',
        'max_discount_amount', 'start_date', 'end_date', 'usage_limit',
        'used_count', 'is_active'
    );
});

it('is valid when active and within date range', function () {
    $promo = PromoCode::create([
        'code' => 'SAVE20',
        'discount_type' => 'percentage',
        'discount_value' => 20,
        'start_date' => now()->subDay(),
        'end_date' => now()->addDay(),
        'is_active' => true,
        'usage_limit' => 100,
        'used_count' => 0,
    ]);
    expect($promo->isValid())->toBeTrue();
});

it('is invalid when inactive', function () {
    $promo = PromoCode::create([
        'code' => 'EXPIRED',
        'discount_type' => 'percentage',
        'discount_value' => 20,
        'start_date' => now()->subDay(),
        'end_date' => now()->addDay(),
        'is_active' => false,
    ]);
    expect($promo->isValid())->toBeFalse();
});

it('is invalid when expired', function () {
    $promo = PromoCode::create([
        'code' => 'OLDCODE',
        'discount_type' => 'percentage',
        'discount_value' => 20,
        'start_date' => now()->subDays(10),
        'end_date' => now()->subDays(5),
        'is_active' => true,
    ]);
    expect($promo->isValid())->toBeFalse();
});

it('is invalid when usage limit reached', function () {
    $promo = PromoCode::create([
        'code' => 'LIMITED',
        'discount_type' => 'percentage',
        'discount_value' => 20,
        'start_date' => now()->subDay(),
        'end_date' => now()->addDay(),
        'is_active' => true,
        'usage_limit' => 1,
        'used_count' => 1,
    ]);
    expect($promo->isValid())->toBeFalse();
});

it('is invalid when below minimum booking amount', function () {
    $promo = PromoCode::create([
        'code' => 'MIN500',
        'discount_type' => 'percentage',
        'discount_value' => 20,
        'min_booking_amount' => 500,
        'start_date' => now()->subDay(),
        'end_date' => now()->addDay(),
        'is_active' => true,
    ]);
    expect($promo->isValid(100))->toBeFalse();
});

it('calculates percentage discount correctly', function () {
    $promo = PromoCode::create([
        'code' => 'PCT20',
        'discount_type' => 'percentage',
        'discount_value' => 20,
        'start_date' => now()->subDay(),
        'end_date' => now()->addDay(),
        'is_active' => true,
    ]);
    expect($promo->calculateDiscount(1000))->toBe(200.0);
});

it('caps percentage discount at max_discount_amount', function () {
    $promo = PromoCode::create([
        'code' => 'CAPPED',
        'discount_type' => 'percentage',
        'discount_value' => 50,
        'max_discount_amount' => 300,
        'start_date' => now()->subDay(),
        'end_date' => now()->addDay(),
        'is_active' => true,
    ]);
    expect($promo->calculateDiscount(1000))->toBe(300.0);
});

it('calculates fixed discount correctly', function () {
    $promo = PromoCode::create([
        'code' => 'FIXED100',
        'discount_type' => 'fixed',
        'discount_value' => 100,
        'start_date' => now()->subDay(),
        'end_date' => now()->addDay(),
        'is_active' => true,
    ]);
    expect($promo->calculateDiscount(1000))->toBe(100.0);
});

it('caps fixed discount at total amount', function () {
    $promo = PromoCode::create([
        'code' => 'BIGOFF',
        'discount_type' => 'fixed',
        'discount_value' => 5000,
        'start_date' => now()->subDay(),
        'end_date' => now()->addDay(),
        'is_active' => true,
    ]);
    expect($promo->calculateDiscount(1000))->toBe(1000.0);
});

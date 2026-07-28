<?php

use App\Enums\ReviewStatus;
use App\Models\Review;
use Illuminate\Foundation\Testing\RefreshDatabase;

uses(RefreshDatabase::class);

it('has correct fillable attributes', function () {
    $review = new Review;
    expect($review->getFillable())->toContain(
        'booking_id', 'customer_id', 'provider_id', 'rating', 'comment', 'status'
    );
});

it('casts rating to integer', function () {
    $review = Review::factory()->create(['rating' => '5']);
    expect($review->rating)->toBeInt();
});

it('casts status to ReviewStatus enum', function () {
    $review = Review::factory()->create(['status' => 'published']);
    expect($review->status)->toBeInstanceOf(ReviewStatus::class);
});

it('belongs to a booking', function () {
    $review = Review::factory()->create();
    expect($review->booking)->not->toBeNull();
});

it('belongs to a customer', function () {
    $review = Review::factory()->create();
    expect($review->customer)->not->toBeNull();
});

it('belongs to a provider', function () {
    $review = Review::factory()->create();
    expect($review->provider)->not->toBeNull();
});

it('appends stars attribute', function () {
    $review = Review::factory()->create(['rating' => 4]);
    expect($review->stars)->toBe(4);
});

it('uses uuid as primary key', function () {
    $review = Review::factory()->create();
    expect(strlen($review->id))->toBe(36);
});

it('uses soft deletes', function () {
    $review = Review::factory()->create();
    $reviewId = $review->id;
    $review->delete();
    expect(Review::withTrashed()->find($reviewId))->not->toBeNull();
    expect(Review::find($reviewId))->toBeNull();
});

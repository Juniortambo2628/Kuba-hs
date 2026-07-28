<?php

use App\Enums\ProviderApplicationStatus;
use App\Enums\ProviderAvailabilityStatus;
use App\Enums\ProviderComplianceStatus;
use App\Models\Provider;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;

uses(RefreshDatabase::class);

it('has correct fillable attributes', function () {
    $provider = new Provider;
    expect($provider->getFillable())->toContain(
        'user_id', 'business_name', 'bio', 'experience_years', 'location_name',
        'latitude', 'longitude', 'service_radius', 'rating_avg', 'review_count',
        'is_verified', 'application_status', 'availability_status', 'specialized_skills',
        'quality_score', 'compliance_status', 'balance', 'total_earned'
    );
});

it('casts application_status to enum', function () {
    $provider = Provider::factory()->create(['application_status' => 'approved']);
    expect($provider->application_status)->toBeInstanceOf(ProviderApplicationStatus::class);
});

it('casts availability_status to enum', function () {
    $provider = Provider::factory()->create(['availability_status' => 'available']);
    expect($provider->availability_status)->toBeInstanceOf(ProviderAvailabilityStatus::class);
});

it('casts compliance_status to enum', function () {
    $provider = Provider::factory()->create(['compliance_status' => 'pending']);
    expect($provider->compliance_status)->toBeInstanceOf(ProviderComplianceStatus::class);
});

it('casts specialized_skills to array', function () {
    $provider = Provider::factory()->create(['specialized_skills' => ['plumbing', 'electrical']]);
    expect($provider->specialized_skills)->toBeArray();
});

it('belongs to a user', function () {
    $user = User::factory()->create();
    $provider = Provider::factory()->create(['user_id' => $user->id]);
    expect($provider->user->id)->toBe($user->id);
});

it('has provider services relationship', function () {
    $provider = Provider::factory()->create();
    $service = \App\Models\Service::factory()->create();
    \App\Models\ProviderService::create([
        'provider_id' => $provider->id,
        'service_id' => $service->id,
        'base_price' => 500,
        'pricing_type' => 'fixed',
    ]);
    expect($provider->providerServices)->toHaveCount(1);
});

it('has reviews relationship', function () {
    $provider = Provider::factory()->create();
    $user = User::factory()->create();
    $booking = \App\Models\Booking::factory()->create([
        'customer_id' => $user->id,
        'provider_id' => $provider->id,
    ]);
    \App\Models\Review::create([
        'booking_id' => $booking->id,
        'customer_id' => $user->id,
        'provider_id' => $provider->id,
        'rating' => 5,
        'comment' => 'Great service!',
    ]);
    expect($provider->reviews)->toHaveCount(1);
});

it('has bookings relationship', function () {
    $provider = Provider::factory()->create();
    $user = User::factory()->create();
    \App\Models\Booking::factory()->create([
        'customer_id' => $user->id,
        'provider_id' => $provider->id,
    ]);
    expect($provider->bookings)->toHaveCount(1);
});

it('has conversations relationship', function () {
    $provider = Provider::factory()->create();
    $user = User::factory()->create();
    $booking = \App\Models\Booking::factory()->create([
        'customer_id' => $user->id,
        'provider_id' => $provider->id,
    ]);
    \App\Models\Conversation::create([
        'booking_id' => $booking->id,
        'customer_id' => $user->id,
        'provider_id' => $provider->id,
    ]);
    expect($provider->conversations)->toHaveCount(1);
});

it('uses uuid as primary key', function () {
    $provider = Provider::factory()->create();
    expect(strlen($provider->id))->toBe(36);
});

it('uses soft deletes', function () {
    $provider = Provider::factory()->create();
    $providerId = $provider->id;
    $provider->delete();
    expect(Provider::withTrashed()->find($providerId))->not->toBeNull();
    expect(Provider::find($providerId))->toBeNull();
});

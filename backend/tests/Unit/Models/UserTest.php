<?php

use App\Enums\UserRole;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;

uses(RefreshDatabase::class);

it('has correct fillable attributes', function () {
    $user = new User;
    expect($user->getFillable())->toContain(
        'first_name', 'last_name', 'email', 'password', 'phone', 'role',
        'avatar_url', 'google_id', 'is_verified', 'is_active', 'unsubscribed_from_emails'
    );
});

it('casts role to UserRole enum', function () {
    $user = User::factory()->create(['role' => 'customer']);
    expect($user->role)->toBeInstanceOf(UserRole::class);
});

it('casts boolean attributes correctly', function () {
    $user = User::factory()->create([
        'is_verified' => true,
        'is_active' => true,
        'unsubscribed_from_emails' => false,
    ]);
    expect($user->is_verified)->toBeTrue()
        ->and($user->is_active)->toBeTrue()
        ->and($user->unsubscribed_from_emails)->toBeFalse();
});

it('computes name attribute from first and last name', function () {
    $user = User::factory()->create([
        'first_name' => 'John',
        'last_name' => 'Doe',
    ]);
    expect($user->name)->toBe('John Doe');
});

it('computes name with only first name', function () {
    $user = User::factory()->create([
        'first_name' => 'John',
        'last_name' => '',
    ]);
    expect($user->name)->toBe('John ');
});

it('returns true for isAdmin when role is admin', function () {
    $user = User::factory()->create(['role' => 'admin']);
    expect($user->isAdmin())->toBeTrue();
});

it('returns false for isAdmin when role is customer', function () {
    $user = User::factory()->create(['role' => 'customer']);
    expect($user->isAdmin())->toBeFalse();
});

it('returns true for isProvider when role is provider', function () {
    $user = User::factory()->create(['role' => 'provider']);
    expect($user->isProvider())->toBeTrue();
});

it('returns true for isCustomer when role is customer', function () {
    $user = User::factory()->create(['role' => 'customer']);
    expect($user->isCustomer())->toBeTrue();
});

it('has provider relationship', function () {
    $user = User::factory()->create(['role' => 'provider']);
    $provider = \App\Models\Provider::factory()->create(['user_id' => $user->id]);
    expect($user->provider)->not->toBeNull()
        ->and($user->provider->id)->toBe($provider->id);
});

it('returns null provider for customer user', function () {
    $user = User::factory()->create(['role' => 'customer']);
    expect($user->provider)->toBeNull();
});

it('has addresses relationship', function () {
    $user = User::factory()->create();
    \App\Models\Address::factory()->create(['user_id' => $user->id]);
    expect($user->addresses)->toHaveCount(1);
});

it('has bookings relationship', function () {
    $user = User::factory()->create();
    $provider = \App\Models\Provider::factory()->create();
    $service = \App\Models\Service::factory()->create();
    \App\Models\Booking::factory()->create([
        'customer_id' => $user->id,
        'provider_id' => $provider->id,
        'service_id' => $service->id,
    ]);
    expect($user->bookings)->toHaveCount(1);
});

it('has payments relationship', function () {
    $user = User::factory()->create();
    $provider = \App\Models\Provider::factory()->create();
    $booking = \App\Models\Booking::factory()->create([
        'customer_id' => $user->id,
        'provider_id' => $provider->id,
    ]);
    \App\Models\Payment::factory()->create([
        'customer_id' => $user->id,
        'provider_id' => $provider->id,
        'booking_id' => $booking->id,
    ]);
    expect($user->payments)->toHaveCount(1);
});

it('has loyalty points relationship', function () {
    $user = User::factory()->create();
    \App\Models\LoyaltyPoint::create([
        'user_id' => $user->id,
        'points' => 100,
        'description' => 'Test points',
        'transaction_type' => 'earn',
    ]);
    expect($user->loyaltyPoints)->toHaveCount(1);
});

it('uses uuid as primary key', function () {
    $user = User::factory()->create();
    expect($user->getKeyName())->toBe('id');
    expect(strlen($user->id))->toBe(36);
});

it('uses soft deletes', function () {
    $user = User::factory()->create();
    $userId = $user->id;
    $user->delete();
    expect(User::withTrashed()->find($userId))->not->toBeNull();
    expect(User::find($userId))->toBeNull();
});

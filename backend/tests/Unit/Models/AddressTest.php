<?php

use App\Models\Address;
use Illuminate\Foundation\Testing\RefreshDatabase;

uses(RefreshDatabase::class);

it('has correct fillable attributes', function () {
    $address = new Address;
    expect($address->getFillable())->toContain(
        'user_id', 'address_type', 'street_address', 'apartment',
        'city', 'state', 'postal_code', 'country', 'latitude',
        'longitude', 'is_default'
    );
});

it('casts is_default to boolean', function () {
    $address = Address::factory()->create(['is_default' => true]);
    expect($address->is_default)->toBeTrue();
});

it('casts latitude and longitude to decimal', function () {
    $address = Address::factory()->create([
        'latitude' => -1.2921,
        'longitude' => 36.8219,
    ]);
    expect($address->latitude)->toBe('-1.29210000');
    expect($address->longitude)->toBe('36.82190000');
});

it('belongs to a user', function () {
    $address = Address::factory()->create();
    expect($address->user)->not->toBeNull();
    expect($address->user->id)->toBe($address->user_id);
});

it('uses uuid as primary key', function () {
    $address = Address::factory()->create();
    expect(strlen($address->id))->toBe(36);
});

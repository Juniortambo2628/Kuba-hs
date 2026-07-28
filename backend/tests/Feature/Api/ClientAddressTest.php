<?php

use App\Models\User;
use App\Models\Address;

describe('client addresses API', function () {
    beforeEach(function () {
        $this->customer = User::factory()->create(['role' => 'customer']);
    });

    it('returns customer addresses', function () {
        Address::factory()->create(['user_id' => $this->customer->id]);
        Address::factory()->create(['user_id' => $this->customer->id]);

        $response = $this->actingAs($this->customer)
            ->getJson('/api/client/addresses');

        $response->assertOk();
    });

    it('creates a new address', function () {
        $response = $this->actingAs($this->customer)
            ->postJson('/api/client/addresses', [
                'street_address' => '123 Nairobi Street',
                'city' => 'Nairobi',
                'postal_code' => '00100',
                'address_type' => 'home',
            ]);

        $response->assertCreated();
        expect(Address::where('user_id', $this->customer->id)->count())->toBe(1);
    });

    it('validates required fields', function () {
        $response = $this->actingAs($this->customer)
            ->postJson('/api/client/addresses', [
                'street_address' => '',
            ]);

        $response->assertStatus(422);
    });

    it('updates an address', function () {
        $address = Address::factory()->create(['user_id' => $this->customer->id]);

        $response = $this->actingAs($this->customer)
            ->putJson("/api/client/addresses/{$address->id}", [
                'street_address' => '456 Updated Avenue',
                'city' => 'Mombasa',
            ]);

        $response->assertOk();
        expect($address->fresh()->street_address)->toBe('456 Updated Avenue');
    });

    it('prevents updating other customer address', function () {
        $otherCustomer = User::factory()->create(['role' => 'customer']);
        $address = Address::factory()->create(['user_id' => $otherCustomer->id]);

        $response = $this->actingAs($this->customer)
            ->putJson("/api/client/addresses/{$address->id}", [
                'street_address' => 'Hacked',
            ]);

        $response->assertForbidden();
    });

    it('deletes an address', function () {
        $address = Address::factory()->create(['user_id' => $this->customer->id]);

        $response = $this->actingAs($this->customer)
            ->deleteJson("/api/client/addresses/{$address->id}");

        $response->assertOk();
        expect(Address::find($address->id))->toBeNull();
    });

    it('sets default address', function () {
        $addr1 = Address::factory()->create(['user_id' => $this->customer->id, 'is_default' => true]);
        $addr2 = Address::factory()->create(['user_id' => $this->customer->id, 'is_default' => false]);

        $response = $this->actingAs($this->customer)
            ->patchJson("/api/client/addresses/{$addr2->id}/default");

        $response->assertOk();
        expect($addr2->fresh()->is_default)->toBeTrue();
        expect($addr1->fresh()->is_default)->toBeFalse();
    });

    it('makes first address default automatically', function () {
        $response = $this->actingAs($this->customer)
            ->postJson('/api/client/addresses', [
                'street_address' => '123 Nairobi Street',
                'city' => 'Nairobi',
                'postal_code' => '00100',
            ]);

        $response->assertCreated();
        $address = Address::where('user_id', $this->customer->id)->first();
        expect($address->is_default)->toBeTrue();
    });
});

<?php

use App\Enums\BookingStatus;
use App\Models\Booking;
use App\Models\Payment;
use App\Models\Provider;
use App\Models\User;
use App\Policies\BookingPolicy;
use Illuminate\Foundation\Testing\RefreshDatabase;

uses(RefreshDatabase::class);

describe('BookingPolicy', function () {
    beforeEach(function () {
        $this->policy = new BookingPolicy;
        $this->customer = User::factory()->create(['role' => 'customer']);
        $this->providerUser = User::factory()->create(['role' => 'provider']);
        $this->provider = Provider::factory()->create(['user_id' => $this->providerUser->id]);
        $this->admin = User::factory()->create(['role' => 'admin']);
        $this->booking = Booking::factory()->create([
            'customer_id' => $this->customer->id,
            'provider_id' => $this->provider->id,
        ]);
    });

    it('allows admin to view any booking', function () {
        expect($this->policy->view($this->admin, $this->booking))->toBeTrue();
    });

    it('allows provider to view their booking', function () {
        expect($this->policy->view($this->providerUser, $this->booking))->toBeTrue();
    });

    it('allows customer to view their booking', function () {
        expect($this->policy->view($this->customer, $this->booking))->toBeTrue();
    });

    it('prevents customer from viewing other customer booking', function () {
        $other = User::factory()->create(['role' => 'customer']);
        expect($this->policy->view($other, $this->booking))->toBeFalse();
    });

    it('allows admin to update any booking', function () {
        expect($this->policy->update($this->admin, $this->booking))->toBeTrue();
    });

    it('allows provider to update their booking', function () {
        expect($this->policy->update($this->providerUser, $this->booking))->toBeTrue();
    });

    it('prevents delete by any user', function () {
        expect($this->policy->delete($this->admin, $this->booking))->toBeFalse();
        expect($this->policy->delete($this->customer, $this->booking))->toBeFalse();
        expect($this->policy->delete($this->providerUser, $this->booking))->toBeFalse();
    });
});

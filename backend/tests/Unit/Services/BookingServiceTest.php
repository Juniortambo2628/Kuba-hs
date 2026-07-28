<?php

use App\Enums\BookingStatus;
use App\Models\Address;
use App\Models\Booking;
use App\Models\Conversation;
use App\Models\PromoCode;
use App\Models\Provider;
use App\Models\ProviderService;
use App\Models\Service;
use App\Models\ServiceCategory;
use App\Models\User;
use App\Services\BookingService;
use Illuminate\Foundation\Testing\RefreshDatabase;

uses(RefreshDatabase::class);

describe('BookingService', function () {
    beforeEach(function () {
        $this->service = new BookingService;
        $this->customer = User::factory()->create(['role' => 'customer']);
        $this->providerUser = User::factory()->create(['role' => 'provider']);
        $this->provider = Provider::factory()->create(['user_id' => $this->providerUser->id]);
        $this->category = ServiceCategory::factory()->create();
        $this->serviceModel = Service::factory()->create(['category_id' => $this->category->id]);
        $this->providerService = ProviderService::create([
            'provider_id' => $this->provider->id,
            'service_id' => $this->serviceModel->id,
            'base_price' => 500,
            'pricing_type' => 'fixed',
        ]);
    });

    it('creates a booking with new address', function () {
        $booking = $this->service->createBooking($this->customer, [
            'provider_id' => $this->provider->id,
            'service_id' => $this->serviceModel->id,
            'scheduled_date' => now()->addDays(3)->format('Y-m-d'),
            'service_type' => 'residential',
            'quantity' => 1,
            'new_address' => [
                'street_address' => '123 Test Street',
                'city' => 'Nairobi',
                'state' => 'Nairobi',
                'postal_code' => '00100',
            ],
        ]);

        expect($booking)->not->toBeNull();
        expect($booking->booking_number)->toStartWith('BK-');
        expect($booking->status->value)->toBe('pending');
        expect($booking->payment_status->value)->toBe('pending');
        expect((float) $booking->estimated_price)->toBe(500.0);
        expect($booking->customer_id)->toBe($this->customer->id);
        expect($booking->provider_id)->toBe($this->provider->id);
        expect($booking->service_id)->toBe($this->serviceModel->id);
    });

    it('creates a booking with existing address', function () {
        $address = Address::factory()->create(['user_id' => $this->customer->id]);

        $booking = $this->service->createBooking($this->customer, [
            'provider_id' => $this->provider->id,
            'service_id' => $this->serviceModel->id,
            'scheduled_date' => now()->addDays(3)->format('Y-m-d'),
            'service_type' => 'residential',
            'quantity' => 1,
            'address_id' => $address->id,
        ]);

        expect($booking->address_id)->toBe($address->id);
    });

    it('creates a conversation for the booking', function () {
        $booking = $this->service->createBooking($this->customer, [
            'provider_id' => $this->provider->id,
            'service_id' => $this->serviceModel->id,
            'scheduled_date' => now()->addDays(3)->format('Y-m-d'),
            'service_type' => 'residential',
            'quantity' => 1,
            'address_id' => Address::factory()->create(['user_id' => $this->customer->id])->id,
        ]);

        expect(Conversation::where('booking_id', $booking->id)->count())->toBe(1);
    });

    it('calculates price for fixed pricing', function () {
        $booking = $this->service->createBooking($this->customer, [
            'provider_id' => $this->provider->id,
            'service_id' => $this->serviceModel->id,
            'scheduled_date' => now()->addDays(3)->format('Y-m-d'),
            'service_type' => 'residential',
            'quantity' => 3,
            'address_id' => Address::factory()->create(['user_id' => $this->customer->id])->id,
        ]);

        expect((float) $booking->estimated_price)->toBe(1500.0);
    });

    it('calculates price for hourly pricing', function () {
        $this->providerService->update(['pricing_type' => 'hourly', 'min_hours' => 2]);

        $booking = $this->service->createBooking($this->customer, [
            'provider_id' => $this->provider->id,
            'service_id' => $this->serviceModel->id,
            'scheduled_date' => now()->addDays(3)->format('Y-m-d'),
            'service_type' => 'residential',
            'quantity' => 3,
            'address_id' => Address::factory()->create(['user_id' => $this->customer->id])->id,
        ]);

        expect((float) $booking->estimated_price)->toBe(1500.0);
    });

    it('applies promo code discount', function () {
        $promo = PromoCode::create([
            'code' => 'TEST20',
            'discount_type' => 'percentage',
            'discount_value' => 20,
            'start_date' => now()->subDay(),
            'end_date' => now()->addDay(),
            'is_active' => true,
        ]);

        $booking = $this->service->createBooking($this->customer, [
            'provider_id' => $this->provider->id,
            'service_id' => $this->serviceModel->id,
            'scheduled_date' => now()->addDays(3)->format('Y-m-d'),
            'service_type' => 'residential',
            'quantity' => 1,
            'address_id' => Address::factory()->create(['user_id' => $this->customer->id])->id,
            'promo_code' => 'TEST20',
        ]);

        expect((float) $booking->discount_amount)->toBe(100.0);
        expect((float) $booking->estimated_price)->toBe(400.0);
        expect($booking->promo_code_id)->toBe($promo->id);
    });

    it('increments promo code usage count', function () {
        PromoCode::create([
            'code' => 'COUNT',
            'discount_type' => 'fixed',
            'discount_value' => 50,
            'start_date' => now()->subDay(),
            'end_date' => now()->addDay(),
            'is_active' => true,
            'used_count' => 0,
        ]);

        $this->service->createBooking($this->customer, [
            'provider_id' => $this->provider->id,
            'service_id' => $this->serviceModel->id,
            'scheduled_date' => now()->addDays(3)->format('Y-m-d'),
            'service_type' => 'residential',
            'quantity' => 1,
            'address_id' => Address::factory()->create(['user_id' => $this->customer->id])->id,
            'promo_code' => 'COUNT',
        ]);

        expect(PromoCode::where('code', 'COUNT')->first()->used_count)->toBe(1);
    });

    it('updates booking status', function () {
        $booking = Booking::factory()->create([
            'customer_id' => $this->customer->id,
            'provider_id' => $this->provider->id,
            'service_id' => $this->serviceModel->id,
            'status' => 'pending',
        ]);

        $updated = $this->service->updateBookingStatus($booking, $this->providerUser, 'confirmed');

        expect($updated->status->value)->toBe('confirmed');
    });

    it('records started_at when status changes to in_progress', function () {
        $booking = Booking::factory()->create([
            'customer_id' => $this->customer->id,
            'provider_id' => $this->provider->id,
            'service_id' => $this->serviceModel->id,
            'status' => 'confirmed',
            'started_at' => null,
        ]);

        $updated = $this->service->updateBookingStatus($booking, $this->providerUser, 'in_progress');

        expect($updated->started_at)->not->toBeNull();
    });

    it('records completed_at when status changes to completed', function () {
        $booking = Booking::factory()->create([
            'customer_id' => $this->customer->id,
            'provider_id' => $this->provider->id,
            'service_id' => $this->serviceModel->id,
            'status' => 'in_progress',
            'started_at' => now()->subHour(),
        ]);

        $updated = $this->service->updateBookingStatus($booking, $this->providerUser, 'completed');

        expect($updated->completed_at)->not->toBeNull();
        expect($updated->final_price)->not->toBeNull();
    });

    it('prevents customer from setting non-cancel status', function () {
        $booking = Booking::factory()->create([
            'customer_id' => $this->customer->id,
            'provider_id' => $this->provider->id,
            'service_id' => $this->serviceModel->id,
            'status' => 'pending',
        ]);

        $this->service->updateBookingStatus($booking, $this->customer, 'confirmed');
    })->throws(\Symfony\Component\HttpKernel\Exception\HttpException::class);

    it('allows customer to cancel booking', function () {
        $booking = Booking::factory()->create([
            'customer_id' => $this->customer->id,
            'provider_id' => $this->provider->id,
            'service_id' => $this->serviceModel->id,
            'status' => 'pending',
        ]);

        $updated = $this->service->updateBookingStatus($booking, $this->customer, 'cancelled');

        expect($updated->status->value)->toBe('cancelled');
    });

    it('prevents unauthorized user from updating status', function () {
        $booking = Booking::factory()->create([
            'customer_id' => $this->customer->id,
            'provider_id' => $this->provider->id,
            'service_id' => $this->serviceModel->id,
            'status' => 'pending',
        ]);

        $unauthorized = User::factory()->create(['role' => 'customer']);
        $this->service->updateBookingStatus($booking, $unauthorized, 'confirmed');
    })->throws(\Symfony\Component\HttpKernel\Exception\HttpException::class);
});

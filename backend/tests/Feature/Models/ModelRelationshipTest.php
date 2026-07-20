<?php

use App\Models\Address;
use App\Models\Booking;
use App\Models\FAQ;
use App\Models\Payment;
use App\Models\Provider;
use App\Models\ProviderService;
use App\Models\Review;
use App\Models\Service;
use App\Models\ServiceCategory;
use App\Models\Testimonial;
use App\Models\User;

describe('Model relationships', function () {

    it('service category has many services', function () {
        $category = ServiceCategory::factory()->create();
        $service = Service::factory()->create(['category_id' => $category->id]);

        $this->assertCount(1, $category->services);
        $this->assertTrue($category->services->first()->is($service));
    });

    it('service belongs to a service category', function () {
        $category = ServiceCategory::factory()->create();
        $service = Service::factory()->create(['category_id' => $category->id]);

        $this->assertNotNull($service->category);
        $this->assertTrue($service->category->is($category));
    });

    it('service has many provider services', function () {
        $service = Service::factory()->create();
        $provider = Provider::factory()->create();
        $providerService = ProviderService::create([
            'provider_id' => $provider->id,
            'service_id' => $service->id,
            'base_price' => 1000,
            'is_available' => true,
        ]);

        $this->assertCount(1, $service->providerServices);
        $this->assertTrue($service->providerServices->first()->is($providerService));
    });

    it('booking belongs to customer, provider, and service', function () {
        $customer = User::factory()->create(['role' => 'customer']);
        $providerUser = User::factory()->create(['role' => 'provider']);
        $provider = Provider::factory()->create(['user_id' => $providerUser->id]);
        $category = ServiceCategory::factory()->create();
        $service = Service::factory()->create(['category_id' => $category->id]);
        $address = Address::factory()->create(['user_id' => $customer->id]);

        $booking = Booking::factory()->create([
            'customer_id' => $customer->id,
            'provider_id' => $provider->id,
            'service_id' => $service->id,
            'address_id' => $address->id,
        ]);

        $this->assertTrue($booking->customer->is($customer));
        $this->assertTrue($booking->provider->is($provider));
        $this->assertTrue($booking->service->is($service));
    });

    it('booking has one payment and one review', function () {
        $customer = User::factory()->create(['role' => 'customer']);
        $providerUser = User::factory()->create(['role' => 'provider']);
        $provider = Provider::factory()->create(['user_id' => $providerUser->id]);
        $category = ServiceCategory::factory()->create();
        $service = Service::factory()->create(['category_id' => $category->id]);
        $address = Address::factory()->create(['user_id' => $customer->id]);

        $booking = Booking::factory()->create([
            'customer_id' => $customer->id,
            'provider_id' => $provider->id,
            'service_id' => $service->id,
            'address_id' => $address->id,
        ]);

        Payment::create([
            'booking_id' => $booking->id,
            'customer_id' => $customer->id,
            'provider_id' => $provider->id,
            'amount' => 5000,
            'platform_fee' => 500,
            'provider_amount' => 4500,
            'payment_method' => 'mpesa',
            'transaction_id' => 'TXN-123456',
            'status' => 'completed',
            'payment_gateway' => 'mpesa',
        ]);

        Review::create([
            'booking_id' => $booking->id,
            'customer_id' => $customer->id,
            'provider_id' => $provider->id,
            'rating' => 5,
            'comment' => 'Excellent service!',
            'status' => 'published',
        ]);

        $this->assertNotNull($booking->payment);
        $this->assertNotNull($booking->review);
        $this->assertEquals(5000, $booking->payment->amount);
        $this->assertEquals(5, $booking->review->rating);
    });

    it('user has one provider when role is provider', function () {
        $user = User::factory()->create(['role' => 'provider']);
        $provider = Provider::factory()->create(['user_id' => $user->id]);

        $this->assertNotNull($user->provider);
        $this->assertTrue($user->provider->is($provider));
    });

    it('user has many bookings as customer', function () {
        $customer = User::factory()->create(['role' => 'customer']);
        $provider = Provider::factory()->create();
        $service = Service::factory()->create();
        $address = Address::factory()->create(['user_id' => $customer->id]);

        Booking::factory()->create(['customer_id' => $customer->id, 'provider_id' => $provider->id, 'service_id' => $service->id, 'address_id' => $address->id]);
        Booking::factory()->create(['customer_id' => $customer->id, 'provider_id' => $provider->id, 'service_id' => $service->id, 'address_id' => $address->id]);

        $this->assertCount(2, $customer->bookings);
    });

    it('service category uses soft deletes', function () {
        $category = ServiceCategory::factory()->create();

        $category->delete();

        $this->assertSoftDeleted('service_categories', ['id' => $category->id]);
        $this->assertNull(ServiceCategory::find($category->id));
        $this->assertNotNull(ServiceCategory::withTrashed()->find($category->id));
    });

    it('service category has slug attribute derived from name', function () {
        $category = ServiceCategory::factory()->create(['name' => 'Home Cleaning']);

        expect($category->slug)->toBe('home-cleaning');
    });
});

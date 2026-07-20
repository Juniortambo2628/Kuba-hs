<?php

use App\Enums\BookingStatus;
use App\Models\Address;
use App\Models\Booking;
use App\Models\Provider;
use App\Models\ProviderService;
use App\Models\Service;
use App\Models\ServiceCategory;
use App\Models\User;

beforeEach(function () {
    $this->app->instance(\App\Services\BookingActivityLogService::class, new class {
        public function log($booking, $action, $user = null, $description = null, $metadata = []) {}
        public function logStatusChange($booking, $user, $from, $to) {}
    });
});

describe('Admin Booking API', function () {

    beforeEach(function () {
        $this->admin = User::factory()->create(['role' => 'admin']);
        $this->customer = User::factory()->create(['role' => 'customer']);
        $this->providerUser = User::factory()->create(['role' => 'provider']);
        $this->provider = Provider::factory()->create(['user_id' => $this->providerUser->id]);
        $this->category = ServiceCategory::factory()->create();
        $this->service = Service::factory()->create(['category_id' => $this->category->id, 'is_active' => true]);
        $this->address = Address::factory()->create(['user_id' => $this->customer->id]);
        ProviderService::create([
            'provider_id' => $this->provider->id,
            'service_id' => $this->service->id,
            'base_price' => 2000,
            'is_available' => true,
        ]);
        $this->booking = Booking::factory()->create([
            'customer_id' => $this->customer->id,
            'provider_id' => $this->provider->id,
            'service_id' => $this->service->id,
            'address_id' => $this->address->id,
            'status' => BookingStatus::Pending,
        ]);
    });

    it('lists paginated bookings', function () {
        $response = $this->actingAs($this->admin, 'sanctum')
            ->getJson('/api/admin/bookings');

        $response->assertOk();
        $response->assertJsonStructure([
            'data' => [
                '*' => ['id', 'booking_number', 'status'],
            ],
        ]);
    });

    it('validates required fields on create', function () {
        $response = $this->actingAs($this->admin, 'sanctum')
            ->postJson('/api/admin/bookings', []);

        $response->assertStatus(422);
        $response->assertJsonValidationErrors(['customer_id', 'provider_id', 'service_id', 'scheduled_date', 'service_type', 'quantity']);
    });

    it('shows a booking with full relations', function () {
        $response = $this->actingAs($this->admin, 'sanctum')
            ->getJson("/api/admin/bookings/{$this->booking->id}");

        $response->assertOk();
        $response->assertJsonStructure([
            'data' => [
                'id',
                'booking_number',
                'status',
                'customer' => ['id'],
                'service' => ['id'],
            ],
        ]);
    });

    it('updates a booking status', function () {
        $response = $this->actingAs($this->admin, 'sanctum')
            ->patchJson("/api/admin/bookings/{$this->booking->id}/status", [
                'status' => BookingStatus::Confirmed->value,
            ]);

        $response->assertOk();
        $response->assertJson(['message' => 'Booking status updated.']);

        $this->assertDatabaseHas('bookings', [
            'id' => $this->booking->id,
            'status' => BookingStatus::Confirmed->value,
        ]);
    });

    it('soft deletes a booking', function () {
        $response = $this->actingAs($this->admin, 'sanctum')
            ->deleteJson("/api/admin/bookings/{$this->booking->id}");

        $response->assertOk();

        $this->assertSoftDeleted('bookings', ['id' => $this->booking->id]);
    });

    it('rejects unauthenticated access', function () {
        $this->getJson('/api/admin/bookings')
            ->assertStatus(401);
    });

    it('rejects non-admin users', function () {
        $customer = User::factory()->create(['role' => 'customer']);

        $this->actingAs($customer, 'sanctum')
            ->getJson('/api/admin/bookings')
            ->assertStatus(403);
    });
});

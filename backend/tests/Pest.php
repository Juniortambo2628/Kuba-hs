<?php

/*
|--------------------------------------------------------------------------
| Test Case
|--------------------------------------------------------------------------
*/

pest()->extend(Tests\TestCase::class)
    ->use(Illuminate\Foundation\Testing\RefreshDatabase::class)
    ->in('Feature', 'Unit');

/*
|--------------------------------------------------------------------------
| Expectations
|--------------------------------------------------------------------------
*/

expect()->extend('toBeOne', function () {
    return $this->toBe(1);
});

expect()->extend('toBeJsonApiResponse', function () {
    return $this->toBeArray()
        ->and($this->value)->toHaveKey('data');
});

/*
|--------------------------------------------------------------------------
| Functions — Shared Test Helpers
|--------------------------------------------------------------------------
*/

use App\Enums\UserRole;
use App\Models\User;
use App\Models\Provider;
use App\Models\Service;
use App\Models\ServiceCategory;
use App\Models\ProviderService;
use App\Models\Booking;
use App\Models\Address;

/**
 * Create a customer user.
 */
function createCustomer(array $overrides = []): User
{
    return User::factory()->create(array_merge([
        'role' => UserRole::Customer,
    ], $overrides));
}

/**
 * Create a provider user with associated Provider profile.
 */
function createProviderUser(array $userOverrides = [], array $providerOverrides = []): User
{
    $user = User::factory()->create(array_merge([
        'role' => UserRole::Provider,
    ], $userOverrides));

    Provider::factory()->create(array_merge([
        'user_id' => $user->id,
    ], $providerOverrides));

    return $user->load('provider');
}

/**
 * Create an admin user.
 */
function createAdmin(array $overrides = []): User
{
    return User::factory()->create(array_merge([
        'role' => UserRole::Admin,
    ], $overrides));
}

/**
 * Create a full service catalog chain: category → service → provider service.
 */
function createServiceCatalog(Provider $provider = null): array
{
    $category = ServiceCategory::factory()->create();
    $service = Service::factory()->create(['category_id' => $category->id]);

    $providerUser = null;
    if (!$provider) {
        $providerUser = createProviderUser();
        $provider = $providerUser->provider;
    }

    $providerService = ProviderService::factory()->create([
        'provider_id' => $provider->id,
        'service_id' => $service->id,
    ]);

    return compact('category', 'service', 'provider', 'providerService', 'providerUser');
}

/**
 * Create a full booking workflow: customer + provider + service + address + booking.
 */
function createBookingWorkflow(array $bookingOverrides = []): array
{
    $customer = createCustomer();
    $providerUser = createProviderUser();
    $provider = $providerUser->provider;
    $catalog = createServiceCatalog($provider);
    $address = Address::factory()->create(['user_id' => $customer->id]);

    $booking = Booking::factory()->create(array_merge([
        'customer_id' => $customer->id,
        'provider_id' => $provider->id,
        'service_id' => $catalog['service']->id,
        'address_id' => $address->id,
    ], $bookingOverrides));

    return array_merge($catalog, compact('customer', 'providerUser', 'address', 'booking'));
}

<?php

use App\Models\Booking;
use App\Models\Provider;
use App\Models\ProviderService;
use App\Models\Service;
use App\Models\ServiceCategory;
use App\Models\User;
use App\Services\ProviderManagementService;
use Illuminate\Foundation\Testing\RefreshDatabase;

uses(RefreshDatabase::class);

describe('ProviderManagementService', function () {
    beforeEach(function () {
        $this->service = new ProviderManagementService;
        $this->user = User::factory()->create(['role' => 'provider']);
        $this->provider = Provider::factory()->create(['user_id' => $this->user->id]);
        $this->category = ServiceCategory::factory()->create();
        $this->serviceModel = Service::factory()->create(['category_id' => $this->category->id]);
    });

    it('syncs a new provider service', function () {
        $ps = $this->service->syncProviderService($this->provider, [
            'service_id' => $this->serviceModel->id,
            'base_price' => 500,
            'pricing_type' => 'fixed',
        ]);

        expect($ps)->not->toBeNull();
        expect($ps->provider_id)->toBe($this->provider->id);
        expect($ps->service_id)->toBe($this->serviceModel->id);
        expect($ps->base_price)->toBe('500.00');
    });

    it('updates an existing provider service', function () {
        $ps = ProviderService::create([
            'provider_id' => $this->provider->id,
            'service_id' => $this->serviceModel->id,
            'base_price' => 500,
            'pricing_type' => 'fixed',
        ]);

        $updated = $this->service->updateProviderService($this->provider, [
            'base_price' => 800,
        ], $ps->id);

        expect($updated->base_price)->toBe('800.00');
    });

    it('throws exception for non-existent provider service', function () {
        $this->service->updateProviderService($this->provider, [
            'base_price' => 800,
        ], 'non-existent-id');
    })->throws(\Illuminate\Database\Eloquent\ModelNotFoundException::class);

    it('sets up a new provider profile', function () {
        $newUser = User::factory()->create(['role' => 'provider']);

        $provider = $this->service->setupProfile($newUser, [
            'business_name' => 'Test Provider',
            'bio' => 'Professional services',
            'experience_years' => 5,
            'location_name' => 'Nairobi',
            'services' => [
                [
                    'service_id' => $this->serviceModel->id,
                    'base_price' => 600,
                    'pricing_type' => 'fixed',
                ],
            ],
        ]);

        expect($provider->business_name)->toBe('Test Provider');
        expect($provider->user_id)->toBe($newUser->id);
        expect($provider->providerServices)->toHaveCount(1);
    });

    it('updates a provider profile and re-syncs services', function () {
        $ps = ProviderService::create([
            'provider_id' => $this->provider->id,
            'service_id' => $this->serviceModel->id,
            'base_price' => 500,
            'pricing_type' => 'fixed',
        ]);

        $newService = Service::factory()->create(['category_id' => $this->category->id]);

        $updated = $this->service->updateProfile($this->provider, [
            'business_name' => 'Updated Provider',
            'bio' => 'Updated bio',
            'services' => [
                [
                    'service_id' => $newService->id,
                    'base_price' => 700,
                    'pricing_type' => 'hourly',
                ],
            ],
        ]);

        expect($updated->business_name)->toBe('Updated Provider');
        expect($updated->providerServices)->toHaveCount(1);
        expect($updated->providerServices->first()->service_id)->toBe($newService->id);
    });
});

<?php

namespace App\Services;

use App\Models\ProviderService;
use App\Models\Provider;

class ProviderManagementService
{
    /**
     * Store or strictly update the mapping of a specific Provider capability onto an operational Service Object.
     */
    public function syncProviderService(Provider $provider, array $data): ProviderService
    {
        $keys = ['provider_id' => $provider->id, 'service_id' => $data['service_id']];
        if (! empty($data['id'])) {
            $keys = ['id' => $data['id']];
        }

        $providerService = $provider->providerServices()->updateOrCreate(
            $keys,
            [
                'service_id' => $data['service_id'],
                'base_price' => $data['base_price'],
                'pricing_type' => $data['pricing_type'] ?? 'fixed',
                'min_hours' => $data['min_hours'] ?? 1,
                'travel_fee' => $data['travel_fee'] ?? 0,
                'equipment_included' => $data['equipment_included'] ?? false,
                'extra_configs' => $data['extra_configs'] ?? null,
                'is_available' => $data['is_available'] ?? true,
            ]
        );

        return $providerService;
    }

    /**
     * Update an existing Provider capability Object structure.
     */
    public function updateProviderService(Provider $provider, array $data, string $id): ProviderService
    {
        $providerService = $provider->providerServices()->findOrFail($id);
        $providerService->update($data);

        return $providerService;
    }

    /**
     * Create a new Provider Profile and sync initial services.
     */
    public function setupProfile($user, array $data): Provider
    {
        $provider = Provider::create([
            'user_id' => $user->id,
            'business_name' => $data['business_name'],
            'bio' => $data['bio'] ?? null,
            'experience_years' => $data['experience_years'] ?? null,
            'location_name' => $data['location_name'] ?? null,
            'service_radius' => $data['service_radius'] ?? 25,
        ]);

        foreach ($data['services'] as $service) {
            ProviderService::create([
                'provider_id' => $provider->id,
                'service_id' => $service['service_id'],
                'base_price' => $service['base_price'],
                'pricing_type' => $service['pricing_type'],
                'is_available' => true,
            ]);
        }

        return $provider;
    }

    /**
     * Update an existing Provider Profile and re-sync services.
     */
    public function updateProfile(Provider $provider, array $data): Provider
    {
        $provider->update([
            'business_name' => $data['business_name'],
            'bio' => $data['bio'] ?? null,
            'experience_years' => $data['experience_years'] ?? null,
            'location_name' => $data['location_name'] ?? null,
            'service_radius' => $data['service_radius'] ?? 25,
        ]);

        $provider->providerServices()->delete();

        foreach ($data['services'] as $service) {
            ProviderService::create([
                'provider_id' => $provider->id,
                'service_id' => $service['service_id'],
                'base_price' => $service['base_price'],
                'pricing_type' => $service['pricing_type'],
                'is_available' => true,
            ]);
        }

        return $provider;
    }
}

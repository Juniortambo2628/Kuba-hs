<?php

use App\Models\Provider;
use App\Models\Service;
use App\Models\ServiceCategory;
use App\Models\User;

describe('provider services API', function () {
    beforeEach(function () {
        $this->user = User::factory()->create(['role' => 'provider']);
        $this->provider = Provider::factory()->create(['user_id' => $this->user->id]);
        $this->category = ServiceCategory::factory()->create();
        $this->service = Service::factory()->create(['category_id' => $this->category->id]);
    });

    it('returns provider services and available services', function () {
        \App\Models\ProviderService::create([
            'provider_id' => $this->provider->id,
            'service_id' => $this->service->id,
            'base_price' => 500,
            'pricing_type' => 'fixed',
        ]);

        $response = $this->actingAs($this->user)
            ->getJson('/api/provider/services');

        $response->assertOk();
        $response->assertJsonStructure([
            'services',
            'available_services',
        ]);
    });

    it('adds a new service to provider profile', function () {
        $response = $this->actingAs($this->user)
            ->postJson('/api/provider/services', [
                'service_id' => $this->service->id,
                'base_price' => 750,
                'pricing_type' => 'fixed',
            ]);

        $response->assertCreated();
        expect(\App\Models\ProviderService::where('provider_id', $this->provider->id)->count())->toBe(1);
    });

    it('prevents adding duplicate service', function () {
        \App\Models\ProviderService::create([
            'provider_id' => $this->provider->id,
            'service_id' => $this->service->id,
            'base_price' => 500,
            'pricing_type' => 'fixed',
        ]);

        $response = $this->actingAs($this->user)
            ->postJson('/api/provider/services', [
                'service_id' => $this->service->id,
                'base_price' => 750,
                'pricing_type' => 'fixed',
            ]);

        $response->assertStatus(422);
    });

    it('updates a provider service', function () {
        $ps = \App\Models\ProviderService::create([
            'provider_id' => $this->provider->id,
            'service_id' => $this->service->id,
            'base_price' => 500,
            'pricing_type' => 'fixed',
        ]);

        $response = $this->actingAs($this->user)
            ->putJson("/api/provider/services/{$ps->id}", [
                'base_price' => 800,
                'is_available' => true,
            ]);

        $response->assertOk();
        expect($ps->fresh()->base_price)->toBe('800.00');
    });

    it('deletes a provider service', function () {
        $ps = \App\Models\ProviderService::create([
            'provider_id' => $this->provider->id,
            'service_id' => $this->service->id,
            'base_price' => 500,
            'pricing_type' => 'fixed',
        ]);

        $response = $this->actingAs($this->user)
            ->deleteJson("/api/provider/services/{$ps->id}");

        $response->assertOk();
        expect(\App\Models\ProviderService::find($ps->id))->toBeNull();
    });

    it('returns 404 for non-existent provider service', function () {
        $response = $this->actingAs($this->user)
            ->deleteJson('/api/provider/services/non-existent');

        $response->assertNotFound();
    });
});

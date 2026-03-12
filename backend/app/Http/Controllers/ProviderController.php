<?php

namespace App\Http\Controllers;

use App\Models\Provider;
use App\Models\ProviderService;
use App\Models\ServiceCategory;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class ProviderController extends Controller
{
    /**
     * Show the provider setup/edit page.
     */
    public function create()
    {
        $user = Auth::user();

        // If provider already exists, redirect to edit
        if ($user->provider) {
            return redirect()->route('provider.edit');
        }

        $categories = ServiceCategory::with('services')->orderBy('sort_order')->get();

        return Inertia::render('Provider/Setup', [
            'categories' => $categories,
            'provider' => null,
            'selectedServices' => [],
        ]);
    }

    /**
     * Store a new provider profile.
     */
    public function store(Request $request)
    {
        $user = Auth::user();

        $validated = $request->validate([
            'business_name' => 'required|string|max:255',
            'bio' => 'nullable|string|max:1000',
            'experience_years' => 'nullable|integer|min:0|max:50',
            'location_name' => 'nullable|string|max:255',
            'service_radius' => 'nullable|integer|min:1|max:200',
            'services' => 'required|array|min:1',
            'services.*.service_id' => 'required|exists:services,id',
            'services.*.base_price' => 'required|numeric|min:0',
            'services.*.pricing_type' => 'required|in:fixed,hourly,per_project',
        ]);

        // Create the provider profile
        $provider = Provider::create([
            'user_id' => $user->id,
            'business_name' => $validated['business_name'],
            'bio' => $validated['bio'] ?? null,
            'experience_years' => $validated['experience_years'] ?? null,
            'location_name' => $validated['location_name'] ?? null,
            'service_radius' => $validated['service_radius'] ?? 25,
        ]);

        // Attach selected services with pricing
        foreach ($validated['services'] as $service) {
            ProviderService::create([
                'provider_id' => $provider->id,
                'service_id' => $service['service_id'],
                'base_price' => $service['base_price'],
                'pricing_type' => $service['pricing_type'],
                'is_available' => true,
            ]);
        }

        return redirect()->route('dashboard')->with('success', 'Your provider profile has been set up!');
    }

    /**
     * Show the provider edit page.
     */
    public function edit()
    {
        $user = Auth::user();
        $provider = $user->provider;

        if (!$provider) {
            return redirect()->route('provider.setup');
        }

        $provider->load('providerServices.service');
        $categories = ServiceCategory::with('services')->orderBy('sort_order')->get();

        $selectedServices = $provider->providerServices->map(function ($ps) {
            return [
                'service_id' => $ps->service_id,
                'base_price' => $ps->base_price,
                'pricing_type' => $ps->pricing_type,
            ];
        });

        return Inertia::render('Provider/Setup', [
            'categories' => $categories,
            'provider' => $provider,
            'selectedServices' => $selectedServices,
        ]);
    }

    /**
     * Update an existing provider profile.
     */
    public function update(Request $request)
    {
        $user = Auth::user();
        $provider = $user->provider;

        if (!$provider) {
            return redirect()->route('provider.setup');
        }

        $validated = $request->validate([
            'business_name' => 'required|string|max:255',
            'bio' => 'nullable|string|max:1000',
            'experience_years' => 'nullable|integer|min:0|max:50',
            'location_name' => 'nullable|string|max:255',
            'service_radius' => 'nullable|integer|min:1|max:200',
            'services' => 'required|array|min:1',
            'services.*.service_id' => 'required|exists:services,id',
            'services.*.base_price' => 'required|numeric|min:0',
            'services.*.pricing_type' => 'required|in:fixed,hourly,per_project',
        ]);

        $provider->update([
            'business_name' => $validated['business_name'],
            'bio' => $validated['bio'] ?? null,
            'experience_years' => $validated['experience_years'] ?? null,
            'location_name' => $validated['location_name'] ?? null,
            'service_radius' => $validated['service_radius'] ?? 25,
        ]);

        // Sync services: delete old ones, create new ones
        $provider->providerServices()->delete();

        foreach ($validated['services'] as $service) {
            ProviderService::create([
                'provider_id' => $provider->id,
                'service_id' => $service['service_id'],
                'base_price' => $service['base_price'],
                'pricing_type' => $service['pricing_type'],
                'is_available' => true,
            ]);
        }

        return redirect()->route('dashboard')->with('success', 'Your profile has been updated!');
    }
}

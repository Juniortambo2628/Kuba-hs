<?php

namespace App\Http\Controllers;

use App\Models\Provider;
use App\Models\ProviderService;
use App\Models\ServiceCategory;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use App\Http\Requests\StoreProviderProfileRequest;
use App\Http\Requests\UpdateProviderProfileRequest;
use App\Services\ProviderManagementService;

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
    public function store(StoreProviderProfileRequest $request, ProviderManagementService $service)
    {
        $user = Auth::user();
        $validated = $request->validated();

        $service->setupProfile($user, $validated);

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
    public function update(UpdateProviderProfileRequest $request, ProviderManagementService $service)
    {
        $user = Auth::user();
        $provider = $user->provider;

        if (!$provider) {
            return redirect()->route('provider.setup');
        }

        $validated = $request->validated();

        $service->updateProfile($provider, $validated);

        return redirect()->route('dashboard')->with('success', 'Your profile has been updated!');
    }
}

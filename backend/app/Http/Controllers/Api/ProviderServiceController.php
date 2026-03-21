<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\ProviderService;
use App\Models\Service;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use App\Http\Requests\StoreProviderServiceRequest;
use App\Services\ProviderManagementService;

class ProviderServiceController extends Controller
{
    public function index()
    {
        $user = Auth::user();
        $provider = $user->provider;

        if (!$provider) {
            return response()->json(['error' => 'Provider profile not found'], 404);
        }

        $services = $provider->providerServices()->with('service.category')->get();

        return response()->json([
            'services' => $services,
            'available_services' => Service::with('category')->get()->map(function($s) {
                return [
                    'id' => $s->id,
                    'name' => $s->name,
                    'category' => $s->category,
                ];
            }),
        ]);
    }

    public function store(StoreProviderServiceRequest $request, ProviderManagementService $serviceManager)
    {
        $user = Auth::user();
        $provider = $user->provider;

        if (!$provider) {
            return response()->json(['error' => 'Provider profile not found'], 404);
        }

        $providerService = $serviceManager->syncProviderService($provider, $request->validated());

        return response()->json([
            'message' => 'Service configuration synchronized successfully',
            'service' => $providerService->load('service.category'),
        ]);
    }

    public function update(Request $request, $id, ProviderManagementService $serviceManager)
    {
        $user = Auth::user();
        $provider = $user->provider;

        if (!$provider) {
            return response()->json(['error' => 'Provider profile not found'], 404);
        }

        $validated = $request->validate([
            'base_price' => 'required|numeric|min:0',
            'is_available' => 'boolean',
            'pricing_type' => 'nullable|string|in:fixed,hourly,quote',
            'min_hours' => 'nullable|integer|min:1',
            'travel_fee' => 'nullable|numeric|min:0',
            'equipment_included' => 'nullable|boolean',
            'extra_configs' => 'nullable|array',
        ]);

        $providerService = $serviceManager->updateProviderService($provider, $validated, $id);

        return response()->json([
            'message' => 'Service updated successfully',
            'service' => $providerService->load('service.category'),
        ]);
    }

    public function destroy($id)
    {
        $user = Auth::user();
        $provider = $user->provider;
        
        $providerService = $provider->providerServices()->findOrFail($id);
        $providerService->delete();

        return response()->json(['message' => 'Service removed from your profile']);
    }
}

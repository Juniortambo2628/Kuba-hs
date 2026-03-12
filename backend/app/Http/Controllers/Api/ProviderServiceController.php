<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\ProviderService;
use App\Models\Service;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

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

    public function store(Request $request)
    {
        $user = Auth::user();
        $provider = $user->provider;

        if (!$provider) {
            return response()->json(['error' => 'Provider profile not found'], 404);
        }

        $validated = $request->validate([
            'service_id' => 'required|exists:services,id',
            'base_price' => 'required|numeric|min:0',
            'is_available' => 'boolean',
            'pricing_type' => 'nullable|string|in:fixed,hourly,quote',
        ]);

        $providerService = $provider->providerServices()->updateOrCreate(
            ['id' => $request->id ?? null],
            [
                'service_id' => $validated['service_id'],
                'base_price' => $validated['base_price'],
                'pricing_type' => $validated['pricing_type'] ?? 'fixed',
                'is_available' => $validated['is_available'] ?? true,
            ]
        );

        return response()->json([
            'message' => 'Service configuration synchronized successfully',
            'service' => $providerService->load('service.category'),
        ]);
    }

    public function update(Request $request, $id)
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
        ]);

        $providerService = $provider->providerServices()->findOrFail($id);
        $providerService->update($validated);

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

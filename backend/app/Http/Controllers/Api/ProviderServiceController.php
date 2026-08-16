<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreProviderServiceRequest;
use App\Http\Resources\ProviderServiceResource;
use App\Http\Resources\ServiceResource;
use App\Models\Service;
use App\Services\ProviderManagementService;
use App\Traits\HasProviderAuthorization;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class ProviderServiceController extends Controller
{
    use HasProviderAuthorization;

    public function index() {
        $provider = $this->getProviderOrFail();

        $services = $provider->providerServices()
            ->with(['service.category'])
            ->orderByDesc('updated_at')
            ->get();

        $available = Service::with('category')
            ->where('is_active', true)
            ->orderBy('name')
            ->get();

        return response()->json([
            'services' => ProviderServiceResource::collection($services),
            'available_services' => ServiceResource::collection($available),
        ]);
    }

    public function store(StoreProviderServiceRequest $request, ProviderManagementService $serviceManager) {
        $provider = $this->getProviderOrFail();

        if ($provider->providerServices()->where('service_id', $request->service_id)->exists()) {
            return response()->json([
                'message' => 'You already offer this service. Edit the existing listing instead.',
            ], 422);
        }

        $providerService = $serviceManager->syncProviderService($provider, $request->validated());

        return response()->json([
            'message' => 'Service added to your profile',
            'service' => new ProviderServiceResource($providerService->load('service.category')),
        ], 201);
    }

    public function update(Request $request, string $id, ProviderManagementService $serviceManager) {
        $provider = $this->getProviderOrFail();

        $validated = $request->validate([
            'base_price' => 'required|numeric|min:0',
            'is_available' => 'sometimes|boolean',
            'pricing_type' => 'nullable|string|in:fixed,hourly,quote',
            'min_hours' => 'nullable|integer|min:1',
            'travel_fee' => 'nullable|numeric|min:0',
            'equipment_included' => 'nullable|boolean',
            'extra_configs' => 'nullable|array',
        ]);

        $providerService = $serviceManager->updateProviderService($provider, $validated, $id);

        return response()->json([
            'message' => 'Service updated successfully',
            'service' => new ProviderServiceResource($providerService->load('service.category')),
        ]);
    }

    public function destroy(string $id) {
        $provider = $this->getProviderOrFail();

        $providerService = $provider->providerServices()->findOrFail($id);
        $providerService->delete();

        return response()->json(['message' => 'Service removed from your profile']);
    }
}

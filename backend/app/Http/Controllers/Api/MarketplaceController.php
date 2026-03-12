<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

use App\Models\Provider;
use App\Models\ProviderService;
use App\Models\Service;
use App\Models\ServiceCategory;
use App\Models\TrustPartner;
use App\Http\Resources\ProviderResource;
use App\Http\Resources\ProviderServiceResource;
use App\Http\Resources\ServiceResource;
use App\Http\Resources\ServiceCategoryResource;

class MarketplaceController extends Controller
{
    /**
     * Get all service categories with their sub-services.
     */
    public function categories()
    {
        return ServiceCategoryResource::collection(
            ServiceCategory::with('services')->orderBy('name')->get()
        );
    }

    /**
     * Get featured services.
     */
    public function featured()
    {
        $services = ProviderService::where('is_available', true)
            ->whereHas('service', function($q) {
                $q->where('is_active', true);
            })
            ->with(['service.category', 'provider.user', 'provider.availability', 'media', 'service.media'])
            ->latest()
            ->take(10)
            ->get();

        return ProviderServiceResource::collection($services);
    }

    /**
     * Get similar providers for a given service.
     */
    public function similarProviders(ProviderService $providerService)
    {
        $similar = ProviderService::where('id', '!=', $providerService->id)
            ->where('service_id', $providerService->service_id)
            ->where('is_available', true)
            ->with(['provider.user', 'media', 'service.media'])
            ->take(5)
            ->get();

        return ProviderServiceResource::collection($similar);
    }

    /**
     * Get a specific service category with its sub-services.
     */
    public function showCategory(ServiceCategory $category)
    {
        return new ServiceCategoryResource($category->load('services'));
    }

    /**
     * Get trust partners.
     */
    public function trustPartners()
    {
        return response()->json(
            TrustPartner::where('is_active', true)->latest()->get()
        );
    }

    /**
     * Get a specific provider by ID.
     */
    public function show(Provider $provider)
    {
        return new ProviderResource(
            $provider->load(['user', 'providerServices.service', 'reviews.customer'])
        );
    }

    /**
     * Search for service providers based on criteria.
     */
    public function search(Request $request)
    {
        $searchTerm = $request->input('search');
        $categoryId = $request->input('category_id');
        $serviceId = $request->input('service_id');

        // Start with eloquent query for filters
        $query = Provider::query();

        if ($searchTerm) {
            // If searching by term, find IDs via Scout first
            $scoutIds = Provider::search($searchTerm)->keys();
            $query->whereIn('id', $scoutIds);
        }

        // Apply filters
        if ($categoryId) {
            $query->whereHas('providerServices.service', function($q) use ($categoryId) {
                $q->where('category_id', $categoryId);
            });
        }

        if ($serviceId) {
            $query->whereHas('providerServices', function($q) use ($serviceId) {
                $q->where('service_id', $serviceId);
            });
        }

        $providers = $query->with(['user', 'providerServices.service'])
            ->latest()
            ->paginate(12);

        return ProviderResource::collection($providers);
    }
}

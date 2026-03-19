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
     * Get all service providers.
     */
    public function providers()
    {
        $providers = Provider::with(['user', 'providerServices.service'])
            ->withCount('reviews')
            ->withAvg('reviews', 'rating')
            ->latest()
            ->paginate(12);

        return ProviderResource::collection($providers);
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
     * Get top rated providers.
     */
    public function topProviders()
    {
        $providers = Provider::with(['user', 'providerServices.service'])
            ->withCount('reviews')
            ->withAvg('reviews', 'rating')
            ->orderBy('reviews_avg_rating', 'desc')
            ->orderBy('reviews_count', 'desc')
            ->take(10)
            ->get();

        return ProviderResource::collection($providers);
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
            $provider->load(['user', 'providerServices.service', 'reviews.customer', 'availability', 'scheduleExceptions'])
        );
    }

    /**
     * Get a specific provider service by ID.
     */
    public function showService(ProviderService $providerService)
    {
        return new ProviderServiceResource(
            $providerService->load(['service.category', 'provider.user', 'provider.availability', 'media', 'service.media', 'provider.reviews.customer', 'provider.scheduleExceptions'])
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
        $minRating = $request->input('min_rating');
        $isVerified = $request->boolean('is_verified');
        $lat = $request->input('latitude');
        $lng = $request->input('longitude');
        $radius = $request->input('radius', 50); // Default 50km

        $query = Provider::select('providers.*')
            ->with(['user', 'providerServices.service'])
            ->withCount('reviews')
            ->withAvg('reviews', 'rating');

        $locationFilter = $request->input('location');

        if ($locationFilter) {
            $query->where('location_name', 'like', "%{$locationFilter}%");
        }

        if ($searchTerm) {
            $query->where(function($q) use ($searchTerm) {
                $q->where('business_name', 'like', "%{$searchTerm}%")
                  ->orWhere('bio', 'like', "%{$searchTerm}%")
                  ->orWhere('location_name', 'like', "%{$searchTerm}%");
            });
        }

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

        if ($minRating) {
            $query->whereHas('reviews', function($q) use ($minRating) {
                $q->select(\Illuminate\Support\Facades\DB::raw('avg(rating)'))
                  ->havingRaw('avg(rating) >= ?', [$minRating]);
            });
        }

        if ($isVerified) {
            $query->where('is_verified', true);
        }

        // Geospatial Radius Search (Haversine Formula)
        if ($lat && $lng) {
            $haversine = "(6371 * acos(cos(radians(?)) * cos(radians(latitude)) * cos(radians(longitude) - radians(?)) + sin(radians(?)) * sin(radians(latitude))))";
            $query->selectRaw("$haversine AS distance", [$lat, $lng, $lat])
                  ->whereRaw("$haversine <= ?", [$lat, $lng, $lat, $radius])
                  ->orderBy('distance');
        } else {
            $query->latest();
        }

        $providers = $query->paginate(12);

        return ProviderResource::collection($providers);
    }
}

<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

use App\Models\Provider;
use App\Models\ProviderService;
use App\Models\Service;
use App\Models\ServiceCategory;
use App\Models\TrustPartner;
use App\Models\FAQ;
use App\Models\Testimonial;
use App\Http\Resources\ProviderResource;
use App\Http\Resources\ProviderServiceResource;
use App\Http\Resources\ServiceResource;
use App\Http\Resources\ServiceCategoryResource;
use App\Http\Resources\FAQResource;
use App\Http\Resources\TestimonialResource;
use App\Services\ProviderSearchService;

class MarketplaceController extends Controller
{
    /**
     * Get all actively published FAQs ordered by priority.
     */
    public function faqs()
    {
        return FAQResource::collection(
            FAQ::where('is_active', true)->orderBy('order', 'asc')->get()
        );
    }

    /**
     * Get all actively published Testimonials ordered by priority.
     */
    public function testimonials()
    {
        return TestimonialResource::collection(
            Testimonial::where('is_active', true)->orderBy('order', 'asc')->get()
        );
    }

    /**
     * Get all service categories with their sub-services.
     */
    public function categories()
    {
        return ServiceCategoryResource::collection(
            ServiceCategory::with('services')->withCount('services')->orderBy('name')->get()
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
    public function search(Request $request, ProviderSearchService $searchService)
    {
        $providers = $searchService->search($request->all(), 12);

        return ProviderResource::collection($providers);
    }
}

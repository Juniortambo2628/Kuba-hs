<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;

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
            Cache::remember('api_faqs_all', 86400, function () {
                return FAQ::where('is_active', true)->orderBy('order', 'asc')->get();
            })
        );
    }

    /**
     * Get all actively published Testimonials ordered by priority.
     */
    public function testimonials()
    {
        return TestimonialResource::collection(
            Cache::remember('api_testimonials_all', 86400, function () {
                return Testimonial::where('is_active', true)->orderBy('order', 'asc')->get();
            })
        );
    }

    /**
     * Get all service categories with their sub-services.
     */
    public function categories()
    {
        return ServiceCategoryResource::collection(
            Cache::remember('api_categories_all', 86400, function () {
                return ServiceCategory::with(['services' => function($q) {
                    $q->withMin(['providerServices' => function($query) {
                        $query->where('is_available', true);
                    }], 'base_price');
                }])->withCount('services')->orderBy('name')->get();
            })
        );
    }

    /**
     * Get all service providers.
     */
    public function providers()
    {
        $providers = Cache::remember('api_providers_latest', 300, function () {
            return Provider::with(['user', 'providerServices.service'])
                ->withCount('reviews')
                ->withAvg('reviews', 'rating')
                ->latest()
                ->paginate(12);
        });

        return ProviderResource::collection($providers);
    }

    /**
     * Get featured services.
     */
    public function featured()
    {
        $services = Cache::remember('api_featured_services', 86400, function () {
            return ProviderService::where('is_available', true)
                ->whereHas('service', function($q) {
                    $q->where('is_active', true);
                })
                ->with(['service.category', 'provider.user', 'provider.availability', 'media', 'service.media'])
                ->latest()
                ->take(10)
                ->get();
        });

        return ProviderServiceResource::collection($services);
    }

    /**
     * Get top rated providers.
     */
    public function topProviders()
    {
        $providers = Cache::remember('api_top_providers', 86400, function () {
            return Provider::with(['user', 'providerServices.service'])
                ->withCount('reviews')
                ->withAvg('reviews', 'rating')
                ->orderBy('reviews_avg_rating', 'desc')
                ->orderBy('reviews_count', 'desc')
                ->take(10)
                ->get();
        });

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
    public function showCategory($identifier)
    {
        $category = ServiceCategory::with(['services' => function($q) {
            $q->withMin(['providerServices' => function($query) {
                $query->where('is_available', true);
            }], 'base_price');
        }])->find($identifier);

        if (!$category) {
            $category = ServiceCategory::with(['services' => function($q) {
                $q->withMin(['providerServices' => function($query) {
                    $query->where('is_available', true);
                }], 'base_price');
            }])->get()->first(function($cat) use ($identifier) {
                return \Illuminate\Support\Str::slug($cat->name) === $identifier;
            });
        }

        if (!$category) {
            abort(404);
        }

        return new ServiceCategoryResource($category);
    }

    /**
     * Get trust partners.
     */
    public function trustPartners()
    {
        return response()->json(
            Cache::remember('api_trust_partners', 86400, function () {
                return TrustPartner::where('is_active', true)->latest()->get();
            })
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
     * Get a general service information plus providers who offer it.
     */
    public function showGeneralService(Service $service)
    {
        $service->load(['category', 'media']);
        
        $providerServices = ProviderService::where('service_id', $service->id)
            ->where('is_available', true)
            ->with(['provider.user', 'media', 'service.media'])
            ->get();

        return response()->json([
            'service' => new ServiceResource($service),
            'provider_services' => ProviderServiceResource::collection($providerServices),
            'is_general' => true
        ]);
    }

    /**
     * Search for service providers based on criteria.
     */
    public function search(Request $request, ProviderSearchService $searchService)
    {
        $providers = $searchService->search($request->all(), 12);

        return ProviderResource::collection($providers);
    }

    /**
     * Validate a promo code for a given amount.
     */
    public function validatePromoCode(Request $request)
    {
        $request->validate([
            'code' => 'required|string',
            'amount' => 'required|numeric'
        ]);

        $promoCode = \App\Models\PromoCode::where('code', $request->code)
            ->where('is_active', true)
            ->first();

        if (!$promoCode) {
            return response()->json(['message' => 'Invalid promo code.'], 404);
        }

        if (!$promoCode->isValid($request->amount)) {
            return response()->json(['message' => 'Promo code is not applicable or has expired.'], 422);
        }

        return response()->json([
            'valid' => true,
            'discount_amount' => $promoCode->calculateDiscount($request->amount),
            'promo_code' => $promoCode
        ]);
    }
}

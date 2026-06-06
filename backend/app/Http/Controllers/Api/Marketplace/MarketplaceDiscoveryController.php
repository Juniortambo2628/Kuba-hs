<?php

namespace App\Http\Controllers\Api\Marketplace;

use App\Http\Controllers\Controller;
use App\Http\Resources\ProviderResource;
use App\Models\Provider;
use App\Models\PromoCode;
use App\Services\ProviderSearchService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;

class MarketplaceDiscoveryController extends Controller
{
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

    public function show(Provider $provider)
    {
        return new ProviderResource(
            $provider->load([
                'user',
                'providerServices.service.category',
                'reviews' => fn ($q) => $q->where('status', 'published')->latest(),
                'reviews.customer',
                'reviews.booking.service',
                'availability',
                'scheduleExceptions',
            ])
        );
    }

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

    public function search(Request $request, ProviderSearchService $searchService)
    {
        $perPage = min(max((int) $request->input('per_page', 12), 1), 24);
        $providers = $searchService->search($request->all(), $perPage);

        return ProviderResource::collection($providers);
    }

    public function validatePromoCode(Request $request)
    {
        $request->validate([
            'code' => 'required|string',
            'amount' => 'required|numeric',
        ]);

        $promoCode = PromoCode::where('code', $request->code)
            ->where('is_active', true)
            ->first();

        if (! $promoCode) {
            return response()->json(['message' => 'Invalid promo code.'], 404);
        }

        if (! $promoCode->isValid($request->amount)) {
            return response()->json(['message' => 'Promo code is not applicable or has expired.'], 422);
        }

        return response()->json([
            'valid' => true,
            'discount_amount' => $promoCode->calculateDiscount($request->amount),
            'promo_code' => $promoCode,
        ]);
    }
}

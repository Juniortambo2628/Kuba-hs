<?php

namespace App\Http\Controllers\Api\Marketplace;

use App\Http\Controllers\Controller;
use App\Http\Resources\ProviderResource;
use App\Models\Provider;
use App\Services\ProviderSearchService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;

class MarketplaceDiscoveryController extends Controller
{
    public function providers(): JsonResponse
    {
        $providers = Cache::remember('api_providers_latest', 300, function () {
            return Provider::with(['user', 'providerServices.service'])
                ->withCount('reviews')
                ->withAvg('reviews', 'rating')
                ->latest()
                ->paginate(12);
        });

        return ProviderResource::collection($providers)->response();
    }

    public function show(Provider $provider): JsonResponse
    {
        return (new ProviderResource(
            $provider->load([
                'user',
                'providerServices.service.category',
                'reviews' => fn ($q) => $q->where('status', 'published')->latest(),
                'reviews.customer',
                'reviews.booking.service',
                'availability',
                'scheduleExceptions',
            ])
        ))->response();
    }

    public function topProviders(): JsonResponse
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

        return ProviderResource::collection($providers)->response();
    }

    public function search(Request $request, ProviderSearchService $searchService): JsonResponse
    {
        $perPage = min(max((int) $request->input('per_page', 12), 1), 24);
        $providers = $searchService->search($request->all(), $perPage);

        return ProviderResource::collection($providers)->response();
    }

    public function validatePromoCode(Request $request): JsonResponse
    {
        $request->validate([
            'code' => 'required|string',
            'amount' => 'required|numeric',
        ]);

        return app(\App\Actions\ValidatePromoCode::class)(
            $request->code,
            $request->amount
        );
    }
}

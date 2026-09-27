<?php

namespace App\Http\Controllers\Api\Marketplace;

use App\Http\Controllers\Controller;
use App\Http\Resources\ProviderServiceResource;
use App\Http\Resources\ServiceCategoryResource;
use App\Http\Resources\ServiceResource;
use App\Models\ProviderService;
use App\Models\Service;
use App\Models\ServiceCategory;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Cache;

class MarketplaceCatalogController extends Controller
{
    public function categories() {
        return ServiceCategoryResource::collection(
            Cache::remember('api_categories_all', 86400, function () {
                return ServiceCategory::query()
                    ->whereNull('parent_category_id')
                    ->whereNotIn('name', ['Financial & Legal', 'Plumbing'])
                    ->with(['services' => function ($q) {
                        $q->where('is_active', true)
                            ->orderBy('name')
                            ->withMin(['providerServices' => function ($query) {
                                $query->where('is_available', true);
                            }], 'base_price')
                            ->withCount(['providerServices as provider_services_count' => function ($query) {
                                $query->where('is_available', true);
                            }]);
                    }])
                    ->withCount(['services' => function ($q) {
                        $q->where('is_active', true);
                    }])
                    ->orderBy('sort_order')
                    ->orderBy('name')
                    ->get()
                    ->filter(fn ($category) => $category->services_count > 0)
                    ->values();
            })
        )->response();
    }

    public function featured() {
        $services = Cache::remember('api_featured_services', 86400, function () {
            return ProviderService::where('is_available', true)
                ->whereHas('service', function ($q) {
                    $q->where('is_active', true);
                })
                ->with(['service.category', 'provider.user', 'provider.availability', 'media', 'service.media'])
                ->latest()
                ->take(10)
                ->get();
        });

        return ProviderServiceResource::collection($services)->response();
    }

    public function showService(ProviderService $providerService) {
        return (new ProviderServiceResource(
            $providerService->load(['service.category', 'provider.user', 'provider.availability', 'media', 'service.media', 'provider.reviews.customer', 'provider.scheduleExceptions'])
        ))->response();
    }

    public function showCategory($identifier) {
        $withServices = ['services' => function ($q) {
            $q->withMin(['providerServices' => function ($query) {
                $query->where('is_available', true);
            }], 'base_price')
                ->withCount(['providerServices as provider_services_count' => function ($query) {
                    $query->where('is_available', true);
                }]);
        }];

        $category = \Illuminate\Support\Str::isUuid($identifier)
            ? ServiceCategory::with($withServices)->find($identifier)
            : null;

        if (! $category) {
            $category = ServiceCategory::with($withServices)->where('slug', $identifier)->first();
        }

        if (! $category) {
            abort(404);
        }

        return (new ServiceCategoryResource($category))->response();
    }

    public function showGeneralService(Service $service) {
        $service->load(['category', 'media']);

        $providerServices = ProviderService::where('service_id', $service->id)
            ->where('is_available', true)
            ->with(['provider.user', 'media', 'service.media'])
            ->get();

        return response()->json([
            'service' => new ServiceResource($service),
            'provider_services' => ProviderServiceResource::collection($providerServices),
            'is_general' => true,
        ]);
    }
}

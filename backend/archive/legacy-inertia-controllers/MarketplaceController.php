<?php

namespace App\Http\Controllers;


use App\Models\ServiceCategory;
use App\Models\Provider;
use Illuminate\Http\Request;
use Inertia\Inertia;

class MarketplaceController extends Controller
{
    /**
     * Display the search page with providers.
     */
    public function search(Request $request)
    {
        $query = Provider::with(['user', 'providerServices.service.media', 'providerServices.service.category']);

        // Filter by category
        if ($request->has('category_id') && $request->category_id) {
            $query->whereHas('providerServices.service', function($q) use ($request) {
                $q->where('category_id', $request->category_id);
            });
        }

        // Filter by search term
        if ($request->has('search') && $request->search) {
            $searchTerm = $request->search;
            $query->where(function($q) use ($searchTerm) {
                $q->where('business_name', 'like', "%{$searchTerm}%")
                  ->orWhere('bio', 'like', "%{$searchTerm}%")
                  ->orWhereHas('user', function($q) use ($searchTerm) {
                      $q->where('first_name', 'like', "%{$searchTerm}%")
                        ->orWhere('last_name', 'like', "%{$searchTerm}%");
                  });
            });
        }

        // Get providers with pagination
        $providers = $query->paginate(12)->withQueryString();

        // Get all categories for the filter sidebar
        $categories = ServiceCategory::orderBy('sort_order')->get();

        return Inertia::render('Marketplace/Search', [
            'providers' => \App\Http\Resources\ProviderResource::collection($providers),
            'categories' => $categories,
            'filters' => $request->only(['search', 'category_id']),
        ]);
    }

    /**
     * Display the specified provider.
     */
    public function show($id)
    {
        $provider = Provider::with(['user', 'providerServices.service.media', 'providerServices.service.category', 'reviews.customer'])
            ->findOrFail($id);

        return Inertia::render('Marketplace/ProviderProfile', [
            'provider' => new \App\Http\Resources\ProviderResource($provider),
        ]);
    }
}

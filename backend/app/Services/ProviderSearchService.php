<?php

namespace App\Services;

use App\Models\Provider;
use Illuminate\Pagination\LengthAwarePaginator;

class ProviderSearchService
{
    /**
     * Search and filter providers based on geospatial radius, ratings, and keywords.
     *
     * @param array $filters Request payload parameters mapped to dictionary.
     * @param int $perPage Paginator limits.
     * @return LengthAwarePaginator
     */
    public function search(array $filters, int $perPage = 12): LengthAwarePaginator
    {
        $searchTerm = $filters['search'] ?? null;
        $categoryId = $filters['category_id'] ?? null;
        $serviceId = $filters['service_id'] ?? null;
        $minRating = $filters['min_rating'] ?? null;
        $isVerified = isset($filters['is_verified']) && filter_var($filters['is_verified'], FILTER_VALIDATE_BOOLEAN);
        $locationFilter = $filters['location'] ?? null;
        
        $lat = $filters['latitude'] ?? null;
        $lng = $filters['longitude'] ?? null;
        $radius = $filters['radius'] ?? 50; // Default 50km

        $query = Provider::select('providers.*')
            ->with(['user', 'providerServices.service'])
            ->withCount('reviews')
            ->withAvg('reviews', 'rating');

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

        return $query->paginate($perPage);
    }
}

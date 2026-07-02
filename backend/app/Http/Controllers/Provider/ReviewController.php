<?php

namespace App\Http\Controllers\Provider;

use App\Http\Controllers\Controller;
use App\Models\Review;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class ReviewController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $user = Auth::user();
        $provider = $user->provider;

        if (! $provider) {
            return response()->json(['error' => 'Provider profile not found'], 404);
        }

        $reviews = Review::where('provider_id', $provider->id)
            ->with(['customer', 'booking.service'])
            ->latest()
            ->paginate(20);

        // Single query for all rating stats instead of 5 separate queries
        $ratingDistribution = Review::where('provider_id', $provider->id)
            ->selectRaw('rating, count(*) as count')
            ->groupBy('rating')
            ->pluck('count', 'rating')
            ->toArray();

        $stats = [
            'avg_rating' => $provider->rating_avg ?? 0,
            'total_reviews' => $provider->review_count ?? 0,
            'rating_distribution' => [
                5 => $ratingDistribution[5] ?? 0,
                4 => $ratingDistribution[4] ?? 0,
                3 => $ratingDistribution[3] ?? 0,
                2 => $ratingDistribution[2] ?? 0,
                1 => $ratingDistribution[1] ?? 0,
            ],
            'reputation_score' => $provider->reputation_score ?? 100,
        ];

        return response()->json([
            'reviews' => $reviews,
            'stats' => $stats,
        ]);
    }
}

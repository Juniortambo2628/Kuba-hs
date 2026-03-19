<?php

namespace App\Http\Controllers\Provider;

use App\Http\Controllers\Controller;
use App\Models\Review;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class ReviewController extends Controller
{
    public function index(Request $request)
    {
        $user = Auth::user();
        $provider = $user->provider;

        if (!$provider) {
            return response()->json(['error' => 'Provider profile not found'], 404);
        }

        $reviews = Review::where('provider_id', $provider->id)
            ->with(['customer', 'booking.service'])
            ->latest()
            ->paginate(20);

        $stats = [
            'avg_rating' => Review::where('provider_id', $provider->id)->avg('rating') ?: 0,
            'total_reviews' => Review::where('provider_id', $provider->id)->count(),
            'rating_distribution' => [
                5 => Review::where('provider_id', $provider->id)->where('rating', 5)->count(),
                4 => Review::where('provider_id', $provider->id)->where('rating', 4)->count(),
                3 => Review::where('provider_id', $provider->id)->where('rating', 3)->count(),
                2 => Review::where('provider_id', $provider->id)->where('rating', 2)->count(),
                1 => Review::where('provider_id', $provider->id)->where('rating', 1)->count(),
            ],
            'reputation_score' => $provider->reputation_score ?? 100,
        ];

        return response()->json([
            'reviews' => $reviews,
            'stats' => $stats,
        ]);
    }
}

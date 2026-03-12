<?php

namespace App\Http\Controllers\Provider;

use App\Http\Controllers\Controller;
use App\Models\Booking;
use App\Http\Resources\BookingResource;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class DashboardController extends Controller
{
    public function index()
    {
        $user = Auth::user();
        $provider = $user->provider;
        
        if (!$provider && $user->role === 'provider') {
            $provider = \App\Models\Provider::create([
                'user_id' => $user->id,
                'business_name' => $user->name,
                'is_verified' => false,
                'experience_years' => 0,
                'service_radius' => 10,
            ]);
        }

        if (!$provider) {
            return response()->json(['error' => 'Provider profile not found'], 404);
        }

        $bookings = Booking::where('provider_id', $provider->id)
            ->with(['customer', 'service', 'address', 'review'])
            ->latest()
            ->take(10)
            ->get();

        $stats = [
            'total_earnings' => \App\Models\Payment::whereHas('booking', function($query) use ($provider) {
                $query->where('provider_id', $provider->id);
            })->where('status', 'completed')->sum('amount'),
            'active_bookings' => Booking::where('provider_id', $provider->id)
                ->whereIn('status', ['pending', 'confirmed'])
                ->count(),
            'completed_bookings' => $completed = Booking::where('provider_id', $provider->id)
                ->where('status', 'completed')
                ->count(),
            'avg_rating' => $avgRating = \App\Models\Review::where('provider_id', $provider->id)->avg('rating') ?: 0,
            'reputation_score' => $completed > 0 ? min(100, round(($avgRating / 5) * 100)) : 100,
        ];

        return response()->json([
            'stats' => $stats,
            'recent_bookings' => BookingResource::collection($bookings),
            'profile' => [
                'business_name' => $provider->business_name,
                'bio' => $provider->bio,
                'location_name' => $provider->location_name,
                'experience_years' => $provider->experience_years,
                'service_radius' => $provider->service_radius,
                'is_verified' => $provider->is_verified,
            ],
        ]);
    }
}

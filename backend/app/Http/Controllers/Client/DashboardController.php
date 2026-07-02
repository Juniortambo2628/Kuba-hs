<?php

namespace App\Http\Controllers\Client;

use App\Http\Controllers\Controller;
use App\Http\Resources\BookingResource;
use App\Http\Resources\LoyaltyPointResource;
use App\Models\Booking;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Auth;

class DashboardController extends Controller
{
    public function index(): JsonResponse
    {
        $user = Auth::user()->load('loyaltyPoints');

        $bookings = Booking::where('customer_id', $user->id)
            ->with(['provider.user', 'service', 'address', 'review'])
            ->latest()
            ->take(10)
            ->get();

        $stats = [
            'total_bookings' => Booking::where('customer_id', $user->id)->count(),
            'active_bookings' => Booking::where('customer_id', $user->id)
                ->whereIn('status', ['pending', 'confirmed', 'in_progress'])
                ->count(),
            'loyalty_points' => (int) $user->total_points,
            'membership_tier' => $user->membership_tier ? new \App\Http\Resources\LoyaltyTierResource($user->membership_tier) : null,
            'pending_reviews' => Booking::where('customer_id', $user->id)
                ->where('status', 'completed')
                ->whereDoesntHave('review')
                ->count(),
        ];

        $upcoming = $bookings->whereIn('status', ['pending', 'confirmed', 'in_progress'])->take(3)->values();

        return response()->json([
            'stats' => $stats,
            'upcoming_bookings' => BookingResource::collection($upcoming)->resolve(),
            'recent_bookings' => BookingResource::collection($bookings)->resolve(),
            'loyalty_history' => LoyaltyPointResource::collection(
                $user->loyaltyPoints()->latest()->take(5)->get()
            )->resolve(),
        ]);
    }
}

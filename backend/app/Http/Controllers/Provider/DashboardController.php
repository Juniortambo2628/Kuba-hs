<?php

namespace App\Http\Controllers\Provider;

use App\Http\Controllers\Controller;
use App\Http\Resources\BookingResource;
use App\Models\Booking;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Auth;

class DashboardController extends Controller
{
    public function index() {
        $user = Auth::user();
        $provider = $user->ensureProviderProfile();

        if (! $provider) {
            return response()->json(['error' => 'Provider profile not found'], 404);
        }

        $bookings = Booking::where('provider_id', $provider->id)
            ->with(['customer', 'service', 'address', 'review'])
            ->latest()
            ->take(10)
            ->get();

        $approvedDocs = $provider->verificationDocuments()
            ->where('status', 'approved')
            ->count();

        $stats = [
            'total_earnings' => (float) \App\Models\Payment::whereHas('booking', function ($query) use ($provider) {
                $query->where('provider_id', $provider->id);
            })->where('status', 'completed')->sum('amount'),
            'active_bookings' => Booking::where('provider_id', $provider->id)
                ->whereIn('status', ['pending', 'confirmed', 'in_progress'])
                ->count(),
            'completed_bookings' => $completed = Booking::where('provider_id', $provider->id)
                ->where('status', 'completed')
                ->count(),
            'avg_rating' => $avgRating = \App\Models\Review::where('provider_id', $provider->id)->avg('rating') ?: 0,
            'reputation_score' => $completed > 0 ? min(100, round(($avgRating / 5) * 100)) : 100,
        ];

        return response()->json([
            'stats' => $stats,
            'recent_bookings' => BookingResource::collection($bookings)->resolve(),
            'profile' => $provider->fresh()->toProfileEditorArray($user),
            'verification' => [
                'is_verified' => (bool) $provider->is_verified,
                'documents_submitted' => $provider->verificationDocuments()->count(),
                'documents_approved' => $approvedDocs,
                'needs_action' => ! $provider->is_verified && $approvedDocs < 2,
            ],
        ]);
    }
}

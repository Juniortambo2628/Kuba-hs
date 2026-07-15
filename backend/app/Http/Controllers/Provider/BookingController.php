<?php

namespace App\Http\Controllers\Provider;

use App\Http\Controllers\Controller;
use App\Http\Resources\BookingResource;
use App\Models\Booking;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class BookingController extends Controller
{
    public function index(Request $request) {
        $user = Auth::user();
        $provider = $user->ensureProviderProfile();

        if (! $provider) {
            return response()->json(['data' => []]);
        }

        $bookings = Booking::where('provider_id', $provider->id)
            ->with(['customer', 'service', 'address', 'review', 'payment'])
            ->search($request->search)
            ->byStatus($request->status)
            ->latest()
            ->paginate($request->per_page ?? 20);

        return BookingResource::collection($bookings);
    }

    public function show(Booking $booking) {
        $user = Auth::user();
        $provider = $user->ensureProviderProfile();

        if (! $provider || $booking->provider_id !== $provider->id) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        return response()->json([
            'booking' => new BookingResource(
                $booking->load(['customer', 'provider.user', 'service', 'address', 'review', 'payment', 'media', 'activityLogs.user'])
            ),
        ]);
    }
}

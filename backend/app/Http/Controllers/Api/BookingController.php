<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Booking;
use App\Events\BookingStatusUpdated;
use Illuminate\Http\Request;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;

class BookingController extends Controller
{
    use AuthorizesRequests;

    /**
     * Update the status of a booking.
     */
    public function updateStatus(Request $request, Booking $booking)
    {
        $this->authorize('update', $booking);

        $request->validate([
            'status' => 'required|in:confirmed,completed,cancelled',
        ]);

        $booking->update([
            'status' => $request->status,
        ]);

        if ($request->status === 'completed') {
            app(\App\Services\LoyaltyService::class)->awardPointsForBooking($booking);
        }

        if ($request->status === 'cancelled') {
            app(\App\Services\LoyaltyService::class)->revertPointsForBooking($booking);
        }

        BookingStatusUpdated::dispatch($booking);

        return response()->json([
            'message' => 'Booking status updated successfully.',
            'booking' => $booking->fresh(['customer', 'provider', 'service']),
        ]);
    }

    /**
     * Display the specified booking.
     */
    public function show(Booking $booking)
    {
        $this->authorize('view', $booking);

        return response()->json([
            'booking' => $booking->load(['customer', 'provider.user', 'service', 'address', 'review', 'payment', 'media']),
        ]);
    }
}

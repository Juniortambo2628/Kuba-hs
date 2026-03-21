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
            'cancellation_reason' => 'required_if:status,cancelled|string|nullable',
        ]);

        $booking->update([
            'status' => $request->status,
            'cancellation_reason' => $request->cancellation_reason,
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
     * Reschedule a booking.
     */
    public function reschedule(Request $request, Booking $booking)
    {
        $this->authorize('update', $booking);

        $request->validate([
            'scheduled_date' => 'required|date|after:now',
        ]);

        $booking->update([
            'scheduled_date' => $request->scheduled_date,
            'rescheduled_at' => now(),
            'status' => 'pending', // Revert to pending for re-confirmation if needed
        ]);

        BookingStatusUpdated::dispatch($booking);

        return response()->json([
            'message' => 'Booking rescheduled successfully.',
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

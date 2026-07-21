<?php

namespace App\Http\Controllers\Api;

use App\Enums\BookingStatus;
use App\Events\BookingStatusUpdated;
use App\Http\Requests\RescheduleBookingRequest;
use App\Http\Requests\UpdateBookingStatusRequest;
use App\Http\Controllers\Controller;
use App\Models\Booking;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class BookingController extends Controller
{
    use AuthorizesRequests;

    /**
     * Update the status of a booking.
     */
    public function updateStatus(UpdateBookingStatusRequest $request, Booking $booking) {
        $this->authorize('update', $booking);

        $validated = $request->validated();

        $booking = app(\App\Services\BookingService::class)->updateBookingStatus(
            $booking,
            $request->user(),
            $validated['status']
        );

        if ($validated['status'] === BookingStatus::Completed->value || $validated['status'] === BookingStatus::Completed) {
            app(\App\Services\LoyaltyService::class)->awardPointsForBooking($booking);
        }

        if ($validated['status'] === BookingStatus::Cancelled->value || $validated['status'] === BookingStatus::Cancelled) {
            app(\App\Services\LoyaltyService::class)->revertPointsForBooking($booking);
            if (!empty($validated['cancellation_reason'])) {
                $booking->update(['cancellation_reason' => $validated['cancellation_reason']]);
            }
        }

        return response()->json([
            'message' => 'Booking status updated successfully.',
            'booking' => $booking->fresh(['customer', 'provider.user', 'service', 'address']),
        ]);
    }

    /**
     * Reschedule a booking.
     */
    public function reschedule(RescheduleBookingRequest $request, Booking $booking) {
        $this->authorize('update', $booking);

        $validated = $request->validated();

        $previousDate = $booking->scheduled_date?->toIso8601String();

        $booking->update([
            'scheduled_date' => $validated['scheduled_date'],
            'rescheduled_at' => now(),
            'status' => BookingStatus::Pending, // Revert to pending for re-confirmation if needed
        ]);

        app(\App\Services\BookingActivityLogService::class)->log(
            $booking,
            'rescheduled',
            $request->user(),
            'Booking rescheduled',
            [
                'from' => $previousDate,
                'to' => $booking->scheduled_date?->toIso8601String(),
            ]
        );

        BookingStatusUpdated::dispatch($booking);

        return response()->json([
            'message' => 'Booking rescheduled successfully.',
            'booking' => $booking->fresh(['customer', 'provider', 'service']),
        ]);
    }

    /**
     * Display the specified booking.
     */
    public function show(Booking $booking) {
        $this->authorize('view', $booking);

        return response()->json([
            'booking' => $booking->load(['customer', 'provider.user', 'service', 'address', 'review', 'payment', 'media']),
        ]);
    }
}

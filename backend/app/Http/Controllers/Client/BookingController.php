<?php

namespace App\Http\Controllers\Client;

use App\Enums\BookingStatus;
use App\Http\Controllers\Controller;
use App\Http\Requests\StoreBookingRequest;
use App\Http\Resources\BookingResource;
use App\Models\Booking;
use App\Services\BookingService;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class BookingController extends Controller
{
    use AuthorizesRequests;

    public function index(Request $request) {
        /** @var \App\Models\User $user */
        $user = Auth::user();

        $bookings = Booking::where('customer_id', $user->id)
            ->with(['provider.user', 'service', 'address', 'review', 'payment'])
            ->search($request->search)
            ->byStatus($request->status)
            ->latest()
            ->paginate($request->per_page ?? 10);

        return BookingResource::collection($bookings);
    }

    public function show(Booking $booking) {
        $this->authorize('view', $booking);

        return response()->json([
            'booking' => new BookingResource(
                $booking->load(['provider.user', 'service', 'address', 'review', 'payment', 'media'])
            ),
        ]);
    }

    public function store(StoreBookingRequest $request, BookingService $bookingService) {
        $user = Auth::user();

        $booking = $bookingService->createBooking($user, $request->validated(), [
            'images' => $request->hasFile('images') ? $request->file('images') : null,
        ]);

        return response()->json([
            'message' => 'Booking request sent successfully!',
            'booking' => new BookingResource($booking),
        ], 201);
    }

    public function cancel(Booking $booking, Request $request, BookingService $bookingService) {
        $user = Auth::user();

        $this->authorize('cancel', $booking);

        if (! in_array($booking->status, [BookingStatus::Pending, BookingStatus::Confirmed])) {
            return response()->json([
                'message' => 'Only pending or confirmed bookings can be cancelled.',
            ], 422);
        }

        $bookingService->updateBookingStatus($booking, $user, 'cancelled', $request->input('cancellation_reason'));

        return response()->json([
            'message' => 'Booking cancelled successfully.',
            'booking' => new BookingResource($booking->fresh(['provider.user', 'service'])),
        ]);
    }
}

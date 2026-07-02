<?php

namespace App\Http\Controllers\Admin;

use App\Enums\BookingStatus;
use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\StoreAdminBookingRequest;
use App\Models\Booking;
use App\Models\User;
use App\Services\BookingService;
use App\Support\ApiResponse;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class BookingController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $bookings = Booking::with(['customer', 'provider.user', 'service'])
            ->search($request->search)
            ->byStatus($request->status)
            ->latest()
            ->paginate(15)
            ->withQueryString();

        return \App\Http\Resources\BookingResource::collection($bookings);
    }

    public function show(Booking $booking): JsonResponse
    {
        return new \App\Http\Resources\BookingResource(
            $booking->load(['customer', 'provider.user', 'service', 'address', 'review', 'payment'])
        );
    }

    public function store(StoreAdminBookingRequest $request, BookingService $bookingService): JsonResponse
    {
        $customer = User::findOrFail($request->validated('customer_id'));
        $data = $request->validated();
        $status = $data['status'] ?? 'pending';
        unset($data['status']);

        $booking = $bookingService->createAdminBooking($customer, $data, $status);

        return ApiResponse::success(
            new \App\Http\Resources\BookingResource(
                $booking->load(['customer', 'provider.user', 'service', 'address'])
            ),
            'Booking created successfully.',
            201
        );
    }

    public function updateStatus(Request $request, Booking $booking): JsonResponse
    {
        $validated = $request->validate([
            'status' => 'required|string|in:'.implode(',', array_column(BookingStatus::cases(), 'value')),
            'cancellation_reason' => 'nullable|string',
        ]);

        $previousStatus = $booking->status;
        $booking->update($validated);

        if ($previousStatus !== $validated['status']) {
            app(\App\Services\BookingActivityLogService::class)->logStatusChange(
                $booking,
                $request->user(),
                $previousStatus,
                $validated['status']
            );
        }

        return response()->json([
            'message' => 'Booking status updated.',
            'booking' => new \App\Http\Resources\BookingResource($booking->fresh()->load(['customer', 'provider.user', 'service'])),
        ]);
    }

    public function destroy(Booking $booking): JsonResponse
    {
        app(\App\Services\BookingActivityLogService::class)->log(
            $booking,
            'deleted',
            request()->user(),
            'Booking deleted by administrator',
            ['booking_number' => $booking->booking_number]
        );

        $booking->delete();

        return response()->json(['message' => 'Booking record purged.']);
    }
}

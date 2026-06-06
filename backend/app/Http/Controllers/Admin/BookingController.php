<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\StoreAdminBookingRequest;
use App\Models\Booking;
use App\Models\User;
use App\Services\BookingService;
use App\Support\ApiResponse;
use Illuminate\Http\Request;

class BookingController extends Controller
{
    public function index(Request $request)
    {
        $query = Booking::with(['customer', 'provider.user', 'service']);

        if ($request->filled('search')) {
            $search = $request->search;
            $query->where(function(\Illuminate\Database\Eloquent\Builder $q) use ($search) {
                $q->where('booking_number', 'like', "%{$search}%")
                  ->orWhereHas('customer', function($sq) use ($search) {
                      $sq->where('first_name', 'like', "%{$search}%")
                          ->orWhere('last_name', 'like', "%{$search}%");
                  });
            });
        }

        if ($request->filled('status')) {
            $query->where('status', $request->status);
        }

        return \App\Http\Resources\BookingResource::collection(
            $query->latest()->paginate(15)->withQueryString()
        );
    }

    public function show(Booking $booking)
    {
        return new \App\Http\Resources\BookingResource(
            $booking->load(['customer', 'provider.user', 'service', 'address', 'review', 'payment'])
        );
    }

    public function store(StoreAdminBookingRequest $request, BookingService $bookingService)
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

    public function updateStatus(Request $request, Booking $booking)
    {
        $validated = $request->validate([
            'status' => 'required|string|in:pending,confirmed,in_progress,completed,cancelled',
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

    public function destroy(Booking $booking)
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


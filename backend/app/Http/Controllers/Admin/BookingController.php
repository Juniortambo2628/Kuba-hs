<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Booking;
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

    public function updateStatus(Request $request, Booking $booking)
    {
        $validated = $request->validate([
            'status' => 'required|string|in:pending,confirmed,in_progress,completed,cancelled',
            'cancellation_reason' => 'nullable|string',
        ]);

        $booking->update($validated);

        return response()->json([
            'message' => 'Booking status updated.',
            'booking' => new \App\Http\Resources\BookingResource($booking->fresh()->load(['customer', 'provider.user', 'service'])),
        ]);
    }

    public function destroy(Booking $booking)
    {
        $booking->delete();
        return response()->json(['message' => 'Booking record purged.']);
    }
}


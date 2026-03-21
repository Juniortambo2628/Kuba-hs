<?php

namespace App\Http\Controllers\Client;

use App\Http\Controllers\Controller;
use App\Models\Booking;
use App\Http\Resources\BookingResource;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use App\Http\Requests\StoreBookingRequest;
use App\Services\BookingService;

class BookingController extends Controller
{
    public function index(Request $request)
    {
        /** @var \App\Models\User $user */
        $user = Auth::user();
        
        $query = Booking::where('customer_id', $user->id)
            ->with(['provider.user', 'service', 'address', 'review', 'payment']);

        if ($request->search) {
            $query->where(function ($q) use ($request) {
                $q->where('booking_number', 'like', "%{$request->search}%")
                  ->orWhereHas('service', function ($sq) use ($request) {
                      $sq->where('name', 'like', "%{$request->search}%");
                  });
            });
        }

        if ($request->status) {
            $query->where('status', $request->status);
        }

        $bookings = $query->latest()->paginate($request->per_page ?? 10);

        return BookingResource::collection($bookings);
    }

    public function store(StoreBookingRequest $request, BookingService $bookingService)
    {
        $user = Auth::user();
        
        $images = $request->hasFile('images') ? $request->file('images') : null;
        
        $booking = $bookingService->createBooking($user, $request->validated(), $images);

        return response()->json([
            'message' => 'Booking request sent successfully!',
            'booking' => new BookingResource($booking)
        ], 201);
    }
}

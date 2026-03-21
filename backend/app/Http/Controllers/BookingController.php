<?php

namespace App\Http\Controllers;

use App\Models\Booking;
use App\Models\ProviderService;
use App\Models\Address;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Illuminate\Support\Str;

use App\Models\User;
use App\Models\ServiceCategory;
use App\Models\Service;
use Inertia\Response;
use App\Http\Requests\StoreBookingRequest;
use App\Http\Requests\UpdateBookingStatusRequest;
use App\Services\BookingService;

class BookingController extends Controller
{
    /**
     * Display a listing of the user's bookings.
     */
    public function index(Request $request): Response
    {
        /** @var \App\Models\User $user */
        $user = Auth::user();
        
        if ($user->role === 'provider') {
            $bookings = Booking::where('provider_id', $user->provider->id)
                ->with(['customer', 'service', 'address', 'review', 'payment'])
                ->latest()
                ->get();
            
            return Inertia::render('Provider/Bookings', [
                'bookings' => $bookings,
            ]);
        }

        $bookings = Booking::where('customer_id', $user->id)
            ->with(['provider.user', 'service', 'address', 'review', 'payment'])
            ->latest()
            ->get();

        return Inertia::render('Client/Bookings', [
            'bookings' => $bookings,
        ]);
    }

    /**
     * Store a newly created booking in storage.
     */
    public function store(StoreBookingRequest $request, BookingService $bookingService)
    {
        $validated = $request->validated();
        /** @var \App\Models\User $user */
        $user = Auth::user();
        
        $images = $request->hasFile('images') ? $request->file('images') : null;

        $bookingService->createBooking($user, $validated, $images);

        return redirect()->route('dashboard')->with('success', 'Booking request sent successfully!');
    }

    /**
     * Update the specified booking status.
     */
    public function updateStatus(UpdateBookingStatusRequest $request, Booking $booking, BookingService $bookingService)
    {
        $validated = $request->validated();
        $user = Auth::user();

        $bookingService->updateBookingStatus($booking, $user, $validated['status']);

        return back()->with('success', 'Booking status updated successfully.');
    }
}

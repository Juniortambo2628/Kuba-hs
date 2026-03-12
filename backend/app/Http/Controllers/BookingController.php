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

class BookingController extends Controller
{
    /**
     * Display a listing of the user's bookings.
     */
    public function index(Request $request): Response
    {
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
    public function store(Request $request)
    {
        $validated = $request->validate([
            'provider_id' => 'required|exists:providers,id',
            'service_id' => 'required|exists:services,id',
            'scheduled_date' => 'required|date|after:now',
            'description' => 'nullable|string',
            'service_type' => 'required|in:residential,commercial,large_scale',
            'quantity' => 'required|integer|min:1',
            'images' => 'nullable|array',
            'images.*' => 'image|max:5120', // 5MB limit
            'address_id' => 'nullable|exists:addresses,id',
            // If new address is provided
            'new_address' => 'required_without:address_id|array',
            'new_address.street_address' => 'required_with:new_address',
            'new_address.city' => 'required_with:new_address',
            'new_address.state' => 'required_with:new_address',
            'new_address.postal_code' => 'required_with:new_address',
        ]);

        $user = Auth::user();

        // Handle Address
        $addressId = $validated['address_id'] ?? null;
        if (!$addressId && isset($validated['new_address'])) {
            $address = Address::create([
                'user_id' => $user->id,
                'address_type' => $validated['service_type'] === 'residential' ? 'residential' : 'business',
                'street_address' => $validated['new_address']['street_address'],
                'city' => $validated['new_address']['city'],
                'state' => $validated['new_address']['state'],
                'postal_code' => $validated['new_address']['postal_code'],
                'country' => 'USA', // default for now
                'is_default' => true,
            ]);
            $addressId = $address->id;
        }

        // Get Service Price
        $providerService = ProviderService::where('provider_id', $validated['provider_id'])
            ->where('service_id', $validated['service_id'])
            ->firstOrFail();

        $booking = Booking::create([
            'customer_id' => $user->id,
            'provider_id' => $validated['provider_id'],
            'service_id' => $validated['service_id'],
            'booking_number' => 'BK-' . strtoupper(Str::random(8)),
            'scheduled_date' => $validated['scheduled_date'],
            'status' => 'pending',
            'payment_status' => 'pending',
            'address_id' => $addressId,
            'description' => $validated['description'] ?? null,
            'service_type' => $validated['service_type'],
            'quantity' => $validated['quantity'],
            'estimated_price' => $providerService->base_price * $validated['quantity'],
        ]);

        // Handle Images
        if ($request->hasFile('images')) {
            foreach ($request->file('images') as $image) {
                $booking->addMedia($image)->toMediaCollection('issue_images');
            }
        }

        // Notify Provider
        $booking->provider->user->notify(new \App\Notifications\BookingStatusUpdated($booking));

        // Notify Customer (Confirmation)
        $user->notify(new \App\Notifications\BookingStatusUpdated($booking));

        return redirect()->route('dashboard')->with('success', 'Booking request sent successfully!');
    }

    /**
     * Update the specified booking status.
     */
    public function updateStatus(Request $request, Booking $booking)
    {
        $validated = $request->validate([
            'status' => 'required|in:confirmed,cancelled,completed',
        ]);

        $user = Auth::user();

        // Authorization check
        if ($user->id !== $booking->provider_id && $user->id !== $booking->customer_id) {
            abort(403, 'Unauthorized action.');
        }

        // Provider can confirm, cancel, or complete
        if ($user->id === $booking->provider_id) {
            // Add specific logic if needed (e.g., cannot confirm if already cancelled)
        }

        // Customer can only cancel
        if ($user->id === $booking->customer_id && $validated['status'] !== 'cancelled') {
            abort(403, 'Customers can only cancel bookings.');
        }

        $booking->update([
            'status' => $validated['status'],
        ]);

        // Notify the OTHER party
        if ($user->id === $booking->provider_id) {
            $booking->customer->notify(new \App\Notifications\BookingStatusUpdated($booking));
        } elseif ($user->id === $booking->customer_id) {
            $booking->provider->user->notify(new \App\Notifications\BookingStatusUpdated($booking));
        }

        return back()->with('success', 'Booking status updated successfully.');
    }
}

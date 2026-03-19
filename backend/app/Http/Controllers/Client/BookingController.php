<?php

namespace App\Http\Controllers\Client;

use App\Http\Controllers\Controller;
use App\Models\Booking;
use App\Http\Resources\BookingResource;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Str;
use App\Models\ProviderService;
use App\Models\Address;

class BookingController extends Controller
{
    public function index(Request $request)
    {
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

    public function store(Request $request)
    {
        $validated = $request->validate([
            'provider_id' => 'required|exists:providers,id',
            'service_id' => 'required|exists:services,id',
            'scheduled_date' => 'required|date',
            'scheduled_time' => 'required',
            'description' => 'nullable|string',
            'service_type' => 'required|string',
            'quantity' => 'required|integer|min:1',
            'quantity_label' => 'nullable|string',
            'address_id' => 'required|exists:addresses,id',
            'images' => 'nullable|array',
            'images.*' => 'image|max:5120',
        ]);

        $user = Auth::user();

        // Get Service Price
        $providerService = ProviderService::where('provider_id', $validated['provider_id'])
            ->where('service_id', $validated['service_id'])
            ->firstOrFail();

        // Combine date and time
        $scheduledDate = $validated['scheduled_date'] . ' ' . $validated['scheduled_time'] . ':00';

        // Calculate Price based on advanced rules
        $price = 0;
        if ($providerService->pricing_type === 'hourly') {
            $effectiveHours = max($validated['quantity'], (int) ($providerService->min_hours ?? 1));
            $price = ($providerService->base_price * $effectiveHours);
        } else {
            $price = ($providerService->base_price * $validated['quantity']);
        }

        // Add Travel Fee
        $price += (float) ($providerService->travel_fee ?? 0);

        $booking = Booking::create([
            'customer_id' => $user->id,
            'provider_id' => $validated['provider_id'],
            'service_id' => $validated['service_id'],
            'booking_number' => 'BK-' . strtoupper(Str::random(8)),
            'scheduled_date' => $scheduledDate,
            'status' => 'pending',
            'payment_status' => 'pending',
            'address_id' => $validated['address_id'],
            'description' => $validated['description'] ?? null,
            'service_type' => $validated['service_type'],
            'quantity' => $validated['quantity'],
            'quantity_label' => $request->quantity_label,
            'estimated_price' => $price,
        ]);

        // Handle Images
        if ($request->hasFile('images')) {
            foreach ($request->file('images') as $image) {
                // Ensure Booking model implements HasMedia
                $booking->addMedia($image)->toMediaCollection('issue_images');
            }
        }

        return response()->json([
            'message' => 'Booking request sent successfully!',
            'booking' => new BookingResource($booking)
        ], 201);
    }
}

<?php

namespace App\Http\Controllers\Provider;

use App\Http\Controllers\Controller;
use App\Http\Resources\BookingResource;
use App\Models\Booking;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class BookingController extends Controller
{
    public function index(Request $request)
    {
        $user = Auth::user();
        $provider = $user->ensureProviderProfile();

        if (!$provider) {
            return response()->json(['data' => []]);
        }

        $query = Booking::where('provider_id', $provider->id)
            ->with(['customer', 'service', 'address', 'review', 'payment']);

        if ($request->search) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('booking_number', 'like', "%{$search}%")
                    ->orWhereHas('service', fn ($sq) => $sq->where('name', 'like', "%{$search}%"))
                    ->orWhereHas('customer', function ($cq) use ($search) {
                        $cq->where('first_name', 'like', "%{$search}%")
                            ->orWhere('last_name', 'like', "%{$search}%")
                            ->orWhere('email', 'like', "%{$search}%");
                    });
            });
        }

        if ($request->status) {
            $query->where('status', $request->status);
        }

        $bookings = $query->latest()->paginate($request->per_page ?? 20);

        return BookingResource::collection($bookings);
    }
}

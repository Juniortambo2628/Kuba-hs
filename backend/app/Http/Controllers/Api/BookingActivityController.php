<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\BookingActivityLogResource;
use App\Models\Booking;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;

class BookingActivityController extends Controller
{
    use AuthorizesRequests;

    public function index(Booking $booking)
    {
        $this->authorize('view', $booking);

        $logs = $booking->activityLogs()
            ->with('user:id,first_name,last_name,email,role')
            ->latest()
            ->get();

        return response()->json([
            'data' => BookingActivityLogResource::collection($logs),
        ]);
    }
}

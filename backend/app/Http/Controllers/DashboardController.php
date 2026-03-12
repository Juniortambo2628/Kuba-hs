<?php

namespace App\Http\Controllers;

use App\Models\Booking;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class DashboardController extends Controller
{
    public function index()
    {
        $user = Auth::user();

        // Redirect providers without a profile to the setup page
        if ($user->role === 'provider' && !$user->provider) {
            return redirect()->route('provider.setup');
        }

        if ($user->role === 'provider') {
            $bookings = Booking::where('provider_id', $user->provider->id)
                ->with(['customer', 'service', 'address', 'review'])
                ->latest()
                ->get();
        } else {
            $bookings = Booking::where('customer_id', $user->id)
                ->with(['provider.user', 'service', 'address', 'review'])
                ->latest()
                ->get();
        }

        return Inertia::render('Dashboard', [
            'bookings' => $bookings,
            'userRole' => $user->role,
            'hasProvider' => $user->role === 'provider' && $user->provider !== null,
        ]);
    }
}

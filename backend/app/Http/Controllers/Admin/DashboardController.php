<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Booking;
use App\Models\Payment;
use App\Models\Provider;
use App\Models\User;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class DashboardController extends Controller
{
    public function index()
    {
        $userCount = User::count();
        $providerCount = Provider::count();
        $bookingCount = Booking::count();
        $completedBookings = Booking::where('status', 'completed')->count();
        $revenue = Payment::where('status', 'completed')->sum('platform_fee');

        $recentBookings = Booking::with(['customer:id,first_name,last_name', 'provider.user:id,first_name,last_name', 'service:id,name'])
            ->latest()
            ->limit(10)
            ->get();

        return Inertia::render('Admin/Dashboard', [
            'stats' => [
                'users' => $userCount,
                'providers' => $providerCount,
                'bookings' => $bookingCount,
                'completed_bookings' => $completedBookings,
                'revenue' => round($revenue, 2),
            ],
            'recentBookings' => $recentBookings,
        ]);
    }
}

<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Booking;
use App\Models\ContactMessage;
use App\Models\CustomQuote;
use App\Models\Payment;
use App\Models\Provider;
use App\Models\Review;
use App\Models\User;
use App\Models\VerificationDocument;
use Illuminate\Http\JsonResponse;

class DashboardController extends Controller
{
    public function index() {
        $userCount = User::count();
        $providerCount = Provider::count();
        $bookingCount = Booking::count();
        $completedBookings = Booking::where('status', 'completed')->count();
        $revenue = Payment::where('status', 'completed')->sum('platform_fee');

        $recentBookings = Booking::with(['customer:id,first_name,last_name', 'provider.user:id,first_name,last_name', 'service:id,name'])
            ->latest()
            ->limit(10)
            ->get();

        return response()->json([
            'stats' => [
                'users' => $userCount,
                'providers' => $providerCount,
                'bookings' => $bookingCount,
                'completed_bookings' => $completedBookings,
                'revenue' => round($revenue, 2),
            ],
            'pending_bookings' => Booking::where('status', 'pending')->count(),
            'pending_payments' => Payment::where('status', 'pending')->count(),
            'pending_verification' => VerificationDocument::where('status', 'pending')->count(),
            'pending_quotes' => CustomQuote::where('status', 'pending')->count(),
            'recent_bookings' => $recentBookings,
        ]);
    }

    public function messagesSummary() {
        $contactCount = ContactMessage::where('status', 'new')->count();
        $feedbackCount = Review::where('status', 'hidden')->count();
        $quoteCount = CustomQuote::where('status', 'pending')->count();

        $recentSignals = collect([
            ...ContactMessage::where('status', 'new')->latest()->limit(3)->get()->map(fn ($m) => ['type' => 'contact', 'data' => $m]),
            ...Review::where('status', 'hidden')->latest()->limit(3)->get()->map(fn ($f) => ['type' => 'feedback', 'data' => $f]),
            ...CustomQuote::where('status', 'pending')->latest()->limit(3)->get()->map(fn ($q) => ['type' => 'quote', 'data' => $q]),
        ])->sortByDesc('data.created_at')->values()->all();

        return response()->json([
            'counts' => [
                'contacts' => $contactCount,
                'feedback' => $feedbackCount,
                'quotes' => $quoteCount,
                'total' => $contactCount + $feedbackCount + $quoteCount,
            ],
            'recent' => $recentSignals,
        ]);
    }
}

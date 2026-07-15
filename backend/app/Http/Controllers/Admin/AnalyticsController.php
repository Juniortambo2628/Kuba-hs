<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\JsonResponse;

class AnalyticsController extends Controller
{
    public function index() {
        $now = now();
        $last30Days = $now->copy()->subDays(30);
        $prev30Days = $now->copy()->subDays(60);

        // Growth Trends (Daily)
        $userTrends = \App\Models\User::where('created_at', '>=', $last30Days)
            ->selectRaw('DATE(created_at) as date, count(*) as count')
            ->groupBy('date')
            ->orderBy('date')
            ->get();

        $bookingTrends = \App\Models\Booking::where('created_at', '>=', $last30Days)
            ->selectRaw('DATE(created_at) as date, count(*) as count')
            ->groupBy('date')
            ->orderBy('date')
            ->get();

        $revenueTrends = \App\Models\Payment::where('status', 'completed')
            ->where('created_at', '>=', $last30Days)
            ->selectRaw('DATE(created_at) as date, sum(platform_fee) as count')
            ->groupBy('date')
            ->orderBy('date')
            ->get();

        // MoM Calculations
        $thisMonthUsers = \App\Models\User::where('created_at', '>=', $last30Days)->count();
        $lastMonthUsers = \App\Models\User::where('created_at', '>=', $prev30Days)->where('created_at', '<', $last30Days)->count();
        $userGrowth = $lastMonthUsers > 0 ? round((($thisMonthUsers - $lastMonthUsers) / $lastMonthUsers) * 100) : 100;

        $thisMonthBookings = \App\Models\Booking::where('created_at', '>=', $last30Days)->count();
        $lastMonthBookings = \App\Models\Booking::where('created_at', '>=', $prev30Days)->where('created_at', '<', $last30Days)->count();
        $bookingGrowth = $lastMonthBookings > 0 ? round((($thisMonthBookings - $lastMonthBookings) / $lastMonthBookings) * 100) : 100;

        $thisMonthRevenue = \App\Models\Payment::where('status', 'completed')->where('created_at', '>=', $last30Days)->sum('platform_fee');
        $lastMonthRevenue = \App\Models\Payment::where('status', 'completed')->where('created_at', '>=', $prev30Days)->where('created_at', '<', $last30Days)->sum('platform_fee');
        $revenueGrowth = $lastMonthRevenue > 0 ? round((($thisMonthRevenue - $lastMonthRevenue) / $lastMonthRevenue) * 100) : 100;

        // Distributions
        $userDistribution = [
            'customers' => \App\Models\User::where('role', 'customer')->count(),
            'providers' => \App\Models\User::where('role', 'provider')->count(),
            'admins' => \App\Models\User::where('role', 'admin')->count(),
        ];

        $serviceDistribution = \App\Models\Service::withCount('providerServices')
            ->orderByDesc('provider_services_count')
            ->limit(5)
            ->get();

        return response()->json([
            'trends' => [
                'users' => $userTrends,
                'bookings' => $bookingTrends,
                'revenue' => $revenueTrends,
            ],
            'growth' => [
                'users' => $userGrowth,
                'bookings' => $bookingGrowth,
                'revenue' => $revenueGrowth,
            ],
            'distribution' => [
                'users' => $userDistribution,
                'services' => $serviceDistribution,
            ],
            'summary' => [
                'total_users' => \App\Models\User::count(),
                'total_bookings' => \App\Models\Booking::count(),
                'platform_revenue' => \App\Models\Payment::where('status', 'completed')->sum('platform_fee'),
                'avg_rating' => \App\Models\Review::avg('rating') ?: 0,
            ],
        ]);
    }
}

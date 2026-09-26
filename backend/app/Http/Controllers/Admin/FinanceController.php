<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Payment;
use Illuminate\Support\Facades\DB;

class FinanceController extends Controller
{
    /**
     * Get financial overview and payout statistics.
     */
    public function index() {
        $stats = [
            'total_volume' => Payment::where('status', 'completed')->sum('amount'),
            'total_platform_fees' => Payment::where('status', 'completed')->sum('platform_fee'),
            'total_provider_payouts' => Payment::where('status', 'completed')->sum('provider_amount'),
            'pending_payouts' => Payment::where('status', 'pending')->sum('provider_amount'),
            'monthly_revenue' => $this->getMonthlyRevenue(),
            'payment_methods' => $this->getPaymentMethodBreakdown(),
        ];

        $recentPayments = Payment::with(['customer', 'provider.user', 'booking'])
            ->latest()
            ->limit(10)
            ->get();

        return response()->json([
            'stats' => $stats,
            'recent_payments' => $recentPayments,
        ]);
    }

    /**
     * Get monthly revenue breakdown for charts.
     */
    protected function getMonthlyRevenue()
    {
        $monthExpression = DB::getDriverName() === 'sqlite'
            ? "strftime('%Y-%m', created_at)"
            : "DATE_FORMAT(created_at, '%Y-%m')";

        return Payment::where('status', 'completed')
            ->selectRaw("{$monthExpression} as month, SUM(amount) as revenue, SUM(platform_fee) as profit")
            ->groupBy('month')
            ->orderBy('month', 'desc')
            ->limit(12)
            ->get();
    }

    /**
     * Get breakdown of payment methods.
     */
    protected function getPaymentMethodBreakdown()
    {
        return Payment::select('payment_method', DB::raw('count(*) as count'))
            ->groupBy('payment_method')
            ->get();
    }
}

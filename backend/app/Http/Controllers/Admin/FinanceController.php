<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Payment;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Pagination\LengthAwarePaginator;
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
        return Payment::where('status', 'completed')
            ->selectRaw('DATE_FORMAT(created_at, "%Y-%m") as month, SUM(amount) as revenue, SUM(platform_fee) as profit')
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

    /**
     * Get detailed list of transactions with filtering.
     */
    public function transactions(Request $request): LengthAwarePaginator
    {
        $query = Payment::with(['customer', 'provider.user', 'booking']);

        if ($request->filled('status')) {
            $query->where('status', $request->status);
        }

        if ($request->filled('search')) {
            $search = $request->search;
            $query->where(function (\Illuminate\Database\Eloquent\Builder $q) use ($search) {
                $q->where('transaction_id', 'like', "%{$search}%")
                    ->orWhereHas('customer', function ($sq) use ($search) {
                        $sq->where('first_name', 'like', "%{$search}%")
                            ->orWhere('last_name', 'like', "%{$search}%");
                    });
            });
        }

        return $query->latest()->paginate(20);
    }
}

<?php

namespace App\Http\Controllers\Api\Admin;

use App\Enums\PaymentStatus;
use App\Enums\PayoutStatus;
use App\Http\Controllers\Controller;
use App\Models\Payout;
use App\Models\Payment;
use App\Models\Provider;
use App\Services\LedgerService;
use Illuminate\Http\Request;

class FinancialController extends Controller
{
    protected LedgerService $ledgerService;

    public function __construct(LedgerService $ledgerService)
    {
        $this->ledgerService = $ledgerService;
    }

    public function overview() {
        // Lifetime platform revenue: the platform's cut of completed payments.
        // Admin\AnalyticsController calls the same figure platform_revenue, and
        // the tile that renders this is labelled "Total Platform Revenue" /
        // "Lifetime Earnings" - it used to report the gross value of completed
        // bookings instead, which is roughly 10x larger and disagreed with the
        // analytics screen.
        $totalRevenue = Payment::where('status', PaymentStatus::Completed)->sum('platform_fee');

        $pendingPayoutsAmount = Payout::where('status', PayoutStatus::Pending)->sum('amount');
        $pendingPayoutsCount = Payout::where('status', PayoutStatus::Pending)->count();
        $globalProviderBalance = Provider::sum('balance');

        return response()->json([
            'total_revenue' => (float) $totalRevenue,
            'pending_payouts_amount' => (float) $pendingPayoutsAmount,
            'pending_payouts_count' => $pendingPayoutsCount,
            'global_provider_balance' => (float) $globalProviderBalance,
        ]);
    }

    public function payouts(Request $request) {
        $query = Payout::with('provider.user')
            ->when($request->status, function ($q, $status) {
                if ($status !== 'all') {
                    $q->where('status', $status);
                }
            })
            ->when($request->search, function ($q, $search) {
                $q->where(function ($q) use ($search) {
                    $q->whereHas('provider', function ($q) use ($search) {
                        $q->where('business_name', 'like', "%{$search}%")
                            ->orWhereHas('user', fn ($u) => $u->like($search, withEmail: false));
                    })->orWhere('reference_number', 'like', "%{$search}%");
                });
            });

        return response()->json($query->latest()->paginate(15));
    }

    public function process(Request $request, Payout $payout) {
        $request->validate([
            'status' => 'required|in:'.implode(',', array_column(PayoutStatus::cases(), 'value')),
            'reference_number' => 'nullable|string',
            'notes' => 'nullable|string',
        ]);

        try {
            $processedPayout = $this->ledgerService->processPayout(
                $payout,
                $request->status,
                $request->reference_number,
                $request->notes
            );

            $processedPayout->load('provider.user');

            return response()->json([
                'message' => 'Payout processed successfully',
                'payout' => $processedPayout,
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'message' => $e->getMessage(),
            ], 422);
        }
    }
}

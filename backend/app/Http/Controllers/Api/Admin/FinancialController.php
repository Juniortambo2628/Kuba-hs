<?php

namespace App\Http\Controllers\Api\Admin;

use App\Enums\BookingStatus;
use App\Enums\PayoutStatus;
use App\Http\Controllers\Controller;
use App\Models\Booking;
use App\Models\Payout;
use App\Models\Provider;
use App\Services\LedgerService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class FinancialController extends Controller
{
    protected LedgerService $ledgerService;

    public function __construct(LedgerService $ledgerService)
    {
        $this->ledgerService = $ledgerService;
    }

    public function overview(): JsonResponse
    {
        // Calculate Total Revenue (completed bookings)
        $totalRevenue = Booking::where('status', BookingStatus::Completed)
            ->selectRaw('COALESCE(SUM(final_price), SUM(estimated_price)) as total')
            ->value('total') ?? 0;

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

    public function payouts(Request $request): JsonResponse
    {
        $query = Payout::with('provider.user')
            ->when($request->status, function ($q, $status) {
                if ($status !== 'all') {
                    $q->where('status', $status);
                }
            })
            ->when($request->search, function ($q, $search) {
                $q->whereHas('provider', function ($q) use ($search) {
                    $q->where('business_name', 'like', "%{$search}%")
                        ->orWhereHas('user', fn ($q) => $q->where('first_name', 'like', "%{$search}%")
                            ->orWhere('last_name', 'like', "%{$search}%")
                        );
                })->orWhere('reference_number', 'like', "%{$search}%");
            });

        return response()->json($query->latest()->paginate(15));
    }

    public function process(Request $request, Payout $payout): JsonResponse
    {
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

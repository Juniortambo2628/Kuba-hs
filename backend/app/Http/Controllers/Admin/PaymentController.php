<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Payment;
use App\Http\Resources\PaymentResource;
use Illuminate\Http\Request;

class PaymentController extends Controller
{
    public function index(Request $request)
    {
        $query = Payment::with(['customer', 'provider.user', 'booking.service']);

        if ($request->filled('search')) {
            $search = $request->search;
            $query->where('transaction_id', 'like', "%{$search}%")
                  ->orWhereHas('customer', function($q) use ($search) {
                      $q->where('first_name', 'like', "%{$search}%")
                          ->orWhere('last_name', 'like', "%{$search}%");
                  });
        }

        if ($request->filled('status')) {
            $query->where('status', $request->status);
        }

        $payments = $query->latest()->paginate(20)->withQueryString();

        // Stats
        $stats = [
            'total_volume' => Payment::where('status', 'completed')->sum('amount'),
            'total_fees' => Payment::where('status', 'completed')->sum('platform_fee'),
            'pending_volume' => Payment::where('status', 'pending')->sum('amount'),
            'completed_count' => Payment::where('status', 'completed')->count(),
        ];

        return response()->json([
            'payments' => PaymentResource::collection($payments)->response()->getData(true),
            'stats' => $stats,
        ]);
    }

    public function show(Payment $payment)
    {
        $payment->load([
            'customer',
            'provider.user',
            'booking.service',
            'booking.address',
        ]);

        return response()->json([
            'payment' => new PaymentResource($payment),
        ]);
    }
}

<?php

namespace App\Http\Controllers\Api;

use App\Enums\UserRole;
use App\Http\Controllers\Controller;
use App\Http\Requests\InitializePaymentRequest;
use App\Http\Requests\VerifyPaymentRequest;
use App\Http\Resources\PaymentResource;
use App\Models\Booking;
use App\Models\Payment;
use App\Services\PaymentService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class PaystackController extends Controller
{
    /**
     * Initialize a Paystack transaction for a booking.
     */
    public function initialize(InitializePaymentRequest $request, PaymentService $paymentService) {
        try {
            $user = $request->user();
            $booking = Booking::with('provider')->findOrFail($request->booking_id);

            $paymentData = $paymentService->initializePayment($booking, $user);

            return response()->json($paymentData);
        } catch (\Exception $e) {
            $code = $e->getCode() > 0 ? $e->getCode() : 500;

            return response()->json(['message' => $e->getMessage()], $code);
        }
    }

    /**
     * Verify a Paystack transaction via reference.
     */
    public function verify(VerifyPaymentRequest $request, PaymentService $paymentService) {
        try {
            $booking = $paymentService->verifyPayment($request->reference);

            return response()->json([
                'message' => 'Payment verified successfully.',
                'booking' => $booking,
            ]);
        } catch (\Exception $e) {
            $code = $e->getCode() > 0 ? $e->getCode() : 500;

            return response()->json(['message' => $e->getMessage()], $code);
        }
    }

    /**
     * Get transaction history for the authenticated provider.
     */
    public function providerTransactions(Request $request) {
        $user = $request->user();
        if ($user->role !== UserRole::Provider) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $provider = $user->provider;
        if (! $provider) {
            return response()->json(['message' => 'Provider profile not found'], 404);
        }

        $payments = Payment::with('booking.service')
            ->where('provider_id', $provider->id)
            ->orderBy('created_at', 'desc')
            ->paginate(15);

        return PaymentResource::collection($payments);
    }

    /**
     * Get transaction history for the authenticated user (client).
     */
    public function userTransactions(Request $request) {
        $user = $request->user();

        $payments = Payment::with('booking.service')
            ->where('customer_id', $user->id)
            ->orderBy('created_at', 'desc')
            ->paginate(15);

        return PaymentResource::collection($payments);
    }
}

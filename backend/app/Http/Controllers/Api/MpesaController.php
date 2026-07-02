<?php

namespace App\Http\Controllers\Api;

use App\Enums\BookingPaymentStatus;
use App\Enums\BookingStatus;
use App\Http\Controllers\Controller;
use App\Models\Booking;
use App\Models\Payment;
use App\Services\MpesaService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class MpesaController extends Controller
{
    protected $mpesaService;

    public function __construct(MpesaService $mpesaService)
    {
        $this->mpesaService = $mpesaService;
    }

    /**
     * Initialize M-Pesa STK Push
     */
    public function stkPush(Request $request): JsonResponse
    {
        $request->validate([
            'booking_id' => 'required|exists:bookings,id',
            'phone_number' => 'required|string',
        ]);

        $user = $request->user();

        try {
            $booking = Booking::with('service')->findOrFail($request->booking_id);

            if ($user->id !== $booking->customer_id) {
                return response()->json(['message' => 'Unauthorized'], 403);
            }

            if (! in_array($booking->status, [BookingStatus::Confirmed, BookingStatus::Completed])) {
                return response()->json(['message' => 'Booking must be confirmed or completed first'], 422);
            }

            if ($booking->payment_status === BookingPaymentStatus::Paid) {
                return response()->json(['message' => 'Already paid'], 422);
            }

            $response = $this->mpesaService->stkPush($booking, $request->phone_number);

            // Store checkout ID so we can match the callback
            $booking->update([
                'mpesa_checkout_id' => $response['CheckoutRequestID'] ?? null,
                'payment_method' => 'mpesa',
            ]);

            return response()->json([
                'message' => 'STK Push sent. Please check your phone and enter your M-Pesa PIN.',
                'checkout_request_id' => $response['CheckoutRequestID'] ?? null,
            ]);
        } catch (\Exception $e) {
            Log::error('M-Pesa STK Push Error', ['error' => $e->getMessage()]);

            return response()->json(['message' => $e->getMessage()], 500);
        }
    }

    /**
     * M-Pesa Callback from Daraja API (no auth required)
     * Verifies Safaricom signature to prevent forged payment confirmations.
     */
    public function callback(Request $request): JsonResponse
    {
        // Verify Safaricom signature — mandatory to prevent forged payment confirmations
        $signature = $request->header('X-Safaricom-Signature');
        if (! $signature) {
            Log::warning('M-Pesa callback: Missing X-Safaricom-Signature header');

            return response()->json(['ResultCode' => 1, 'ResultDesc' => 'Missing signature'], 401);
        }

        $expectedSignature = hash_hmac(
            'sha256',
            $request->getContent(),
            config('services.safaricom.callback_secret', '')
        );
        if (! hash_equals($expectedSignature, $signature)) {
            Log::warning('M-Pesa callback: Invalid signature');

            return response()->json(['ResultCode' => 1, 'ResultDesc' => 'Invalid signature'], 401);
        }

        Log::info('M-Pesa Callback Received', $request->all());

        $callbackData = $request->input('Body.stkCallback');

        if (! $callbackData) {
            return response()->json(['ResultCode' => 0, 'ResultDesc' => 'Accepted']);
        }

        $resultCode = $callbackData['ResultCode'];
        $checkoutRequestID = $callbackData['CheckoutRequestID'];

        $booking = Booking::where('mpesa_checkout_id', $checkoutRequestID)->first();

        if (! $booking) {
            Log::warning("M-Pesa callback: No booking found for CheckoutRequestID $checkoutRequestID");

            return response()->json(['ResultCode' => 0, 'ResultDesc' => 'Accepted']);
        }

        if ($resultCode == 0) {
            // Payment was successful
            $metadata = $callbackData['CallbackMetadata']['Item'] ?? [];
            $amount = 0;
            $transactionId = '';
            $phoneNumber = '';

            foreach ($metadata as $item) {
                if ($item['Name'] === 'Amount') {
                    $amount = $item['Value'];
                }
                if ($item['Name'] === 'MpesaReceiptNumber') {
                    $transactionId = $item['Value'];
                }
                if ($item['Name'] === 'PhoneNumber') {
                    $phoneNumber = $item['Value'];
                }
            }

            $serviceAmount = $booking->final_price ?? $booking->estimated_price;
            $platformFee = round($serviceAmount * 0.10, 2);
            $providerAmount = round($serviceAmount - $platformFee, 2);

            // Record Payment
            Payment::create([
                'booking_id' => $booking->id,
                'customer_id' => $booking->customer_id,
                'provider_id' => $booking->provider_id,
                'amount' => $serviceAmount,
                'platform_fee' => $platformFee,
                'provider_amount' => $providerAmount,
                'payment_method' => 'mpesa',
                'transaction_id' => $transactionId,
                'status' => 'completed',
                'payment_gateway' => 'mpesa',
            ]);

            // Update Booking
            $booking->update([
                'payment_status' => 'paid',
                'final_price' => $serviceAmount,
            ]);

            app(\App\Services\BookingActivityLogService::class)->log(
                $booking,
                'payment_completed',
                $booking->customer,
                'Payment verified via M-Pesa',
                ['transaction_id' => $transactionId, 'amount' => $serviceAmount]
            );

            // Notifications
            $booking->load(['customer', 'provider.user']);

            if ($booking->provider?->user) {
                $booking->provider->user->notify(new \App\Notifications\BookingStatusUpdated($booking));
            }
            if ($booking->customer) {
                $booking->customer->notify(new \App\Notifications\PaymentReceived($booking, (float) $serviceAmount));
            }

            Log::info("M-Pesa Payment Success: TX $transactionId for Booking {$booking->id}");
        } else {
            Log::warning("M-Pesa Payment Failed: Booking {$booking->id}, Code $resultCode");
        }

        return response()->json(['ResultCode' => 0, 'ResultDesc' => 'Accepted']);
    }

    /**
     * Check the status of a pending M-Pesa payment.
     */
    public function checkStatus(Request $request): JsonResponse
    {
        $request->validate(['booking_id' => 'required|exists:bookings,id']);
        $booking = Booking::findOrFail($request->booking_id);

        return response()->json([
            'payment_status' => $booking->payment_status,
            'payment_method' => $booking->payment_method,
        ]);
    }
}

<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Booking;
use App\Models\Payment;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;
use App\Models\SiteSetting;

class PaystackController extends Controller
{
    const PLATFORM_FEE_PERCENT = 0.10;

    /**
     * Get a setting value, falling back to config if not found in DB.
     */
    protected function getSetting($key, $configFallback)
    {
        $setting = SiteSetting::where('key', $key)->first();
        return ($setting && $setting->value) ? $setting->value : config($configFallback);
    }

    /**
     * Initialize a Paystack transaction for a booking.
     */
    public function initialize(Request $request)
    {
        $request->validate([
            'booking_id' => 'required|exists:bookings,id',
        ]);

        $user = $request->user();
        $booking = Booking::with('provider')->findOrFail($request->booking_id);

        if ($user->id !== $booking->customer_id) {
            return response()->json(['message' => 'Unauthorized. Only the customer can pay for this booking.'], 403);
        }

        if ($booking->status !== 'confirmed') {
            return response()->json(['message' => 'This booking must be confirmed before payment.'], 422);
        }

        if ($booking->payment_status === 'paid') {
            return response()->json(['message' => 'This booking has already been paid.'], 422);
        }

        $amount = $booking->final_price ?? $booking->estimated_price;
        $feePercent = (float) $this->getSetting('platform_fee_percent', 'services.platform.feePercent') ?: self::PLATFORM_FEE_PERCENT;
        $platformFee = round($amount * $feePercent, 2);
        $total = round($amount + $platformFee, 2);
        // Paystack amount is in kobo (multiply by 100)
        $amountInKobo = (int) round($total * 100);

        try {
            $secretKey = $this->getSetting('paystack_secret_key', 'services.paystack.secretKey');
            $paymentUrl = $this->getSetting('paystack_payment_url', 'services.paystack.paymentUrl');

            $response = Http::withToken($secretKey)
                ->post($paymentUrl . '/transaction/initialize', [
                    'amount' => $amountInKobo,
                    'email' => $user->email,
                    'reference' => 'KBA-TX-' . uniqid(),
                    'callback_url' => config('app.frontend_url') . '/payment/verify',
                    'metadata' => [
                        'booking_id' => $booking->id,
                        'customer_id' => $user->id,
                        'provider_id' => $booking->provider_id,
                        'platform_fee' => $platformFee,
                    ],
                ]);

            if ($response->successful()) {
                return response()->json([
                    'authorization_url' => $response['data']['authorization_url'],
                    'access_code' => $response['data']['access_code'],
                    'reference' => $response['data']['reference'],
                    'amount' => $total,
                    'platform_fee' => $platformFee
                ]);
            }

            Log::error('Paystack Initialize Error: ', $response->json());
            return response()->json(['message' => 'Failed to initialize payment gateway'], 500);

        } catch (\Exception $e) {
            Log::error('Paystack Initialize Exception: ' . $e->getMessage());
            return response()->json(['message' => 'An error occurred initializing payment'], 500);
        }
    }

    /**
     * Verify a Paystack transaction via reference.
     */
    public function verify(Request $request)
    {
        $request->validate([
            'reference' => 'required|string',
        ]);

        $reference = $request->reference;

        try {
            $secretKey = $this->getSetting('paystack_secret_key', 'services.paystack.secretKey');
            $paymentUrl = $this->getSetting('paystack_payment_url', 'services.paystack.paymentUrl');

            $response = Http::withToken($secretKey)
                ->get($paymentUrl . "/transaction/verify/" . rawurlencode($reference));

            if (!$response->successful() || $response['data']['status'] !== 'success') {
                return response()->json(['message' => 'Payment verification failed or pending.'], 400);
            }

            $paymentData = $response['data'];
            $metadata = $paymentData['metadata'];

            $booking = Booking::with(['customer', 'provider.user'])->find($metadata['booking_id']);

            if (!$booking) {
                return response()->json(['message' => 'Original booking not found.'], 404);
            }

            if ($booking->payment_status === 'paid') {
                return response()->json(['message' => 'Payment already processed.', 'booking' => $booking]);
            }

            $amount = $booking->final_price ?? $booking->estimated_price;
            $platformFee = isset($metadata['platform_fee']) ? (float) $metadata['platform_fee'] : round($amount * self::PLATFORM_FEE_PERCENT, 2);
            $providerAmount = round($amount - $platformFee, 2);

            // Record Payment
            Payment::create([
                'booking_id' => $booking->id,
                'customer_id' => $booking->customer_id,
                'provider_id' => $booking->provider_id,
                'amount' => $amount,
                'platform_fee' => $platformFee,
                'provider_amount' => $providerAmount,
                'payment_method' => $paymentData['channel'] ?? 'paystack',
                'transaction_id' => $reference,
                'status' => 'completed',
                'payment_gateway' => 'paystack',
            ]);

            // Update Booking
            $booking->update([
                'payment_status' => 'paid',
                'final_price' => $amount,
            ]);

            // Notify Provider
            $booking->provider->user->notify(new \App\Notifications\BookingStatusUpdated($booking));
            
            // Notify Customer
            $booking->customer->notify(new \App\Notifications\PaymentReceived($booking, (float) $amount));

            return response()->json([
                'message' => 'Payment verified successfully.',
                'booking' => $booking
            ]);

        } catch (\Exception $e) {
            Log::error('Paystack Verify Exception: ' . $e->getMessage());
            return response()->json(['message' => 'An error occurred verifying payment'], 500);
        }
    }

    /**
     * Get transaction history for the authenticated provider.
     */
    public function providerTransactions(Request $request)
    {
        $user = $request->user();
        if ($user->role !== 'provider') {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $provider = $user->provider;
        if (!$provider) {
            return response()->json(['message' => 'Provider profile not found'], 404);
        }

        $payments = Payment::with('booking.service')
            ->where('provider_id', $provider->id)
            ->orderBy('created_at', 'desc')
            ->paginate(15);

        return response()->json($payments);
    }
}

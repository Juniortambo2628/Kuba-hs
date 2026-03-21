<?php

namespace App\Services;

use App\Models\Booking;
use App\Models\Payment;
use App\Models\SiteSetting;
use App\Models\User;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class PaymentService
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
     *
     * @param Booking $booking
     * @param User $user
     * @return array
     * @throws \Exception
     */
    public function initializePayment(Booking $booking, User $user): array
    {
        if ($user->id !== $booking->customer_id) {
            throw new \Exception('Unauthorized. Only the customer can pay for this booking.', 403);
        }

        if ($booking->status !== 'confirmed') {
            throw new \Exception('This booking must be confirmed before payment.', 422);
        }

        if ($booking->payment_status === 'paid') {
            throw new \Exception('This booking has already been paid.', 422);
        }

        $amount = $booking->final_price ?? $booking->estimated_price;
        $feePercent = (float) $this->getSetting('platform_fee_percent', 'services.platform.feePercent') ?: self::PLATFORM_FEE_PERCENT;
        $platformFee = round($amount * $feePercent, 2);
        $total = round($amount + $platformFee, 2);
        // Paystack amount is in kobo (multiply by 100)
        $amountInKobo = (int) round($total * 100);

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
            return [
                'authorization_url' => $response['data']['authorization_url'],
                'access_code' => $response['data']['access_code'],
                'reference' => $response['data']['reference'],
                'amount' => $total,
                'platform_fee' => $platformFee
            ];
        }

        Log::error('Paystack Initialize Error: ', $response->json());
        throw new \Exception('Failed to initialize payment gateway');
    }

    /**
     * Verify a Paystack transaction via reference.
     *
     * @param string $reference
     * @return Booking
     * @throws \Exception
     */
    public function verifyPayment(string $reference): Booking
    {
        $secretKey = $this->getSetting('paystack_secret_key', 'services.paystack.secretKey');
        $paymentUrl = $this->getSetting('paystack_payment_url', 'services.paystack.paymentUrl');

        $response = Http::withToken($secretKey)
            ->get($paymentUrl . "/transaction/verify/" . rawurlencode($reference));

        if (!$response->successful() || $response['data']['status'] !== 'success') {
            throw new \Exception('Payment verification failed or pending.', 400);
        }

        $paymentData = $response['data'];
        $metadata = $paymentData['metadata'];

        $booking = Booking::with(['customer', 'provider.user'])->findOrFail($metadata['booking_id']);

        if ($booking->payment_status === 'paid') {
            return $booking;
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
        if (isset($booking->provider->user)) {
             $booking->provider->user->notify(new \App\Notifications\BookingStatusUpdated($booking));
        }
        
        // Notify Customer
        if (isset($booking->customer)) {
            $booking->customer->notify(new \App\Notifications\PaymentReceived($booking, (float) $amount));
        }

        return $booking;
    }
}

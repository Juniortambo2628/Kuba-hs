<?php

namespace App\Http\Controllers;

use App\Models\Booking;
use App\Models\Payment;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;
use Stripe\Stripe;
use Stripe\PaymentIntent;

class PaymentController extends Controller
{
    /**
     * Platform fee percentage (10%).
     */
    const PLATFORM_FEE_PERCENT = 0.10;

    public function __construct()
    {
        Stripe::setApiKey(config('services.stripe.secret'));
    }

    /**
     * Show the payment page for a booking.
     */
    public function show(Booking $booking)
    {
        $user = Auth::user();

        // Only the customer who made the booking can pay
        if ($user->id !== $booking->customer_id) {
            abort(403, 'Unauthorized.');
        }

        // Booking must be confirmed before payment
        if ($booking->status !== 'confirmed') {
            return redirect()->route('dashboard')->with('error', 'This booking must be confirmed by the provider before payment.');
        }

        // Check if already paid
        if ($booking->payment_status === 'paid') {
            return redirect()->route('dashboard')->with('info', 'This booking has already been paid.');
        }

        $booking->load(['provider.user', 'service']);

        $amount = $booking->final_price ?? $booking->estimated_price;
        $platformFee = round($amount * self::PLATFORM_FEE_PERCENT, 2);

        return Inertia::render('Payment/Checkout', [
            'booking' => $booking,
            'amount' => $amount,
            'platformFee' => $platformFee,
            'total' => round($amount + $platformFee, 2),
            'stripeKey' => config('services.stripe.key'),
        ]);
    }

    /**
     * Create a Stripe PaymentIntent for a booking.
     */
    public function createIntent(Request $request, Booking $booking): JsonResponse
    {
        $user = Auth::user();
        if ($user->id !== $booking->customer_id) {
            abort(403, 'Unauthorized.');
        }
        $result = $this->createStripePaymentIntentForBooking($booking, $user->id);
        $status = isset($result['error']) ? 500 : 200;
        return response()->json($result, $status);
    }

    /**
     * @return array{clientSecret: string}|array{error: string}
     */
    private function createStripePaymentIntentForBooking(Booking $booking, string $customerId): array
    {
        $amountCents = $this->getBookingPaymentAmountCents($booking);
        $metadata = [
            'booking_id' => $booking->id,
            'booking_number' => $booking->booking_number,
            'customer_id' => $customerId,
        ];

        try {
            $clientSecret = $this->createStripeIntent($amountCents, $metadata);
            return ['clientSecret' => $clientSecret];
        } catch (\Throwable $e) {
            return ['error' => $e->getMessage()];
        }
    }

    /** @return int Amount in cents for Stripe. */
    private function getBookingPaymentAmountCents(Booking $booking): int
    {
        $amount = $booking->final_price ?? $booking->estimated_price;
        $platformFee = round($amount * self::PLATFORM_FEE_PERCENT, 2);
        $total = round($amount + $platformFee, 2);
        return (int) round($total * 100);
    }

    /**
     * Create a Stripe PaymentIntent and return its client secret.
     *
     * @param array<string, string> $metadata
     * @return string
     */
    private function createStripeIntent(int $amountCents, array $metadata): string
    {
        /** @var \Stripe\PaymentIntent $intent */
        $intent = PaymentIntent::create([
            'amount' => $amountCents,
            'currency' => 'usd',
            'metadata' => $metadata,
        ]);
        $secret = $intent->client_secret;
        return (string) $secret;
    }

    /**
     * Confirm payment was successful (called from frontend after Stripe confirms).
     */
    public function confirm(Request $request, Booking $booking)
    {
        $user = Auth::user();

        if ($user->id !== $booking->customer_id) {
            abort(403, 'Unauthorized.');
        }

        $validated = $request->validate([
            'payment_intent_id' => 'required|string',
        ]);

        try {
            $intent = PaymentIntent::retrieve($validated['payment_intent_id']);

            if ($intent->status !== 'succeeded') {
                return back()->with('error', 'Payment has not been completed.');
            }

            $amount = $booking->final_price ?? $booking->estimated_price;
            $platformFee = round($amount * self::PLATFORM_FEE_PERCENT, 2);
            $providerAmount = round($amount - $platformFee, 2);

            // Create payment record
            Payment::create([
                'booking_id' => $booking->id,
                'customer_id' => $user->id,
                'provider_id' => $booking->provider_id,
                'amount' => $amount,
                'platform_fee' => $platformFee,
                'provider_amount' => $providerAmount,
                'payment_method' => $intent->payment_method_types[0] ?? 'card',
                'transaction_id' => $intent->id,
                'status' => 'completed',
                'payment_gateway' => 'stripe',
            ]);

            // Update booking payment status
            $booking->update([
                'payment_status' => 'paid',
                'final_price' => $amount,
            ]);

            // Notify provider (booking status / payment)
            $booking->provider->user->notify(new \App\Notifications\BookingStatusUpdated($booking));

            // Notify customer (payment received)
            $booking->customer->notify(new \App\Notifications\PaymentReceived($booking, (float) $amount));

            return redirect()->route('dashboard')->with('success', 'Payment successful! Your booking is now confirmed and paid.');

        } catch (\Exception $e) {
            return back()->with('error', 'Payment verification failed: ' . $e->getMessage());
        }
    }

    /**
     * Handle Stripe webhook events (e.g. payment_intent.succeeded for reliability).
     */
    public function handleWebhook(Request $request)
    {
        $payload = $request->getContent();
        $sigHeader = $request->header('Stripe-Signature');
        $webhookSecret = config('services.stripe.webhook_secret');

        if (!$webhookSecret) {
            Log::warning('Stripe webhook secret not set');
            return response()->json(['error' => 'Webhook not configured'], 500);
        }

        try {
            $event = \Stripe\Webhook::constructEvent(
                $payload,
                $sigHeader,
                $webhookSecret
            );
        } catch (\UnexpectedValueException $e) {
            return response()->json(['error' => 'Invalid payload'], 400);
        } catch (\Stripe\Exception\SignatureVerificationException $e) {
            return response()->json(['error' => 'Invalid signature'], 400);
        }

        if ($event->type === 'payment_intent.succeeded') {
            $intent = $event->data->object;
            $bookingId = $intent->metadata->booking_id ?? null;

            if ($bookingId) {
                $booking = Booking::find($bookingId);
                if ($booking && $booking->payment_status !== 'paid') {
                    $amount = $booking->final_price ?? $booking->estimated_price;
                    $platformFee = round($amount * self::PLATFORM_FEE_PERCENT, 2);
                    $providerAmount = round($amount - $platformFee, 2);

                    Payment::firstOrCreate(
                        ['transaction_id' => $intent->id],
                        [
                            'booking_id' => $booking->id,
                            'customer_id' => $booking->customer_id,
                            'provider_id' => $booking->provider_id,
                            'amount' => $amount,
                            'platform_fee' => $platformFee,
                            'provider_amount' => $providerAmount,
                            'payment_method' => $intent->payment_method_types[0] ?? 'card',
                            'status' => 'completed',
                            'payment_gateway' => 'stripe',
                        ]
                    );

                    $booking->update([
                        'payment_status' => 'paid',
                        'final_price' => $amount,
                    ]);
                }
            }
        }

        return response()->json(['received' => true]);
    }
}

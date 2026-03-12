import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, router } from '@inertiajs/react';
import { useState, useEffect } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { cn } from '@/lib/utils';
import { CreditCard, Shield, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';

function CheckoutForm({ booking, amount, platformFee, total }) {
    const stripe = useStripe();
    const elements = useElements();
    const [error, setError] = useState(null);
    const [processing, setProcessing] = useState(false);
    const [succeeded, setSucceeded] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setProcessing(true);
        setError(null);

        try {
            // 1. Create a PaymentIntent on the server
            const response = await fetch(route('payment.intent', booking.id), {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content'),
                    'Accept': 'application/json',
                },
            });

            const data = await response.json();

            if (data.error) {
                setError(data.error);
                setProcessing(false);
                return;
            }

            // 2. Confirm the payment with Stripe
            const { error: stripeError, paymentIntent } = await stripe.confirmCardPayment(
                data.clientSecret,
                {
                    payment_method: {
                        card: elements.getElement(CardElement),
                    },
                }
            );

            if (stripeError) {
                setError(stripeError.message);
                setProcessing(false);
                return;
            }

            if (paymentIntent.status === 'succeeded') {
                setSucceeded(true);

                // 3. Confirm the payment on our server
                router.post(route('payment.confirm', booking.id), {
                    payment_intent_id: paymentIntent.id,
                });
            }
        } catch (err) {
            setError('An unexpected error occurred. Please try again.');
            setProcessing(false);
        }
    };

    const cardStyle = {
        style: {
            base: {
                color: '#1c1917',
                fontFamily: '"Inter", system-ui, sans-serif',
                fontSmoothing: 'antialiased',
                fontSize: '16px',
                '::placeholder': {
                    color: '#a8a29e',
                },
            },
            invalid: {
                color: '#ef4444',
                iconColor: '#ef4444',
            },
        },
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            {/* Order Summary */}
            <div className="bg-white dark:bg-zinc-800/50 rounded-2xl border border-stone-100 dark:border-zinc-800 p-6 shadow-sm">
                <h3 className="text-sm font-bold text-stone-900 dark:text-white mb-4">Order Summary</h3>
                
                <div className="space-y-3">
                    <div className="flex justify-between text-sm">
                        <span className="text-stone-600 dark:text-zinc-400">{booking.service?.name}</span>
                        <span className="font-medium text-stone-900 dark:text-white">${parseFloat(amount).toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                        <span className="text-stone-600 dark:text-zinc-400">Service fee</span>
                        <span className="font-medium text-stone-900 dark:text-white">${parseFloat(platformFee).toFixed(2)}</span>
                    </div>
                    <div className="border-t border-stone-100 dark:border-zinc-800 pt-3 flex justify-between">
                        <span className="font-bold text-stone-900 dark:text-white">Total</span>
                        <span className="font-bold text-lg text-indigo-600">${parseFloat(total).toFixed(2)}</span>
                    </div>
                </div>
            </div>

            {/* Card Input */}
            <div className="bg-white dark:bg-zinc-800/50 rounded-2xl border border-stone-100 dark:border-zinc-800 p-6 shadow-sm">
                <div className="flex items-center gap-3 mb-6">
                    <div className="h-10 w-10 rounded-xl bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center">
                        <CreditCard className="h-5 w-5 text-indigo-600" />
                    </div>
                    <div>
                        <h3 className="text-sm font-bold text-stone-900 dark:text-white">Payment Details</h3>
                        <p className="text-xs text-stone-500">Secured by Stripe</p>
                    </div>
                </div>

                <div className="border border-stone-200 dark:border-zinc-700 rounded-xl p-4 bg-stone-50 dark:bg-zinc-900 focus-within:ring-2 focus-within:ring-indigo-500/20 focus-within:border-indigo-500 transition-all">
                    <CardElement options={cardStyle} />
                </div>

                {/* Security Badge */}
                <div className="flex items-center gap-2 mt-4 text-xs text-stone-400">
                    <Shield className="h-3.5 w-3.5" />
                    <span>Your payment information is encrypted and processed securely.</span>
                </div>
            </div>

            {/* Error Message */}
            {error && (
                <div className="flex items-center gap-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-4">
                    <AlertCircle className="h-5 w-5 text-red-500 flex-shrink-0" />
                    <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
                </div>
            )}

            {/* Success Message */}
            {succeeded && (
                <div className="flex items-center gap-3 bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800 rounded-xl p-4">
                    <CheckCircle className="h-5 w-5 text-emerald-500 flex-shrink-0" />
                    <p className="text-sm text-emerald-600 dark:text-emerald-400">Payment successful! Redirecting...</p>
                </div>
            )}

            {/* Submit Button */}
            <button
                type="submit"
                disabled={!stripe || processing || succeeded}
                className={cn(
                    "w-full py-4 text-sm font-bold rounded-xl shadow-xl active:scale-[0.98] transition-all flex items-center justify-center gap-2",
                    processing || succeeded || !stripe
                        ? "bg-stone-300 text-stone-500 cursor-not-allowed"
                        : "bg-indigo-600 text-white hover:bg-indigo-700 shadow-indigo-500/20"
                )}
            >
                {processing ? (
                    <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Processing Payment...
                    </>
                ) : succeeded ? (
                    <>
                        <CheckCircle className="h-4 w-4" />
                        Payment Complete
                    </>
                ) : (
                    <>
                        <CreditCard className="h-4 w-4" />
                        Pay ${parseFloat(total).toFixed(2)}
                    </>
                )}
            </button>
        </form>
    );
}

export default function Checkout({ booking, amount, platformFee, total, stripeKey }) {
    const [stripePromise] = useState(() => loadStripe(stripeKey));

    return (
        <AuthenticatedLayout
            header={
                <div>
                    <h1 className="text-2xl font-bold text-stone-900 dark:text-white">Complete Payment</h1>
                    <p className="text-sm text-stone-500">
                        Booking #{booking.booking_number} &middot; {booking.service?.name}
                    </p>
                </div>
            }
        >
            <Head title="Payment" />

            <div className="max-w-lg mx-auto">
                {/* Booking Details Banner */}
                <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-indigo-600 to-violet-600 p-6 text-white shadow-xl shadow-indigo-500/20 mb-8">
                    <div className="absolute top-0 right-0 w-48 h-48 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2" />
                    <div className="relative z-10">
                        <p className="text-[11px] font-bold uppercase tracking-widest text-indigo-200 mb-2">Booking Details</p>
                        <p className="text-lg font-bold">{booking.service?.name}</p>
                        <p className="text-sm text-indigo-100 mt-1">
                            Provider: {booking.provider?.user?.first_name} {booking.provider?.user?.last_name}
                        </p>
                        <p className="text-sm text-indigo-100">
                            Date: {new Date(booking.scheduled_date).toLocaleDateString('en-US', {
                                weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
                            })}
                        </p>
                    </div>
                </div>

                {/* Stripe Elements Payment Form */}
                <Elements stripe={stripePromise}>
                    <CheckoutForm 
                        booking={booking}
                        amount={amount}
                        platformFee={platformFee}
                        total={total}
                    />
                </Elements>
            </div>
        </AuthenticatedLayout>
    );
}

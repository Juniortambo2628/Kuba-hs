"use client";

import { useState, useEffect } from "react";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle,
  DialogDescription
} from "@/components/ui/dialog"; 
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  CreditCard, 
  ShieldCheck, 
  Zap, 
  Loader2, 
  CheckCircle2, 
  Smartphone, 
  Banknote, 
  ArrowLeft, 
  ChevronRight,
  Receipt
} from "lucide-react";
import { usePaystackPayment } from "react-paystack";
import axiosInstance from "@/lib/axios";
import { toast } from "sonner";
import { Booking } from "@/types";
import { VirtualReceipt } from "./VirtualReceipt";

type PaymentMethod = 'select' | 'paystack' | 'mpesa' | 'cash';
type PaymentStep = 'select' | 'details' | 'processing' | 'success';

interface CheckoutDialogProps {
    isOpen: boolean;
    onClose: () => void;
    booking: Booking;
    userEmail: string;
    onSuccess: () => void;
}

export function CheckoutDialog({ isOpen, onClose, booking, userEmail, onSuccess }: CheckoutDialogProps) {
    const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('select');
    const [paymentStep, setPaymentStep] = useState<PaymentStep>('select');
    const [isInitializing, setIsInitializing] = useState(false);
    const [mpesaPhone, setMpesaPhone] = useState('');
    const [mpesaPolling, setMpesaPolling] = useState(false);
    const [showReceipt, setShowReceipt] = useState(false);
    const [txReference, setTxReference] = useState('');

    const PLATFORM_FEE_PERCENT = 0.10;
    const amount = booking.final_price || booking.estimated_price || 0;
    const platformFee = Math.round(amount * PLATFORM_FEE_PERCENT * 100) / 100;
    const total = amount + platformFee;

    // Reset state when dialog opens
    useEffect(() => {
        if (isOpen) {
            setPaymentMethod('select');
            setPaymentStep('select');
            setIsInitializing(false);
            setMpesaPhone('');
            setShowReceipt(false);
        }
    }, [isOpen]);

    // Paystack config
    const paystackConfig = {
        publicKey: process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY || "",
        email: userEmail,
        amount: Math.round(total * 100),
        reference: `KBA-${booking.id}-${Date.now()}`,
    };

    const initializePayment = usePaystackPayment(paystackConfig);

    // ─── Paystack Flow ───
    const handlePaystack = async () => {
        setIsInitializing(true);
        try {
            const initRes = await axiosInstance.post("/api/payments/paystack/initialize", {
                booking_id: booking.id
            });
            const { reference } = initRes.data;
            setTxReference(reference);

            initializePayment({
                config: { ...paystackConfig, reference },
                onSuccess: (ref: any) => verifyPaystack(ref.reference),
                onClose: () => {
                    setIsInitializing(false);
                    toast.info("Payment session closed");
                }
            });
        } catch (err: any) {
            toast.error(err.response?.data?.message || "Failed to start payment");
            setIsInitializing(false);
        }
    };

    const verifyPaystack = async (ref: string) => {
        setPaymentStep('processing');
        try {
            await axiosInstance.post("/api/payments/paystack/verify", { reference: ref });
            setTxReference(ref);
            setPaymentStep('success');
            toast.success("Payment confirmed!");
        } catch {
            toast.error("Verification failed. Contact support.");
            setPaymentStep('details');
        } finally {
            setIsInitializing(false);
        }
    };

    // ─── M-Pesa Flow ───
    const handleMpesa = async () => {
        if (!mpesaPhone || mpesaPhone.length < 9) {
            toast.error("Please enter a valid phone number");
            return;
        }
        setIsInitializing(true);
        setPaymentStep('processing');
        try {
            const res = await axiosInstance.post("/api/payments/mpesa/stk-push", {
                booking_id: booking.id,
                phone_number: mpesaPhone,
            });
            toast.success("Check your phone for the M-Pesa prompt!");
            setTxReference(res.data.checkout_request_id || '');
            
            // Poll for status
            setMpesaPolling(true);
            const pollInterval = setInterval(async () => {
                try {
                    const statusRes = await axiosInstance.post("/api/payments/mpesa/check-status", {
                        booking_id: booking.id
                    });
                    if (statusRes.data.payment_status === 'paid') {
                        clearInterval(pollInterval);
                        setMpesaPolling(false);
                        setPaymentStep('success');
                        toast.success("M-Pesa payment confirmed!");
                    }
                } catch {
                    // Silent poll failure
                }
            }, 3000);
            
            // Stop polling after 2 minutes
            setTimeout(() => {
                clearInterval(pollInterval);
                setMpesaPolling(false);
                if (paymentStep !== 'success') {
                    setIsInitializing(false);
                    toast.info("If you completed the payment, it may take a moment to process.");
                }
            }, 120000);
        } catch (err: any) {
            toast.error(err.response?.data?.message || "Failed to send STK Push");
            setPaymentStep('details');
            setIsInitializing(false);
        }
    };

    const selectMethod = (method: PaymentMethod) => {
        setPaymentMethod(method);
        setPaymentStep('details');
    };

    const progressWidth = paymentStep === 'select' ? 'w-1/4' 
        : paymentStep === 'details' ? 'w-1/2' 
        : paymentStep === 'processing' ? 'w-3/4' 
        : 'w-full';

    if (!isOpen) return null;

    // Show receipt overlay
    if (showReceipt) {
        return (
            <VirtualReceipt 
                booking={booking} 
                onClose={() => {
                    setShowReceipt(false);
                    onSuccess();
                    onClose();
                }} 
                transactionId={txReference}
                paymentMethod={paymentMethod}
            />
        );
    }

    return (
        <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
            <DialogContent className="max-w-md p-0 overflow-hidden bg-white dark:bg-background rounded-[2.5rem] border border-border shadow-2xl">
                {/* Progress Bar */}
                <div className="h-1.5 w-full bg-muted overflow-hidden">
                    <div className={`h-full bg-primary transition-all duration-700 ease-out ${progressWidth}`} />
                </div>

                <div className="p-8">
                    {/* ─── SUCCESS STATE ─── */}
                    {paymentStep === 'success' ? (
                        <div className="text-center py-6 animate-in zoom-in duration-500">
                            <div className="w-20 h-20 bg-emerald-100 dark:bg-emerald-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
                                <CheckCircle2 className="w-10 h-10 text-emerald-600 dark:text-emerald-400" />
                            </div>
                            <h2 className="text-2xl font-black text-foreground mb-2 tracking-tight">
                                {paymentMethod === 'cash' ? 'Cash Selected!' : 'Payment Confirmed!'}
                            </h2>
                            <p className="text-sm text-muted-foreground max-w-xs mx-auto">
                                Your transaction has been securely processed.
                            </p>
                            <div className="flex gap-3 mt-8">
                                <Button 
                                    onClick={() => setShowReceipt(true)}
                                    variant="outline"
                                    className="flex-1 h-12 rounded-2xl font-bold text-[10px] uppercase tracking-widest gap-2"
                                >
                                    <Receipt className="w-4 h-4" />
                                    View Receipt
                                </Button>
                                <Button 
                                    onClick={() => { onSuccess(); onClose(); }}
                                    className="flex-1 h-12 bg-foreground text-background hover:bg-foreground/90 rounded-2xl font-bold text-[10px] uppercase tracking-widest"
                                >
                                    Continue
                                </Button>
                            </div>
                        </div>
                    ) : (
                        <>
                            {/* Header */}
                            <DialogHeader className="flex flex-row justify-between items-start mb-6 space-y-0">
                                <div className="flex items-center gap-3">
                                    {paymentStep !== 'select' && (
                                        <button 
                                            onClick={() => { setPaymentStep('select'); setPaymentMethod('select'); }}
                                            className="p-2 -ml-2 rounded-xl hover:bg-muted transition-colors text-muted-foreground"
                                        >
                                            <ArrowLeft className="w-4 h-4" />
                                        </button>
                                    )}
                                    <div>
                                        <DialogTitle className="text-xl font-black tracking-tight text-foreground text-left">
                                            {paymentStep === 'select' ? 'Checkout' : paymentMethod === 'mpesa' ? 'M-Pesa' : paymentMethod === 'cash' ? 'Cash Payment' : 'Card Payment'}
                                        </DialogTitle>
                                        <DialogDescription className="text-xs text-muted-foreground mt-0.5 font-medium uppercase tracking-widest text-left">
                                            Order #{booking.booking_number}
                                        </DialogDescription>
                                    </div>
                                </div>
                                <div className="w-12 h-12 bg-muted rounded-2xl flex items-center justify-center text-primary shrink-0">
                                    <Zap className="w-6 h-6" />
                                </div>
                            </DialogHeader>

                            {/* ─── METHOD SELECTION ─── */}
                            {paymentStep === 'select' && (
                                <div className="space-y-6">
                                    {/* Order Summary */}
                                    <div className="bg-muted/30 rounded-2xl p-5 border border-border/50">
                                        <div className="flex justify-between items-center text-sm mb-2">
                                            <span className="text-muted-foreground font-medium">{booking.service?.name}</span>
                                            <span className="font-bold">KES {amount.toLocaleString()}</span>
                                        </div>
                                        <div className="flex justify-between items-center text-sm mb-3">
                                            <span className="text-muted-foreground font-medium">Platform Fee</span>
                                            <span className="font-bold">KES {platformFee.toLocaleString()}</span>
                                        </div>
                                        <div className="pt-3 border-t border-border flex justify-between items-end">
                                            <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Total</span>
                                            <span className="text-2xl font-black text-foreground tabular-nums">KES {total.toLocaleString()}</span>
                                        </div>
                                    </div>

                                    {/* Payment Methods */}
                                    <div className="space-y-2">
                                        <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest mb-3">Select Payment Method</p>
                                        
                                        {/* Paystack */}
                                        <button 
                                            onClick={() => selectMethod('paystack')}
                                            className="w-full flex items-center gap-4 p-4 rounded-2xl border border-border hover:border-primary/30 hover:bg-primary/5 transition-all group"
                                        >
                                            <div className="w-12 h-12 rounded-xl bg-indigo-100 dark:bg-indigo-500/10 flex items-center justify-center text-indigo-600 shrink-0">
                                                <CreditCard className="w-5 h-5" />
                                            </div>
                                            <div className="text-left flex-1">
                                                <p className="text-sm font-bold text-foreground">Card / Bank</p>
                                                <p className="text-[10px] text-muted-foreground font-medium">Visa, Mastercard via Paystack</p>
                                            </div>
                                            <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
                                        </button>

                                        {/* M-Pesa */}
                                        <button 
                                            onClick={() => selectMethod('mpesa')}
                                            className="w-full flex items-center gap-4 p-4 rounded-2xl border border-border hover:border-emerald-500/30 hover:bg-emerald-500/5 transition-all group"
                                        >
                                            <div className="w-12 h-12 rounded-xl bg-emerald-100 dark:bg-emerald-500/10 flex items-center justify-center text-emerald-600 shrink-0">
                                                <Smartphone className="w-5 h-5" />
                                            </div>
                                            <div className="text-left flex-1">
                                                <p className="text-sm font-bold text-foreground">M-Pesa</p>
                                                <p className="text-[10px] text-muted-foreground font-medium">Pay via STK Push to your phone</p>
                                            </div>
                                            <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:text-emerald-500 transition-colors" />
                                        </button>
                                    </div>
                                </div>
                            )}

                            {/* ─── PAYSTACK DETAILS ─── */}
                            {paymentStep === 'details' && paymentMethod === 'paystack' && (
                                <div className="space-y-6">
                                    <div className="bg-muted/30 rounded-2xl p-5 border border-border/50">
                                        <div className="pt-2 flex justify-between items-end">
                                            <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Total to Pay</span>
                                            <span className="text-3xl font-black text-foreground tabular-nums">KES {total.toLocaleString()}</span>
                                        </div>
                                    </div>

                                    <div className="flex items-center justify-center gap-8 py-2">
                                        <div className="flex flex-col items-center gap-2 opacity-50">
                                            <ShieldCheck className="w-5 h-5" />
                                            <span className="text-[9px] font-bold uppercase tracking-tighter">AES-256</span>
                                        </div>
                                        <div className="flex flex-col items-center gap-2 opacity-50">
                                            <CreditCard className="w-5 h-5" />
                                            <span className="text-[9px] font-bold uppercase tracking-tighter">Paystack</span>
                                        </div>
                                    </div>

                                    <Button 
                                        onClick={handlePaystack}
                                        disabled={isInitializing}
                                        className="w-full h-14 bg-foreground text-background hover:bg-muted hover:text-foreground rounded-2xl font-bold text-xs uppercase tracking-[0.2em] shadow-xl transition-all active:scale-95"
                                    >
                                        {isInitializing ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Pay with Card'}
                                    </Button>
                                </div>
                            )}

                            {/* ─── M-PESA DETAILS ─── */}
                            {paymentStep === 'details' && paymentMethod === 'mpesa' && (
                                <div className="space-y-6">
                                    <div className="bg-emerald-50 dark:bg-emerald-500/5 rounded-2xl p-5 border border-emerald-100 dark:border-emerald-500/10">
                                        <p className="text-xs text-emerald-700 dark:text-emerald-400 font-medium leading-relaxed">
                                            Enter your Safaricom phone number. An M-Pesa prompt will appear on your device to authorize <strong>KES {total.toLocaleString()}</strong>.
                                        </p>
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Phone Number</label>
                                        <Input
                                            type="tel"
                                            placeholder="0712 345 678"
                                            value={mpesaPhone}
                                            onChange={(e) => setMpesaPhone(e.target.value)}
                                            className="h-14 rounded-2xl text-base font-bold px-5 bg-muted/30 border-border focus:ring-emerald-500"
                                        />
                                    </div>

                                    <Button 
                                        onClick={handleMpesa}
                                        disabled={isInitializing || !mpesaPhone}
                                        className="w-full h-14 bg-emerald-600 hover:bg-emerald-700 text-white rounded-2xl font-bold text-xs uppercase tracking-[0.2em] shadow-xl shadow-emerald-500/20 transition-all active:scale-95"
                                    >
                                        {isInitializing ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Send STK Push'}
                                    </Button>
                                </div>
                            )}

                            {/* ─── PROCESSING STATE ─── */}
                            {paymentStep === 'processing' && (
                                <div className="text-center py-10 space-y-4">
                                    <Loader2 className="w-10 h-10 animate-spin text-primary mx-auto" />
                                    <h3 className="text-lg font-bold text-foreground">Processing Payment</h3>
                                    <p className="text-xs text-muted-foreground max-w-xs mx-auto">
                                        {paymentMethod === 'mpesa' 
                                            ? 'Waiting for M-Pesa confirmation from your phone...' 
                                            : 'Verifying your transaction...'}
                                    </p>
                                    {mpesaPolling && (
                                        <p className="text-[10px] text-primary font-bold uppercase tracking-widest animate-pulse">
                                            Listening for confirmation...
                                        </p>
                                    )}
                                </div>
                            )}

                            {/* Legal footer */}
                            {paymentStep !== 'processing' && (
                                <p className="text-[9px] text-center text-muted-foreground font-medium leading-relaxed px-4 mt-4">
                                    By proceeding, you agree to Kuba's Terms of Service and secure payment processing.
                                </p>
                            )}
                        </>
                    )}
                </div>
            </DialogContent>
        </Dialog>
    );
}

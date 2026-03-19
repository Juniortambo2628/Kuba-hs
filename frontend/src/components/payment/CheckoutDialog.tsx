"use client";

import { useState } from "react";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle,
  DialogDescription
} from "@/components/ui/dialog"; 
import { Button } from "@/components/ui/button";
import { CreditCard, ShieldCheck, Zap, Loader2, CheckCircle2 } from "lucide-react";
import { usePaystackPayment } from "react-paystack";
import axiosInstance from "@/lib/axios";
import { toast } from "sonner";
import { Booking } from "@/types";

// Using standard shadcn dialog components for consistency

interface CheckoutDialogProps {
    isOpen: boolean;
    onClose: () => void;
    booking: Booking;
    userEmail: string;
    onSuccess: () => void;
}

export function CheckoutDialog({ isOpen, onClose, booking, userEmail, onSuccess }: CheckoutDialogProps) {
    const [isInitializing, setIsInitializing] = useState(false);
    const [paymentStep, setPaymentStep] = useState<'preview' | 'processing' | 'success'>('preview');

    const PLATFORM_FEE_PERCENT = 0.10;
    const amount = booking.final_price || booking.estimated_price || 0;
    const platformFee = Math.round(amount * PLATFORM_FEE_PERCENT * 100) / 100;
    const total = amount + platformFee;

    const paystackConfig = {
        publicKey: process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY || "",
        email: userEmail,
        amount: Math.round(total * 100),
        reference: `KBA-${booking.id}-${Date.now()}`,
    };

    const initializePayment = usePaystackPayment(paystackConfig);

    const handlePayment = async () => {
        setIsInitializing(true);
        try {
            // Validate availability one last time or initialize session on server
            const initRes = await axiosInstance.post("/api/payments/paystack/initialize", {
                booking_id: booking.id
            });
            
            const { reference, platform_fee } = initRes.data;

            initializePayment({
                config: {
                    ...paystackConfig,
                    reference: reference, // Use server-generated reference
                },
                onSuccess: (reference: any) => {
                    verifyAndComplete(reference.reference);
                },
                onClose: () => {
                    setIsInitializing(false);
                    toast.info("Payment session closed");
                }
            });

        } catch (err: any) {
            toast.error(err.response?.data?.message || "Failed to start secure checkout");
            setIsInitializing(false);
        }
    };

    const verifyAndComplete = async (ref: string) => {
        setPaymentStep('processing');
        try {
            await axiosInstance.post("/api/payments/paystack/verify", { reference: ref });
            setPaymentStep('success');
            toast.success("Payment confirmed!");
            setTimeout(() => {
                onSuccess();
                onClose();
            }, 2500);
        } catch (err: any) {
            toast.error("Verification failed. Please contact support.");
            setPaymentStep('preview');
        } finally {
            setIsInitializing(false);
        }
    };

    if (!isOpen) return null;

    return (
        <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
            <DialogContent className="max-w-md p-0 overflow-hidden bg-white dark:bg-[#0B0F19] rounded-[2.5rem] border border-border shadow-2xl">

                    <div className="bg-white dark:bg-[#0B0F19] rounded-[2.5rem] border border-border shadow-2xl overflow-hidden relative">
                        {/* Status bar */}
                        <div className="h-1.5 w-full bg-muted overflow-hidden">
                            <div 
                                className={`h-full bg-primary transition-all duration-1000 ${paymentStep === 'preview' ? 'w-1/3' : paymentStep === 'processing' ? 'w-2/3' : 'w-full'}`}
                            />
                        </div>

                        <div className="p-8">
                            {paymentStep === 'success' ? (
                                <div className="text-center py-8 animate-in zoom-in duration-500">
                                    <div className="w-20 h-20 bg-emerald-100 dark:bg-emerald-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
                                        <CheckCircle2 className="w-10 h-10 text-emerald-600 dark:text-emerald-400" />
                                    </div>
                                    <h2 className="text-2xl font-bold text-foreground mb-2">Securely Paid!</h2>
                                    <p className="text-sm text-muted-foreground">Redirecting you to your booking console.</p>
                                </div>
                            ) : (
                                <>
                                    <div className="flex justify-between items-start mb-8">
                                        <div>
                                            <h2 className="text-2xl font-bold tracking-tight text-foreground">Checkout</h2>
                                            <p className="text-xs text-muted-foreground mt-1 font-medium uppercase tracking-widest">Order #{booking.booking_number}</p>
                                        </div>
                                        <div className="w-12 h-12 bg-muted rounded-2xl flex items-center justify-center text-primary">
                                            <Zap className="w-6 h-6" />
                                        </div>
                                    </div>

                                    <div className="space-y-6">
                                        {/* Order Details */}
                                        <div className="bg-muted/30 rounded-3xl p-6 border border-border/50">
                                            <div className="space-y-4">
                                                <div className="flex justify-between items-center text-sm font-medium">
                                                    <span className="text-muted-foreground">Service Amount</span>
                                                    <span className="text-foreground">KES {amount.toLocaleString()}</span>
                                                </div>
                                                <div className="flex justify-between items-center text-sm font-medium">
                                                    <div className="flex items-center gap-1.5">
                                                        <span className="text-muted-foreground">Platform Fee</span>
                                                        <div className="group relative">
                                                            <div className="w-3.5 h-3.5 rounded-full border border-muted-foreground/30 flex items-center justify-center text-[8px] cursor-help">?</div>
                                                            <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-40 p-2 bg-foreground text-background text-[9px] rounded-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-20">
                                                                10% fee for platform maintenance and secure escrow service.
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <span className="text-foreground">KES {platformFee.toLocaleString()}</span>
                                                </div>
                                                <div className="pt-4 border-t border-border flex justify-between items-end">
                                                    <span className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Total to Pay</span>
                                                    <span className="text-3xl font-bold text-foreground tabular-nums">KES {total.toLocaleString()}</span>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Trust Badges */}
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
                                            onClick={handlePayment}
                                            disabled={isInitializing || paymentStep === 'processing'}
                                            className="w-full h-14 bg-foreground text-background hover:bg-muted hover:text-foreground rounded-2xl font-bold text-xs uppercase tracking-[0.2em] shadow-xl shadow-foreground/10 transition-all active:scale-95"
                                        >
                                            {isInitializing || paymentStep === 'processing' ? (
                                                <Loader2 className="w-5 h-5 animate-spin" />
                                            ) : (
                                                'Initialize Secure Payment'
                                            )}
                                        </Button>
                                        
                                        <p className="text-[9px] text-center text-muted-foreground font-medium leading-relaxed px-4">
                                            By clicking above, you agree to Kuba's Terms of Service and secure payment processing via Paystack.
                                        </p>
                                    </div>
                                </>
                            )}
                        </div>
                    </div>
            </DialogContent>
        </Dialog>
    );
}

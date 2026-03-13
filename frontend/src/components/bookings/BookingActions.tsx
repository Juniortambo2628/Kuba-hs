"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Loader2, MessageSquare, CreditCard, DownloadCloud } from "lucide-react";
import { usePaystackPayment } from "react-paystack";
import axiosInstance from "@/lib/axios";
import { toast } from "sonner";

interface BookingActionsProps {
    booking: any;
    userEmail: string;
    onRefresh: () => void;
    onMessage: (id: number) => void;
    isStartingChat: boolean;
}

export default function BookingActions({ booking, userEmail, onRefresh, onMessage, isStartingChat }: BookingActionsProps) {
    const [isProcessingPayment, setIsProcessingPayment] = useState(false);

    // Paystack configuration
    const paystackConfig = {
        publicKey: process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY || "pk_test_dummy",
        reference: "", // Will be set during handlePayment
        email: userEmail || "",
        amount: 0, // Will be set during handlePayment
    };

    const initializePayment = usePaystackPayment(paystackConfig);

    const handlePayment = async () => {
        setIsProcessingPayment(true);
        try {
            const initRes = await axiosInstance.post("/api/payments/paystack/initialize", {
                booking_id: booking.id
            });
            
            const { reference, amount } = initRes.data;

            initializePayment({
                config: {
                    ...paystackConfig,
                    reference: reference,
                    email: userEmail || "",
                    amount: Math.round(amount * 100),
                },
                onSuccess: async (referenceData: any) => {
                    try {
                        await axiosInstance.post("/api/payments/paystack/verify", {
                            reference: referenceData.reference
                        });
                        toast.success("Payment successful!");
                        onRefresh();
                    } catch (verifyErr: any) {
                        toast.error(verifyErr.response?.data?.message || "Payment verification failed.");
                    } finally {
                        setIsProcessingPayment(false);
                    }
                },
                onClose: () => {
                    toast.info("Payment cancelled");
                    setIsProcessingPayment(false);
                }
            });
            
        } catch (err: any) {
            console.error("Payment init error:", err);
            toast.error(err.response?.data?.message || "Failed to initialize payment");
            setIsProcessingPayment(false);
        }
    };

    const handleDownloadInvoice = async () => {
        try {
            const response = await axiosInstance.get(`/api/invoices/${booking.id}/download`, {
                responseType: 'blob',
            });
            
            if (typeof window !== 'undefined') {
                const url = window.URL.createObjectURL(new Blob([response.data]));
                const link = document.createElement('a');
                link.href = url;
                link.setAttribute('download', `invoice-${booking.id}.pdf`);
                document.body.appendChild(link);
                link.click();
                window.URL.revokeObjectURL(url);
                link.remove();
                toast.success("Invoice downloaded successfully");
            }
        } catch (err) {
            console.error("Failed to download invoice:", err);
            toast.error("Failed to download invoice");
        }
    };

    return (
        <div className="flex items-center justify-end gap-2">
            <Button 
               variant="ghost" 
               onClick={() => onMessage(booking.id)}
               disabled={isStartingChat || isProcessingPayment}
               className="text-sky-600 hover:text-sky-700 hover:bg-sky-50 h-8 rounded-lg px-3 flex items-center gap-1.5 transition-colors"
            >
               {isStartingChat ? <Loader2 className="w-4 h-4 animate-spin" /> : <MessageSquare className="w-4 h-4" />}
               <span className="text-[10px] font-bold uppercase tracking-widest hidden md:inline">Message</span>
            </Button>

            {booking.status === 'confirmed' && booking.payment_status !== 'paid' && (
                <Button 
                   onClick={handlePayment}
                   disabled={isProcessingPayment}
                   className="bg-emerald-600 hover:bg-emerald-700 text-white h-8 rounded-lg px-4 flex items-center gap-1.5 shadow-md shadow-emerald-500/20 transition-all font-black uppercase text-[10px] tracking-widest"
                >
                   {isProcessingPayment ? <Loader2 className="w-4 h-4 animate-spin" /> : <CreditCard className="w-4 h-4" />}
                   Pay Now
                </Button>
            )}

            {booking.payment_status === 'paid' && (
                <Button 
                   variant="ghost" 
                   onClick={handleDownloadInvoice}
                   className="text-gray-500 hover:text-[#1E293B] hover:bg-gray-100 h-8 rounded-lg px-3 flex items-center gap-1.5 transition-colors ml-1"
                >
                   <DownloadCloud className="w-4 h-4" />
                   <span className="text-[10px] font-bold uppercase tracking-widest hidden md:inline">Invoice</span>
                </Button>
            )}
        </div>
    );
}

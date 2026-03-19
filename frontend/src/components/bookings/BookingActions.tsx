"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Loader2, MessageSquare, CreditCard, DownloadCloud } from "lucide-react";
import axiosInstance from "@/lib/axios";
import { toast } from "sonner";
import { CheckoutDialog } from "@/components/payment/CheckoutDialog";
import { WriteReviewDialog } from "@/components/reviews/WriteReviewDialog";
import { Star } from "lucide-react";

interface BookingActionsProps {
    booking: any;
    userEmail: string;
    onRefresh: () => void;
    onMessage: (id: number) => void;
    isStartingChat: boolean;
}

export default function BookingActions({ booking, userEmail, onRefresh, onMessage, isStartingChat }: BookingActionsProps) {
    const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
    const [isReviewOpen, setIsReviewOpen] = useState(false);

    const handlePayment = () => {
        setIsCheckoutOpen(true);
    };

    const handleReview = () => {
        setIsReviewOpen(true);
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
               disabled={isStartingChat || isCheckoutOpen}
               className="text-sky-600 hover:text-sky-700 hover:bg-sky-50 h-8 rounded-lg px-3 flex items-center gap-1.5 transition-colors"
            >
               {isStartingChat ? <Loader2 className="w-4 h-4 animate-spin" /> : <MessageSquare className="w-4 h-4" />}
               <span className="text-[10px] font-bold tracking-widest hidden md:inline">Message</span>
            </Button>

            {booking.status === 'confirmed' && booking.payment_status !== 'paid' && (
                <Button 
                   onClick={handlePayment}
                   className="bg-emerald-600 hover:bg-emerald-700 text-white h-8 rounded-lg px-4 flex items-center gap-1.5 shadow-md shadow-emerald-500/20 transition-all font-black text-[10px] tracking-widest"
                >
                   <CreditCard className="w-4 h-4" />
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
                   <span className="text-[10px] font-bold tracking-widest hidden md:inline">Invoice</span>
                </Button>
            )}

            {booking.status === 'completed' && !booking.review && (
                <Button 
                   onClick={handleReview}
                   className="bg-primary hover:bg-primary/90 text-white h-8 rounded-lg px-4 flex items-center gap-1.5 shadow-md shadow-primary/20 transition-all font-black text-[10px] tracking-widest"
                >
                   <Star className="w-4 h-4 fill-white" />
                   Rate Service
                </Button>
            )}

            <CheckoutDialog 
                isOpen={isCheckoutOpen}
                onClose={() => setIsCheckoutOpen(false)}
                booking={booking}
                userEmail={userEmail}
                onSuccess={onRefresh}
            />

            <WriteReviewDialog 
                isOpen={isReviewOpen}
                onClose={() => setIsReviewOpen(false)}
                booking={booking}
                onSuccess={onRefresh}
            />
        </div>
    );
}

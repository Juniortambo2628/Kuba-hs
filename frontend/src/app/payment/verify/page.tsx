"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { CheckCircle2, Loader2, XCircle } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import axiosInstance from "@/lib/axios";

import { Suspense } from "react";

function VerifyContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const reference = searchParams.get('reference');
  
  const [status, setStatus] = useState<'verifying' | 'success' | 'failed'>('verifying');
  const [message, setMessage] = useState('Verifying your payment...');

  useEffect(() => {
    if (reference) {
      verifyPayment(reference);
    } else {
      setStatus('failed');
      setMessage('No payment reference found.');
    }
  }, [reference]);

  const verifyPayment = async (ref: string) => {
    try {
      await axiosInstance.post("/api/payments/paystack/verify", { reference: ref });
      setStatus('success');
      setMessage('Payment successful! Your booking is now confirmed and paid.');
      
      // Auto redirect after success
      setTimeout(() => {
        router.push('/dashboard/client/bookings');
      }, 3000);
      
    } catch (error: any) {
      console.error('Payment verification failed:', error);
      setStatus('failed');
      setMessage(error.response?.data?.message || 'Payment verification failed. Please contact support if you were charged.');
    }
  };

  return (
    <Card className="max-w-md w-full rounded-[2.5rem] border-border shadow-2xl relative overflow-hidden bg-white dark:bg-[#0B0F19]">
      {status === 'verifying' && (
         <div className="absolute top-0 left-0 right-0 h-1 bg-muted">
           <div className="h-full bg-primary w-2/3 animate-pulse"></div>
         </div>
      )}
      <CardContent className="p-10 text-center flex flex-col items-center">
        
        {status === 'verifying' && (
          <>
            <div className="w-20 h-20 bg-muted/50 rounded-full flex items-center justify-center mb-6 text-muted-foreground border border-border">
              <Loader2 className="w-10 h-10 animate-spin" />
            </div>
            <h2 className="text-2xl font-bold text-foreground mb-2 tracking-tight">Processing Payment</h2>
            <p className="text-muted-foreground text-sm">{message}</p>
          </>
        )}

        {status === 'success' && (
          <>
            <div className="w-20 h-20 bg-emerald-100 dark:bg-emerald-500/20 rounded-full flex items-center justify-center mb-6 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-500/30">
              <CheckCircle2 className="w-10 h-10" />
            </div>
            <h2 className="text-2xl font-bold text-foreground mb-2 tracking-tight">Payment Complete!</h2>
            <p className="text-muted-foreground text-sm mb-8">{message}</p>
            
            <div className="w-full space-y-3">
              <Button asChild className="w-full bg-foreground text-background hover:bg-muted hover:text-foreground h-12 rounded-xl font-bold tracking-widest text-[10px] shadow-xl">
                <Link href="/dashboard/client/bookings">View Bookings</Link>
              </Button>
              <p className="text-[10px] text-muted-foreground font-bold tracking-widest mt-4">Redirecting shortly...</p>
            </div>
          </>
        )}

        {status === 'failed' && (
          <>
            <div className="w-20 h-20 bg-red-100 dark:bg-red-500/20 rounded-full flex items-center justify-center mb-6 text-red-600 dark:text-red-400 border border-red-200 dark:border-red-500/30">
              <XCircle className="w-10 h-10" />
            </div>
            <h2 className="text-2xl font-bold text-foreground mb-2 tracking-tight">Payment Failed</h2>
            <p className="text-muted-foreground text-sm mb-8">{message}</p>
            
            <Button asChild variant="outline" className="w-full h-12 rounded-xl font-bold tracking-widest text-[10px] border-border text-foreground hover:bg-muted">
              <Link href="/dashboard/client/bookings">Return to Dashboard</Link>
            </Button>
          </>
        )}

      </CardContent>
    </Card>
  );
}

export default function PaystackVerifyPage() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Suspense fallback={
        <Card className="max-w-md w-full rounded-[2.5rem] border-border shadow-2xl relative overflow-hidden bg-white dark:bg-[#0B0F19]">
          <CardContent className="p-10 text-center flex flex-col items-center">
            <div className="w-20 h-20 bg-muted/50 rounded-full flex items-center justify-center mb-6 text-muted-foreground border border-border">
              <Loader2 className="w-10 h-10 animate-spin" />
            </div>
            <h2 className="text-2xl font-bold text-foreground mb-2 tracking-tight">Initializing</h2>
            <p className="text-muted-foreground text-sm">Synchronizing with payment gateway...</p>
          </CardContent>
        </Card>
      }>
        <VerifyContent />
      </Suspense>
    </div>
  );
}

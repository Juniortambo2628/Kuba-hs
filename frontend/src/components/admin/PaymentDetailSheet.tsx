"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import axiosInstance from "@/lib/axios";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { PaymentTransactionBadge } from "@/components/shared/PaymentTransactionBadge";
import { normalizeApiResponse } from "@/lib/api-response";
import { Calendar, CreditCard, ExternalLink, User, Briefcase } from "lucide-react";

export interface PaymentDetail {
  id: string;
  booking_id?: string;
  transaction_id?: string;
  amount: number;
  platform_fee?: number;
  provider_amount?: number;
  status: string;
  payment_method?: string;
  payment_gateway?: string;
  created_at: string;
  booking_number?: string;
  service_name?: string;
  customer?: { name?: string; email?: string; phone?: string };
  provider?: { business_name?: string; user?: { name?: string; email?: string } };
  booking?: { id?: string; booking_number?: string; status?: string };
}

const formatKES = (val: number | string) => `KES ${Number(val || 0).toLocaleString()}`;

interface PaymentDetailSheetProps {
  paymentId: string | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function PaymentDetailSheet({ paymentId, open, onOpenChange }: PaymentDetailSheetProps) {
  const [payment, setPayment] = useState<PaymentDetail | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!open || !paymentId) {
      setPayment(null);
      return;
    }

    let cancelled = false;
    setIsLoading(true);

    axiosInstance
      .get(`/api/admin/payments/${paymentId}`)
      .then((res) => {
        if (cancelled) return;
        const data = normalizeApiResponse<PaymentDetail>(res.data);
        setPayment(data);
      })
      .catch(() => {
        if (!cancelled) setPayment(null);
      })
      .finally(() => {
        if (!cancelled) setIsLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [open, paymentId]);

  const bookingId = payment?.booking?.id || payment?.booking_id;

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full sm:max-w-md border-l border-border flex flex-col">
        <SheetHeader className="border-b border-border pb-4">
          <SheetTitle className="text-lg font-black tracking-tight">Transaction Detail</SheetTitle>
          <SheetDescription className="font-mono text-xs">
            {payment?.transaction_id || (paymentId ? `ID ${paymentId.slice(0, 8)}…` : "")}
          </SheetDescription>
        </SheetHeader>

        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {isLoading ? (
            <div className="space-y-4">
              <Skeleton className="h-24 w-full rounded-xl" />
              <Skeleton className="h-32 w-full rounded-xl" />
            </div>
          ) : payment ? (
            <>
              <div className="flex items-center justify-between">
                <PaymentTransactionBadge status={payment.status} />
                <span className="text-[10px] font-bold text-muted-foreground flex items-center gap-1">
                  <Calendar className="w-3 h-3" />
                  {new Date(payment.created_at).toLocaleString()}
                </span>
              </div>

              <div className="bg-muted/40 rounded-2xl p-5 space-y-3 border border-border">
                <div className="flex justify-between items-center">
                  <span className="text-xs font-bold text-muted-foreground">Gross Amount</span>
                  <span className="text-xl font-black">{formatKES(payment.amount)}</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-muted-foreground">Platform fee</span>
                  <span className="font-bold">{formatKES(payment.platform_fee ?? 0)}</span>
                </div>
                <div className="flex justify-between items-center text-sm border-t border-border pt-2">
                  <span className="text-muted-foreground">Provider share</span>
                  <span className="font-bold text-emerald-600">
                    {formatKES(payment.provider_amount ?? 0)}
                  </span>
                </div>
              </div>

              <div className="space-y-3">
                <h4 className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">
                  Payment channel
                </h4>
                <div className="flex items-center gap-2 text-sm font-bold capitalize">
                  <CreditCard className="w-4 h-4 text-primary" />
                  {payment.payment_method?.replace(/_/g, " ") || "—"}
                  {payment.payment_gateway && (
                    <span className="text-muted-foreground font-medium">
                      via {payment.payment_gateway}
                    </span>
                  )}
                </div>
              </div>

              <div className="space-y-3">
                <h4 className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">
                  Participants
                </h4>
                <div className="space-y-2 text-sm">
                  <div className="flex items-start gap-2">
                    <User className="w-4 h-4 text-muted-foreground mt-0.5" />
                    <div>
                      <p className="font-bold">{payment.customer?.name || "Client"}</p>
                      <p className="text-xs text-muted-foreground">{payment.customer?.email}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <Briefcase className="w-4 h-4 text-muted-foreground mt-0.5" />
                    <div>
                      <p className="font-bold">{payment.provider?.business_name || "Provider"}</p>
                      <p className="text-xs text-muted-foreground">
                        {payment.provider?.user?.name}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {(payment.service_name || payment.booking_number) && (
                <div className="space-y-2">
                  <h4 className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">
                    Booking
                  </h4>
                  <p className="text-sm font-bold">{payment.service_name || "Service"}</p>
                  <p className="text-xs font-mono text-muted-foreground">
                    #{payment.booking_number || payment.booking?.booking_number}
                  </p>
                  {payment.booking?.status && (
                    <p className="text-xs capitalize text-muted-foreground">
                      Status: {payment.booking.status}
                    </p>
                  )}
                </div>
              )}
            </>
          ) : (
            <p className="text-sm text-muted-foreground font-medium">Could not load payment details.</p>
          )}
        </div>

        {payment && bookingId && (
          <div className="p-6 border-t border-border">
            <Button asChild className="w-full rounded-xl font-bold gap-2">
              <Link href={`/admin/bookings/${bookingId}`}>
                <ExternalLink className="w-4 h-4" />
                Open booking
              </Link>
            </Button>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
}

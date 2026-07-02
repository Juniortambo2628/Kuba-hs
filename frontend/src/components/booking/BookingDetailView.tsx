"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import axiosInstance from "@/lib/axios";
import { useBookingDetail } from "@/hooks/useBookingDetail";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/shared/StatusBadge";
import {
  Clock,
  MapPin,
  User,
  CheckCircle2,
  MessageSquare,
  XCircle,
  FileText,
  ArrowLeft,
  Loader2,
  Zap,
} from "lucide-react";
import { format } from "date-fns";
import { ChatUI } from "@/components/chat/ChatUI";
import { ServiceProgress } from "@/components/booking/ServiceProgress";
import { LiveServiceTimer } from "@/components/booking/LiveServiceTimer";
import { toast } from "sonner";
import { Booking } from "@/types";
import { DashboardPageContainer } from "@/components/shared/DashboardPageContainer";

export type BookingDetailRole = "client" | "provider";

interface BookingDetailViewProps {
  bookingId: string;
  role: BookingDetailRole;
  backHref: string;
  backLabel?: string;
}

export function BookingDetailView({
  bookingId,
  role,
  backHref,
  backLabel = "Back to Bookings",
}: BookingDetailViewProps) {
  const router = useRouter();
  const [showChat, setShowChat] = useState(false);

  const { booking, isLoading, refresh } = useBookingDetail(bookingId);

  const handleStatusUpdate = async (status: string, cancellationReason?: string) => {
    if (!booking) return;
    try {
      await axiosInstance.patch(`/api/bookings/${booking.id}/status`, {
        status,
        ...(cancellationReason ? { cancellation_reason: cancellationReason } : {}),
      });
      toast.success(`Booking ${status.replace("_", " ")}`);
      refresh();
    } catch {
      toast.error("Failed to update status");
    }
  };

  const partyLabel = role === "client" ? "Professional" : "Customer";
  const partyName =
    role === "client"
      ? booking?.provider?.business_name ||
        booking?.provider?.user?.first_name ||
        "Assigned Pro"
      : booking?.customer
        ? `${booking.customer.first_name ?? ""} ${booking.customer.last_name ?? ""}`.trim() ||
          booking.customer.name
        : "Customer";

  const instructionsLabel =
    role === "client" ? "Your Instructions" : "Specific Requirements";
  const chatTitle = role === "client" ? "Secure Chat" : "Booking Chat";
  const messageLabel = role === "client" ? "Message Pro" : "Message Customer";

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!booking) {
    return (
      <div className="max-w-4xl mx-auto py-8 px-4 text-center text-muted-foreground">
        <p className="font-semibold">Booking not found.</p>
        <Button variant="link" onClick={() => router.push(backHref)} className="mt-4">
          {backLabel}
        </Button>
      </div>
    );
  }

  return (
    <DashboardPageContainer width="compact" className="py-8 px-4 sm:px-0">
      <Button
        variant="ghost"
        onClick={() => router.push(backHref)}
        className="mb-6 flex items-center gap-2 text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="w-4 h-4" /> {backLabel}
      </Button>

      <div className="bg-card overflow-hidden border border-border rounded-[2rem] shadow-premium transition-all duration-500">
        {showChat ? (
          <div className="p-4 sm:p-8 bg-card">
            <div className="flex items-center justify-between mb-4 px-4">
              <Button
                variant="ghost"
                onClick={() => setShowChat(false)}
                className="text-primary font-black uppercase tracking-widest text-[10px]"
              >
                ← Back to Details
              </Button>
              <h2 className="font-black text-foreground uppercase tracking-tighter">{chatTitle}</h2>
            </div>
            <div className="h-[600px] rounded-2xl overflow-hidden border border-border relative">
              <ChatUI bookingId={booking.id} />
            </div>
          </div>
        ) : (
          <>
            <div className="bg-slate-800 dark:bg-slate-900 p-8 sm:p-12 text-white relative overflow-hidden">
              <div className="absolute top-0 right-0 p-8 opacity-10">
                <FileText className="w-32 h-32" />
              </div>
              <div className="relative z-10 space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="space-y-1">
                    <p className="text-[10px] sm:text-xs font-black uppercase tracking-[0.3em] text-sky-400">
                      Booking Reference
                    </p>
                    <h2 className="text-3xl sm:text-4xl font-black italic tracking-tighter">
                      #{booking.booking_number}
                    </h2>
                  </div>
                  <StatusBadge
                    status={booking.status}
                    type="booking"
                    className="rounded-full px-6 py-2 text-[10px]"
                  />
                </div>

                <div className="pt-4">
                  <ServiceProgress status={booking.status} />
                </div>

                {(booking.status === "in_progress" || booking.status === "completed") && (
                  <div className="pt-8 w-full max-w-xl mx-auto">
                    <LiveServiceTimer
                      startedAt={booking.started_at ?? ""}
                      completedAt={booking.completed_at}
                      basePrice={Number(
                        (booking.service as { price?: number })?.price ?? booking.estimated_price
                      )}
                      pricingType={booking.service_type === "hourly" ? "hourly" : "fixed"}
                      status={booking.status}
                    />
                  </div>
                )}
              </div>
            </div>

            <div className="p-8 sm:p-12 space-y-8 bg-card">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                <div className="space-y-1.5 border border-border p-6 rounded-2xl bg-muted/30">
                  <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                    <Clock className="w-4 h-4 text-primary" /> Scheduled Time
                  </p>
                  <p className="font-black text-lg text-foreground mt-2">
                    {booking.scheduled_date
                      ? format(new Date(booking.scheduled_date), "PPP")
                      : "TBD"}
                    {booking.scheduled_time && (
                      <span className="block text-sm text-primary uppercase tracking-widest mt-1">
                        {booking.scheduled_time}
                      </span>
                    )}
                  </p>
                </div>
                <div className="space-y-1.5 border border-border p-6 rounded-2xl bg-muted/30">
                  <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                    <User className="w-4 h-4 text-primary" /> {partyLabel}
                  </p>
                  <p className="font-black text-lg text-foreground mt-2">{partyName}</p>
                </div>
              </div>

              <div className="space-y-1.5 border border-border p-6 rounded-2xl">
                <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground flex items-center gap-2 mb-2">
                  <MapPin className="w-4 h-4 text-destructive" /> Service Location
                </p>
                <p className="font-bold text-base text-foreground leading-relaxed">
                  {booking.address
                    ? `${booking.address.street_address}, ${booking.address.city}`
                    : "On-site Service"}
                </p>
              </div>

              <div className="p-6 sm:p-8 bg-muted/30 rounded-2xl space-y-6 border border-border shadow-inner">
                <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest text-muted-foreground border-b border-border pb-4">
                  <span>Service Item</span>
                  <span>{role === "client" ? "Estimated Cost" : "Cost Breakdown"}</span>
                </div>
                <div className="flex justify-between items-center">
                  <p className="font-black text-lg text-foreground">{booking.service?.name}</p>
                  <p className="font-black text-2xl text-primary italic tracking-tighter">
                    KES {booking.final_price || booking.estimated_price || "0.00"}
                  </p>
                </div>
              </div>

              {booking.description && (
                <div className="space-y-2">
                  <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">
                    {instructionsLabel}
                  </p>
                  <p className="text-sm font-bold text-muted-foreground italic leading-relaxed bg-muted/30 p-6 rounded-2xl border border-border">
                    &ldquo;{booking.description}&rdquo;
                  </p>
                </div>
              )}

              <div className="flex flex-col sm:flex-row items-center gap-4 pt-6 border-t border-border">
                {role === "client" && booking.status === "pending" && (
                  <Button
                    onClick={() => handleStatusUpdate("cancelled")}
                    variant="outline"
                    className="w-full sm:flex-1 h-14 border-destructive/30 text-destructive hover:bg-destructive/10 rounded-2xl font-black text-[10px] sm:text-xs uppercase tracking-widest gap-2"
                  >
                    <XCircle className="w-4 h-4" />
                    Cancel Request
                  </Button>
                )}

                {role === "provider" && booking.status === "pending" && (
                  <Button
                    onClick={() => handleStatusUpdate("confirmed")}
                    className="w-full sm:flex-1 h-14 bg-emerald-600 hover:bg-emerald-700 text-white rounded-2xl font-black text-[10px] sm:text-xs uppercase tracking-widest gap-2"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    Accept Request
                  </Button>
                )}
                {role === "provider" && booking.status === "confirmed" && (
                  <Button
                    onClick={() => handleStatusUpdate("in_progress")}
                    className="w-full sm:flex-1 h-14 bg-primary hover:bg-primary/90 text-primary-foreground rounded-2xl font-black text-[10px] sm:text-xs uppercase tracking-widest gap-2"
                  >
                    <Zap className="w-4 h-4 fill-current" />
                    Commence Service
                  </Button>
                )}
                {role === "provider" && booking.status === "in_progress" && (
                  <Button
                    onClick={() => handleStatusUpdate("completed")}
                    className="w-full sm:flex-1 h-14 bg-emerald-600 hover:bg-emerald-700 text-white rounded-2xl font-black text-[10px] sm:text-xs uppercase tracking-widest gap-2"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    Complete Service
                  </Button>
                )}

                <Button
                  onClick={() => setShowChat(true)}
                  className="w-full sm:flex-[2] h-14 bg-slate-800 dark:bg-primary hover:bg-primary text-white rounded-2xl font-black text-[10px] sm:text-xs uppercase tracking-widest shadow-lg gap-2"
                >
                  <MessageSquare className="w-4 h-4" />
                  {messageLabel}
                </Button>
              </div>
            </div>
          </>
        )}
      </div>
    </DashboardPageContainer>
  );
}

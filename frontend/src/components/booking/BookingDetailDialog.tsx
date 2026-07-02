"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/shared/StatusBadge";
import {
  Clock,
  MapPin,
  User,
  MessageSquare,
  XCircle,
  FileText,
  ArrowLeft,
  CheckCircle2,
  Zap,
  CreditCard,
  Star,
  DownloadCloud,
} from "lucide-react";
import axiosInstance from "@/lib/axios";
import { toast } from "sonner";
import { CheckoutDialog } from "@/components/payment/CheckoutDialog";
import { WriteReviewDialog } from "@/components/reviews/WriteReviewDialog";
import { format } from "date-fns";
import { useState } from "react";
import { ChatUI } from "@/components/chat/ChatUI";
import { BookingStatusProgress } from "@/components/bookings/BookingStatusProgress";
import { AppConfirmDialog } from "@/components/shared/dialog/AppConfirmDialog";
import { LiveServiceTimer } from "@/components/booking/LiveServiceTimer";
import { crudDialogUi } from "@/lib/crud-dialog-ui";
import { cn } from "@/lib/utils";
import type { Booking } from "@/types";

export type BookingDetailRole = "client" | "provider";

interface BookingDetailDialogProps {
  isOpen: boolean;
  onClose: () => void;
  booking: Booking | null;
  role?: BookingDetailRole;
  onUpdateStatus?: (status: string) => void | Promise<void>;
  isUpdating?: boolean;
  /** Required for client checkout in the dialog */
  userEmail?: string;
  onRefresh?: () => void | Promise<void>;
}

export function BookingDetailDialog({
  isOpen,
  onClose,
  booking,
  role = "client",
  onUpdateStatus,
  isUpdating = false,
  userEmail = "",
  onRefresh,
}: BookingDetailDialogProps) {
  const [showChat, setShowChat] = useState(false);
  const [cancelOpen, setCancelOpen] = useState(false);
  const [acceptOpen, setAcceptOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [isReviewOpen, setIsReviewOpen] = useState(false);

  if (!booking) return null;

  const isProvider = role === "provider";

  const handleClose = () => {
    setShowChat(false);
    onClose();
  };

  const partyLabel = isProvider ? "Client" : "Provider";
  const partyName = isProvider
    ? booking.customer?.name ||
      [booking.customer?.first_name, booking.customer?.last_name].filter(Boolean).join(" ") ||
      "Client"
    : booking.provider?.business_name ||
      booking.provider?.user?.name ||
      "Assigned pro";

  const introSubtitle = isProvider
    ? `${booking.service?.name ?? "Service"} for ${partyName}`
    : `${booking.service?.name ?? "Service"} with ${partyName}`;

  const notesLabel = isProvider ? "Client requirements" : "Your notes";
  const messageLabel = isProvider ? "Message client" : "Message provider";

  const price = booking.final_price ?? booking.estimated_price ?? 0;

  const runStatus = (status: string) => {
    void onUpdateStatus?.(status);
  };

  const needsPayment =
    !isProvider &&
    booking.payment_status !== "paid" &&
    (booking.status === "confirmed" || booking.status === "completed");

  const handleDownloadInvoice = async () => {
    try {
      const response = await axiosInstance.get(`/api/invoices/${booking.id}/download`, {
        responseType: "blob",
      });
      if (typeof window !== "undefined") {
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", `invoice-${booking.id}.pdf`);
        document.body.appendChild(link);
        link.click();
        window.URL.revokeObjectURL(url);
        link.remove();
        toast.success("Invoice downloaded");
      }
    } catch {
      toast.error("Failed to download invoice");
    }
  };

  return (
    <>
      <Dialog open={isOpen} onOpenChange={handleClose}>
        <DialogContent
          className={cn(
            crudDialogUi.content,
            "max-w-4xl p-0 gap-0 [&>button.absolute]:hidden",
            showChat && "max-w-3xl"
          )}
        >
          <DialogTitle className="sr-only">
            Booking {booking.booking_number}
          </DialogTitle>
          <DialogDescription className="sr-only">
            Track and manage booking {booking.booking_number}
          </DialogDescription>

          {showChat ? (
            <div className="flex flex-col min-h-[400px] max-h-[85dvh] bg-card">
              <div className="flex items-center justify-between px-5 py-4 border-b border-border/50">
                <Button
                  variant="ghost"
                  size="sm"
                  className="rounded-full"
                  onClick={() => setShowChat(false)}
                >
                  <ArrowLeft className="h-4 w-4 mr-1" />
                  Back to booking
                </Button>
                <p className="text-sm font-semibold text-foreground">{messageLabel}</p>
                <span className="w-20" />
              </div>
              <div className="flex-1 min-h-0 p-4">
                <ChatUI bookingId={booking.id} />
              </div>
            </div>
          ) : (
            <div className={cn(crudDialogUi.layout, "bg-card")}>
              <aside className={crudDialogUi.intro}>
                <div>
                  <p className="text-xs font-semibold text-primary uppercase tracking-wide mb-2">
                    Booking reference
                  </p>
                  <h2 className={crudDialogUi.introTitle}>#{booking.booking_number}</h2>
                  <p className={crudDialogUi.introDesc}>{introSubtitle}</p>
                </div>
                <div className="mt-6">
                  <StatusBadge status={booking.status} type="booking" />
                </div>
                <BookingStatusProgress
                  status={booking.status}
                  paymentStatus={booking.payment_status}
                  compact
                  className="mt-8"
                />
              </aside>

              <div className={cn(crudDialogUi.main, "bg-card")}>
                <div className={cn(crudDialogUi.formWrap, "space-y-0")}>
                  <div className={cn(crudDialogUi.formCard, "space-y-6")}>
                    {isProvider &&
                      (booking.status === "in_progress" || booking.status === "completed") && (
                        <LiveServiceTimer
                          startedAt={booking.started_at ?? ""}
                          completedAt={booking.completed_at}
                          basePrice={Number(booking.estimated_price ?? 0)}
                          pricingType={
                            (booking.service as any)?.pricing_type === "hourly" ? "hourly" : "fixed"
                          }
                          status={booking.status}
                        />
                      )}

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                      <div className="space-y-1">
                        <p className="text-xs font-medium text-muted-foreground flex items-center gap-1.5">
                          <Clock className="h-3.5 w-3.5" />
                          Scheduled
                        </p>
                        <p className="text-sm font-semibold text-foreground">
                          {booking.scheduled_date
                            ? format(new Date(booking.scheduled_date), "PPP")
                            : "TBD"}
                        </p>
                        {booking.scheduled_time && (
                          <p className="text-xs text-muted-foreground">{booking.scheduled_time}</p>
                        )}
                      </div>
                      <div className="space-y-1">
                        <p className="text-xs font-medium text-muted-foreground flex items-center gap-1.5">
                          <User className="h-3.5 w-3.5" />
                          {partyLabel}
                        </p>
                        <p className="text-sm font-semibold text-foreground">{partyName}</p>
                      </div>
                    </div>

                    <div className="space-y-1">
                      <p className="text-xs font-medium text-muted-foreground flex items-center gap-1.5">
                        <MapPin className="h-3.5 w-3.5" />
                        Location
                      </p>
                      <p className="text-sm text-foreground leading-relaxed">
                        {booking.address
                          ? `${booking.address.street_address}, ${booking.address.city}`
                          : "On-site service"}
                      </p>
                    </div>

                    <div className="rounded-xl border border-border/50 bg-muted/20 p-4 flex justify-between items-center gap-4">
                      <div>
                        <p className="text-xs font-medium text-muted-foreground">Service</p>
                        <p className="text-sm font-semibold text-foreground">
                          {booking.service?.name ?? "—"}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-xs font-medium text-muted-foreground">
                          {isProvider ? "Estimate" : "Estimate"}
                        </p>
                        <p className="text-lg font-bold text-foreground tabular-nums">
                          KES {Number(price).toLocaleString()}
                        </p>
                      </div>
                    </div>

                    {booking.description && (
                      <div className="space-y-1">
                        <p className="text-xs font-medium text-muted-foreground flex items-center gap-1.5">
                          <FileText className="h-3.5 w-3.5" />
                          {notesLabel}
                        </p>
                        <p className="text-sm text-foreground leading-relaxed rounded-xl bg-muted/30 p-3 border border-border/40">
                          {booking.description}
                        </p>
                      </div>
                    )}
                  </div>
                </div>

                <footer className={cn(crudDialogUi.footer, "flex-wrap gap-2 bg-card")}>
                  {!isProvider && booking.status === "pending" && onUpdateStatus && (
                    <Button
                      type="button"
                      variant="outline"
                      className={crudDialogUi.cancelBtn}
                      disabled={isUpdating}
                      onClick={() => setCancelOpen(true)}
                    >
                      <XCircle className="h-4 w-4 mr-1.5" />
                      Cancel
                    </Button>
                  )}

                  {isProvider && booking.status === "pending" && onUpdateStatus && (
                    <Button
                      type="button"
                      className={cn(crudDialogUi.submitBtn, "bg-emerald-600 hover:bg-emerald-700")}
                      disabled={isUpdating}
                      onClick={() => setAcceptOpen(true)}
                    >
                      {isUpdating ? (
                        "Updating…"
                      ) : (
                        <>
                          <CheckCircle2 className="h-4 w-4 mr-1.5" />
                          Accept job
                        </>
                      )}
                    </Button>
                  )}

                  {isProvider && booking.status === "confirmed" && onUpdateStatus && (
                    <Button
                      type="button"
                      className={crudDialogUi.submitBtn}
                      disabled={isUpdating}
                      onClick={() => runStatus("in_progress")}
                    >
                      <Zap className="h-4 w-4 mr-1.5" />
                      Start job
                    </Button>
                  )}

                  {isProvider && booking.status === "in_progress" && onUpdateStatus && (
                    <Button
                      type="button"
                      className={cn(crudDialogUi.submitBtn, "bg-emerald-600 hover:bg-emerald-700")}
                      disabled={isUpdating}
                      onClick={() => runStatus("completed")}
                    >
                      <CheckCircle2 className="h-4 w-4 mr-1.5" />
                      Mark complete
                    </Button>
                  )}

                  {!isProvider && needsPayment && (
                    <Button
                      type="button"
                      className={cn(crudDialogUi.submitBtn, "bg-amber-500 hover:bg-amber-600")}
                      onClick={() => setIsCheckoutOpen(true)}
                    >
                      <CreditCard className="h-4 w-4 mr-1.5" />
                      Pay now
                    </Button>
                  )}

                  {!isProvider && booking.payment_status === "paid" && (
                    <Button
                      type="button"
                      variant="outline"
                      className={crudDialogUi.cancelBtn}
                      onClick={() => void handleDownloadInvoice()}
                    >
                      <DownloadCloud className="h-4 w-4 mr-1.5" />
                      Invoice
                    </Button>
                  )}

                  {!isProvider && booking.status === "completed" && !booking.review && (
                    <Button
                      type="button"
                      className={crudDialogUi.submitBtn}
                      onClick={() => setIsReviewOpen(true)}
                    >
                      <Star className="h-4 w-4 mr-1.5 fill-current" />
                      Rate service
                    </Button>
                  )}

                  <Button
                    type="button"
                    variant={isProvider && booking.status !== "pending" ? "outline" : undefined}
                    className={cn(
                      !isProvider || booking.status === "pending"
                        ? crudDialogUi.submitBtn
                        : crudDialogUi.cancelBtn,
                      "flex-1 sm:flex-none sm:min-w-[9rem]"
                    )}
                    onClick={() => setShowChat(true)}
                  >
                    <MessageSquare className="h-4 w-4 mr-1.5" />
                    {messageLabel}
                  </Button>
                </footer>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {!isProvider && (
        <AppConfirmDialog
          open={cancelOpen}
          onOpenChange={setCancelOpen}
          title="Cancel this booking?"
          introDescription="The provider will be notified that you no longer need this visit."
          description="This action cannot be undone. You may need to book again if you change your mind."
          icon={XCircle}
          confirmLabel="Yes, cancel"
          cancelLabel="Keep booking"
          variant="destructive"
          onConfirm={() => {
            runStatus("cancelled");
            setCancelOpen(false);
          }}
        />
      )}

      {isProvider && onUpdateStatus && (
        <AppConfirmDialog
          open={acceptOpen}
          onOpenChange={setAcceptOpen}
          title="Accept this job?"
          introDescription="You will be committed to fulfill this booking for the client."
          description="The client will be notified immediately once you confirm."
          icon={CheckCircle2}
          confirmLabel="Accept job"
          isLoading={isUpdating}
          onConfirm={() => {
            runStatus("confirmed");
            setAcceptOpen(false);
          }}
        />
      )}

      {!isProvider && (
        <>
          <CheckoutDialog
            isOpen={isCheckoutOpen}
            onClose={() => setIsCheckoutOpen(false)}
            booking={booking}
            userEmail={userEmail}
            onSuccess={() => void onRefresh?.()}
          />
          <WriteReviewDialog
            isOpen={isReviewOpen}
            onClose={() => setIsReviewOpen(false)}
            booking={booking}
            onSuccess={() => void onRefresh?.()}
          />
        </>
      )}
    </>
  );
}

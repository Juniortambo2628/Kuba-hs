"use client";

import { useParams, useRouter } from "next/navigation";
import { useBookingDetail } from "@/hooks/useBookingDetail";
import { BookingDetailDialog } from "@/components/booking/BookingDetailDialog";
import axiosInstance, { handleApiError } from "@/lib/axios";
import { toast } from "sonner";
import { useState } from "react";
import { Loader2 } from "lucide-react";
import { DashboardPageContainer } from "@/components/shared/DashboardPageContainer";
import { workspaceUi } from "@/lib/dashboard-workspace-ui";
import { useAuth } from "@/contexts/AuthContext";

/** Deep link to a booking — opens the same management dialog as the list page. */
export default function ClientBookingDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { user } = useAuth();
  const bookingId = params.id as string;
  const [isUpdating, setIsUpdating] = useState(false);

  const { booking, isLoading, refresh } = useBookingDetail(bookingId);

  const handleUpdateStatus = async (status: string) => {
    if (!booking) return;
    setIsUpdating(true);
    try {
      const payload: { status: string; cancellation_reason?: string } = { status };
      if (status === "cancelled") {
        payload.cancellation_reason = "Cancelled by user";
      }
      await axiosInstance.patch(`/api/bookings/${booking.id}/status`, payload);
      toast.success(status === "cancelled" ? "Booking cancelled" : `Booking ${status}`);
      await refresh();
      if (status === "cancelled") {
        router.push("/dashboard/client/bookings");
      }
    } catch (err: unknown) {
      toast.error(handleApiError(err));
    } finally {
      setIsUpdating(false);
    }
  };

  if (isLoading) {
    return (
      <DashboardPageContainer width="default" className={workspaceUi.page}>
        <div className="flex h-64 items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </DashboardPageContainer>
    );
  }

  return (
    <BookingDetailDialog
      isOpen={Boolean(booking)}
      onClose={() => router.push("/dashboard/client/bookings")}
      booking={booking}
      role="client"
      isUpdating={isUpdating}
      userEmail={user?.email ?? ""}
      onRefresh={() => refresh()}
      onUpdateStatus={handleUpdateStatus}
    />
  );
}

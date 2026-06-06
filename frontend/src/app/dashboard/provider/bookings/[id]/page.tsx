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

/** Deep link to a booking — opens the same management dialog as the list page. */
export default function ProviderBookingDetailPage() {
  const params = useParams();
  const router = useRouter();
  const bookingId = params.id as string;
  const [isUpdating, setIsUpdating] = useState(false);

  const { booking, isLoading, refresh } = useBookingDetail(bookingId);

  const handleUpdateStatus = async (status: string) => {
    if (!booking) return;
    setIsUpdating(true);
    try {
      await axiosInstance.patch(`/api/bookings/${booking.id}/status`, { status });
      toast.success(`Booking updated`);
      await refresh();
      if (status === "completed") {
        router.push("/dashboard/provider/bookings");
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
      onClose={() => router.push("/dashboard/provider/bookings")}
      booking={booking}
      role="provider"
      isUpdating={isUpdating}
      onUpdateStatus={handleUpdateStatus}
    />
  );
}

"use client";

import { Suspense, useCallback, useState } from "react";
import useSWR from "swr";
import axiosInstance, { handleApiError } from "@/lib/axios";
import {
  DashboardDataCard,
  DashboardTableHead,
  DashboardTableHeaderRow,
} from "@/components/shared/DashboardTable";
import { Calendar, Loader2, Plus } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { DashboardListToolbar } from "@/components/shared/DashboardListToolbar";
import { BookingStatusBadge } from "@/components/shared/BookingStatusBadge";
import { BookingCard } from "@/components/shared/BookingCard";
import { DashboardEmptyState } from "@/components/shared/DashboardEmptyState";
import { DashboardPageContainer } from "@/components/shared/DashboardPageContainer";
import { DashboardSuspenseFallback } from "@/components/shared/DashboardSuspenseFallback";
import {
  DashboardGreetingBar,
  DashboardFrostedStatCard,
  DashboardFrostedStatGrid,
} from "@/components/dashboard/workspace";
import { workspaceUi } from "@/lib/dashboard-workspace-ui";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import { useSearchState } from "@/hooks/useSearchState";
import { Booking } from "@/types";
import { unwrapResourceList } from "@/lib/api-resource";
import { BookingDetailDialog } from "@/components/booking/BookingDetailDialog";
import { ProviderBookingActions } from "@/components/bookings/ProviderBookingActions";

function BookingsHistoryContent() {
  const router = useRouter();
  const { search, status, setStatus } = useSearchState();
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [isStartingChat, setIsStartingChat] = useState<string | null>(null);
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);

  const { data: bookingsData, isLoading, mutate } = useSWR(
    `/api/provider/bookings?search=${encodeURIComponent(search)}&status=${status}`,
    (url) => axiosInstance.get(url).then((res) => res.data)
  );

  const bookings = unwrapResourceList<Booking>(bookingsData);
  const activeCount = bookings.filter((b) =>
    ["pending", "confirmed", "in_progress"].includes(b.status)
  ).length;

  const openBooking = useCallback((booking: Booking) => {
    setSelectedBooking(booking);
    setIsDetailOpen(true);
  }, []);

  const handleMessageClient = async (bookingId: string) => {
    setIsStartingChat(bookingId);
    try {
      await axiosInstance.post(`/api/chat/bookings/${bookingId}/conversation`);
      router.push("/dashboard/provider/messages");
    } catch {
      toast.error("Failed to start conversation");
    } finally {
      setIsStartingChat(null);
    }
  };

  const handleUpdateStatus = async (bookingId: string, nextStatus: string) => {
    setIsUpdating(true);
    try {
      await axiosInstance.patch(`/api/bookings/${bookingId}/status`, { status: nextStatus });
      toast.success(
        nextStatus === "confirmed"
          ? "Job accepted"
          : nextStatus === "in_progress"
            ? "Job started"
            : nextStatus === "completed"
              ? "Job marked complete"
              : `Booking ${nextStatus}`
      );
      const fresh = await mutate();
      const list = unwrapResourceList<Booking>(fresh);
      const updated = list.find((b) => b.id === bookingId);
      if (updated) setSelectedBooking(updated);
      else if (selectedBooking?.id === bookingId) {
        setSelectedBooking({ ...selectedBooking, status: nextStatus });
      }
      if (nextStatus === "completed" || nextStatus === "cancelled") {
        setIsDetailOpen(false);
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
        <Skeleton className="h-10 w-64 rounded-xl" />
        <Skeleton className="h-80 w-full rounded-2xl" />
      </DashboardPageContainer>
    );
  }

  return (
    <DashboardPageContainer width="default" className={workspaceUi.page}>
      <DashboardGreetingBar
        greeting="Bookings"
        subtitle="Manage jobs from your clients. Use ⌘K in the header to search."
        actions={
          <Button asChild variant="outline" className="rounded-full">
            <Link href="/dashboard/provider">
              <Plus className="h-4 w-4 mr-2" />
              Dashboard
            </Link>
          </Button>
        }
      />

      <DashboardFrostedStatGrid columns={2}>
        <DashboardFrostedStatCard icon={Calendar} label="Total jobs" value={bookings.length} />
        <DashboardFrostedStatCard
          icon={Calendar}
          label="Active"
          value={activeCount}
          tone={activeCount > 0 ? "primary" : "neutral"}
        />
      </DashboardFrostedStatGrid>

      {search && (
        <p className="text-xs text-muted-foreground -mt-2">
          Results for &quot;{search}&quot;
        </p>
      )}

      <DashboardListToolbar
        viewMode={viewMode}
        onViewChange={setViewMode}
        filters={[
          {
            id: "status",
            label: "Status",
            value: status || "all",
            onChange: (val) => setStatus(val === "all" ? "" : val),
            options: [
              { label: "All Status", value: "all" },
              { label: "Pending", value: "pending" },
              { label: "Confirmed", value: "confirmed" },
              { label: "In progress", value: "in_progress" },
              { label: "Completed", value: "completed" },
              { label: "Cancelled", value: "cancelled" },
            ],
          },
        ]}
      />

      {viewMode === "list" ? (
        <DashboardDataCard>
          <Table>
            <TableHeader>
              <DashboardTableHeaderRow>
                <DashboardTableHead position="first" className="!pl-10">
                  Booking ref
                </DashboardTableHead>
                <DashboardTableHead>Service</DashboardTableHead>
                <DashboardTableHead>Client</DashboardTableHead>
                <DashboardTableHead>Date</DashboardTableHead>
                <DashboardTableHead>Status</DashboardTableHead>
                <DashboardTableHead position="last" className="!pr-10" />
              </DashboardTableHeaderRow>
            </TableHeader>
            <TableBody>
              {bookings.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="p-0">
                    <DashboardEmptyState
                      title="No bookings found"
                      className="min-h-[320px]"
                    />
                  </TableCell>
                </TableRow>
              ) : (
                bookings.map((booking) => (
                  <TableRow
                    key={booking.id}
                    className="hover:bg-muted/50 transition-colors border-border group cursor-pointer"
                    onClick={() => openBooking(booking)}
                  >
                    <TableCell className="pl-10 py-6">
                      <span className="text-sm font-medium text-foreground">
                        #{booking.booking_number || booking.id}
                      </span>
                    </TableCell>
                    <TableCell className="py-6">
                      <p className="font-medium text-foreground text-sm group-hover:text-primary">
                        {booking.service?.name}
                      </p>
                    </TableCell>
                    <TableCell className="py-6">
                      <p className="text-sm font-semibold text-foreground">
                        {booking.customer?.name}
                      </p>
                    </TableCell>
                    <TableCell className="py-6">
                      <p className="text-sm text-foreground">
                        {booking.scheduled_date
                          ? new Date(booking.scheduled_date).toLocaleDateString()
                          : "TBD"}
                      </p>
                    </TableCell>
                    <TableCell className="py-6">
                      <BookingStatusBadge status={booking.status} />
                    </TableCell>
                    <TableCell className="pr-10 py-6 text-right" onClick={(e) => e.stopPropagation()}>
                      <ProviderBookingActions
                        booking={booking}
                        onManage={() => openBooking(booking)}
                        onMessage={handleMessageClient}
                        onAccept={(id) => handleUpdateStatus(id, "confirmed")}
                        isStartingChat={isStartingChat === booking.id}
                        isUpdating={isUpdating}
                      />
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </DashboardDataCard>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {bookings.length === 0 ? (
            <DashboardEmptyState title="No bookings found" className="col-span-full h-48" />
          ) : (
            bookings.map((booking) => (
              <BookingCard
                key={booking.id}
                booking={booking}
                type="provider"
                onClick={() => openBooking(booking)}
                actions={
                  <ProviderBookingActions
                    booking={booking}
                    onManage={() => openBooking(booking)}
                    onMessage={handleMessageClient}
                    onAccept={(id) => handleUpdateStatus(id, "confirmed")}
                    isStartingChat={isStartingChat === booking.id}
                    isUpdating={isUpdating}
                  />
                }
              />
            ))
          )}
        </div>
      )}

      <BookingDetailDialog
        isOpen={isDetailOpen}
        onClose={() => setIsDetailOpen(false)}
        booking={selectedBooking}
        role="provider"
        isUpdating={isUpdating}
        onUpdateStatus={(nextStatus) =>
          selectedBooking && handleUpdateStatus(selectedBooking.id, nextStatus)
        }
      />
    </DashboardPageContainer>
  );
}

export default function BookingsHistory() {
  return (
    <Suspense fallback={<DashboardSuspenseFallback />}>
      <BookingsHistoryContent />
    </Suspense>
  );
}

"use client";

import { DashboardPageContainer } from "@/components/shared/DashboardPageContainer";
import { Suspense, useCallback, useState } from "react";
import useSWR from "swr";
import { useAuth } from "@/contexts/AuthContext";
import axiosInstance, { handleApiError } from "@/lib/axios";
import { Button } from "@/components/ui/button";
import {
  DashboardDataCard,
  DashboardTableHead,
  DashboardTableHeaderRow,
} from "@/components/shared/DashboardTable";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Calendar, Plus } from "lucide-react";
import {
  DashboardGreetingBar,
  DashboardFrostedStatCard,
  DashboardFrostedStatGrid,
} from "@/components/dashboard/workspace";
import { workspaceUi } from "@/lib/dashboard-workspace-ui";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { DashboardListToolbar } from "@/components/shared/DashboardListToolbar";
import { useSearchState } from "@/hooks/useSearchState";
import { DashboardSuspenseFallback } from "@/components/shared/DashboardSuspenseFallback";
import { BookingStatusBadge } from "@/components/shared/BookingStatusBadge";
import { BookingCard } from "@/components/shared/BookingCard";
import { DashboardEmptyState } from "@/components/shared/DashboardEmptyState";
import { BookingDetailDialog } from "@/components/booking/BookingDetailDialog";
import { ClientBookingActions } from "@/components/bookings/ClientBookingActions";
import { Booking } from "@/types";
import { unwrapResourceList } from "@/lib/api-resource";

function ClientBookingsContent() {
  const router = useRouter();
  const { user, isLoading: authLoading } = useAuth();
  const { search, status, setStatus } = useSearchState();
  const filterStatus = status;
  const [isStartingChat, setIsStartingChat] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);

  const { data: bookingsData, isLoading: isBookingsLoading, mutate: mutateBookings } = useSWR(
    user ? `/api/client/bookings?search=${encodeURIComponent(search)}&status=${filterStatus}` : null,
    (url) => axiosInstance.get(url).then((res) => res.data),
    { dedupingInterval: 500 }
  );

  const bookings = unwrapResourceList<Booking>(bookingsData);
  const isLoading = authLoading || isBookingsLoading;

  const openBooking = useCallback((booking: Booking) => {
    setSelectedBooking(booking);
    setIsDetailOpen(true);
  }, []);

  const handleMessageProvider = async (bookingId: string) => {
    setIsStartingChat(bookingId);
    try {
      await axiosInstance.post(`/api/chat/bookings/${bookingId}/conversation`);
      router.push("/dashboard/client/messages");
    } catch {
      toast.error("Failed to start conversation");
    } finally {
      setIsStartingChat(null);
    }
  };

  const handleUpdateStatus = async (bookingId: string, nextStatus: string) => {
    setIsUpdating(true);
    try {
      const payload: { status: string; cancellation_reason?: string } = { status: nextStatus };
      if (nextStatus === "cancelled") {
        payload.cancellation_reason = "Cancelled by user";
      }
      await axiosInstance.patch(`/api/bookings/${bookingId}/status`, payload);
      toast.success(nextStatus === "cancelled" ? "Booking cancelled" : `Booking ${nextStatus}`);
      const fresh = await mutateBookings();
      const list = unwrapResourceList<Booking>(fresh);
      const updated = list.find((b) => b.id === bookingId);
      if (updated) setSelectedBooking(updated);
      else if (selectedBooking?.id === bookingId) {
        setSelectedBooking({ ...selectedBooking, status: nextStatus });
      }
      if (nextStatus === "cancelled") {
        setIsDetailOpen(false);
      }
    } catch (err: unknown) {
      toast.error(handleApiError(err));
    } finally {
      setIsUpdating(false);
    }
  };

  const formatScheduledTime = (dateStr?: string | null) => {
    if (!dateStr) return "Time TBD";
    const d = new Date(dateStr);
    if (Number.isNaN(d.getTime())) return "Time TBD";
    return d.toLocaleTimeString(undefined, {
      hour: "numeric",
      minute: "2-digit",
    });
  };

  const formatScheduledDate = (dateStr?: string | null) => {
    if (!dateStr) return "Date TBD";
    const d = new Date(dateStr);
    if (Number.isNaN(d.getTime())) return "Date TBD";
    return d.toLocaleDateString(undefined, {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  const activeCount = bookings.filter((b: Booking) =>
    ["pending", "confirmed", "in_progress"].includes(b.status)
  ).length;

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
        greeting="My bookings"
        subtitle="Upcoming and past appointments. Use ⌘K in the header to search bookings."
        actions={
          <Button asChild className="rounded-full">
            <Link href="/services">
              <Plus className="h-4 w-4 mr-2" />
              Book a service
            </Link>
          </Button>
        }
      />

      <DashboardFrostedStatGrid columns={2}>
        <DashboardFrostedStatCard
          icon={Calendar}
          label="Total bookings"
          value={bookings.length}
        />
        <DashboardFrostedStatCard
          icon={Calendar}
          label="Active"
          value={activeCount}
          tone={activeCount > 0 ? "primary" : "neutral"}
        />
      </DashboardFrostedStatGrid>

      {search && (
        <p className="text-xs text-muted-foreground -mt-4 mb-2">
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
            value: filterStatus || "all",
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
                  Booking Ref
                </DashboardTableHead>
                <DashboardTableHead>Service Details</DashboardTableHead>
                <DashboardTableHead>Scheduled For</DashboardTableHead>
                <DashboardTableHead>Price Estimate</DashboardTableHead>
                <DashboardTableHead>Status</DashboardTableHead>
                <DashboardTableHead position="last" className="!pr-10 w-12" />
              </DashboardTableHeaderRow>
            </TableHeader>
            <TableBody>
              {bookings.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="p-0">
                    <DashboardEmptyState
                      title="No bookings found in your history"
                      className="min-h-[400px]"
                    >
                      <Button asChild className="rounded-full">
                        <Link href="/services">Browse services</Link>
                      </Button>
                    </DashboardEmptyState>
                  </TableCell>
                </TableRow>
              ) : (
                bookings.map((booking: Booking) => (
                  <TableRow
                    key={booking.id}
                    className="hover:bg-muted/50 transition-colors border-border group cursor-pointer"
                    onClick={() => openBooking(booking)}
                  >
                    <TableCell className="pl-10 py-6">
                      <p className="text-sm font-medium text-foreground">
                        #{booking.booking_number}
                      </p>
                    </TableCell>
                    <TableCell className="py-6">
                      <p className="font-medium text-foreground text-sm group-hover:text-primary transition-colors">
                        {booking.service?.name}
                      </p>
                    </TableCell>
                    <TableCell className="py-6">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-muted flex items-center justify-center text-foreground">
                          <Calendar className="w-4 h-4" />
                        </div>
                        <div className="space-y-0.5">
                          <p className="text-sm text-foreground">
                            {formatScheduledDate(booking.scheduled_date)}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {formatScheduledTime(booking.scheduled_date)}
                          </p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="py-6 font-semibold text-foreground text-sm">
                      KES {Number(booking.estimated_price ?? 0).toLocaleString()}
                    </TableCell>
                    <TableCell className="py-6">
                      <BookingStatusBadge status={booking.status} />
                    </TableCell>
                    <TableCell
                      className="pr-10 py-6 text-right"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <div className="flex items-center justify-end gap-2">
                        <ClientBookingActions
                          booking={booking}
                          onManage={() => openBooking(booking)}
                          onMessage={handleMessageProvider}
                          isStartingChat={isStartingChat}
                        />
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </DashboardDataCard>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {bookings.length === 0 ? (
            <DashboardEmptyState
              title="No bookings found"
              className="col-span-full h-48"
            />
          ) : (
            bookings.map((booking: Booking) => (
              <BookingCard
                key={booking.id}
                booking={booking}
                type="client"
                onClick={() => openBooking(booking)}
                actions={
                  <ClientBookingActions
                    booking={booking}
                    onManage={() => openBooking(booking)}
                    onMessage={handleMessageProvider}
                    isStartingChat={isStartingChat}
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
        role="client"
        isUpdating={isUpdating}
        userEmail={user?.email ?? ""}
        onRefresh={() => { mutateBookings(); }}
        onUpdateStatus={(nextStatus) =>
          selectedBooking && handleUpdateStatus(selectedBooking.id, nextStatus)
        }
      />
    </DashboardPageContainer>
  );
}

export default function ClientBookings() {
  return (
    <Suspense fallback={<DashboardSuspenseFallback />}>
      <ClientBookingsContent />
    </Suspense>
  );
}

"use client";

import { useEffect, useState, Suspense } from "react";
import axiosInstance from "@/lib/axios";
import { Table, TableHeader, TableBody, TableHead, TableRow, TableCell } from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { AdminCreateBookingDialog } from "@/components/admin/AdminCreateBookingDialog";
import { 
  Download,
  MoreHorizontal,
  Plus,
  Trash2,
  Check,
  Calendar,
  XCircle
} from "lucide-react";
import { useSearchState } from "@/hooks/useSearchState";
import { useExport } from "@/hooks/useExport";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { DashboardListToolbar } from "@/components/shared/DashboardListToolbar";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuLabel
} from "@/components/ui/dropdown-menu";
import { toast } from "sonner";
import { DashboardPageHeader } from "@/components/shared/DashboardPageHeader";
import { DashboardPageContainer } from "@/components/shared/DashboardPageContainer";
import { DashboardSuspenseFallback } from "@/components/shared/DashboardSuspenseFallback";
import { DashboardCard } from "@/components/shared/DashboardCard";
import {
  DashboardTableHead,
  DashboardTableHeaderRow,
} from "@/components/shared/DashboardTable";
import { dashboardUi } from "@/lib/dashboard-ui";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { EmptyState } from "@/components/shared/ui/EmptyState";
import { BookingCard } from "@/components/shared/BookingCard";
import { Booking } from "@/types";

import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogFooter 
} from "@/components/ui/dialog";
import { FieldLabel } from "@/components/shared/ui/FilterControls";
import { Input } from "@/components/ui/input";
import { useData } from "@/hooks/useData";
import { AppConfirmDialog } from "@/components/shared/dialog/AppConfirmDialog";
function AdminBookingsContent() {
  const { search, setSearch, status, setStatus } = useSearchState();
  const { data: bookings, isLoading, refetch: fetchBookings } = useData<Booking[]>(
    `/api/admin/bookings?search=${search}&status=${status || ''}`,
    { initialData: [] }
  );

  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [selectedBookings, setSelectedBookings] = useState<string[]>([]);
  const [rescheduleData, setRescheduleData] = useState<{ id: string, date: string } | null>(null);
  const [cancelData, setCancelData] = useState<{ id: string, reason: string } | null>(null);
  const [createOpen, setCreateOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const { exportToCSV } = useExport();

  const handleStatusChange = async (id: string, newStatus: string, reason?: string) => {
    try {
      await axiosInstance.patch(`/api/bookings/${id}/status`, { 
        status: newStatus,
        cancellation_reason: reason 
      });
      toast.success(`Booking ${newStatus} successfully`);
      fetchBookings();
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to update status");
    }
  };

  const handleReschedule = async () => {
    if (!rescheduleData) return;
    try {
      await axiosInstance.patch(`/api/bookings/${rescheduleData.id}/reschedule`, { 
        scheduled_date: rescheduleData.date 
      });
      toast.success("Booking rescheduled successfully");
      setRescheduleData(null);
      fetchBookings();
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to reschedule");
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await axiosInstance.delete(`/api/admin/bookings/${id}`);
      toast.success("Booking deleted");
      fetchBookings();
    } catch (err: any) {
      toast.error("Failed to delete booking");
    }
  };

  const toggleSelection = (id: string) => {
    setSelectedBookings(prev => 
      prev.includes(id) ? prev.filter(itemIndex => itemIndex !== id) : [...prev, id]
    );
  };

  return (
    <DashboardPageContainer width="default">
      <DashboardPageHeader 
        title="Service Bookings" 
        subtitle="Monitor and manage all service requests across the platform."
      >
        <Button
          onClick={() => setCreateOpen(true)}
          className="rounded-xl h-11 px-6 font-bold bg-primary text-primary-foreground"
        >
          <Plus className="w-4 h-4 mr-2" />
          Create booking
        </Button>
      </DashboardPageHeader>

      <AdminCreateBookingDialog
        open={createOpen}
        onOpenChange={setCreateOpen}
        onCreated={fetchBookings}
      />

      {search && (
        <p className="text-xs text-muted-foreground">Results for &quot;{search}&quot;</p>
      )}

      <DashboardListToolbar
        hint="Use ⌘K Quick Jump to search bookings"
        viewMode={viewMode}
        onViewChange={setViewMode}
        filters={[
          {
            id: 'status',
            label: 'Status',
            value: status || 'all',
            onChange: (val) => setStatus(val === 'all' ? '' : val),
            options: [
              { label: 'All Status', value: 'all' },
              { label: 'Pending', value: 'pending' },
              { label: 'Confirmed', value: 'confirmed' },
              { label: 'Completed', value: 'completed' },
              { label: 'Cancelled', value: 'cancelled' }
            ]
          }
        ]}
        bulkActions={[
          {
            label: "Export Records",
            icon: <Download className="w-4 h-4" />,
            onClick: () => exportToCSV(bookings, "all_bookings"),
          },
        ]}
      />

      {viewMode === 'list' ? (
        <DashboardCard variant="premium" contentClassName="p-0">
            <div className="overflow-x-auto kuba-scroll">
              <Table>
              <TableHeader>
                <DashboardTableHeaderRow className="bg-muted/20">
                  <TableHead className="w-12 pl-6 h-12"><Checkbox checked={selectedBookings.length === bookings.length && bookings.length > 0} onCheckedChange={(val) => val ? setSelectedBookings(bookings.map(b => b.id.toString())) : setSelectedBookings([])} /></TableHead>
                  <DashboardTableHead>Booking ID</DashboardTableHead>
                  <DashboardTableHead>Client & Service</DashboardTableHead>
                  <DashboardTableHead>Schedule</DashboardTableHead>
                  <DashboardTableHead>Verification</DashboardTableHead>
                  <DashboardTableHead position="last" className="!pr-6">Operations</DashboardTableHead>
                </DashboardTableHeaderRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  Array.from({ length: 5 }).map((_, i) => (
                    <TableRow key={i} className="border-border">
                      <TableCell className="pl-6"><Skeleton className="h-4 w-4" /></TableCell>
                      <TableCell><Skeleton className="h-4 w-16" /></TableCell>
                      <TableCell><Skeleton className="h-10 w-48" /></TableCell>
                      <TableCell><Skeleton className="h-10 w-32" /></TableCell>
                      <TableCell><Skeleton className="h-6 w-20 rounded-full" /></TableCell>
                      <TableCell className="pr-6 text-right"><Skeleton className="h-8 w-8 rounded-md ml-auto" /></TableCell>
                    </TableRow>
                  ))
                ) : bookings.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="p-0 border-none">
                      <EmptyState
                        variant="dashboard"
                        title="No bookings found"
                        description="Adjust your search criteria or clear filters to view more results."
                      />
                    </TableCell>
                  </TableRow>
                ) : (
                  bookings.map((booking) => (
                    <TableRow key={booking.id} className="group border-border hover:bg-muted/30 transition-colors">
                      <TableCell className="pl-6">
                        <Checkbox checked={selectedBookings.includes(booking.id.toString())} onCheckedChange={() => toggleSelection(booking.id.toString())} />
                      </TableCell>
                      <TableCell>
                        <Link href={`/admin/bookings/${booking.id}`}>
                          <span className="text-[11px] font-black text-primary hover:underline cursor-pointer uppercase tracking-tighter">#{booking.booking_number}</span>
                        </Link>
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-col">
                          <span className="text-[13px] font-black text-foreground group-hover:text-primary transition-colors">{booking.service?.name}</span>
                          <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">{booking.customer?.name}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-col">
                          <span className="text-xs font-black text-foreground">{new Date(booking.scheduled_date).toLocaleDateString([], { day: '2-digit', month: 'short' })}</span>
                          <span className="text-[10px] font-bold text-muted-foreground uppercase">{new Date(booking.scheduled_date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <StatusBadge status={booking.status} type="booking" />
                      </TableCell>
                      <TableCell className="pr-6 text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-9 w-9 rounded-xl hover:bg-muted text-muted-foreground">
                              <MoreHorizontal className="w-4 h-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="w-52 rounded-2xl p-1.5 shadow-xl border-border bg-card/95 backdrop-blur-xl">
                            <DropdownMenuLabel className={dashboardUi.dropdown.label}>Operations</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem asChild className="rounded-lg py-2.5 font-bold text-xs gap-3 cursor-pointer">
                              <Link href={`/admin/bookings/${booking.id}`} className="flex items-center gap-3">
                                <ArrowUpRight className="w-4 h-4 text-primary" /> View Details
                              </Link>
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem onClick={() => handleStatusChange(booking.id.toString(), 'confirmed')} disabled={booking.status === 'confirmed'} className="rounded-lg py-2.5 font-bold text-xs gap-3 cursor-pointer">
                              <Check className="w-4 h-4 text-emerald-500" /> Confirm Order
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => setRescheduleData({ id: booking.id.toString(), date: booking.scheduled_date })} className="rounded-lg py-2.5 font-bold text-xs gap-3 cursor-pointer">
                              <Calendar className="w-4 h-4 text-primary" /> Reschedule Date
                            </DropdownMenuItem>
                             <DropdownMenuItem onClick={() => setCancelData({ id: booking.id.toString(), reason: "" })} className="rounded-lg py-2.5 font-bold text-xs gap-3 cursor-pointer">
                              <XCircle className="w-4 h-4 text-amber-500" /> Cancel with Reason
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem onSelect={(e) => e.preventDefault()} onClick={() => setDeleteId(booking.id.toString())} className="rounded-lg py-2.5 font-bold text-xs gap-3 cursor-pointer text-red-500 focus:bg-red-50 focus:text-red-600">
                              <Trash2 className="w-4 h-4" /> Purge Record
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </DashboardCard>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {isLoading ? (
            Array.from({ length: 6 }).map((_, i) => <Skeleton key={i} className="h-64 rounded-3xl" />)
          ) : bookings.length === 0 ? (
            <EmptyState
              variant="dashboard"
              title="No bookings found"
              className="col-span-full"
            />
          ) : (
            bookings.map((booking) => (
              <BookingCard 
                key={booking.id} 
                booking={booking} 
                type="admin" 
                isSelected={selectedBookings.includes(booking.id.toString())}
                onSelect={() => toggleSelection(booking.id.toString())}
                actions={
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="outline" className="h-10 w-full rounded-xl border-border text-[10px] font-black uppercase tracking-widest hover:bg-muted transition-all bg-card/50">
                        Management Options
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="w-56 rounded-2xl p-1.5 shadow-xl border-border bg-card/95 backdrop-blur-xl" align="end">
                      <DropdownMenuItem asChild className="rounded-lg py-2.5 font-bold text-xs gap-3 cursor-pointer">
                        <Link href={`/admin/bookings/${booking.id}`} className="flex items-center gap-3">
                          <ArrowUpRight className="w-4 h-4 text-primary" /> View Full Details
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={() => handleStatusChange(booking.id.toString(), 'confirmed')} className="rounded-lg py-2.5 font-bold text-xs gap-3 cursor-pointer">Confirm Service</DropdownMenuItem>
                      <DropdownMenuItem onClick={() => setRescheduleData({ id: booking.id.toString(), date: booking.scheduled_date })} className="rounded-lg py-2.5 font-bold text-xs gap-3 cursor-pointer">Reschedule</DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleStatusChange(booking.id.toString(), 'completed')} className="rounded-lg py-2.5 font-bold text-xs gap-3 cursor-pointer">Mark Completed</DropdownMenuItem>
                      <DropdownMenuSeparator />
                       <DropdownMenuItem onClick={() => setCancelData({ id: booking.id.toString(), reason: "" })} className="rounded-lg py-2.5 font-bold text-xs gap-3 cursor-pointer text-amber-600">Cancel & Notify</DropdownMenuItem>
                       <DropdownMenuItem onSelect={(e) => e.preventDefault()} onClick={() => setDeleteId(booking.id.toString())} className="rounded-lg py-2.5 font-bold text-xs gap-3 cursor-pointer text-red-500">Purge</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                }
              />
            ))
          )}
        </div>
      )}

      {/* Reschedule Dialog */}
      <Dialog open={!!rescheduleData} onOpenChange={(open) => !open && setRescheduleData(null)}>
        <DialogContent className="rounded-3xl border-border bg-card/95 backdrop-blur-xl max-w-sm">
          <DialogHeader>
            <DialogTitle className="text-xl font-black italic tracking-tight">Reschedule Service</DialogTitle>
          </DialogHeader>
          <div className="py-6 space-y-4">
            <div className="space-y-2">
              <FieldLabel>Proposed Date & Time</FieldLabel>
              <Input 
                type="datetime-local" 
                className="h-12 rounded-xl bg-muted/50 border-border font-bold text-sm"
                value={rescheduleData?.date ? new Date(rescheduleData.date).toISOString().slice(0, 16) : ""}
                onChange={(e) => setRescheduleData(prev => prev ? { ...prev, date: e.target.value } : null)}
              />
            </div>
            <p className="text-[10px] text-muted-foreground font-semibold px-1 leading-relaxed">
              Moving the schedule will notify both the client and the provider. Service status will revert to "Pending" awaiting final confirmation.
            </p>
          </div>
          <DialogFooter className="gap-2 sm:gap-0">
            <Button variant="ghost" className="rounded-xl font-bold text-xs" onClick={() => setRescheduleData(null)}>Abort</Button>
            <Button className="rounded-xl font-bold text-xs px-6" onClick={handleReschedule}>Confirm Shift</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Cancellation Dialog */}
      <Dialog open={!!cancelData} onOpenChange={(open) => !open && setCancelData(null)}>
        <DialogContent className="rounded-3xl border-border bg-card/95 backdrop-blur-xl max-w-sm">
          <DialogHeader>
            <DialogTitle className="text-xl font-black italic tracking-tight">Revoke Booking</DialogTitle>
          </DialogHeader>
          <div className="py-6 space-y-4">
            <div className="space-y-2">
              <FieldLabel>Reason for Cancellation</FieldLabel>
              <textarea 
                className="w-full min-h-[100px] p-4 rounded-xl bg-muted/50 border border-border font-medium text-sm focus:ring-1 focus:ring-primary outline-none resize-none"
                placeholder="Briefly explain the cause of revocation..."
                value={cancelData?.reason || ""}
                onChange={(e) => setCancelData(prev => prev ? { ...prev, reason: e.target.value } : null)}
              />
            </div>
            <p className="text-[10px] text-muted-foreground font-semibold px-1 leading-relaxed italic">
              Formal notification will be dispatched to all transacting parties immediately.
            </p>
          </div>
          <DialogFooter className="gap-2 sm:gap-0">
            <Button variant="ghost" className="rounded-xl font-bold text-xs" onClick={() => setCancelData(null)}>Dismiss</Button>
            <Button 
                className="rounded-xl font-bold text-xs px-6 bg-amber-600 hover:bg-amber-700 text-white" 
                onClick={() => {
                    if (cancelData) {
                        handleStatusChange(cancelData.id, 'cancelled', cancelData.reason);
                        setCancelData(null);
                    }
                }}
                disabled={!cancelData?.reason}
            >
                Confirm Revocation
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <AppConfirmDialog
        open={deleteId !== null}
        onOpenChange={() => setDeleteId(null)}
        onConfirm={async () => { if (deleteId) { await handleDelete(deleteId); setDeleteId(null); } }}
        title="Purge Registry Record?"
        description="This action is permanent and will remove the booking from all historical marketplace logs. This cannot be undone."
      />
    </DashboardPageContainer>
  );
}

export default function AdminBookings() {
  return (
    <Suspense fallback={<DashboardSuspenseFallback />}>
      <AdminBookingsContent />
    </Suspense>
  );
}

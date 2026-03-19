"use client";

import { useEffect, useState } from "react";
import axiosInstance from "@/lib/axios";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableHeader, TableBody, TableHead, TableRow, TableCell } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Search, 
  Download,
  Briefcase,
  MoreHorizontal,
  Trash2,
  Check
} from "lucide-react";
import Link from "next/link";
import { useSearchState } from "@/hooks/useSearchState";
import { useExport } from "@/hooks/useExport";
import { Checkbox } from "@/components/ui/checkbox";
import { DataToolbar } from "@/components/shared/DataToolbar";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuLabel
} from "@/components/ui/dropdown-menu";
import { toast } from "sonner";

import { Booking, User, Provider } from "@/types";

export default function AdminBookings() {
  const { search, setSearch, status, setStatus } = useSearchState();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const [viewMode, setViewMode] = useState<'grid'|'list'>('grid');
  const { exportToCSV } = useExport();

  useEffect(() => {
    fetchBookings(search, status);
  }, [search, status]);

  const fetchBookings = async (search = "", status = "") => {
    try {
      const res = await axiosInstance.get(`/api/admin/bookings?search=${search}&status=${status}`);
      setBookings(res.data.data || []);
    } catch (err) {
      console.error("Failed to fetch bookings:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const updateStatus = async (id: number, statusToUpdate: string) => {
    try {
        await axiosInstance.patch(`/api/bookings/${id}/status`, { status: statusToUpdate });
        fetchBookings(search, status);
    } catch (err) {
        console.error("Failed to update status:", err);
    }
  };

  const handleBatchUpdate = async (newStatus: string) => {
    try {
        await Promise.all(selectedIds.map(id => 
            axiosInstance.patch(`/api/bookings/${id}/status`, { status: newStatus })
        ));
        toast.success(`Updated ${selectedIds.length} bookings`);
        setSelectedIds([]);
        fetchBookings(search, status);
    } catch (err) {
        toast.error("Batch update failed");
    }
  };

  const toggleSelect = (id: number) => {
    setSelectedIds(prev => 
        prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  const toggleAll = () => {
    setSelectedIds(prev => 
        prev.length === bookings.length ? [] : bookings.map(b => b.id)
    );
  };

  const getStatusBadge = (status: string) => {
    const styles: Record<string, string> = {
      pending: "bg-muted text-foreground border-border",
      confirmed: "bg-muted text-foreground border-border",
      completed: "bg-muted text-foreground border-border",
      cancelled: "bg-muted text-foreground border-border"
    };
    return (
      <Badge variant="outline" className={`rounded-full px-2.5 py-0.5 text-xs font-medium capitalize border ${styles[status] || "bg-muted text-muted-foreground"}`}>
        {status}
      </Badge>
    );
  };

  if (isLoading) {
    return (
      <div className="max-w-6xl mx-auto space-y-6 animate-pulse">
        <Skeleton className="h-10 w-48 rounded-lg" />
        <Skeleton className="h-[400px] w-full rounded-xl" />
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground tracking-tight">Bookings</h1>
          <p className="text-sm text-muted-foreground mt-1">Manage all marketplace transactions and service fulfillment.</p>
        </div>
      </div>
      <DataToolbar 
        search={search}
        onSearchChange={setSearch}
        searchPlaceholder="Search bookings..."
        viewMode={viewMode}
        onViewChange={setViewMode}
        filters={[
          {
            id: 'status',
            label: 'Status',
            value: status || 'all',
            onChange: (val) => setStatus(val === 'all' ? null : val),
            options: [
              { label: 'All Status', value: 'all' },
              { label: 'Pending', value: 'pending' },
              { label: 'Confirmed', value: 'confirmed' },
              { label: 'Completed', value: 'completed' },
              { label: 'Cancelled', value: 'cancelled' }
            ]
          }
        ]}
        selectedCount={selectedIds.length}
        onSelectAll={toggleAll}
        bulkActions={[
          {
            label: 'Confirm Selected',
            icon: <Check className="w-4 h-4" />,
            onClick: () => handleBatchUpdate('confirmed')
          },
          {
            label: 'Cancel Selected',
            icon: <Trash2 className="w-4 h-4" />,
            destructive: true,
            onClick: () => handleBatchUpdate('cancelled')
          },
          {
            label: 'Export All',
            icon: <Download className="w-4 h-4" />,
            onClick: () => exportToCSV(bookings, 'all_bookings')
          }
        ]}
      />

      {/* Content area: Grid or List */}
      {viewMode === 'list' ? (
        <Card className="border border-border overflow-hidden bg-card">
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow className="hover:bg-transparent border-border">
                  <TableHead className="pl-6 w-10"><Checkbox checked={selectedIds.length === bookings.length && bookings.length > 0} onCheckedChange={toggleAll} /></TableHead>
                  <TableHead className="uppercase text-[10px] font-semibold text-muted-foreground tracking-wider h-12">Reference</TableHead>
                  <TableHead className="uppercase text-[10px] font-semibold text-muted-foreground tracking-wider h-12">Service</TableHead>
                  <TableHead className="uppercase text-[10px] font-semibold text-muted-foreground tracking-wider h-12">Customer</TableHead>
                  <TableHead className="uppercase text-[10px] font-semibold text-muted-foreground tracking-wider h-12">Value</TableHead>
                  <TableHead className="uppercase text-[10px] font-semibold text-muted-foreground tracking-wider h-12">Status</TableHead>
                  <TableHead className="pr-6 text-right uppercase text-[10px] font-semibold text-muted-foreground tracking-wider h-12">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {bookings.map((booking) => (
                  <TableRow key={booking.id} className={`group border-border hover:bg-muted/50 transition-colors ${selectedIds.includes(booking.id) ? "bg-accent/50" : ""}`}>
                    <TableCell className="pl-6">
                      <Checkbox checked={selectedIds.includes(booking.id)} onCheckedChange={() => toggleSelect(booking.id)} />
                    </TableCell>
                    <TableCell className="font-semibold text-primary text-sm group-hover:text-primary transition-colors">
                      <Link href={`/admin/bookings/${booking.id}`}>
                        #{booking.booking_number}
                      </Link>
                    </TableCell>
                    <TableCell>
                      <div>
                        <p className="text-sm font-semibold text-foreground">{booking.service?.name || "—"}</p>
                        <p className="text-[10px] font-medium uppercase tracking-wide text-muted-foreground mt-0.5">via {booking.provider?.business_name || "Individual"}</p>
                      </div>
                    </TableCell>
                    <TableCell className="text-sm font-medium text-foreground">{booking.customer?.name}</TableCell>
                    <TableCell>
                      <p className="text-sm font-bold text-foreground">${booking.final_price || booking.estimated_price || '0.00'}</p>
                      <p className="text-[10px] font-medium uppercase tracking-wide text-muted-foreground mt-0.5">{booking.final_price ? 'Final' : 'Estimated'}</p>
                    </TableCell>
                    <TableCell>{getStatusBadge(booking.status)}</TableCell>
                    <TableCell className="pr-6 text-right">
                      <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        {booking.status === 'pending' && (
                          <Button onClick={() => updateStatus(booking.id, 'confirmed')} variant="ghost" size="sm" className="h-7 text-xs text-foreground bg-background border border-border shadow-sm hover:bg-accent">
                            Confirm
                          </Button>
                        )}
                        {(booking.status === 'confirmed' || booking.status === 'pending') && (
                          <Button onClick={() => updateStatus(booking.id, 'cancelled')} variant="ghost" size="sm" className="h-7 text-xs text-red-500 hover:text-red-600 hover:bg-red-50 transition-colors">
                            Cancel
                          </Button>
                        )}
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <button className="p-1.5 text-muted-foreground hover:text-foreground transition-colors rounded-md hover:bg-accent ml-1">
                              <MoreHorizontal className="w-4 h-4" />
                            </button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="rounded-xl border-border">
                            <DropdownMenuLabel className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Booking Ops</DropdownMenuLabel>
                            <DropdownMenuItem asChild>
                              <Link href={`/admin/bookings/${booking.id}`} className="cursor-pointer text-xs font-semibold uppercase tracking-tight">
                                View Full Console
                              </Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => updateStatus(booking.id, 'cancelled')} className="cursor-pointer text-xs font-semibold uppercase tracking-tight text-red-500 hover:text-red-600">
                                Abort Transaction
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
                {bookings.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={7} className="h-48 text-center text-sm text-muted-foreground border-border">
                      No bookings found
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {bookings.length === 0 ? (
            <div className="col-span-full h-48 flex items-center justify-center text-muted-foreground text-sm border border-dashed border-border rounded-xl">No bookings found</div>
          ) : bookings.map((booking) => (
            <Card key={booking.id} className={`border group transition-all hover:shadow-md overflow-hidden bg-card ${selectedIds.includes(booking.id) ? 'border-primary shadow-sm' : 'border-border block'}`}>
              <CardContent className="p-5">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center gap-3">
                    <Checkbox checked={selectedIds.includes(booking.id)} onCheckedChange={() => toggleSelect(booking.id)} className="mt-0.5" />
                    <div>
                      <h3 className="font-semibold text-primary text-sm group-hover:text-primary transition-colors">
                        <Link href={`/admin/bookings/${booking.id}`}>
                          #{booking.booking_number}
                        </Link>
                      </h3>
                      <p className="text-[10px] font-medium uppercase tracking-widest text-muted-foreground mt-0.5">{new Date(booking.scheduled_date).toLocaleDateString()}</p>
                    </div>
                  </div>
                  {getStatusBadge(booking.status)}
                </div>
                
                <div className="space-y-3 mb-5">
                  <div>
                    <p className="text-sm font-semibold text-foreground truncate">{booking.service?.name || "—"}</p>
                    <p className="text-xs text-muted-foreground truncate flex flex-col mt-1">
                      <span><span className="font-medium text-foreground">Client:</span> {booking.customer?.name}</span>
                      <span><span className="font-medium text-foreground">Provider:</span> {booking.provider?.business_name || "Individual"}</span>
                    </p>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-border mt-auto">
                    <div>
                        <p className="text-lg font-bold text-foreground leading-none">${booking.final_price || booking.estimated_price || '0.00'}</p>
                        <p className="text-[10px] font-semibold uppercase tracking-wide text-muted-foreground mt-1">{booking.final_price ? 'Final Price' : 'Estimated Value'}</p>
                    </div>
                    <div className="flex items-center gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                        {booking.status === 'pending' && (
                            <Button onClick={() => updateStatus(booking.id, 'confirmed')} variant="outline" size="sm" className="h-7 text-xs px-2.5 bg-background shadow-sm hover:bg-accent transition-colors">
                                Confirm
                            </Button>
                        )}
                        <Button asChild variant="ghost" size="sm" className="h-7 text-xs px-2.5 text-muted-foreground hover:text-foreground hover:bg-accent transition-colors">
                            <Link href={`/admin/bookings/${booking.id}`}>
                              Details
                            </Link>
                        </Button>
                    </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

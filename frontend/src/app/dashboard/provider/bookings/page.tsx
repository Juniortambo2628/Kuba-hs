"use client";

import { useEffect, useState, Suspense } from "react";
import axiosInstance from "@/lib/axios";
import { Card, CardContent } from "@/components/ui/card";
import { 
  Calendar, 
  Loader2, 
  MessageSquare
} from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { DataToolbar } from "@/components/shared/DataToolbar";
import { BookingStatusBadge } from "@/components/shared/BookingStatusBadge";
import { BookingCard } from "@/components/shared/BookingCard";
import { DashboardEmptyState } from "@/components/shared/DashboardEmptyState";
import { DashboardPageHeader } from "@/components/shared/DashboardPageHeader";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import { useSearchState } from "@/hooks/useSearchState";
import { Booking } from "@/types";

function BookingsHistoryContent() {
  const router = useRouter();
  const { search, setSearch, status, setStatus } = useSearchState();
  const [data, setData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [isStartingChat, setIsStartingChat] = useState<number | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axiosInstance.get('/api/provider/dashboard');
        setData(res.data);
      } catch (err) {
        console.error("Failed to fetch dashboard data:", err);
        toast.error("Failed to load booking history");
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  const bookings = data?.recent_bookings || [];

  const filteredBookings = bookings.filter((b: any) => {
    const matchesSearch = 
      b.service?.name?.toLowerCase().includes(search.toLowerCase()) ||
      b.customer?.name?.toLowerCase().includes(search.toLowerCase()) ||
      b.booking_number?.toLowerCase().includes(search.toLowerCase()) ||
      b.id.toString().includes(search);
    const matchesStatus = status && status !== 'all' ? b.status === status : true;
    return matchesSearch && matchesStatus;
  });

  const handleMessageClient = async (bookingId: number) => {
    setIsStartingChat(bookingId);
    try {
      await axiosInstance.post(`/api/chat/bookings/${bookingId}/conversation`);
      router.push('/dashboard/provider/messages');
    } catch (err) {
      console.error(err);
      toast.error("Failed to start conversation");
    } finally {
      setIsStartingChat(null);
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-12">
      <DashboardPageHeader 
        title="Fleet History" 
        subtitle="Comprehensive archive of all Kuba work orders."
      />

      <DataToolbar 
        search={search}
        onSearchChange={setSearch}
        searchPlaceholder="Search by ID or Service..."
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
      />

      {viewMode === 'list' ? (
        <Card className="rounded-[2.5rem] border-border shadow-sm overflow-hidden border-none bg-card/50 backdrop-blur-md">
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow className="hover:bg-transparent border-border">
                  <TableHead className="pl-10 h-16 uppercase text-[10px] font-semibold tracking-normal text-muted-foreground">Order ID</TableHead>
                  <TableHead className="h-16 uppercase text-[10px] font-semibold tracking-normal text-muted-foreground">Service</TableHead>
                  <TableHead className="h-16 uppercase text-[10px] font-semibold tracking-normal text-muted-foreground">Client</TableHead>
                  <TableHead className="h-16 uppercase text-[10px] font-semibold tracking-normal text-muted-foreground">Date</TableHead>
                  <TableHead className="h-16 uppercase text-[10px] font-semibold tracking-normal text-muted-foreground">Status</TableHead>
                  <TableHead className="h-16 pr-10 text-right uppercase text-[10px] font-semibold tracking-normal text-muted-foreground">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  Array.from({ length: 5 }).map((_, i) => (
                    <TableRow key={i} className="border-border">
                      <TableCell className="pl-10 py-6"><Skeleton className="h-6 w-24" /></TableCell>
                      <TableCell className="py-6"><Skeleton className="h-6 w-32" /></TableCell>
                      <TableCell className="py-6"><Skeleton className="h-6 w-28" /></TableCell>
                      <TableCell className="py-6"><Skeleton className="h-6 w-28" /></TableCell>
                      <TableCell className="py-6"><Skeleton className="h-6 w-20 rounded-full" /></TableCell>
                      <TableCell className="pr-10 py-6 text-right"><Skeleton className="h-8 w-24 rounded-lg ml-auto" /></TableCell>
                    </TableRow>
                  ))
                ) : filteredBookings.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="p-0">
                      <DashboardEmptyState 
                        title="No work orders found in your history" 
                        className="min-h-[400px]"
                      />
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredBookings.map((booking: Booking) => (
                    <TableRow key={booking.id} className="hover:bg-muted/50 transition-colors border-border group">
                      <TableCell className="pl-10 py-6">
                        <span className="text-[10px] font-semibold text-primary uppercase tracking-normal">
                          #{booking.booking_number || booking.id}
                        </span>
                      </TableCell>
                      <TableCell className="py-6">
                        <div className="font-semibold text-foreground text-sm group-hover:text-primary transition-colors">{booking.service?.name}</div>
                      </TableCell>
                      <TableCell className="py-6">
                        <div className="text-sm font-semibold text-foreground">{booking.customer?.name}</div>
                      </TableCell>
                      <TableCell className="py-6">
                        <div className="flex items-center gap-2 text-sm font-medium text-foreground">
                          <Calendar className="w-4 h-4 text-muted-foreground" />
                          {new Date(booking.scheduled_date).toLocaleDateString()}
                        </div>
                      </TableCell>
                      <TableCell className="py-6">
                        <BookingStatusBadge status={booking.status} />
                      </TableCell>
                      <TableCell className="pr-10 py-6 text-right">
                        <Button 
                          variant="outline" 
                          onClick={(e: React.MouseEvent) => { e.stopPropagation(); handleMessageClient(booking.id); }}
                          disabled={isStartingChat === booking.id}
                          className="text-primary border-sky-100 hover:bg-muted h-8 rounded-lg px-3 inline-flex items-center gap-1.5"
                        >
                          {isStartingChat === booking.id ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <MessageSquare className="w-3.5 h-3.5" />}
                          <span className="text-[9px] font-semibold uppercase tracking-normal">Message</span>
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 mt-4 gap-6">
          {isLoading ? (
            Array.from({ length: 6 }).map((_, i) => <Skeleton key={i} className="h-64 rounded-3xl" />)
          ) : filteredBookings.length === 0 ? (
            <DashboardEmptyState 
              title="No bookings found" 
              className="col-span-full"
            />
          ) : (
            filteredBookings.map((booking: Booking) => (
              <BookingCard 
                key={booking.id} 
                booking={booking} 
                type="provider" 
                onClick={() => router.push(`/dashboard/provider/bookings/${booking.id}`)}
                actions={
                  <div className="flex items-center gap-2">
                    <Button asChild variant="outline" size="sm" className="h-9 px-4 rounded-xl border-border text-[9px] font-bold uppercase tracking-normal hover:bg-muted transition-all shadow-none">
                      <Link href={`/dashboard/provider/bookings/${booking.id}`} onClick={(e: React.MouseEvent) => e.stopPropagation()}>Details</Link>
                    </Button>
                    <Button 
                      onClick={(e: React.MouseEvent) => { e.stopPropagation(); handleMessageClient(booking.id); }}
                      className="h-9 bg-foreground text-background hover:bg-muted hover:text-foreground transition-all duration-300 rounded-xl font-semibold px-4 text-[9px] tracking-normal uppercase border border-border shadow-none"
                      disabled={isStartingChat === booking.id}
                    >
                      {isStartingChat === booking.id ? <Loader2 className="w-3 h-3 animate-spin mr-2" /> : <MessageSquare className="w-3 h-3 mr-2" />}
                      Message
                    </Button>
                  </div>
                }
              />
            ))
          )}
        </div>
      )}
    </div>
  );
}

export default function BookingsHistory() {
  return (
    <Suspense fallback={<div className="max-w-6xl mx-auto p-8"><Skeleton className="h-[600px] w-full rounded-2xl" /></div>}>
      <BookingsHistoryContent />
    </Suspense>
  );
}

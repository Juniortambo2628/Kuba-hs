"use client";

import { useEffect, useState } from "react";
import useSWR from "swr";
import { useAuth } from "@/contexts/AuthContext";
import axiosInstance from "@/lib/axios";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
 Table,
 TableBody,
 TableCell,
 TableHead,
 TableHeader,
 TableRow,
} from "@/components/ui/table";
import { 
 Calendar, 
 Search, 
 Filter, 
 MoreHorizontal,
 ChevronRight,
 ClipboardList,
 Clock,
 CheckCircle,
 XCircle,
 AlertCircle,
 MessageSquare,
 Loader2,
 CreditCard,
 DownloadCloud
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import dynamic from "next/dynamic";
import { DataToolbar } from "@/components/shared/DataToolbar";
import { BookingProgressTracker } from "@/components/bookings/BookingProgressTracker";
import { BookingStatusBadge } from "@/components/shared/BookingStatusBadge";
import { BookingCard } from "@/components/shared/BookingCard";
import { DashboardEmptyState } from "@/components/shared/DashboardEmptyState";

import { Booking, User } from "@/types";

const BookingActions = dynamic(() => import("@/components/bookings/BookingActions"), {
  ssr: false,
  loading: () => <div className="h-8 w-24 bg-gray-100 animate-pulse rounded-lg" />
});

export default function ClientBookings() {
 const router = useRouter();
 const { user, isLoading: authLoading } = useAuth();
 const [searchQuery, setSearchQuery] = useState("");
 const [filterStatus, setFilterStatus] = useState("");
 const [isStartingChat, setIsStartingChat] = useState<number | null>(null);
 const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

 // Use SWR for real-time reactive updates
 const { data: bookingsData, isLoading: isBookingsLoading, mutate: mutateBookings } = useSWR(
  user ? `/api/client/bookings?search=${searchQuery}&status=${filterStatus}` : null,
  (url) => axiosInstance.get(url).then(res => res.data),
  { dedupingInterval: 500 }
 );

 const bookings = bookingsData?.data || [];
 const isLoading = authLoading || isBookingsLoading;

 const fetchBookings = async () => {
  await mutateBookings();
 };

 const handleMessageProvider = async (bookingId: number) => {
  setIsStartingChat(bookingId);
  try {
   await axiosInstance.post(`/api/chat/bookings/${bookingId}/conversation`);
   router.push('/dashboard/client/messages');
  } catch (err) {
   console.error(err);
   toast.error("Failed to start conversation");
  } finally {
   setIsStartingChat(null);
  }
 };

 const getTimeSession = (dateStr: string) => {
  const hour = new Date(dateStr).getHours();
  if (hour < 12) return "Morning Session";
  if (hour < 17) return "Afternoon Session";
  return "Evening Session";
 };


 if (isLoading) {
  return (
   <div className="space-y-8">
    <Skeleton className="h-10 w-64 rounded-xl" />
    <Card className="rounded-[2.5rem] border-border">
      <CardContent className="p-10">
       <Skeleton className="h-80 w-full rounded-2xl" />
      </CardContent>
    </Card>
   </div>
  );
 }

 return (
  <div className="max-w-[1400px] mx-auto space-y-8 pb-12">
   <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
    <div>
     <h1 className="text-2xl font-bold text-foreground tracking-tight">My Service History</h1>
     <p className="text-sm text-muted-foreground mt-1">Track and manage your upcoming and past home services.</p>
    </div>
    <Link href="/services">
     <Button className="bg-foreground text-background hover:bg-muted hover:text-foreground rounded-xl font-semibold px-6 shadow-md transition-all">
      Book New Service
     </Button>
    </Link>
   </div>

   <DataToolbar 
    search={searchQuery}
    onSearchChange={setSearchQuery}
    searchPlaceholder="Search by ID or Service..."
    viewMode={viewMode}
    onViewChange={setViewMode}
    filters={[
     {
      id: 'status',
      label: 'Status',
      value: filterStatus || 'all',
      onChange: (val) => setFilterStatus(val === 'all' ? '' : val),
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
        <TableHead className="pl-10 h-16 uppercase text-[10px] font-semibold tracking-normal text-muted-foreground">Booking Ref</TableHead>
        <TableHead className="h-16 uppercase text-[10px] font-semibold tracking-normal text-muted-foreground">Service Details</TableHead>
        <TableHead className="h-16 uppercase text-[10px] font-semibold tracking-normal text-muted-foreground">Scheduled For</TableHead>
        <TableHead className="h-16 uppercase text-[10px] font-semibold tracking-normal text-muted-foreground">Price Estimate</TableHead>
        <TableHead className="h-16 uppercase text-[10px] font-semibold tracking-normal text-muted-foreground">Status</TableHead>
        <TableHead className="h-16 pr-10"></TableHead>
       </TableRow>
      </TableHeader>
      <TableBody>
       {bookings.map((booking: Booking) => (
        <TableRow key={booking.id} className="hover:bg-muted/50 transition-colors border-border group">
         <TableCell className="pl-10 py-6">
          <span className="text-[10px] font-semibold text-primary uppercase tracking-normal group-hover:scale-110 transition-transform inline-block">
            #{booking.booking_number}
          </span>
         </TableCell>
         <TableCell className="py-6">
          <div className="space-y-1">
            <p className="font-semibold text-foreground text-sm group-hover:text-primary transition-colors">{booking.service?.name}</p>
            <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-tighter">Professional Service</p>
          </div>
         </TableCell>
         <TableCell className="py-6">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-muted flex items-center justify-center text-foreground">
              <Calendar className="w-4 h-4" />
            </div>
            <div className="space-y-0.5">
              <p className="text-[11px] font-semibold text-foreground">{new Date(booking.scheduled_date).toLocaleDateString()}</p>
              <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-tighter">{getTimeSession(booking.scheduled_date)}</p>
            </div>
          </div>
         </TableCell>
         <TableCell className="py-6 font-semibold text-foreground text-sm">
          KES {booking.estimated_price.toLocaleString()}
         </TableCell>
          <TableCell className="py-6">
           <BookingStatusBadge status={booking.status} />
          </TableCell>
         <TableCell className="pr-10 py-6 text-right">
          <div className="flex items-center justify-end gap-2">
            <BookingActions 
              booking={booking} 
              userEmail={user?.email || ""} 
              onRefresh={() => fetchBookings()}
              onMessage={handleMessageProvider}
              isStartingChat={isStartingChat === booking.id}
            />

          </div>
         </TableCell>
        </TableRow>
       ))}
        {bookings.length === 0 && (
         <TableRow>
          <TableCell colSpan={6} className="p-0">
           <DashboardEmptyState
             title="No bookings found in your history"
             className="min-h-[400px]"
           >
             <Button asChild variant="link" className="text-primary font-bold uppercase text-[9px] tracking-normal underline decoration-2 underline-offset-4">
               <Link href="/services">Book your first service</Link>
             </Button>
           </DashboardEmptyState>
          </TableCell>
         </TableRow>
        )}
      </TableBody>
     </Table>
    </CardContent>
   </Card>
   ) : (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
     {bookings.length === 0 ? (
       <DashboardEmptyState
         title="No bookings found"
         className="col-span-full h-48"
       />
     ) : bookings.map((booking: Booking) => (
       <BookingCard
          key={booking.id}
          booking={booking}
          type="client"
          actions={
            <BookingActions 
             booking={booking} 
             userEmail={user?.email || ""} 
             onRefresh={() => fetchBookings()}
             onMessage={handleMessageProvider}
             isStartingChat={isStartingChat === booking.id}
           />
          }
       />
     ))}
    </div>
   )}
  </div>
 );
}

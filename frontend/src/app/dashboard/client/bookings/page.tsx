"use client";

import { useEffect, useState } from "react";
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

import { Booking, User } from "@/types";

const BookingActions = dynamic(() => import("@/components/bookings/BookingActions"), {
  ssr: false,
  loading: () => <div className="h-8 w-24 bg-gray-100 animate-pulse rounded-lg" />
});

export default function ClientBookings() {
 const router = useRouter();
 const { user, isLoading: authLoading } = useAuth();
 const [bookings, setBookings] = useState<Booking[]>([]);
 const [isLoading, setIsLoading] = useState(true);
 const [searchQuery, setSearchQuery] = useState("");
 const [filterStatus, setFilterStatus] = useState("");
 const [isStartingChat, setIsStartingChat] = useState<number | null>(null);
 const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

 useEffect(() => {
  if (!authLoading && user) {
   const delayDebounceFn = setTimeout(() => {
    fetchBookings(searchQuery, filterStatus);
   }, 500);

   return () => clearTimeout(delayDebounceFn);
  }
 }, [authLoading, user, searchQuery, filterStatus]);

 const fetchBookings = async (search = "", status = "") => {
  try {
   const res = await axiosInstance.get(`/api/client/bookings?search=${search}&status=${status}`);
   setBookings(res.data.data || []);
  } catch (err) {
   console.error("Failed to fetch bookings:", err);
  } finally {
   setIsLoading(false);
  }
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

 const getStatusStyle = (status: string) => {
  switch (status.toLowerCase()) {
   case 'completed': return 'text-foreground bg-muted';
   case 'confirmed': return 'text-blue-600 bg-blue-50';
   case 'pending': return 'text-amber-600 bg-muted';
   case 'cancelled': return 'text-primary bg-muted';
   default: return 'text-gray-600 bg-muted';
  }
 };

 const getStatusIcon = (status: string) => {
  switch (status.toLowerCase()) {
   case 'completed': return <CheckCircle className="w-3.5 h-3.5" />;
   case 'confirmed': return <Clock className="w-3.5 h-3.5" />;
   case 'pending': return <AlertCircle className="w-3.5 h-3.5" />;
   case 'cancelled': return <XCircle className="w-3.5 h-3.5" />;
   default: return null;
  }
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
       {bookings.map((booking) => (
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
          <div className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full ${getStatusStyle(booking.status)} font-semibold text-[9px] uppercase tracking-normal`}>
            {getStatusIcon(booking.status)}
            {booking.status}
          </div>
         </TableCell>
         <TableCell className="pr-10 py-6 text-right">
          <div className="flex items-center justify-end gap-2">
            <BookingActions 
              booking={booking} 
              userEmail={user?.email || ""} 
              onRefresh={() => fetchBookings(searchQuery, filterStatus)}
              onMessage={handleMessageProvider}
              isStartingChat={isStartingChat === booking.id}
            />

          </div>
         </TableCell>
        </TableRow>
       ))}
       {bookings.length === 0 && (
        <TableRow>
         <TableCell colSpan={6} className="h-80 text-center">
          <div className="flex flex-col items-center justify-center gap-4 text-muted-foreground">
            <ClipboardList className="w-12 h-12 opacity-20" />
            <p className="text-[10px] font-semibold uppercase tracking-normal tracking-normal ">No bookings found in your history</p>
            <Button asChild variant="link" className="text-primary font-bold uppercase text-[9px] tracking-normal underline decoration-2 underline-offset-4">
              <Link href="/services">Book your first service</Link>
            </Button>
          </div>
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
       <div className="col-span-full h-48 flex flex-col items-center justify-center text-muted-foreground border-2 border-dashed border-border rounded-[2.5rem] ">
        <ClipboardList className="w-12 h-12 opacity-20 mb-4" />
        No bookings found
       </div>
     ) : bookings.map((booking) => (
       <Card key={booking.id} className="border border-border group overflow-hidden border-none cursor-pointer hover:shadow-md transition-all bg-card/50 backdrop-blur-md">
         <CardContent className="p-0 flex flex-col">
          <div className="p-6 flex-1 flex flex-col gap-6">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-semibold text-primary uppercase bg-muted px-2 py-1 rounded-md">
                #{booking.booking_number}
              </span>
              <div className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full ${getStatusStyle(booking.status)} font-semibold text-[9px] uppercase tracking-normal`}>
                {getStatusIcon(booking.status)}
                {booking.status}
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="w-14 h-14 rounded-2xl bg-muted/50 flex flex-col items-center justify-center border border-border group-hover:border-primary/50 transition-all shrink-0">
                <span className="text-[9px] font-semibold text-muted-foreground uppercase">
                  {new Date(booking.scheduled_date).toLocaleString('default', { month: 'short' })}
                </span>
                <span className="text-xl font-bold text-foreground leading-none mt-0.5">
                  {new Date(booking.scheduled_date).getDate()}
                </span>
              </div>
              <div className="space-y-1">
                <h3 className="text-lg font-bold text-foreground group-hover:text-primary transition-colors line-clamp-1">
                  {booking.service?.name}
                </h3>
                <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wide">Professional Service</p>
              </div>
            </div>

            <div className="px-6 py-4 bg-muted/30 border-y border-border/50">
                <BookingProgressTracker status={booking.status} paymentStatus={booking.payment_status} />
            </div>
            
            <div className="grid grid-cols-2 gap-4 border-b border-border py-4 px-6">
              <div className="space-y-1">
                <p className="text-[9px] font-bold text-muted-foreground uppercase tracking-wider">Scheduled Time</p>
                <div className="flex items-center gap-1.5 text-[10px] font-semibold text-foreground">
                  <Clock className="w-3 h-3 text-muted-foreground mb-0.5" /> {getTimeSession(booking.scheduled_date)}
                </div>
              </div>
              <div className="space-y-1 pl-4 border-l border-border">
                <p className="text-[9px] font-bold text-muted-foreground uppercase tracking-wider">Price Est.</p>
                <div className="flex items-center gap-1.5 text-sm font-bold text-foreground">
                  KES {booking.estimated_price.toLocaleString()}
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between pt-2">
               <BookingActions 
                booking={booking} 
                userEmail={user?.email || ""} 
                onRefresh={() => fetchBookings(searchQuery, filterStatus)}
                onMessage={handleMessageProvider}
                isStartingChat={isStartingChat === booking.id}
              />
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

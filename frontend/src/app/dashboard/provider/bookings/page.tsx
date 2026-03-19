"use client";

import { useEffect, useState } from "react";
import axiosInstance from "@/lib/axios";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
 Calendar, 
 User as UserIcon, 
 Briefcase,
 MapPin,
 Clock,
 Loader2,
 ChevronRight,
 Zap,
 Building2,
 Home,
 Factory,
 ImageIcon,
 MessageSquare
} from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { DataToolbar } from "@/components/shared/DataToolbar";
import {
 Table,
 TableBody,
 TableCell,
 TableHead,
 TableHeader,
 TableRow,
} from "@/components/ui/table";
import { Booking, User } from "@/types";

export default function BookingsHistory() {
 const router = useRouter();
 const [bookings, setBookings] = useState<Booking[]>([]);
 const [isLoading, setIsLoading] = useState(true);
 const [searchQuery, setSearchQuery] = useState("");
 const [filterStatus, setFilterStatus] = useState("");
 const [isStartingChat, setIsStartingChat] = useState<number | null>(null);
 const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

 useEffect(() => {
  fetchBookings(searchQuery, filterStatus);
 }, [searchQuery, filterStatus]);

 const fetchBookings = async (search = "", status = "") => {
  try {
   // Temporary simulated search logic since we are relying on dashboard endpoint originally
   const res = await axiosInstance.get(`/api/provider/dashboard`); 
   let fetched: Booking[] = res.data.recent_bookings || [];
   if (search) {
     fetched = fetched.filter((b: Booking) => 
      b.service?.name?.toLowerCase().includes(search.toLowerCase()) || 
      b.id.toString().includes(search)
     );
   }
   if (status && status !== 'all') {
     fetched = fetched.filter((b: Booking) => b.status === status);
   }
   setBookings(fetched);
  } catch (err) {
   toast.error("Failed to load booking history");
  } finally {
   setIsLoading(false);
  }
 };

 const handleMessageClient = async (e: React.MouseEvent, bookingId: number) => {
  e.stopPropagation();
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

 const getStatusBadge = (status: string) => {
  const styles: { [key: string]: string } = {
   pending: "bg-yellow-50 text-yellow-600 border-yellow-100",
   confirmed: "bg-blue-50 text-blue-600 border-blue-100",
   completed: "bg-green-50 text-green-600 border-green-100",
   cancelled: "bg-red-50 text-red-600 border-red-100"
  };
  return (
   <Badge variant="outline" className={`rounded-full px-3 py-1 font-semibold text-[8px] uppercase tracking-normal border ${styles[status] || "bg-muted text-muted-foreground"}`}>
    {status}
   </Badge>
  );
 };

 if (isLoading) {
  return <div className="flex items-center justify-center h-64"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>;
 }

 return (
  <div className="max-w-[1200px] mx-auto space-y-8 pb-12">
   <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
    <div>
     <h1 className="text-2xl font-bold text-foreground tracking-tight">Fleet History</h1>
     <p className="text-sm text-muted-foreground mt-1">Comprehensive archive of all Kuba work orders.</p>
    </div>
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
          <TableHead className="pl-10 h-16 uppercase text-[10px] font-semibold tracking-normal text-muted-foreground">Order ID</TableHead>
          <TableHead className="h-16 uppercase text-[10px] font-semibold tracking-normal text-muted-foreground">Service</TableHead>
          <TableHead className="h-16 uppercase text-[10px] font-semibold tracking-normal text-muted-foreground">Client</TableHead>
          <TableHead className="h-16 uppercase text-[10px] font-semibold tracking-normal text-muted-foreground">Date</TableHead>
          <TableHead className="h-16 uppercase text-[10px] font-semibold tracking-normal text-muted-foreground">Status</TableHead>
          <TableHead className="h-16 pr-10 text-right uppercase text-[10px] font-semibold tracking-normal text-muted-foreground">Action</TableHead>
         </TableRow>
        </TableHeader>
        <TableBody>
         {bookings.map((booking: Booking) => (
          <TableRow key={booking.id} className="hover:bg-muted/50 transition-colors border-border group">
           <TableCell className="pl-10 py-6">
            <span className="text-[10px] font-semibold text-primary uppercase tracking-normal">
              #{booking.id || booking.booking_number}
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
            {getStatusBadge(booking.status)}
           </TableCell>
           <TableCell className="pr-10 py-6 text-right">
            <Button 
             variant="outline" 
             onClick={(e) => handleMessageClient(e, booking.id)}
             disabled={isStartingChat === booking.id}
             className="text-primary border-sky-100 hover:bg-muted h-8 rounded-lg px-3 inline-flex items-center gap-1.5"
            >
              {isStartingChat === booking.id ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <MessageSquare className="w-3.5 h-3.5" />}
              <span className="text-[9px] font-semibold uppercase tracking-normal">Message</span>
            </Button>
           </TableCell>
          </TableRow>
         ))}
         {bookings.length === 0 && (
          <TableRow>
           <TableCell colSpan={6} className="h-80 text-center">
            <div className="flex flex-col items-center justify-center gap-4 text-muted-foreground ">
              <Zap className="w-12 h-12 opacity-20" />
              <p className="text-[10px] font-semibold uppercase tracking-normal">No transaction records found</p>
            </div>
           </TableCell>
          </TableRow>
         )}
        </TableBody>
       </Table>
      </CardContent>
    </Card>
   ) : (
   <div className="grid grid-cols-1 md:grid-cols-2 mt-4 gap-6">
    {bookings.length === 0 ? (
     <div className="col-span-full border-border rounded-[2.5rem] p-20 flex flex-col items-center gap-4 text-muted-foreground border-2 border-dashed ">
      <Zap className="w-12 h-12 opacity-10" />
      <p className="text-[10px] font-semibold uppercase tracking-normal">No transaction records found</p>
     </div>
    ) : bookings.map((booking: Booking) => (
     <Card key={booking.id} className="border border-border group border-none overflow-hidden hover:bg-muted/50 transition-all cursor-pointer">
      <CardContent className="p-0 flex">
       <div className={`w-1.5 transition-all duration-500 ${booking.status === 'completed' ? 'bg-green-600' : booking.status === 'pending' ? 'bg-amber-400' : 'bg-blue-600'} group-hover:w-3`}></div>
       <div className="p-8 flex-1 flex flex-col md:flex-row justify-between items-start md:items-center gap-8">
        <div className="flex items-start gap-6">
         <div className="p-5 bg-muted rounded-2xl text-foreground group-hover:bg-white group-hover:shadow-sm transition-all duration-500 mt-1">
          {booking.service_type === 'commercial' ? <Building2 className="w-6 h-6 text-foreground" /> : booking.service_type === 'large_scale' ? <Factory className="w-6 h-6 text-rose-600" /> : <Home className="w-6 h-6 text-blue-600" />}
         </div>
         <div className="space-y-4">
          <div className="space-y-2">
            <div className="flex items-center gap-3">
            <span className="text-[10px] font-semibold text-primary uppercase tracking-normal leading-none">#{booking.id}</span>
            {getStatusBadge(booking.status)}
            </div>
            <div className="flex items-center gap-3">
              <h3 className="text-xl font-semibold text-foreground group-hover:text-primary transition-colors uppercase tracking-tight leading-none">{booking.service?.name}</h3>
              {booking.quantity && (
                <Badge className="bg-gray-100 text-gray-600 hover:bg-gray-200 uppercase tracking-normal text-[9px] font-semibold">
                  {booking.quantity} {booking.service_type === 'commercial' ? 'Offices' : booking.service_type === 'large_scale' ? 'Units' : 'Rooms'}
                </Badge>
              )}
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-6 text-[10px] font-bold text-muted-foreground uppercase tracking-tighter">
           <span className="flex items-center gap-1.5"><Calendar className="w-4 h-4" /> {new Date(booking.scheduled_date).toLocaleDateString()}</span>
           <span className="flex items-center gap-1.5 font-semibold text-foreground"><UserIcon className="w-4 h-4" /> {booking.customer?.name}</span>
           <span className="flex items-center gap-1.5"><MapPin className="w-4 h-4" /> {booking.address?.street_address || 'Service Location'}</span>
          </div>

          {booking.description && (
            <p className="text-xs text-muted-foreground max-w-xl line-clamp-2">"{booking.description}"</p>
          )}

          {/* Image Gallery Preview */}
          {booking.image_urls && booking.image_urls.length > 0 && (
            <div className="flex items-center gap-3 mt-4">
              <div className="flex -space-x-3">
                {booking.image_urls.slice(0, 3).map((img: any, idx: number) => (
                  <div key={img.id} className="w-10 h-10 rounded-xl border-2 border-white shadow-sm overflow-hidden bg-gray-100 z-10" style={{ zIndex: 10 - idx }}>
                    <img src={img.url} alt="Issue detail" className="w-full h-full object-cover" />
                  </div>
                ))}
              </div>
              <span className="text-[10px] font-bold text-muted-foreground flex items-center gap-1 uppercase tracking-normal">
                <ImageIcon className="w-3 h-3" /> {booking.image_urls.length} Attached
              </span>
            </div>
          )}
         </div>
        </div>
        
          <div className="flex flex-col items-end gap-2 shrink-0">
          <p className="text-[8px] font-semibold text-muted-foreground uppercase tracking-normal ">Est. Revenue</p>
          <div className="flex items-center gap-4">
           <div className="text-right">
             <p className="text-lg font-semibold text-foreground">${Number(booking.estimated_price || booking.final_price || 0).toLocaleString()}</p>
             <p className="text-[8px] font-semibold text-muted-foreground uppercase bg-muted px-2 py-0.5 rounded-full inline-block mt-1">Pending Confirmation</p>
           </div>
          </div>
          <Button 
           variant="outline" 
           onClick={(e) => handleMessageClient(e, booking.id)}
           disabled={isStartingChat === booking.id}
           className="mt-2 text-primary border-sky-100 hover:bg-muted h-8 rounded-lg px-3 flex items-center gap-1.5"
          >
            {isStartingChat === booking.id ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <MessageSquare className="w-3.5 h-3.5" />}
            <span className="text-[9px] font-semibold uppercase tracking-normal">Message Client</span>
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

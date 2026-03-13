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

export default function BookingsHistory() {
  const router = useRouter();
  const [bookings, setBookings] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isStartingChat, setIsStartingChat] = useState<number | null>(null);

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      const res = await axiosInstance.get("/api/provider/dashboard"); // Reusing this for now as it has bookings
      setBookings(res.data.recent_bookings || []);
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
    const styles: any = {
      pending: "bg-amber-50 text-amber-600 border-amber-100",
      confirmed: "bg-blue-50 text-blue-600 border-blue-100",
      completed: "bg-emerald-50 text-emerald-600 border-emerald-100",
      cancelled: "bg-red-50 text-red-600 border-red-100"
    };
    return (
      <Badge variant="outline" className={`rounded-full px-3 py-1 font-black text-[8px] uppercase tracking-widest border ${styles[status] || "bg-gray-50 text-gray-500"}`}>
        {status}
      </Badge>
    );
  };

  if (isLoading) {
    return <div className="flex items-center justify-center h-64"><Loader2 className="w-8 h-8 animate-spin text-sky-600" /></div>;
  }

  return (
    <div className="max-w-[1200px] mx-auto space-y-8 pb-12">
      <div>
        <h1 className="text-3xl font-black text-[#1E293B] uppercase tracking-tight italic">Fleet <span className="text-sky-600">History</span></h1>
        <p className="text-gray-400 text-[10px] font-black uppercase tracking-[0.2em] mt-1 italic">Comprehensive archive of all Kuba work orders</p>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {bookings.length === 0 ? (
          <div className="bg-white rounded-3xl p-20 flex flex-col items-center gap-4 text-gray-300 border-2 border-dashed border-gray-100 italic">
            <Zap className="w-12 h-12 opacity-10" />
            <p className="text-[10px] font-black uppercase tracking-widest">No transaction records found</p>
          </div>
        ) : bookings.map((booking: any) => (
          <Card key={booking.id} className="premium-card group border-none overflow-hidden hover:bg-gray-50/50 transition-all cursor-pointer">
            <CardContent className="p-0 flex">
              <div className={`w-1.5 transition-all duration-500 ${booking.status === 'completed' ? 'bg-emerald-500' : booking.status === 'pending' ? 'bg-amber-400' : 'bg-blue-600'} group-hover:w-3`}></div>
              <div className="p-8 flex-1 flex flex-col md:flex-row justify-between items-start md:items-center gap-8">
                <div className="flex items-start gap-6">
                  <div className="p-5 bg-gray-50 rounded-2xl text-[#1E293B] group-hover:bg-white group-hover:shadow-sm transition-all duration-500 mt-1">
                    {booking.service_type === 'commercial' ? <Building2 className="w-6 h-6 text-indigo-600" /> : booking.service_type === 'large_scale' ? <Factory className="w-6 h-6 text-rose-600" /> : <Home className="w-6 h-6 text-blue-600" />}
                  </div>
                  <div className="space-y-4">
                    <div className="space-y-2">
                        <div className="flex items-center gap-3">
                        <span className="text-[10px] font-black text-sky-600 uppercase tracking-widest leading-none">#{booking.id}</span>
                        {getStatusBadge(booking.status)}
                        </div>
                        <div className="flex items-center gap-3">
                            <h3 className="text-xl font-black text-[#1E293B] group-hover:text-sky-600 transition-colors uppercase tracking-tight leading-none">{booking.service?.name}</h3>
                            {booking.quantity && (
                                <Badge className="bg-gray-100 text-gray-600 hover:bg-gray-200 uppercase tracking-widest text-[9px] font-black">
                                    {booking.quantity} {booking.service_type === 'commercial' ? 'Offices' : booking.service_type === 'large_scale' ? 'Units' : 'Rooms'}
                                </Badge>
                            )}
                        </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-6 text-[10px] font-bold text-gray-400 uppercase tracking-tighter">
                      <span className="flex items-center gap-1.5"><Calendar className="w-4 h-4" /> {new Date(booking.scheduled_date).toLocaleDateString()}</span>
                      <span className="flex items-center gap-1.5 font-black text-[#1E293B]"><UserIcon className="w-4 h-4" /> {booking.customer?.name}</span>
                      <span className="flex items-center gap-1.5"><MapPin className="w-4 h-4" /> {booking.address?.address_line1 || 'Service Location'}</span>
                    </div>

                    {booking.description && (
                        <p className="text-xs text-gray-500 italic max-w-xl line-clamp-2">"{booking.description}"</p>
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
                            <span className="text-[10px] font-bold text-gray-400 flex items-center gap-1 uppercase tracking-widest">
                                <ImageIcon className="w-3 h-3" /> {booking.image_urls.length} Attached
                            </span>
                        </div>
                    )}
                  </div>
                </div>
                
                <div className="flex flex-col items-end gap-2 shrink-0">
                   <p className="text-[8px] font-black text-gray-300 uppercase tracking-widest italic">Est. Revenue</p>
                   <div className="flex items-center gap-4">
                      <div className="text-right">
                         <p className="text-lg font-black text-[#1E293B]">${Number(booking.estimated_price || booking.total_price || 0).toLocaleString()}</p>
                         <p className="text-[8px] font-black text-emerald-500 uppercase italic bg-emerald-50 px-2 py-0.5 rounded-full inline-block mt-1">Pending Confirmation</p>
                      </div>
                   </div>
                   <Button 
                      variant="outline" 
                      onClick={(e) => handleMessageClient(e, booking.id)}
                      disabled={isStartingChat === booking.id}
                      className="mt-2 text-sky-600 border-sky-100 hover:bg-sky-50 h-8 rounded-lg px-3 flex items-center gap-1.5"
                   >
                       {isStartingChat === booking.id ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <MessageSquare className="w-3.5 h-3.5" />}
                       <span className="text-[9px] font-black uppercase tracking-widest">Message Client</span>
                   </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

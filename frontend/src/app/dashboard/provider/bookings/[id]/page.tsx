"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import axiosInstance from "@/lib/axios";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Clock, 
  MapPin, 
  User, 
  CreditCard, 
  CheckCircle2, 
  AlertCircle,
  MessageSquare,
  XCircle,
  FileText,
  ArrowLeft,
  Loader2,
  Zap,
} from "lucide-react";
import { format } from "date-fns";
import { ChatUI } from "@/components/chat/ChatUI";
import { ServiceProgress } from "@/components/booking/ServiceProgress";
import { LiveServiceTimer } from "@/components/booking/LiveServiceTimer";
import { toast } from "sonner";

export default function ProviderBookingDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [booking, setBooking] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showChat, setShowChat] = useState(false);

  useEffect(() => {
    if (params.id) {
      fetchBooking();
    }
  }, [params.id]);

  const fetchBooking = async () => {
    try {
      console.log("Fetching booking details...");
      const response = await axiosInstance.get(`/api/bookings/${params.id}`);
      console.log("Fetch success! Response data:", response.data);
      setBooking(response.data.booking || response.data.data || response.data);
    } catch (err: any) {
      console.error("Fetch error:", err);
      toast.error("Failed to load booking details");
      router.push("/dashboard/provider/bookings");
    } finally {
      setIsLoading(false);
    }
  };

  const handleStatusUpdate = async (status: string) => {
    try {
      await axiosInstance.patch(`/api/bookings/${booking.id}/status`, { status });
      toast.success(`Booking marked as ${status}`);
      fetchBooking();
    } catch (error) {
      toast.error("Failed to update status");
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed': return 'text-blue-600 bg-blue-50 border-blue-100';
      case 'in_progress': return 'text-emerald-700 bg-emerald-100 border-emerald-200';
      case 'completed': return 'text-emerald-600 bg-emerald-50 border-emerald-100';
      case 'cancelled': return 'text-sky-600 bg-sky-50 border-sky-100';
      default: return 'text-amber-600 bg-amber-50 border-amber-100';
    }
  };

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-sky-600" />
      </div>
    );
  }

  if (!booking) return null;

  return (
    <div className="max-w-4xl mx-auto py-8">
      <Button 
        variant="ghost" 
        onClick={() => router.push("/dashboard/provider/bookings")}
        className="mb-6 flexItems-center gap-2 text-gray-500 hover:text-gray-900"
      >
        <ArrowLeft className="w-4 h-4" /> Back to Bookings
      </Button>

      <div className="bg-white dark:bg-zinc-900 overflow-hidden border border-gray-100 dark:border-white/5 rounded-[2rem] shadow-premium transition-all duration-500">
        {showChat ? (
          <div className="p-4 sm:p-8 bg-white dark:bg-zinc-950">
            <div className="flex items-center justify-between mb-4 px-4">
              <Button variant="ghost" onClick={() => setShowChat(false)} className="text-sky-600 font-black uppercase tracking-widest text-[10px]">
                ← Back to Details
              </Button>
              <h2 className="font-black text-[#1E293B] dark:text-white uppercase tracking-tighter">Booking Chat</h2>
            </div>
            <div className="h-[600px] rounded-2xl overflow-hidden border border-gray-100 dark:border-white/5 relative">
               <ChatUI bookingId={booking.id} />
            </div>
          </div>
        ) : (
          <>
            <div className="bg-[#1E293B] p-8 sm:p-12 text-white relative overflow-hidden">
                <div className="absolute top-0 right-0 p-8 opacity-10">
                    <FileText className="w-32 h-32" />
                </div>
                <div className="relative z-10 space-y-6">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div className="space-y-1">
                            <p className="text-[10px] sm:text-xs font-black uppercase tracking-[0.3em] text-sky-500">Booking Reference</p>
                            <h2 className="text-3xl sm:text-4xl font-black italic tracking-tighter">#{booking.booking_number}</h2>
                        </div>
                        <Badge variant="outline" className={`rounded-full px-6 py-2 font-black text-[10px] uppercase tracking-widest border ${getStatusColor(booking.status)}`}>
                            {booking.status}
                        </Badge>
                    </div>
                    
                    {/* Service Tracking Progress */}
                    <div className="pt-4">
                      <ServiceProgress status={booking.status} />
                    </div>

                    {/* Live Timer Section */}
                    {(booking.status === 'in_progress' || booking.status === 'completed') && (
                      <div className="pt-8 w-full max-w-xl mx-auto">
                        <LiveServiceTimer 
                          startedAt={booking.started_at}
                          completedAt={booking.completed_at}
                          basePrice={Number(booking.service?.price || booking.estimated_price)}
                          pricingType={booking.service_type === 'hourly' ? 'hourly' : 'fixed'}
                          status={booking.status}
                        />
                      </div>
                    )}
                </div>
            </div>

            <div className="p-8 sm:p-12 space-y-8 bg-white dark:bg-zinc-900">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                    <div className="space-y-1.5 border border-gray-100 dark:border-white/5 p-6 rounded-2xl bg-gray-50/50 dark:bg-zinc-950/50">
                        <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 flex items-center gap-2">
                            <Clock className="w-4 h-4 text-sky-500" /> Scheduled Time
                        </p>
                        <p className="font-black text-lg text-[#1E293B] dark:text-white mt-2">
                            {booking.scheduled_date ? format(new Date(booking.scheduled_date), 'PPP') : 'TBD'}
                            {booking.scheduled_time && <span className="block text-sm text-sky-600 uppercase tracking-widest mt-1">{booking.scheduled_time}</span>}
                        </p>
                    </div>
                    <div className="space-y-1.5 border border-gray-100 dark:border-white/5 p-6 rounded-2xl bg-gray-50/50 dark:bg-zinc-950/50">
                        <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 flex items-center gap-2">
                            <User className="w-4 h-4 text-indigo-500" /> Customer
                        </p>
                        <p className="font-black text-lg text-[#1E293B] dark:text-white mt-2">
                            {booking.customer?.first_name} {booking.customer?.last_name}
                        </p>
                    </div>
                </div>

                <div className="space-y-1.5 border border-gray-100 dark:border-white/5 p-6 rounded-2xl">
                    <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 flex items-center gap-2 mb-2">
                        <MapPin className="w-4 h-4 text-rose-500" /> Service Location
                    </p>
                    <p className="font-bold text-base text-[#1E293B] dark:text-gray-300 leading-relaxed">
                        {booking.address ? `${booking.address.street_address}, ${booking.address.city}` : 'On-site Service'}
                    </p>
                </div>

                <div className="p-6 sm:p-8 bg-gray-50 dark:bg-zinc-950 rounded-2xl space-y-6 border border-gray-100 dark:border-white/5 shadow-inner">
                    <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest text-gray-400 border-b border-gray-200 dark:border-white/10 pb-4">
                        <span>Service Item</span>
                        <span>Cost Breakdown</span>
                    </div>
                    <div className="flex justify-between items-center">
                        <p className="font-black text-lg text-[#1E293B] dark:text-white">{booking.service?.name}</p>
                        <p className="font-black text-2xl text-sky-600 italic tracking-tighter">
                            KES {booking.final_price || booking.estimated_price || '0.00'}
                        </p>
                    </div>
                </div>

                {booking.description && (
                    <div className="space-y-2">
                        <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">Specific Requirements</p>
                        <p className="text-sm font-bold text-gray-600 dark:text-gray-400 italic leading-relaxed bg-[#F8FAFC] dark:bg-zinc-950 p-6 rounded-2xl border border-gray-100 dark:border-white/5">
                            "{booking.description}"
                        </p>
                    </div>
                )}

                <div className="flex flex-col sm:flex-row items-center gap-4 pt-6 border-t border-gray-100 dark:border-white/5">
                    {booking.status === 'pending' && (
                        <Button 
                            onClick={() => handleStatusUpdate('confirmed')}
                            className="w-full sm:flex-1 h-14 bg-emerald-600 hover:bg-emerald-700 text-white rounded-2xl font-black text-[10px] sm:text-xs uppercase tracking-widest transition-all gap-2 shadow-lg shadow-emerald-600/20"
                        >
                            <CheckCircle2 className="w-4 h-4" />
                            Accept Request
                        </Button>
                    )}
                    {booking.status === 'confirmed' && (
                        <Button 
                            onClick={() => handleStatusUpdate('in_progress')}
                            className="w-full sm:flex-1 h-14 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl font-black text-[10px] sm:text-xs uppercase tracking-widest transition-all gap-2 shadow-lg shadow-blue-600/20"
                        >
                            <Zap className="w-4 h-4 fill-white" />
                            Commence Service
                        </Button>
                    )}
                    {booking.status === 'in_progress' && (
                        <Button 
                            onClick={() => handleStatusUpdate('completed')}
                            className="w-full sm:flex-1 h-14 bg-emerald-600 hover:bg-emerald-700 text-white rounded-2xl font-black text-[10px] sm:text-xs uppercase tracking-widest transition-all gap-2 shadow-lg shadow-emerald-600/20"
                        >
                            <CheckCircle2 className="w-4 h-4" />
                            Complete Service
                        </Button>
                    )}
                    <Button 
                        onClick={() => setShowChat(true)}
                        className="w-full sm:flex-[2] h-14 bg-[#1E293B] dark:bg-sky-600 hover:bg-sky-600 text-white rounded-2xl font-black text-[10px] sm:text-xs uppercase tracking-widest transition-all shadow-lg gap-2"
                    >
                        <MessageSquare className="w-4 h-4" />
                        Message Customer
                    </Button>
                </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

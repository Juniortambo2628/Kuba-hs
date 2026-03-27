"use client";

import { use, useState, useEffect } from "react";
import axiosInstance from "@/lib/axios";
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Clock, 
  MapPin, 
  User as UserIcon, 
  Building2, 
  CreditCard, 
  MessageSquare,
  ChevronLeft,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Briefcase,
  ExternalLink,
  Phone,
  Mail,
  Zap,
  Star,
  ReceiptText,
  ShieldCheck
} from "lucide-react";
import Link from "next/link";
import { format } from "date-fns";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { ChatUI } from "@/components/chat/ChatUI";
import { useData } from "@/hooks/useData";
import { StatsSkeleton } from "@/components/shared/AdvancedSkeleton";
import { Skeleton } from "@/components/ui/skeleton";

export default function AdminBookingClient({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const { data: bookingData, isLoading, mutate: revalidate } = useData<any>(id ? `/api/bookings/${id}` : null);
  const booking = bookingData?.booking || null;
  const [showChat, setShowChat] = useState(false);

  const updateStatus = async (status: string) => {
    try {
      await axiosInstance.patch(`/api/bookings/${id}/status`, { status });
      toast.success(`Booking marked as ${status}`);
      revalidate();
    } catch (err) {
      toast.error("Failed to update status");
    }
  };

  const getStatusStyle = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-amber-50 text-amber-700 border-amber-100';
      case 'confirmed': return 'bg-blue-50 text-blue-700 border-blue-100';
      case 'completed': return 'bg-emerald-50 text-emerald-700 border-emerald-100';
      case 'cancelled': return 'bg-sky-50 text-sky-700 border-sky-100';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  if (isLoading) {
    return (
      <div className="max-w-[1400px] mx-auto space-y-8 p-4">
        <div className="flex items-center gap-4">
          <Skeleton className="h-14 w-14 rounded-2xl" />
          <div className="space-y-2">
            <Skeleton className="h-8 w-64 rounded-xl" />
            <Skeleton className="h-4 w-48 rounded-lg" />
          </div>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
           <div className="lg:col-span-8">
              <Skeleton className="h-[500px] w-full rounded-[2.5rem]" />
           </div>
           <div className="lg:col-span-4 gap-6 flex flex-col">
              <Skeleton className="h-64 w-full rounded-[2rem]" />
              <Skeleton className="h-64 w-full rounded-[2rem]" />
           </div>
        </div>
      </div>
    );
  }

  if (!booking) {
    return (
      <div className="h-[60vh] flex flex-col items-center justify-center gap-4">
        <XCircle className="w-16 h-16 text-muted-foreground/20" />
        <h2 className="text-xl font-bold uppercase tracking-widest text-muted-foreground">Booking Not Found</h2>
        <Button asChild variant="outline" className="rounded-xl">
          <Link href="/admin/bookings">Return to Registry</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="max-w-[1400px] mx-auto space-y-10 pb-20 px-4">
      {/* Navigation & Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div className="flex items-center gap-6">
          <Link href="/admin/bookings">
            <Button variant="ghost" className="h-14 w-14 rounded-2xl bg-muted/50 hover:bg-muted border border-border transition-all">
              <ChevronLeft className="w-6 h-6" />
            </Button>
          </Link>
          <div className="space-y-1">
            <div className="flex items-center gap-3">
              <h1 className="text-3xl font-bold text-foreground tracking-tighter uppercase">
                Order <span className="text-primary">#{booking.booking_number}</span>
              </h1>
              <Badge variant="outline" className={`rounded-full px-4 py-1 font-bold text-[10px] uppercase tracking-widest border shadow-sm ${getStatusStyle(booking.status)}`}>
                {booking.status}
              </Badge>
            </div>
            <p className="text-xs font-semibold text-muted-foreground uppercase flex items-center gap-2">
              <Zap className="w-3.5 h-3.5 text-primary" />
              Service Transaction Orchestrated via Kuba Marketplace
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
           {booking.status === 'pending' && (
             <Button onClick={() => updateStatus('confirmed')} className="h-12 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold px-8 shadow-xl shadow-emerald-100 transition-all uppercase text-[10px] tracking-widest">
                Confirm Execution
             </Button>
           )}
           <Button onClick={() => setShowChat(!showChat)} variant="outline" className="h-12 border-border text-foreground hover:bg-muted rounded-xl font-bold px-8 transition-all uppercase text-[10px] tracking-widest gap-2">
              <MessageSquare className="w-4 h-4" />
              {showChat ? "Hide Logs" : "Monitor Comms"}
           </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        <div className="lg:col-span-8 space-y-10">
          {showChat ? (
            <Card className="border-none shadow-premium rounded-[2.5rem] overflow-hidden bg-card/50 backdrop-blur-md">
              <CardHeader className="p-8 border-b border-border bg-muted/30">
                <CardTitle className="text-lg font-bold uppercase tracking-tight flex items-center gap-3">
                  <MessageSquare className="w-5 h-5 text-primary" />
                  Communication Logs
                </CardTitle>
              </CardHeader>
              <CardContent className="p-4">
                <ChatUI bookingId={booking.id} />
              </CardContent>
            </Card>
          ) : (
            <>
              <Card className="border-none shadow-premium rounded-[2.5rem] overflow-hidden bg-card/50 backdrop-blur-md">
                <div className="h-32 bg-primary relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-r from-sky-600/20 to-transparent"></div>
                </div>
                <CardContent className="p-10 -mt-10 relative z-10">
                  <div className="flex flex-col md:flex-row gap-10">
                    <div className="w-24 h-24 rounded-[2rem] bg-white shadow-xl flex items-center justify-center text-primary border border-sky-50 shrink-0">
                      <Zap className="w-10 h-10" />
                    </div>
                    <div className="space-y-6 flex-1">
                      <div className="space-y-1">
                        <h2 className="text-2xl font-bold text-foreground italic tracking-tight">{booking.service?.name}</h2>
                        <p className="text-sm font-medium text-muted-foreground leading-relaxed">{booking.service?.description}</p>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-4">
                        <div className="space-y-1.5">
                          <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest flex items-center gap-2">
                             <Clock className="w-3.5 h-3.5" /> Timeline
                          </p>
                          <p className="text-sm font-bold text-foreground line-clamp-2">
                            {format(new Date(booking.scheduled_date), 'PPP')}<br/>
                            <span className="text-muted-foreground opacity-60">{booking.scheduled_time || 'TBD'}</span>
                          </p>
                        </div>
                        <div className="space-y-1.5">
                          <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest flex items-center gap-2">
                             <MapPin className="w-3.5 h-3.5" /> Deployment
                          </p>
                          <p className="text-sm font-bold text-foreground line-clamp-2">
                            {booking.address?.street_address}<br/>
                            <span className="text-muted-foreground opacity-60">{booking.address?.city}</span>
                          </p>
                        </div>
                        <div className="space-y-1.5 text-right sm:text-left">
                          <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest flex items-center gap-2">
                             <ReceiptText className="w-3.5 h-3.5" /> Financial
                          </p>
                          <p className="text-3xl font-bold text-primary italic tracking-tight">
                            KES {Number(booking.final_price || booking.estimated_price || 0).toLocaleString()}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {booking.description && (
                <Card className="border-none shadow-sm rounded-[2rem] bg-[#F8FAFC]">
                   <CardContent className="p-8 space-y-4">
                      <h3 className="text-[10px] font-bold text-foreground uppercase tracking-widest">Client Directives</h3>
                      <blockquote className="text-sm font-medium text-slate-600 leading-loose italic">
                        "{booking.description}"
                      </blockquote>
                   </CardContent>
                </Card>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}

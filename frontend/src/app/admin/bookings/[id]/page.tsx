"use client";

import { useEffect, useState, use } from "react";
import axiosInstance from "@/lib/axios";
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
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

export default function AdminBookingDetail({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [booking, setBooking] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showChat, setShowChat] = useState(false);

  useEffect(() => {
    fetchBookingDetail();
  }, [id]);

  const fetchBookingDetail = async () => {
    try {
      const res = await axiosInstance.get(`/api/bookings/${id}`);
      setBooking(res.data.booking);
    } catch (err) {
      console.error("Failed to fetch booking:", err);
      toast.error("Failed to load booking details");
    } finally {
      setIsLoading(false);
    }
  };

  const updateStatus = async (status: string) => {
    try {
      await axiosInstance.patch(`/api/bookings/${id}/status`, { status });
      toast.success(`Booking marked as ${status}`);
      fetchBookingDetail();
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
      <div className="max-w-[1400px] mx-auto space-y-8 animate-pulse p-4">
        <div className="flex items-center gap-4">
          <Skeleton className="h-10 w-10 rounded-xl" />
          <Skeleton className="h-10 w-64 rounded-xl" />
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <Skeleton className="lg:col-span-2 h-[600px] rounded-[2.5rem]" />
          <Skeleton className="h-[600px] rounded-[2.5rem]" />
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
        {/* Main Details Column */}
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
              {/* Service & Location */}
              <Card className="border-none shadow-premium rounded-[2.5rem] overflow-hidden bg-card/50 backdrop-blur-md">
                <div className="h-32 bg-primary relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-r from-sky-600/20 to-transparent"></div>
                  <div className="absolute top-0 right-0 p-8 opacity-10">
                    <Briefcase className="w-32 h-32" />
                  </div>
                </div>
                <CardContent className="p-10 -mt-10 relative z-10">
                  <div className="flex flex-col md:flex-row gap-10">
                    <div className="w-24 h-24 rounded-[2rem] bg-white shadow-xl flex items-center justify-center text-primary border border-sky-50 shrink-0">
                      <Zap className="w-10 h-10" />
                    </div>
                    <div className="space-y-6 flex-1">
                      <div className="space-y-1">
                        <h2 className="text-2xl font-bold text-foreground italic tracking-tight">{booking.service?.name}</h2>
                        <p className="text-sm font-medium text-muted-foreground leading-relaxed">{booking.service?.description || "Professional home maintenance service executed by Kuba marketplace partners."}</p>
                      </div>
                      
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-4">
                        <div className="space-y-1.5">
                          <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest flex items-center gap-2">
                             <Clock className="w-3.5 h-3.5" /> Timeline
                          </p>
                          <p className="text-sm font-bold text-foreground">
                            {format(new Date(booking.scheduled_date), 'PPP')}<br/>
                            <span className="text-muted-foreground opacity-60">{booking.scheduled_time || '09:00 AM'}</span>
                          </p>
                        </div>
                        <div className="space-y-1.5">
                          <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest flex items-center gap-2">
                             <MapPin className="w-3.5 h-3.5" /> Deployment
                          </p>
                          <p className="text-sm font-bold text-foreground">
                            {booking.address?.street_address}<br/>
                            <span className="text-muted-foreground opacity-60">{booking.address?.city}, {booking.address?.postal_code}</span>
                          </p>
                        </div>
                        <div className="space-y-1.5 text-right sm:text-left">
                          <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest flex items-center gap-2 sm:justify-start justify-end">
                             <ReceiptText className="w-3.5 h-3.5" /> Financial
                          </p>
                          <p className="text-3xl font-bold text-primary italic tracking-tight underline decoration-sky-100 decoration-4 underline-offset-4">
                            ${booking.final_price || booking.estimated_price || '0.00'}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Requirement Text */}
              {booking.description && (
                <Card className="border-none shadow-sm rounded-[2rem] bg-[#F8FAFC]">
                   <CardContent className="p-8 space-y-4">
                      <div className="flex items-center gap-3">
                         <div className="w-2 h-2 rounded-full bg-primary animate-pulse"></div>
                         <h3 className="text-[10px] font-bold text-foreground uppercase tracking-widest">Client Directives</h3>
                      </div>
                      <blockquote className="text-sm font-medium text-slate-600 leading-loose italic">
                        "{booking.description}"
                      </blockquote>
                   </CardContent>
                </Card>
              )}

              {/* Status Timeline */}
              <Card className="border-none shadow-sm rounded-[2.5rem] bg-card/50">
                 <CardHeader className="p-8 border-b border-border">
                    <CardTitle className="text-[11px] font-bold uppercase tracking-[0.3em] flex items-center gap-3">
                       <Activity className="w-4 h-4 text-primary" /> Lifecycle Metrics
                    </CardTitle>
                 </CardHeader>
                 <CardContent className="p-8">
                    <div className="relative space-y-12">
                       <div className="absolute left-[23px] top-2 bottom-2 w-0.5 bg-muted"></div>
                       {[
                         { status: 'booked', label: 'Order Processed', icon: ReceiptText, time: booking.created_at, completed: true },
                         { status: 'confirmed', label: 'Provider Sync', icon: ShieldCheck, time: booking.status !== 'pending' ? booking.updated_at : null, completed: booking.status !== 'pending' },
                         { status: 'completed', label: 'Service Verified', icon: CheckCircle2, time: booking.status === 'completed' ? booking.updated_at : null, completed: booking.status === 'completed' }
                       ].map((step, i) => (
                         <div key={i} className={`flex items-start gap-6 relative z-10 ${!step.completed ? 'opacity-30 grayscale' : ''}`}>
                            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center border-4 border-white shadow-xl transition-all duration-500 ${step.completed ? 'bg-primary text-white scale-110' : 'bg-muted text-muted-foreground'}`}>
                               <step.icon className="w-5 h-5" />
                            </div>
                            <div className="space-y-1 py-1">
                               <p className="text-sm font-bold text-foreground uppercase tracking-tight">{step.label}</p>
                               <p className="text-[10px] font-bold text-muted-foreground uppercase opacity-60">
                                 {step.time ? format(new Date(step.time), 'PPP p') : 'Awaiting Protocol Execution'}
                               </p>
                            </div>
                         </div>
                       ))}
                    </div>
                 </CardContent>
              </Card>
            </>
          )}
        </div>

        {/* Sidebar Info */}
        <div className="lg:col-span-4 space-y-8">
           {/* Client Profile */}
           <Card className="border-none shadow-premium rounded-[2.5rem] overflow-hidden bg-card/50 backdrop-blur-md">
              <CardContent className="p-8 space-y-6">
                 <div className="flex items-center justify-between">
                    <h3 className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Client Record</h3>
                    <UserIcon className="w-4 h-4 text-primary" />
                 </div>
                 <div className="flex gap-4 items-center">
                    <div className="w-16 h-16 rounded-2xl bg-muted flex items-center justify-center text-foreground font-bold text-2xl border border-border shadow-inner">
                       {booking.customer?.name?.[0] || 'C'}
                    </div>
                    <div>
                        <Link href={`/admin/users?id=${booking.customer?.id}`} className="text-lg font-bold text-foreground hover:text-primary transition-colors flex items-center gap-2 group">
                           {booking.customer?.name}
                           <ExternalLink className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-all" />
                        </Link>
                        <p className="text-[9px] font-bold text-primary bg-primary/10 px-2 py-0.5 rounded-full inline-block uppercase tracking-wide mt-1">Marketplace Member</p>
                    </div>
                 </div>
                 <div className="space-y-4 pt-4 border-t border-border">
                    <div className="flex items-center gap-3 text-xs font-semibold text-foreground">
                       <Mail className="w-4 h-4 text-muted-foreground" />
                       {booking.customer?.email}
                    </div>
                    <div className="flex items-center gap-3 text-xs font-semibold text-foreground">
                       <Phone className="w-4 h-4 text-muted-foreground" />
                       {booking.customer?.phone || "+27 NOT PROVIDED"}
                    </div>
                 </div>
              </CardContent>
           </Card>

           {/* Provider Profile */}
           <Card className="border-none shadow-premium rounded-[2.5rem] overflow-hidden bg-card/50 backdrop-blur-md">
              <CardContent className="p-8 space-y-6">
                 <div className="flex items-center justify-between">
                    <h3 className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Merchant Record</h3>
                    <Building2 className="w-4 h-4 text-primary" />
                 </div>
                 <div className="flex gap-4 items-center">
                    <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center text-primary font-bold text-2xl border border-primary/20 shadow-inner">
                       {booking.provider?.business_name?.[0] || booking.provider?.user?.name?.[0] || 'P'}
                    </div>
                    <div>
                        <Link href={`/admin/providers?id=${booking.provider?.id}`} className="text-lg font-bold text-foreground hover:text-primary transition-colors flex items-center gap-2 group">
                           {booking.provider?.business_name || booking.provider?.user?.name}
                           <ExternalLink className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-all" />
                        </Link>
                        <div className="flex items-center gap-1 mt-1">
                           {[1,2,3,4,5].map(i => <Star key={i} className="w-2.5 h-2.5 text-amber-400 fill-current" />)}
                           <span className="text-[9px] font-bold text-muted-foreground ml-1 uppercase">(4.9/5 RANK)</span>
                        </div>
                    </div>
                 </div>
                 <div className="space-y-4 pt-4 border-t border-border">
                    <div className="flex items-center gap-3 text-xs font-semibold text-foreground">
                       <ShieldCheck className="w-4 h-4 text-emerald-500" />
                       Kuba Verified Merchant
                    </div>
                    <div className="flex items-center gap-3 text-xs font-semibold text-foreground">
                       <Zap className="w-4 h-4 text-primary" />
                       Elite Fulfillment Track
                    </div>
                 </div>
                 <Button variant="outline" className="w-full h-11 border-border rounded-xl font-bold uppercase text-[9px] tracking-widest hover:bg-muted transition-all">
                    Merchant Diagnostics
                 </Button>
              </CardContent>
           </Card>

           {/* Governance Information */}
           <Card className="border-none shadow-sm rounded-[2rem] bg-[#020617] text-white overflow-hidden relative group">
              <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:scale-125 transition-transform duration-[2s]">
                <ShieldCheck className="w-32 h-32" />
              </div>
              <CardContent className="p-8 space-y-6 relative z-10">
                 <h4 className="text-[10px] font-bold uppercase tracking-[0.2em] text-sky-500">Governance & Security</h4>
                 <div className="space-y-4">
                    <p className="text-[11px] font-medium text-slate-400 leading-relaxed">
                       This transaction is protected by the Kuba Security Protocol. Any deviations should be logged for arbitration.
                    </p>
                    <div className="pt-4 space-y-3">
                       <div className="flex justify-between items-center text-[10px] font-bold uppercase">
                          <span className="text-slate-500">Platform ID</span>
                          <span className="text-slate-300">KB-{booking.id}-CORE</span>
                       </div>
                       <div className="flex justify-between items-center text-[10px] font-bold uppercase">
                          <span className="text-slate-500">Cipher Strength</span>
                          <span className="text-emerald-500">AES-256 SYNC</span>
                       </div>
                    </div>
                 </div>
              </CardContent>
           </Card>
        </div>
      </div>
    </div>
  );
}

function ShieldCheckIcon({ className }: { className?: string }) {
    return <ShieldCheck className={className} />;
}

function Activity({ className }: { className?: string }) {
    return <Zap className={className} />;
}

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
  ShieldCheck,
  Quote,
  History,
  Info as InfoIcon,
  Calendar,
  Wallet,
  Building,
  UserCheck,
  Loader2,
  Banknote
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
            <Card className="border-none shadow-[0_32px_64px_-16px_rgba(0,0,0,0.1)] rounded-[3rem] overflow-hidden bg-white dark:bg-[#0F172A] border border-border/50">
              <CardHeader className="p-10 border-b border-border bg-muted/20">
                <CardTitle className="text-xl font-bold uppercase tracking-tight flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                    <MessageSquare className="w-5 h-5" />
                  </div>
                  System Communication Logs
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <div className="h-[600px]">
                  <ChatUI bookingId={booking.id} />
                </div>
              </CardContent>
            </Card>
          ) : (
            <>
              {/* Service Overview */}
              <Card className="border-none shadow-[0_32px_64px_-16px_rgba(0,0,0,0.1)] rounded-[3.5rem] overflow-hidden bg-white dark:bg-[#0F172A] border border-border/50">
                <div className="h-48 bg-muted relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-transparent"></div>
                  {/* Abstract Pattern */}
                  <div className="absolute inset-0 opacity-5">
                    <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_20%_20%,#000_1px,transparent_1px)] bg-[length:20px_20px]"></div>
                  </div>
                  <div className="absolute bottom-0 left-10 translate-y-1/2">
                    <div className="w-32 h-32 rounded-[2.5rem] bg-white dark:bg-slate-900 shadow-2xl flex items-center justify-center text-primary border-8 border-white dark:border-slate-900 transition-transform hover:scale-105 duration-500">
                      <Zap className="w-12 h-12" />
                    </div>
                  </div>
                </div>
                
                <CardContent className="p-10 pt-20">
                  <div className="flex flex-col md:flex-row justify-between items-start gap-10">
                    <div className="space-y-6 flex-1">
                      <div className="space-y-2">
                        <div className="flex items-center gap-3">
                            <Badge className="bg-primary/10 text-primary border-none text-[10px] font-black uppercase tracking-widest px-3 py-1">Marketplace Active</Badge>
                            <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">ID: {booking.id.split('-')[0]}</span>
                        </div>
                        <h2 className="text-4xl font-black text-foreground tracking-tight leading-none italic">{booking.service?.name}</h2>
                        <p className="text-base font-medium text-muted-foreground leading-relaxed max-w-2xl">{booking.service?.description}</p>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 py-8 border-y border-border/50">
                        <div className="flex items-center gap-4">
                           <div className="w-12 h-12 rounded-2xl bg-muted/50 flex items-center justify-center text-muted-foreground">
                             <Calendar className="w-5 h-5" />
                           </div>
                           <div>
                             <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Target Timeline</p>
                             <p className="text-sm font-bold text-foreground mt-0.5">
                               {format(new Date(booking.scheduled_date), 'MMMM do, yyyy')} • {booking.scheduled_time || 'TBD'}
                             </p>
                           </div>
                        </div>
                        <div className="flex items-center gap-4">
                           <div className="w-12 h-12 rounded-2xl bg-muted/50 flex items-center justify-center text-muted-foreground">
                             <MapPin className="w-5 h-5" />
                           </div>
                           <div className="flex-1 min-w-0">
                             <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Deployment Zone</p>
                             <p className="text-sm font-bold text-foreground mt-0.5 truncate">
                               {booking.address?.street_address}, {booking.address?.city}
                             </p>
                           </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Client Directives */}
              {booking.description && (
                <Card className="border-none shadow-premium rounded-[3rem] bg-[#F8FAFC] dark:bg-slate-900/50 border border-border/40 overflow-hidden relative group">
                   <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity">
                     <Quote className="w-24 h-24" />
                   </div>
                   <CardContent className="p-10 space-y-6 relative z-10">
                      <div className="flex items-center gap-3">
                        <div className="w-1.5 h-6 bg-primary rounded-full" />
                        <h3 className="text-xs font-black text-foreground uppercase tracking-[0.2em]">Project Directives</h3>
                      </div>
                      <p className="text-xl font-medium text-slate-600 dark:text-slate-300 leading-relaxed italic tracking-tight px-4">
                        "{booking.description}"
                      </p>
                   </CardContent>
                </Card>
              )}
            </>
          )}
        </div>

        {/* Sidebar */}
        <div className="lg:col-span-4 space-y-8">
          {/* Financials Card */}
          <Card className="border-none shadow-xl rounded-[2.5rem] bg-gradient-to-br from-slate-900 to-slate-800 text-white overflow-hidden relative">
            <div className="absolute -right-6 -bottom-6 w-32 h-32 bg-white/5 rounded-full blur-3xl" />
            <CardHeader className="p-8 pb-4">
              <div className="flex items-center justify-between mb-4">
                <Badge className="bg-white/10 text-white border-none text-[9px] font-black uppercase tracking-[0.15em] backdrop-blur-md">Transactional Audit</Badge>
                <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center">
                  <Wallet className="w-5 h-5" />
                </div>
              </div>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Registry Value</p>
              <h3 className="text-4xl font-black italic tracking-tighter mt-1 leading-none">
                KES {Number(booking.final_price || booking.estimated_price || 0).toLocaleString()}
              </h3>
            </CardHeader>
            <CardContent className="p-8 pt-4 space-y-6">
               <div className="flex flex-col gap-4">
                 <div className="flex items-center justify-between py-3 border-b border-white/10">
                   <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Payment Status</span>
                   <Badge className={`${booking.payment_status === 'paid' ? 'bg-emerald-500' : 'bg-amber-500'} text-white text-[9px] border-none font-bold uppercase tracking-wider`}>
                     {booking.payment_status || 'Pending'}
                   </Badge>
                 </div>
                 <div className="flex items-center justify-between py-1">
                   <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Method</span>
                   <span className="text-xs font-bold">{booking.payment_method?.replace('_', ' ') || 'Marketplace Escrow'}</span>
                 </div>
               </div>
               <Button className="w-full h-12 bg-white text-slate-900 hover:bg-slate-100 rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-xl shadow-white/5 transition-all" disabled={booking.payment_status === 'paid'}>
                 {booking.payment_status === 'paid' ? 'Payment Verified ✓' : 'Audit Ledger Details'}
               </Button>
            </CardContent>
          </Card>

          {/* Customer Card */}
          <Card className="border-none shadow-premium rounded-[2.5rem] bg-white dark:bg-[#0F172A] border border-border/50 overflow-hidden">
             <div className="p-8 border-b border-border/40 bg-muted/20">
               <h3 className="text-xs font-black text-foreground uppercase tracking-widest flex items-center gap-2">
                 <UserCheck className="w-4 h-4 text-primary" />
                 Requester Profile
               </h3>
             </div>
             <CardContent className="p-8 space-y-6">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-2xl bg-primary text-white flex items-center justify-center font-black text-xl shadow-lg shadow-primary/20">
                    {booking.customer?.name?.[0] || 'U'}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="text-lg font-bold text-foreground truncate">{booking.customer?.name}</h4>
                    <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Marketplace Tier: Gold</p>
                  </div>
                </div>
                
                <div className="space-y-4 pt-4">
                  <div className="flex items-center gap-3 text-sm font-medium text-slate-600 dark:text-slate-400">
                    <Mail className="w-4 h-4 text-muted-foreground" />
                    <span className="truncate">{booking.customer?.email}</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm font-medium text-slate-600 dark:text-slate-400">
                    <Phone className="w-4 h-4 text-muted-foreground" />
                    <span>{booking.customer?.phone || 'N/A'}</span>
                  </div>
                </div>

                <Button variant="outline" className="w-full h-11 rounded-xl border-border hover:bg-muted font-bold text-[10px] uppercase tracking-widest">
                  Investigate User ID
                </Button>
             </CardContent>
          </Card>

          {/* Provider Card */}
          <Card className="border-none shadow-premium rounded-[2.5rem] bg-white dark:bg-[#0F172A] border border-border/50 overflow-hidden">
             <div className="p-8 border-b border-border/40 bg-muted/20">
               <h3 className="text-xs font-black text-foreground uppercase tracking-widest flex items-center gap-2">
                 <ShieldCheck className="w-4 h-4 text-emerald-500" />
                 Provider Credential
               </h3>
             </div>
             <CardContent className="p-8 space-y-6">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-2xl bg-muted flex items-center justify-center text-muted-foreground">
                    {booking.provider?.brand_name ? <Building className="w-7 h-7" /> : <UserIcon className="w-7 h-7" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="text-lg font-bold text-foreground truncate">{booking.provider?.brand_name || 'Individual Provider'}</h4>
                    <p className="text-[10px] font-bold text-emerald-500 uppercase tracking-widest flex items-center gap-1.5">
                      <Star className="w-3 h-3 fill-emerald-500" /> Professional Verified
                    </p>
                  </div>
                </div>
             </CardContent>
          </Card>

          {/* System Logs / Timeline Placeholder */}
          <Card className="border-none shadow-sm rounded-[2rem] bg-muted/30 border border-border/40">
             <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em] flex items-center gap-2">
                    <History className="w-3.5 h-3.5" />
                    Operational Log
                  </h3>
                  <InfoIcon className="w-3.5 h-3.5 text-muted-foreground/40" />
                </div>
                <div className="space-y-4">
                  <div className="flex gap-3 relative">
                    <div className="absolute left-[3px] top-[14px] bottom-0 w-[1px] bg-border/60" />
                    <div className="w-2 h-2 rounded-full bg-primary mt-1 shadow-sm ring-4 ring-primary/10 shrink-0" />
                    <div>
                      <p className="text-[11px] font-bold text-foreground leading-none">System Initialization</p>
                      <p className="text-[9px] text-muted-foreground mt-1 uppercase font-medium">{format(new Date(booking.created_at), 'HH:mm • MMM d')}</p>
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <div className="w-2 h-2 rounded-full bg-border mt-1 shrink-0" />
                    <div>
                      <p className="text-[11px] font-bold text-muted-foreground leading-none">{booking.status === 'confirmed' ? 'Workflow Confirmed' : 'Awaiting confirmation'}</p>
                      <p className="text-[9px] text-muted-foreground/60 mt-1 uppercase font-medium">Pending Audit</p>
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

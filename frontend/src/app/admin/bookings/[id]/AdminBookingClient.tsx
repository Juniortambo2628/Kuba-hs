"use client";

import { use, useState } from "react";
import axiosInstance from "@/lib/axios";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Clock,
  MapPin,
  MessageSquare,
  ChevronLeft,
  XCircle,
  Zap,
  Quote,
  Calendar,
} from "lucide-react";
import Link from "next/link";
import { format } from "date-fns";
import { toast } from "sonner";
import { ChatUI } from "@/components/chat/ChatUI";
import { BookingStatusBadge } from "@/components/shared/BookingStatusBadge";
import { Skeleton } from "@/components/ui/skeleton";
import { useBookingDetail } from "@/hooks/useBookingDetail";
import { AdminBookingSidebar } from "@/components/booking/AdminBookingSidebar";
import { DashboardPageContainer } from "@/components/shared/DashboardPageContainer";

export default function AdminBookingClient({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const { booking, isLoading, refresh } = useBookingDetail(id);
  const [showChat, setShowChat] = useState(false);
  const [logRefresh, setLogRefresh] = useState(0);

  const updateStatus = async (status: string) => {
    try {
      await axiosInstance.patch(`/api/bookings/${id}/status`, { status });
      toast.success(`Booking marked as ${status}`);
      refresh();
      setLogRefresh((k) => k + 1);
    } catch {
      toast.error("Failed to update status");
    }
  };

  const customerTierLabel =
    booking?.customer?.membership_tier?.name ||
    (booking?.customer?.total_points != null
      ? `${booking.customer.total_points.toLocaleString()} pts`
      : "Standard");

  if (isLoading) {
    return (
      <DashboardPageContainer className="p-4">
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
      </DashboardPageContainer>
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
    <DashboardPageContainer className="space-y-10 pb-20 px-4">
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
              <BookingStatusBadge status={booking.status} className="rounded-full px-4 py-1 text-[10px] uppercase tracking-widest shadow-sm" />
            </div>
            <p className="text-xs font-semibold text-muted-foreground uppercase flex items-center gap-2">
              <Zap className="w-3.5 h-3.5 text-primary" />
              Service Transaction Orchestrated via Kuba Marketplace
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          {booking.status === "pending" && (
            <Button
              onClick={() => updateStatus("confirmed")}
              className="h-12 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold px-8 shadow-xl shadow-emerald-100 transition-all uppercase text-[10px] tracking-widest"
            >
              Confirm Execution
            </Button>
          )}
          <Button
            onClick={() => setShowChat(!showChat)}
            variant="outline"
            className="h-12 border-border text-foreground hover:bg-muted rounded-xl font-bold px-8 transition-all uppercase text-[10px] tracking-widest gap-2"
          >
            <MessageSquare className="w-4 h-4" />
            {showChat ? "Hide Logs" : "Monitor Comms"}
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        <div className="lg:col-span-8 space-y-10">
          {showChat ? (
            <Card className="border-none shadow-[0_32px_64px_-16px_rgba(0,0,0,0.1)] rounded-[3rem] overflow-hidden bg-card border border-border/50">
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
              <Card className="border-none shadow-[0_32px_64px_-16px_rgba(0,0,0,0.1)] rounded-[3.5rem] overflow-hidden bg-white dark:bg-card border border-border/50">
                <div className="h-48 bg-muted relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-transparent" />
                  <div className="absolute bottom-0 left-10 translate-y-1/2">
                    <div className="w-32 h-32 rounded-[2.5rem] bg-white dark:bg-slate-900 shadow-2xl flex items-center justify-center text-primary border-8 border-white dark:border-slate-900">
                      <Zap className="w-12 h-12" />
                    </div>
                  </div>
                </div>
                <CardContent className="p-10 pt-20">
                  <div className="space-y-6">
                    <div className="space-y-2">
                      <div className="flex items-center gap-3">
                        <Badge className="bg-primary/10 text-primary border-none text-[10px] font-black uppercase tracking-widest px-3 py-1">
                          Marketplace Active
                        </Badge>
                        <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
                          ID: {String(booking.id).split("-")[0]}
                        </span>
                      </div>
                      <h2 className="text-4xl font-black text-foreground tracking-tight leading-none italic">
                        {booking.service?.name}
                      </h2>
                      <p className="text-base font-medium text-muted-foreground leading-relaxed max-w-2xl">
                        {booking.service?.description}
                      </p>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 py-8 border-y border-border/50">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-2xl bg-muted/50 flex items-center justify-center text-muted-foreground">
                          <Calendar className="w-5 h-5" />
                        </div>
                        <div>
                          <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Target Timeline</p>
                          <p className="text-sm font-bold text-foreground mt-0.5">
                            {booking.scheduled_date
                              ? `${format(new Date(booking.scheduled_date), "MMMM do, yyyy")} • ${booking.scheduled_time || "TBD"}`
                              : "TBD"}
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
                            {booking.address
                              ? `${booking.address.street_address}, ${booking.address.city}`
                              : "On-site"}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

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
                      &ldquo;{booking.description}&rdquo;
                    </p>
                  </CardContent>
                </Card>
              )}
            </>
          )}
        </div>

        <AdminBookingSidebar
          booking={booking}
          logRefreshKey={logRefresh}
          customerTierLabel={customerTierLabel}
        />
      </div>
    </DashboardPageContainer>
  );
}

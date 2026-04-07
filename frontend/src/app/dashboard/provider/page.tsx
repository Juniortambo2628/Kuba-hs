"use client";

import { useEffect, useState } from "react";
import useSWR from "swr";
import { useAuth } from "@/contexts/AuthContext";
import axiosInstance from "@/lib/axios";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { 
 TrendingUp, 
 DollarSign, 
 CheckCircle, 
 Clock, 
 Loader2,
 ChevronRight,
 ClipboardList,
 ArrowUpRight,
 Plus,
 ShieldCheck,
 Zap,
 Star,
 Briefcase,
 Calendar,
 User as UserIcon
} from "lucide-react";
import { motion } from "framer-motion";
import Link from "next/link";
import { MetricCard } from "@/components/shared/MetricCard";
import { PerformanceMetrics } from "@/components/shared/PerformanceMetrics";
import { ProviderEarnings } from "@/components/dashboard/ProviderEarnings";
import { BookingStatusBadge } from "@/components/shared/BookingStatusBadge";
import { BookingCard } from "@/components/shared/BookingCard";
import { DashboardEmptyState } from "@/components/shared/DashboardEmptyState";
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

import { Booking, User, Provider } from "@/types";

interface ProviderStats {
  total_earnings: number;
  active_bookings: number;
  completed_bookings: number;
  avg_rating: number;
  reputation_score: number;
}

interface ProviderDashboardData {
  stats: ProviderStats;
  recent_bookings: Booking[];
  profile: Partial<Provider>;
}

export default function ProviderOverview() {
 const { user, isLoading: authLoading } = useAuth();
 const [updatingId, setUpdatingId] = useState<number | null>(null);

 // Use SWR for real-time reactive updates
 const { data: dashboardData, isLoading: isDashboardLoading, mutate: mutateDashboard } = useSWR(
  user ? "/api/provider/dashboard" : null,
  (url) => axiosInstance.get(url).then(res => res.data)
 );

 const data = dashboardData || null;
 const isLoading = authLoading || isDashboardLoading;

 const fetchDashboard = async () => {
  await mutateDashboard();
 };

 const handleStatusUpdate = async (bookingId: number, status: string) => {
  setUpdatingId(bookingId);
  try {
   await axiosInstance.patch(`/api/bookings/${bookingId}/status`, { status });
   fetchDashboard();
  } catch (err) {
   console.error("Failed to update status:", err);
  } finally {
   setUpdatingId(null);
  }
 };

 if (isLoading) {
  return (
   <div className="space-y-8 animate-pulse">
    <Skeleton className="h-12 w-64 rounded-2xl" />
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
     {[1,2,3,4].map(i => <Skeleton key={i} className="h-32 w-full rounded-3xl" />)}
    </div>
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <Skeleton className="h-[500px] rounded-[2.5rem] lg:col-span-2" />
      <Skeleton className="h-[500px] rounded-[2.5rem]" />
    </div>
   </div>
  );
 }

 const stats = data?.stats;
 const bookings = data?.recent_bookings || [];


 return (
  <motion.div 
   initial={{ opacity: 0 }} 
   animate={{ opacity: 1 }} 
   className="max-w-[1400px] mx-auto space-y-6 sm:space-y-10 pb-8 sm:pb-12"
  >
   {/* Provider Header */}
   <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
    <div>
      <h1 className="text-xl sm:text-2xl font-bold text-foreground tracking-tight">Pro Dashboard</h1>
      <p className="text-sm text-muted-foreground mt-1">Logged in as {user?.name} — Manage your jobs and services.</p>
    </div>
    <div className="flex items-center gap-3">
      <Button asChild variant="outline" className="h-10 border-border text-foreground hover:bg-muted font-semibold px-6 transition-all capitalize tracking-normal text-xs rounded-xl shadow-sm">
       <Link href="/dashboard/provider/profile">My Business</Link>
      </Button>
      <Button asChild className="h-10 bg-foreground text-background hover:bg-muted hover:text-foreground transition-all duration-300 rounded-xl flex items-center justify-center font-semibold px-6 shadow-md shadow-foreground/10 border border-border tracking-tight capitalize text-xs">
       <Link href="/dashboard/provider/services">Add a Service</Link>
      </Button>
    </div>
   </div>

   <motion.div 
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5, delay: 0.2 }}
   >
     <PerformanceMetrics 
      stats={{
        totalEarnings: stats?.total_earnings || 0,
        avgRating: Number(stats?.avg_rating || 0),
        completionRate: stats?.reputation_score || 100,
        totalJobs: stats?.completed_bookings || 0
      }} 
     />
   </motion.div>

   <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-10">
     {/* Active Work Orders */}
     <div className="lg:col-span-2 space-y-6">
      <div className="flex items-center justify-between px-2">
        <div>
          <h2 className="text-lg font-bold text-foreground tracking-tight">Active Jobs</h2>
          <p className="text-[11px] text-muted-foreground mt-1">Manage your current jobs.</p>
        </div>
        <Link href="/dashboard/provider/bookings" className="text-[10px] font-semibold text-muted-foreground hover:text-foreground transition-colors capitalize tracking-normal">
          See All Jobs
        </Link>
      </div>

         {bookings.map((booking: Booking) => (
           <BookingCard
              key={booking.id}
              booking={booking}
              type="provider"
              actions={
                <div className="flex gap-3">
                  {booking.status === 'pending' && (
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button 
                          id={`accept-order-${booking.id}`}
                          className="h-9 bg-foreground text-background hover:bg-muted hover:text-foreground transition-all duration-300 rounded-xl font-semibold px-4 text-[9px] tracking-normal uppercase shrink-0 border border-border"
                          disabled={updatingId === booking.id}
                        >
                          {updatingId === booking.id ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Accept Job'}
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Accept Service Order?</AlertDialogTitle>
                          <AlertDialogDescription>
                            By accepting this job, you commit to fulfilling the service for <span className="font-bold text-foreground">{booking.customer?.name}</span>. A confirmation notification will be sent immediately.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel className="rounded-xl font-bold text-xs uppercase tracking-widest">Abort</AlertDialogCancel>
                          <AlertDialogAction 
                            onClick={() => handleStatusUpdate(booking.id, 'confirmed')}
                            className="rounded-xl font-bold text-xs uppercase tracking-widest bg-primary text-primary-foreground hover:bg-primary/90"
                          >
                            Confirm Acceptance
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  )}
                  {booking.status === 'confirmed' && (
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button 
                          id={`complete-order-${booking.id}`}
                          className="h-9 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-semibold px-4 text-[9px] tracking-normal uppercase transition-all shrink-0"
                          disabled={updatingId === booking.id}
                        >
                          {updatingId === booking.id ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Finish Job'}
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Mark Service as Completed?</AlertDialogTitle>
                          <AlertDialogDescription>
                            This will finalize the transaction and trigger settlement. Please ensure you have fulfilled all requirements for <span className="font-bold text-foreground">{booking.customer?.name}</span>.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel className="rounded-xl font-bold text-xs uppercase tracking-widest">Not Yet</AlertDialogCancel>
                          <AlertDialogAction 
                            onClick={() => handleStatusUpdate(booking.id, 'completed')}
                            className="rounded-xl font-bold text-xs uppercase tracking-widest bg-emerald-600 hover:bg-emerald-700 text-white"
                          >
                            Mark Fulfilled
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  )}
                  <Button asChild variant="outline" className="h-9 w-9 p-0 rounded-xl border-border text-muted-foreground hover:text-primary hover:bg-muted transition-all shrink-0">
                    <Link href={`/dashboard/provider/bookings`}>
                      <ArrowUpRight className="w-4 h-4" />
                    </Link>
                  </Button>
                </div>
              }
           />
         ))}
         {bookings.length === 0 && (
           <DashboardEmptyState
              icon={Zap}
              title="No active jobs"
           />
         )}
      
      <div className="pt-8">
        <ProviderEarnings />
      </div>
     </div>

     <div className="space-y-6">
       <Card className="border border-border bg-card/50 backdrop-blur-md overflow-hidden relative group border-none shadow-sm">
         <div className="absolute top-0 right-0 w-32 h-32 bg-muted/30 rounded-full blur-3xl -mr-10 -mt-10 group-hover:bg-muted/50 transition-all duration-700"></div>
         <CardContent className="p-6 space-y-6 relative z-10">
           <div className="space-y-2">
             <p className="text-[10px] font-semibold text-muted-foreground capitalize tracking-wide">Grow My Business</p>
             <h2 className="text-xl font-bold tracking-tight text-foreground">Add More Services</h2>
           </div>
           <p className="text-sm font-medium text-muted-foreground leading-relaxed">Add more services to reach more customers and earn more.</p>
           <Button asChild className="w-full h-10 bg-foreground text-background hover:bg-muted hover:text-foreground transition-all duration-300 rounded-xl font-semibold text-[10px] tracking-normal capitalize border border-border">
            <Link href="/dashboard/provider/services">Get started</Link>
           </Button>
         </CardContent>
       </Card>

       <div className="space-y-4">
         <h3 className="text-lg font-bold text-foreground tracking-tight px-2">Pro Tools</h3>
         <div className="grid gap-3">
           {[
            { label: "Service Schedule", icon: Clock, href: "/dashboard/provider/availability" },
            { label: "Service Catalog", icon: Briefcase, href: "/dashboard/provider/services" },
            { label: "Client Reviews", icon: Star, href: "/dashboard/provider/reviews" },
            { label: "Business Intelligence", icon: Activity, href: "/dashboard/provider/bookings" }
           ].map((tool, i) => (
            <Link key={i} href={tool.href} className="border border-border bg-card/50 backdrop-blur-md border-none shadow-sm group hover:bg-muted/50 cursor-pointer transition-colors rounded-xl block">
              <CardContent className="p-4 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-muted rounded-xl flex items-center justify-center text-foreground group-hover:scale-110 transition-transform">
                    <tool.icon className="w-4 h-4" />
                  </div>
                  <span className="text-sm font-semibold text-foreground tracking-tight">{tool.label}</span>
                </div>
                <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:text-foreground transition-colors" />
              </CardContent>
            </Link>
           ))}
         </div>
       </div>
     </div>
   </div>
  </motion.div>
 );
}

function Activity({ className }: { className?: string }) {
  return <TrendingUp className={className} />;
}

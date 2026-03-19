"use client";

import { useEffect, useState } from "react";
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
import { MetricCard } from "@/components/dashboard/MetricCard";
import { PerformanceMetrics } from "@/components/dashboard/PerformanceMetrics";
import { ProviderEarnings } from "@/components/dashboard/ProviderEarnings";

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
 const [data, setData] = useState<ProviderDashboardData | null>(null);
 const [isLoading, setIsLoading] = useState(true);
 const [updatingId, setUpdatingId] = useState<number | null>(null);

 useEffect(() => {
  if (!authLoading && user) {
   fetchDashboard();
  }
 }, [authLoading, user]);

 const fetchDashboard = async () => {
  try {
   const res = await axiosInstance.get("/api/provider/dashboard");
   setData(res.data);
  } catch (err) {
   console.error("Failed to fetch provider dashboard:", err);
  } finally {
   setIsLoading(false);
  }
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

 const getStatusBadge = (status: string) => {
  const styles: any = {
   pending: "bg-muted text-foreground border-border",
   confirmed: "bg-muted text-foreground border-border",
   completed: "bg-muted text-foreground border-border",
   cancelled: "bg-red-50 text-primary border-sky-100"
  };
  return (
   <Badge variant="outline" className={`rounded-full px-3 py-1 font-semibold text-[8px] uppercase tracking-normal border ${styles[status] || "bg-muted text-muted-foreground"}`}>
    {status}
   </Badge>
  );
 };

 return (
  <motion.div 
   initial={{ opacity: 0 }} 
   animate={{ opacity: 1 }} 
   className="max-w-[1400px] mx-auto space-y-10 pb-12"
  >
   {/* Provider Header */}
   <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
    <div>
      <h1 className="text-2xl font-bold text-foreground tracking-tight">Merchant Portal</h1>
      <p className="text-sm text-muted-foreground mt-1">Logged in as {user?.name} — Managing Kuba Marketplace Operations.</p>
    </div>
    <div className="flex items-center gap-3">
      <Button asChild variant="outline" className="h-10 border-border text-foreground hover:bg-muted font-semibold px-6 transition-all uppercase tracking-normal text-xs rounded-xl shadow-sm">
       <Link href="/dashboard/provider/profile">Business Profile</Link>
      </Button>
      <Button asChild className="h-10 bg-foreground text-background hover:bg-muted hover:text-foreground transition-all duration-300 rounded-xl flex items-center justify-center font-semibold px-6 shadow-md shadow-foreground/10 border border-border tracking-tight uppercase text-xs">
       <Link href="/dashboard/provider/services">Add Service</Link>
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
        completionRate: 100, // Hardcoded for now until backend provides it
        totalJobs: stats?.completed_bookings || 0
      }} 
     />
   </motion.div>

   <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
     {/* Active Work Orders */}
     <div className="lg:col-span-2 space-y-6">
      <div className="flex items-center justify-between px-2">
        <div>
          <h2 className="text-lg font-bold text-foreground tracking-tight">Work Order Monitor</h2>
          <p className="text-[11px] text-muted-foreground mt-1">Manage your real-time service requests.</p>
        </div>
        <Link href="/dashboard/provider/bookings" className="text-[10px] font-semibold text-muted-foreground hover:text-foreground transition-colors uppercase tracking-normal">
          View Fleet History
        </Link>
      </div>

      <div className="grid gap-4">
        {bookings.map((booking) => (
          <Card key={booking.id} className="border border-border bg-card/50 backdrop-blur-md hover:shadow-md transition-all group overflow-hidden flex flex-col cursor-pointer border-none shadow-sm">
            <CardContent className="p-5 flex-1 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div className="flex gap-4">
                <div className="p-4 bg-muted rounded-2xl flex items-center justify-center text-foreground border border-border group-hover:border-primary/50 transition-all shrink-0">
                  <Briefcase className="w-6 h-6" />
                </div>
                <div className="space-y-1">
                  <div className="flex items-center gap-3">
                    <span className="text-[10px] font-semibold text-primary uppercase tracking-normal">#{booking.id || booking.booking_number}</span>
                    {getStatusBadge(booking.status)}
                  </div>
                  <h3 className="text-sm font-semibold text-foreground group-hover:text-primary transition-colors capitalize">{booking.service?.name}</h3>
                  <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-4 text-[10px] text-muted-foreground uppercase tracking-wider">
                    <span className="flex items-center gap-1.5"><Calendar className="w-3.5 h-3.5" /> {new Date(booking.scheduled_date).toLocaleDateString()}</span>
                    <span className="flex items-center gap-1.5 font-semibold text-foreground"><UserIcon className="w-3.5 h-3.5" /> {booking.customer?.name}</span>
                  </div>
                </div>
              </div>
              
              <div className="flex gap-3 ml-auto">
                {booking.status === 'pending' && (
                  <Button 
                    id={`accept-order-${booking.id}`}
                    onClick={(e) => { e.stopPropagation(); handleStatusUpdate(booking.id, 'confirmed'); }}
                    className="h-9 bg-foreground text-background hover:bg-muted hover:text-foreground transition-all duration-300 rounded-xl font-semibold px-4 text-[9px] tracking-normal uppercase shrink-0 border border-border"
                    disabled={updatingId === booking.id}
                  >
                    {updatingId === booking.id ? <Loader2 className="w-4 h-4 animate-spin" /> : 'ACCEPT ORDER'}
                  </Button>
                )}
                {booking.status === 'confirmed' && (
                  <Button 
                    id={`complete-order-${booking.id}`}
                    className="h-9 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-semibold px-4 text-[9px] tracking-normal uppercase transition-all shrink-0"
                    onClick={(e) => { e.stopPropagation(); handleStatusUpdate(booking.id, 'completed'); }}
                    disabled={updatingId === booking.id}
                  >
                    {updatingId === booking.id ? <Loader2 className="w-4 h-4 animate-spin" /> : 'MARK COMPLETED'}
                  </Button>
                )}
                <Button asChild variant="outline" className="h-9 w-9 p-0 rounded-xl border-border text-muted-foreground hover:text-primary hover:bg-muted transition-all shrink-0">
                  <Link href={`/dashboard/provider/bookings`}>
                    <ArrowUpRight className="w-4 h-4" />
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
        {bookings.length === 0 && (
          <Card className="border border-dashed border-border min-h-[300px] flex items-center justify-center flex-col gap-6 text-center bg-transparent shadow-none">
            <div className="w-16 h-16 rounded-2xl bg-muted flex items-center justify-center text-muted-foreground">
              <Zap className="w-8 h-8 opacity-50" />
            </div>
            <p className="text-[10px] font-semibold uppercase tracking-wide text-foreground">No active work orders</p>
          </Card>
        )}
      </div>
      
      <div className="pt-8">
        <ProviderEarnings />
      </div>
     </div>

     <div className="space-y-6">
       <Card className="border border-border bg-card/50 backdrop-blur-md overflow-hidden relative group border-none shadow-sm">
         <div className="absolute top-0 right-0 w-32 h-32 bg-muted/30 rounded-full blur-3xl -mr-10 -mt-10 group-hover:bg-muted/50 transition-all duration-700"></div>
         <CardContent className="p-6 space-y-6 relative z-10">
           <div className="space-y-2">
             <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wide">Business Growth</p>
             <h2 className="text-xl font-bold tracking-tight text-foreground">Expand Portfolio</h2>
           </div>
           <p className="text-sm font-medium text-muted-foreground leading-relaxed">Add more services to your Kuba profile to reach more customers and increase your revenue potential.</p>
           <Button asChild className="w-full h-10 bg-foreground text-background hover:bg-muted hover:text-foreground transition-all duration-300 rounded-xl font-semibold text-[10px] tracking-normal uppercase border border-border">
            <Link href="/dashboard/provider/services">Get Started</Link>
           </Button>
         </CardContent>
       </Card>

       <div className="space-y-4">
         <h3 className="text-lg font-bold text-foreground tracking-tight px-2">Merchant Tools</h3>
         <div className="grid gap-3">
           {[
            { label: "Availability Manager", icon: Clock, href: "/dashboard/provider/availability" },
            { label: "Service Portfolio", icon: Briefcase, href: "/dashboard/provider/services" },
            { label: "Merchant Feedback", icon: Star, href: "/dashboard/provider/reviews" },
            { label: "Deployment Metrics", icon: Activity, href: "/dashboard/provider/bookings" }
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

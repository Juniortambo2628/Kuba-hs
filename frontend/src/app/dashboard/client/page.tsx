"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import axiosInstance from "@/lib/axios";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { 
  Calendar, 
  MapPin, 
  Star, 
  Clock, 
  Gift, 
  CheckCircle, 
  ChevronRight, 
  Plus, 
  Zap,
  Briefcase,
  ShieldCheck,
  TrendingUp,
  CreditCard,
  Loader2,
  Users,
  User as UserIcon,
  MessageSquare
} from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";
import { motion } from "framer-motion";
import { BookingDetailDialog } from "@/components/booking/BookingDetailDialog";
import { MetricCard } from "@/components/dashboard/MetricCard";

import { Booking, User, LoyaltyTier } from "@/types";

interface ClientStats {
  total_bookings: number;
  active_bookings: number;
  loyalty_points: number;
  membership_tier: LoyaltyTier | null;
  pending_reviews: number;
}

export default function ClientOverview() {
  const { user, isLoading: authLoading } = useAuth();
  const [stats, setStats] = useState<ClientStats | null>(null);
  const [upcoming, setUpcoming] = useState<Booking[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRedeeming, setIsRedeeming] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);

  useEffect(() => {
    if (!authLoading && user) {
      fetchDashboardData();
    }
  }, [authLoading, user]);

  const fetchDashboardData = async () => {
    try {
      const res = await axiosInstance.get("/api/client/dashboard");
      setStats(res.data.stats);
      setUpcoming(res.data.upcoming_bookings || []);
    } catch (err) {
      console.error("Failed to fetch dashboard data:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateStatus = async (id: number, status: string) => {
    try {
      await axiosInstance.patch(`/api/bookings/${id}/status`, { status });
      toast.success(`Booking ${status}`);
      setIsDetailOpen(false);
      fetchDashboardData();
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to update status");
    }
  };

  const handleRedeem = async () => {
    if ((stats?.loyalty_points || 0) < 500) {
      toast.error("You need at least 500 points to redeem a reward");
      return;
    }

    setIsRedeeming(true);
    try {
      const res = await axiosInstance.post("/api/client/loyalty/redeem", {
        reward_type: "Discount Voucher",
        points: 500
      });
      const msg = res.data.voucher_code 
        ? `Success! Your code: ${res.data.voucher_code}`
        : res.data.message;
      toast.success(msg, {
        duration: 10000,
        description: "Copy this code to use at checkout."
      });
      await fetchDashboardData();
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to redeem reward");
    } finally {
      setIsRedeeming(false);
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-8 animate-pulse">
        <Skeleton className="h-12 w-64 rounded-2xl" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[1,2,3].map(i => <Skeleton key={i} className="h-32 rounded-3xl" />)}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <Skeleton className="h-[400px] rounded-[2.5rem]" />
            <Skeleton className="h-[400px] rounded-[2.5rem]" />
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-[1400px] mx-auto space-y-10 pb-12">
      {/* Welcome Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
            <h1 className="text-2xl font-bold text-foreground tracking-tight">Welcome to Kuba, {user?.name?.split(' ')[0]}</h1>
            <p className="text-sm text-muted-foreground mt-1">Your home service requests are being prioritized.</p>
        </div>
        <Link href="/services">
          <Button className="bg-foreground text-background hover:bg-muted hover:text-foreground rounded-xl font-semibold px-6 shadow-md transition-all gap-2">
            Request New Service
            <Plus className="w-4 h-4" />
          </Button>
        </Link>
      </div>

      {/* Stats Grid */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="grid grid-cols-1 md:grid-cols-3 gap-6"
      >
        {[
          { label: "Active Requests", value: stats?.active_bookings || 0, icon: Clock, trend: "On schedule" },
          { label: "Service History", value: stats?.total_bookings || 0, icon: CheckCircle, trend: "Total completed" },
          { label: "Membership Tier", value: stats?.membership_tier?.name || "Member", icon: Star, trend: stats?.membership_tier ? "Status active" : "Join rewards" }
        ].map((stat, i) => (
          <MetricCard 
            key={i} 
            label={stat.label} 
            value={stat.value} 
            icon={stat.icon} 
            trend={stat.trend} 
          />
        ))}
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* Main Content: Upcoming Services */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex items-center justify-between px-2">
             <h2 className="text-lg font-bold text-foreground tracking-tight">Next Appointments</h2>
             <Link href="/dashboard/client/bookings" className="text-[10px] font-semibold text-muted-foreground hover:text-foreground transition-colors uppercase tracking-normal">
                View All History
             </Link>
          </div>

          {upcoming.length > 0 ? (
            <div className="grid gap-4">
              {upcoming.map((booking) => (
                <Card key={booking.id} className="border border-border bg-card/50 backdrop-blur-md hover:shadow-md transition-all group overflow-hidden flex flex-col cursor-pointer border-none shadow-sm">
                  <CardContent className="p-5 flex-1 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div className="flex gap-4">
                        <div className="w-14 h-14 rounded-2xl bg-muted flex items-center justify-center text-foreground border border-border group-hover:border-primary/50 transition-all shrink-0">
                             <div className="text-center">
                                <p className="text-[9px] font-semibold uppercase tracking-wider text-muted-foreground leading-none">{new Date(booking.scheduled_date).toLocaleString('default', { month: 'short' })}</p>
                                <p className="text-lg font-bold text-foreground leading-none mt-1">{new Date(booking.scheduled_date).getDate()}</p>
                             </div>
                        </div>
                        <div className="space-y-1">
                            <h3 className="text-sm font-semibold text-foreground group-hover:text-primary transition-colors capitalize">
                                {booking.service?.name}
                            </h3>
                            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-4 text-[10px] text-muted-foreground uppercase tracking-wider">
                                <span className="flex items-center gap-1.5"><Clock className="w-3 h-3" /> {booking.scheduled_time || 'Pending Time'}</span>
                                <span className="flex items-center gap-1.5"><MapPin className="w-3 h-3" /> {booking.address?.city || 'Location TBD'}</span>
                            </div>
                        </div>
                    </div>
                    <Button 
                        onClick={(e) => {
                            e.stopPropagation();
                            setSelectedBooking(booking);
                            setIsDetailOpen(true);
                        }}
                        className="rounded-xl font-semibold text-[9px] tracking-normal border-border text-foreground hover:text-background hover:bg-foreground hover:border-foreground transition-all ml-auto" 
                        variant="outline"
                        size="sm"
                    >
                        MANAGE
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <Card className="border border-dashed border-border min-h-[300px] flex items-center justify-center flex-col gap-6 text-center bg-transparent shadow-none">
                <div className="w-16 h-16 rounded-2xl bg-muted flex items-center justify-center text-muted-foreground">
                    <Briefcase className="w-8 h-8 opacity-50" />
                </div>
                <div className="space-y-2">
                    <p className="text-[10px] font-semibold text-foreground uppercase tracking-normal">No service requests yet</p>
                    <p className="text-[11px] text-muted-foreground">Professional help is just a few clicks away.</p>
                </div>
                <Link href="/services">
                    <Button className="h-10 bg-foreground text-background hover:bg-muted hover:text-foreground transition-all duration-300 rounded-xl flex items-center justify-center font-semibold px-6 shadow-md shadow-foreground/10 border border-border tracking-tight uppercase text-xs">
                        Browse Services
                    </Button>
                </Link>
            </Card>
          )}
        </div>

        <div className="space-y-6">
           <Card className="border border-border bg-card/50 backdrop-blur-md overflow-hidden relative group border-none shadow-sm">
                <div className="absolute -top-10 -right-10 w-40 h-40 bg-muted/30 rounded-full blur-3xl group-hover:bg-muted/50 transition-all duration-700"></div>
                <CardContent className="p-6 relative z-10 space-y-6">
                     <div className="flex justify-between items-start">
                        <div className="space-y-1">
                            <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wide">Loyalty Status</p>
                             <h3 className="text-xl font-bold tracking-tight text-foreground">{user?.membership_tier?.name || stats?.membership_tier?.name || 'Explorer'}</h3>
                        </div>
                        <div className="p-3 bg-muted rounded-2xl">
                            <Gift className="w-5 h-5 text-foreground" />
                        </div>
                    </div>

                    <div className="space-y-4">
                        <div className="flex justify-between items-end">
                            <div className="space-y-1">
                                <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wide">Points Available</p>
                                <p className="text-3xl font-semibold tabular-nums text-foreground">{stats?.loyalty_points || 0}</p>
                            </div>
                            <TrendingUp className="w-6 h-6 text-muted-foreground opacity-50 mb-1" />
                        </div>
                        <div className="h-1.5 w-full bg-muted rounded-full overflow-hidden">
                            <div 
                                className="h-full bg-foreground rounded-full transition-all duration-1000" 
                                style={{ width: `${Math.min(100, ((stats?.loyalty_points || 0) % 1000) / 10)}%` }}
                            ></div>
                        </div>
                        <p className="text-[9px] font-semibold text-muted-foreground uppercase tracking-normal text-right">
                            {1000 - ((stats?.loyalty_points || 0) % 1000)} Points to next reward
                        </p>
                    </div>

                    <Button 
                        onClick={handleRedeem}
                        disabled={isRedeeming}
                        className="w-full h-10 bg-foreground text-background hover:bg-muted hover:text-foreground transition-all duration-300 rounded-xl font-semibold text-[10px] tracking-normal uppercase"
                    >
                        {isRedeeming ? <Loader2 className="w-4 h-4 animate-spin" /> : 'REDEEM REWARDS'}
                    </Button>
                </CardContent>
           </Card>

           <Link href="/dashboard/client/profile" className="block">
                <Card className="border border-border bg-card/50 backdrop-blur-md border-none shadow-sm group hover:bg-muted/50 cursor-pointer transition-colors">
                    <CardContent className="p-6 flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <div className="w-10 h-10 bg-muted rounded-2xl flex items-center justify-center text-foreground group-hover:scale-110 transition-transform">
                                <CreditCard className="w-4 h-4" />
                            </div>
                            <div>
                                <p className="text-sm font-semibold text-foreground tracking-tight">{user?.membership_tier?.name || 'Standard Plan'}</p>
                            </div>
                        </div>
                        <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:text-foreground transition-colors" />
                    </CardContent>
                </Card>
           </Link>
        </div>
      </div>
      <BookingDetailDialog 
        isOpen={isDetailOpen}
        onClose={() => setIsDetailOpen(false)}
        booking={selectedBooking}
        onUpdateStatus={(status) => selectedBooking && handleUpdateStatus(selectedBooking.id, status)}
      />
    </div>
  );
}

// Local Button function removed in favor of standard component

"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
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
import { BookingDetailDialog } from "@/components/booking/BookingDetailDialog";
import { MetricCard } from "@/components/shared/MetricCard";
import { BookingCard } from "@/components/shared/BookingCard";
import { DashboardEmptyState } from "@/components/shared/DashboardEmptyState";

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
            <h1 className="text-2xl font-bold text-foreground tracking-tight">Welcome back, {user?.name?.split(' ')[0]}</h1>
            <p className="text-sm text-muted-foreground mt-1">We're helping you find the best pros for your home.</p>
        </div>
        <Link href="/services">
          <Button className="bg-foreground text-background hover:bg-muted hover:text-foreground rounded-xl font-semibold px-6 shadow-md transition-all gap-2">
            Book a Service
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
          { label: "Current Jobs", value: stats?.active_bookings || 0, icon: Clock, trend: "On schedule" },
          { label: "Past Jobs", value: stats?.total_bookings || 0, icon: CheckCircle, trend: "Total completed" },
          { label: "My Level", value: stats?.membership_tier?.name || "Member", icon: Star, trend: stats?.membership_tier ? "Status active" : "Join rewards" }
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
             <h2 className="text-lg font-bold text-foreground tracking-tight">Upcoming Jobs</h2>
             <Link href="/dashboard/client/bookings" className="text-[10px] font-semibold text-muted-foreground hover:text-foreground transition-colors capitalize tracking-normal">
                See All
             </Link>
          </div>

          {upcoming.length > 0 ? (
              upcoming.map((booking) => (
                <BookingCard
                  key={booking.id}
                  booking={booking}
                  type="client"
                  onClick={() => {
                    setSelectedBooking(booking);
                    setIsDetailOpen(true);
                  }}
                  actions={
                    <Button 
                        onClick={(e) => {
                            e.stopPropagation();
                            setSelectedBooking(booking);
                            setIsDetailOpen(true);
                        }}
                        className="rounded-xl font-semibold text-[9px] tracking-normal border-border text-foreground hover:text-background hover:bg-foreground hover:border-foreground transition-all" 
                        variant="outline"
                        size="sm"
                    >
                        Manage
                    </Button>
                  }
                />
              ))
          ) : (
            <DashboardEmptyState
              icon={Briefcase}
              title="No jobs yet"
              description="Professional help is just a few clicks away."
            >
                <Link href="/services">
                    <Button className="h-10 bg-foreground text-background hover:bg-muted hover:text-foreground transition-all duration-300 rounded-xl flex items-center justify-center font-semibold px-6 shadow-md shadow-foreground/10 border border-border tracking-tight capitalize text-xs">
                        Search Services
                    </Button>
                </Link>
            </DashboardEmptyState>
          )}
        </div>

        <div className="space-y-6">
           <Card className="border border-border bg-card/50 backdrop-blur-md overflow-hidden relative group border-none shadow-sm">
                <div className="absolute -top-10 -right-10 w-40 h-40 bg-muted/30 rounded-full blur-3xl group-hover:bg-muted/50 transition-all duration-700"></div>
                <CardContent className="p-6 relative z-10 space-y-6">
                     <div className="flex justify-between items-start">
                        <div className="space-y-1">
                            <p className="text-[10px] font-semibold text-muted-foreground capitalize tracking-wide">Rewards</p>
                             <h3 className="text-xl font-bold tracking-tight text-foreground">{user?.membership_tier?.name || stats?.membership_tier?.name || 'Explorer'}</h3>
                        </div>
                        <div className="p-3 bg-muted rounded-2xl">
                            <Gift className="w-5 h-5 text-foreground" />
                        </div>
                    </div>

                    <div className="space-y-4">
                        <div className="flex justify-between items-end">
                            <div className="space-y-1">
                                <p className="text-[10px] font-semibold text-muted-foreground capitalize tracking-wide">My Points</p>
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
                        <p className="text-[9px] font-semibold text-muted-foreground capitalize tracking-normal text-right">
                            {1000 - ((stats?.loyalty_points || 0) % 1000)} Points to next reward
                        </p>
                    </div>

                    <Button 
                        onClick={handleRedeem}
                        disabled={isRedeeming}
                        className="w-full h-10 bg-foreground text-background hover:bg-muted hover:text-foreground transition-all duration-300 rounded-xl font-semibold text-[10px] tracking-normal capitalize"
                    >
                        {isRedeeming ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Get My Reward'}
                    </Button>
                </CardContent>
           </Card>


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

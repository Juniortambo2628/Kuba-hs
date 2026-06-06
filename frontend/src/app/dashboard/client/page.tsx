"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import useSWR from "swr";
import { useAuth } from "@/contexts/AuthContext";
import axiosInstance from "@/lib/axios";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Star, Clock, Gift, CheckCircle, Plus, Briefcase, Loader2 } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";
import { BookingDetailDialog } from "@/components/booking/BookingDetailDialog";
import { BookingCard } from "@/components/shared/BookingCard";
import { DashboardEmptyState } from "@/components/shared/DashboardEmptyState";
import { DashboardPageContainer } from "@/components/shared/DashboardPageContainer";
import {
  DashboardGreetingBar,
  DashboardFrostedStatCard,
  DashboardFrostedStatGrid,
  DashboardPanelCard,
} from "@/components/dashboard/workspace";
import { workspaceUi } from "@/lib/dashboard-workspace-ui";

import { Booking, User, LoyaltyTier } from "@/types";
import { unwrapResourceList } from "@/lib/api-resource";

interface ClientStats {
  total_bookings: number;
  active_bookings: number;
  loyalty_points: number;
  membership_tier: LoyaltyTier | null;
  pending_reviews: number;
}

export default function ClientOverview() {
  const { user, isLoading: authLoading } = useAuth();
  const [isRedeeming, setIsRedeeming] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);

  // Use SWR for real-time reactive updates
  const { data, mutate: mutateDashboard, isLoading: isDashboardLoading } = useSWR(
    user ? "/api/client/dashboard" : null,
    (url) => axiosInstance.get(url).then(res => res.data)
  );

  const stats = data?.stats || null;
  const upcoming = unwrapResourceList<Booking>(data?.upcoming_bookings);
  const isLoading = authLoading || isDashboardLoading;

  const fetchDashboardData = async () => {
    await mutateDashboard();
  };

  const handleUpdateStatus = async (id: string, status: string) => {
    try {
      const payload: any = { status };
      if (status === 'cancelled') {
        payload.cancellation_reason = "Cancelled by user";
      }
      await axiosInstance.patch(`/api/bookings/${id}/status`, payload);
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
            <Skeleton className="h-[400px] rounded-2xl" />
            <Skeleton className="h-[400px] rounded-2xl" />
        </div>
      </div>
    );
  }

  return (
    <DashboardPageContainer width="default" className={workspaceUi.page}>
      <DashboardGreetingBar
        greeting={`Welcome back, ${user?.name?.split(" ")[0] || "there"}`}
        subtitle="Your upcoming bookings and rewards at a glance."
        actions={
          <Button asChild className="rounded-full">
            <Link href="/services">
              <Plus className="w-4 h-4 mr-2" />
              Book a service
            </Link>
          </Button>
        }
      />

      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <DashboardFrostedStatGrid columns={3}>
          <DashboardFrostedStatCard
            icon={Clock}
            label="Active bookings"
            value={stats?.active_bookings || 0}
            hint="In progress or scheduled"
          />
          <DashboardFrostedStatCard
            icon={CheckCircle}
            label="All bookings"
            value={stats?.total_bookings || 0}
          />
          <DashboardFrostedStatCard
            icon={Star}
            label="Rewards tier"
            value={stats?.membership_tier?.name || "Member"}
            tone="primary"
            hint={`${stats?.loyalty_points || 0} points`}
          />
        </DashboardFrostedStatGrid>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-10">
        {/* Main Content: Upcoming Services */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex items-center justify-between px-1">
             <h2 className="text-lg font-semibold text-foreground">Upcoming bookings</h2>
             <Link href="/dashboard/client/bookings" className="text-sm text-muted-foreground hover:text-foreground">
                View all
             </Link>
          </div>

          {upcoming.length > 0 ? (
              upcoming.map((booking: Booking) => (
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
              title="No upcoming bookings"
              description="Browse services and book your first appointment."
            >
                <Button asChild className="rounded-full mt-4">
                  <Link href="/services">Browse services</Link>
                </Button>
            </DashboardEmptyState>
          )}
        </div>

        <div className="space-y-6">
          <DashboardPanelCard title="Loyalty rewards" icon={Gift}>
            <p className="text-sm text-muted-foreground mb-1">
              Tier: {user?.membership_tier?.name || stats?.membership_tier?.name || "Member"}
            </p>
            <p className="text-3xl font-semibold tabular-nums text-foreground mb-4">
              {stats?.loyalty_points || 0} points
            </p>
            <div className="h-1.5 w-full bg-muted rounded-full overflow-hidden mb-2">
              <div
                className="h-full bg-primary rounded-full transition-all duration-1000"
                style={{ width: `${Math.min(100, ((stats?.loyalty_points || 0) % 1000) / 10)}%` }}
              />
            </div>
            <p className="text-xs text-muted-foreground text-right mb-4">
              {1000 - ((stats?.loyalty_points || 0) % 1000)} points to next reward
            </p>
            <Button
              onClick={handleRedeem}
              disabled={isRedeeming || (stats?.loyalty_points || 0) < 500}
              className="w-full rounded-full"
            >
              {isRedeeming ? <Loader2 className="w-4 h-4 animate-spin" /> : "Redeem 500 points"}
            </Button>
            <Button variant="link" className="w-full mt-2 text-xs" asChild>
              <Link href="/dashboard/client/loyalty">View loyalty details</Link>
            </Button>
          </DashboardPanelCard>
        </div>
      </div>
      <BookingDetailDialog
        isOpen={isDetailOpen}
        onClose={() => setIsDetailOpen(false)}
        booking={selectedBooking}
        role="client"
        isUpdating={false}
        userEmail={user?.email ?? ""}
        onRefresh={() => fetchDashboardData()}
        onUpdateStatus={(status) =>
          selectedBooking && handleUpdateStatus(selectedBooking.id, status)
        }
      />
    </DashboardPageContainer>
  );
}

// Local Button function removed in favor of standard component

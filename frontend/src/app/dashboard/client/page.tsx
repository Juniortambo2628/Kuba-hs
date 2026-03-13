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
  Loader2
} from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";
import { motion } from "framer-motion";
import { BookingDetailDialog } from "@/components/booking/BookingDetailDialog";

export default function ClientOverview() {
  const { user, isLoading: authLoading } = useAuth();
  const [stats, setStats] = useState<any>(null);
  const [upcoming, setUpcoming] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRedeeming, setIsRedeeming] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState<any>(null);
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
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div className="space-y-2">
            <h1 className="text-4xl md:text-5xl font-black text-[#1E293B] tracking-tight">
                Welcome to <span className="text-sky-600">Kuba</span>, {user?.name?.split(' ')[0]}
            </h1>
            <p className="text-gray-400 font-bold text-sm italic flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-500" />
                Your home service requests are being prioritized.
            </p>
        </div>
        <Link href="/services">
          <button className="h-14 bg-[#1E293B] hover:bg-sky-600 text-white rounded-2xl font-black px-10 shadow-xl shadow-gray-200 hover:shadow-sky-100 transition-all duration-500 uppercase tracking-widest text-[11px] group">
            Request New Service
            <Plus className="inline-block ml-2 w-4 h-4 transform group-hover:rotate-90 transition-transform" />
          </button>
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
          { label: "Active Requests", value: stats?.active_bookings || 0, icon: Clock, color: "text-sky-600", bg: "bg-sky-50", trend: "On schedule" },
          { label: "Service History", value: stats?.total_bookings || 0, icon: CheckCircle, color: "text-[#1E293B]", bg: "bg-gray-50", trend: "Total completed" },
          { label: "Membership Tier", value: stats?.membership_tier?.name || "Member", icon: Star, color: "text-amber-500", bg: "bg-amber-50", trend: stats?.membership_tier ? "Status active" : "Join rewards" }
        ].map((stat, i) => (
          <Card key={i} className="premium-card group border-none transition-all duration-300 hover:shadow-2xl hover:shadow-sky-100/50">
            <CardContent className="p-8 flex items-center justify-between">
              <div className="space-y-3">
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">{stat.label}</p>
                <div className="flex items-center gap-3">
                    <span className="text-3xl font-black text-[#1E293B] group-hover:text-sky-600 transition-colors">
                        {stat.value}
                    </span>
                    <span className="text-[9px] font-bold text-emerald-500 bg-emerald-50 px-2 py-0.5 rounded-full uppercase tracking-tighter">
                        {user?.membership_tier ? "Status active" : "Join rewards"}
                    </span>
                </div>
              </div>
              <div className={`p-5 ${stat.bg} rounded-3xl ${stat.color} group-hover:scale-110 group-hover:rotate-6 transition-all duration-500`}>
                <stat.icon className="w-6 h-6" />
              </div>
            </CardContent>
          </Card>
        ))}
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* Main Content: Upcoming Services */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex items-center justify-between px-2">
             <h2 className="text-sm font-black text-[#1E293B] uppercase tracking-[0.2em]">Next Appointments</h2>
             <Link href="/dashboard/client/bookings" className="text-[10px] font-black text-sky-600 hover:text-[#1E293B] transition-colors uppercase tracking-widest">
                View All History
             </Link>
          </div>

          {upcoming.length > 0 ? (
            <div className="space-y-4">
              {upcoming.map((booking: any) => (
                <Card key={booking.id} className="premium-card group overflow-hidden border-none cursor-pointer">
                  <CardContent className="p-0 flex">
                    <div className="w-2 bg-sky-600 group-hover:w-4 transition-all duration-500"></div>
                    <div className="p-8 flex-1 flex flex-col md:flex-row justify-between items-center gap-6">
                        <div className="flex items-center gap-6">
                            <div className="w-16 h-16 rounded-2xl bg-[#F8FAFC] flex flex-col items-center justify-center border border-gray-100 group-hover:border-sky-100 transition-all">
                                <span className="text-[10px] font-black text-sky-600 uppercase">
                                    {new Date(booking.scheduled_date).toLocaleString('default', { month: 'short' })}
                                </span>
                                <span className="text-xl font-black text-[#1E293B]">
                                    {new Date(booking.scheduled_date).getDate()}
                                </span>
                            </div>
                            <div className="space-y-1">
                                <h3 className="text-lg font-black text-[#1E293B] group-hover:text-sky-600 transition-colors">
                                    {booking.service?.name}
                                </h3>
                                <div className="flex items-center gap-4 text-[10px] font-bold text-gray-400 uppercase tracking-tighter">
                                    <span className="flex items-center gap-1.5"><Clock className="w-3 h-3" /> {booking.scheduled_time || '09:00 AM'}</span>
                                    <span className="flex items-center gap-1.5"><MapPin className="w-3 h-3" /> {booking.address?.city || 'On-site'}</span>
                                </div>
                            </div>
                        </div>
                        <Button 
                            onClick={() => {
                                setSelectedBooking(booking);
                                setIsDetailOpen(true);
                            }}
                            className="rounded-xl font-black text-[9px] tracking-widest border-gray-100 text-gray-400 hover:text-sky-600 hover:bg-sky-50 hover:border-sky-100 transition-all" 
                            variant="outline"
                        >
                            MANAGE
                        </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <Card className="premium-card border-none min-h-[300px] flex items-center justify-center flex-col gap-6 text-center">
                <div className="w-20 h-20 rounded-full bg-gray-50 flex items-center justify-center text-gray-200">
                    <Briefcase className="w-10 h-10" />
                </div>
                <div className="space-y-2">
                    <p className="text-[10px] font-black text-[#1E293B] uppercase tracking-widest">No service requests yet</p>
                    <p className="text-[11px] font-bold text-gray-400 italic">Professional help is just a few clicks away.</p>
                </div>
                <Link href="/services">
                    <Button className="bg-[#1E293B] hover:bg-sky-600 text-white rounded-xl font-black px-8 text-[10px] tracking-widest uppercase h-11 transition-all">
                        Browse Services
                    </Button>
                </Link>
            </Card>
          )}
        </div>

        {/* Sidebar: Loyalty & Membership */}
        <div className="space-y-8">
           <Card className="premium-card bg-[#1E293B] border-none text-white overflow-hidden relative group">
                <div className="absolute -top-10 -right-10 w-40 h-40 bg-sky-600/10 rounded-full blur-3xl group-hover:bg-sky-600/20 transition-all duration-700"></div>
                <CardContent className="p-10 relative z-10 space-y-8">
                     <div className="flex justify-between items-start">
                        <div className="space-y-1">
                            <p className="text-[10px] font-black text-sky-500 uppercase tracking-[0.2em]">Loyalty Status</p>
                            <h3 className="text-2xl font-black tracking-tight italic">{user?.membership_tier?.name || 'Standard Member'}</h3>
                        </div>
                        <div className="p-3 bg-white/10 rounded-2xl backdrop-blur-md">
                            <Gift className="w-5 h-5 text-sky-500" />
                        </div>
                    </div>

                    <div className="space-y-4">
                        <div className="flex justify-between items-end">
                            <div className="space-y-1">
                                <p className="text-[11px] font-bold text-gray-400">Total Points Available</p>
                                <p className="text-3xl font-black tabular-nums">{stats?.loyalty_points || 0}</p>
                            </div>
                            <TrendingUp className="w-8 h-8 text-emerald-500 opacity-50" />
                        </div>
                        <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden">
                            <div 
                                className="h-full bg-sky-600 rounded-full shadow-[0_0_15px_rgba(225,29,72,0.5)] transition-all duration-1000" 
                                style={{ width: `${Math.min(100, (stats?.loyalty_points % 1000) / 10)}%` }}
                            ></div>
                        </div>
                        <p className="text-[9px] font-black text-gray-500 uppercase tracking-widest text-right">
                            {1000 - (stats?.loyalty_points % 1000)} Points to next reward
                        </p>
                    </div>

                    <Button 
                        onClick={handleRedeem}
                        disabled={isRedeeming}
                        className="w-full h-12 bg-white text-[#1E293B] hover:bg-sky-50 hover:text-sky-600 rounded-2xl font-black text-[10px] tracking-widest transition-all"
                    >
                        {isRedeeming ? <Loader2 className="w-4 h-4 animate-spin" /> : 'REDEEM REWARDS'}
                    </Button>
                </CardContent>
           </Card>

           <Link href="/dashboard/client/profile" className="block">
                <Card className="premium-card border-none bg-emerald-50 group hover:bg-emerald-100/50 cursor-pointer transition-colors">
                    <CardContent className="p-8 flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-emerald-100 rounded-2xl flex items-center justify-center text-emerald-600 group-hover:scale-110 transition-transform">
                                <CreditCard className="w-5 h-5" />
                            </div>
                            <div>
                                <p className="text-xs font-black text-[#1E293B]">{user?.membership_tier?.name || 'Standard Plan'}</p>
                            </div>
                        </div>
                        <ChevronRight className="w-4 h-4 text-emerald-300 group-hover:text-emerald-600 transition-colors" />
                    </CardContent>
                </Card>
           </Link>
        </div>
      </div>
      <BookingDetailDialog 
        isOpen={isDetailOpen}
        onClose={() => setIsDetailOpen(false)}
        booking={selectedBooking}
        onUpdateStatus={(status) => handleUpdateStatus(selectedBooking.id, status)}
      />
    </div>
  );
}

// Local Button function removed in favor of standard component

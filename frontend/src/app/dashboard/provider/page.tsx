"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import axiosInstance from "@/lib/axios";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { 
  Calendar, 
  MapPin, 
  User as UserIcon, 
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
  Briefcase
} from "lucide-react";
import { motion } from "framer-motion";
import Link from "next/link";

export default function ProviderOverview() {
  const { user, isLoading: authLoading } = useAuth();
  const [data, setData] = useState<any>(null);
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

  const stats = data?.stats || {};
  const bookings = data?.recent_bookings || [];

  const getStatusBadge = (status: string) => {
    const styles: any = {
      pending: "bg-amber-50 text-amber-600 border-amber-100",
      confirmed: "bg-blue-50 text-blue-600 border-blue-100",
      completed: "bg-emerald-50 text-emerald-600 border-emerald-100",
      cancelled: "bg-red-50 text-sky-600 border-sky-100"
    };
    return (
      <Badge variant="outline" className={`rounded-full px-3 py-1 font-black text-[8px] uppercase tracking-widest border ${styles[status] || "bg-gray-50 text-gray-500"}`}>
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
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 text-glow-red">
        <div className="space-y-2">
            <h1 className="text-4xl md:text-5xl font-black text-[#1E293B] tracking-tight">
                Merchant <span className="text-sky-600">Portal</span>
            </h1>
            <p className="text-gray-400 font-bold text-sm italic flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-sky-600" />
                Logged in as {user?.name} — Managing Kuba Marketplace Operations.
            </p>
        </div>
        <div className="flex items-center gap-3">
            <Button asChild variant="outline" className="h-12 border-gray-100 bg-white text-[#1E293B] hover:bg-gray-50 rounded-xl font-black px-6 transition-all uppercase tracking-widest text-[10px]">
              <Link href="/dashboard/provider/profile">Business Profile</Link>
            </Button>
            <Button asChild className="h-12 bg-[#1E293B] hover:bg-sky-600 text-white rounded-xl font-black px-8 shadow-lg shadow-gray-200 transition-all uppercase tracking-widest text-[10px]">
              <Link href="/dashboard/provider/services">Add Service</Link>
            </Button>
        </div>
      </div>

      {/* Stats Grid */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
      >
          {[
            { label: "Total Revenue", value: `$${Number(stats.total_earnings || 0).toLocaleString()}`, icon: DollarSign, color: "text-emerald-600", bg: "bg-emerald-50", trend: "Paid out" },
            { label: "Incoming Jobs", value: stats.active_bookings || 0, icon: Clock, color: "text-blue-600", bg: "bg-blue-50", trend: "Action required" },
            { label: "Success Rate", value: stats.completed_bookings || 0, icon: CheckCircle, color: "text-sky-600", bg: "bg-red-50", trend: "Total served" },
            { label: "Merchant Rating", value: Number(stats.avg_rating || 5.0).toFixed(1), icon: Star, color: "text-amber-500", bg: "bg-amber-50", trend: "Elite status" }
          ].map((stat, i) => (
            <Card key={i} className="premium-card group border-none hover:shadow-2xl transition-all duration-300">
              <CardContent className="p-8 flex items-center justify-between">
                <div className="space-y-3">
                  <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">{stat.label}</p>
                  <div className="flex items-center gap-2">
                      <span className="text-2xl font-black text-[#1E293B] group-hover:text-sky-600 transition-colors">{stat.value}</span>
                      <span className="text-[8px] font-black text-gray-300 uppercase italic tracking-tighter">{stat.trend}</span>
                  </div>
                </div>
                <div className={`p-4 ${stat.bg} rounded-2xl ${stat.color} group-hover:scale-110 group-hover:rotate-6 transition-all duration-500`}>
                  <stat.icon className="w-6 h-6" />
                </div>
              </CardContent>
            </Card>
          ))}
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          {/* Active Work Orders */}
          <div className="lg:col-span-2 space-y-6">
            <div className="flex items-center justify-between px-2">
                <div className="space-y-1">
                    <h2 className="text-sm font-black text-[#1E293B] uppercase tracking-[0.2em]">Work Order Monitor</h2>
                    <p className="text-[10px] font-bold text-gray-400 italic">Manage your real-time service requests.</p>
                </div>
                <Link href="/dashboard/provider/bookings" className="text-[10px] font-black text-sky-600 hover:text-[#1E293B] transition-colors uppercase tracking-widest">
                    View Fleet History
                </Link>
            </div>

            <div className="space-y-4">
                {bookings.map((booking: any) => (
                    <Card key={booking.id} className="premium-card group border-none overflow-hidden hover:bg-red-50/10 cursor-pointer">
                        <CardContent className="p-0 flex">
                            <div className={`w-1.5 transition-all duration-500 ${booking.status === 'pending' ? 'bg-amber-400' : 'bg-blue-600'} group-hover:w-3`}></div>
                            <div className="p-8 flex-1 flex flex-col md:flex-row justify-between items-center gap-8">
                                <div className="flex items-center gap-6">
                                    <div className="p-4 bg-gray-50 rounded-2xl text-[#1E293B] group-hover:bg-white group-hover:shadow-sm transition-all">
                                        <Briefcase className="w-6 h-6" />
                                    </div>
                                    <div className="space-y-2">
                                        <div className="flex items-center gap-3">
                                            <span className="text-[10px] font-black text-sky-600 uppercase tracking-widest">#{booking.id || booking.booking_number}</span>
                                            {getStatusBadge(booking.status)}
                                        </div>
                                        <h3 className="text-lg font-black text-[#1E293B] group-hover:text-sky-600 transition-colors uppercase tracking-tight">{booking.service?.name}</h3>
                                        <div className="flex items-center gap-5 text-[10px] font-bold text-gray-400 uppercase tracking-tighter">
                                            <span className="flex items-center gap-2"><Calendar className="w-3.5 h-3.5" /> {new Date(booking.scheduled_date).toLocaleDateString()}</span>
                                            <span className="flex items-center gap-2 font-black text-[#1E293B]"><UserIcon className="w-3.5 h-3.5" /> {booking.customer?.name}</span>
                                        </div>
                                    </div>
                                </div>
                                
                                <div className="flex gap-3">
                                    {booking.status === 'pending' && (
                                        <Button 
                                            onClick={(e) => { e.stopPropagation(); handleStatusUpdate(booking.id, 'confirmed'); }}
                                            className="h-11 bg-sky-600 hover:bg-black text-white rounded-xl font-black px-8 text-[9px] tracking-widest uppercase transition-all"
                                            disabled={updatingId === booking.id}
                                        >
                                            {updatingId === booking.id ? <Loader2 className="w-4 h-4 animate-spin" /> : 'ACCEPT ORDER'}
                                        </Button>
                                    )}
                                    {booking.status === 'confirmed' && (
                                        <Button 
                                            className="h-11 bg-emerald-600 hover:bg-black text-white rounded-xl font-black px-8 text-[9px] tracking-widest uppercase transition-all"
                                            onClick={(e) => { e.stopPropagation(); handleStatusUpdate(booking.id, 'completed'); }}
                                            disabled={updatingId === booking.id}
                                        >
                                            {updatingId === booking.id ? <Loader2 className="w-4 h-4 animate-spin" /> : 'MARK COMPLETED'}
                                        </Button>
                                    )}
                                    <Button asChild variant="outline" className="h-11 w-11 p-0 rounded-xl border-gray-100 text-gray-300 hover:text-sky-600 hover:bg-white transition-all">
                                        <Link href={`/dashboard/provider/bookings`}>
                                            <ArrowUpRight className="w-5 h-5" />
                                        </Link>
                                    </Button>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                ))}
                {bookings.length === 0 && (
                    <div className="premium-card p-20 flex flex-col items-center justify-center gap-4 text-gray-300 border-none">
                        <Zap className="w-12 h-12 opacity-10" />
                        <p className="text-[10px] font-black uppercase tracking-[0.2em] italic">No active work orders</p>
                    </div>
                )}
            </div>
          </div>

          {/* Quick Management */}
          <div className="space-y-8">
              <Card className="premium-card border-none bg-[#1E293B] text-white p-10 overflow-hidden relative group">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-sky-600/10 rounded-full blur-3xl -mr-10 -mt-10 group-hover:bg-sky-600/20 transition-all duration-700"></div>
                  <CardContent className="p-0 space-y-8 relative z-10">
                      <div className="space-y-2">
                          <p className="text-[10px] font-black text-sky-500 uppercase tracking-widest">Business Growth</p>
                          <h2 className="text-2xl font-black uppercase italic tracking-tight">Expand Portfolio</h2>
                      </div>
                      <p className="text-xs font-bold text-gray-400 leading-relaxed italic">Add more services to your Kuba profile to reach more customers and increase your revenue potential.</p>
                      <Button asChild className="w-full h-14 bg-white text-[#1E293B] hover:bg-red-50 hover:text-sky-600 transition-all rounded-2xl font-black text-[10px] tracking-widest uppercase">
                        <Link href="/dashboard/provider/services">Get Started</Link>
                      </Button>
                  </CardContent>
              </Card>

              <div className="space-y-4">
                  <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] px-2">Merchant Tools</h3>
                  <div className="space-y-3">
                      {[
                        { label: "Availability Manager", icon: Clock, href: "/dashboard/provider/availability" },
                        { label: "Service Portfolio", icon: Briefcase, href: "/dashboard/provider/services" },
                        { label: "Merchant Feedback", icon: Star, href: "/dashboard/provider/reviews" },
                        { label: "Deployment Metrics", icon: Activity, href: "/dashboard/provider/bookings" }
                      ].map((tool, i) => (
                        <Link key={i} href={tool.href} className="w-full h-16 bg-white hover:bg-red-50 border border-transparent hover:border-sky-100 rounded-[1.5rem] px-6 flex items-center justify-between transition-all group">
                            <div className="flex items-center gap-4">
                                <div className="w-10 h-10 bg-gray-50 rounded-xl flex items-center justify-center text-[#1E293B] group-hover:bg-white group-hover:text-sky-600 transition-all">
                                    <tool.icon className="w-5 h-5" />
                                </div>
                                <span className="text-[11px] font-black text-[#1E293B] uppercase tracking-wide group-hover:translate-x-1 transition-transform">{tool.label}</span>
                            </div>
                            <ChevronRight className="w-4 h-4 text-gray-200 group-hover:text-sky-600" />
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

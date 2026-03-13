"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import axiosInstance from "@/lib/axios";
import { Card, CardContent } from "@/components/ui/card";
import { 
  Table, 
  TableHeader, 
  TableBody, 
  TableHead, 
  TableRow, 
  TableCell 
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { 
  Users, 
  Calendar, 
  Banknote, 
  Star, 
  TrendingUp,
  Briefcase,
  Search,
  Filter,
  MoreHorizontal,
  ChevronRight,
  ShieldCheck,
  Activity,
  ArrowUpRight,
} from "lucide-react";
import { VisualAnalytics } from "@/components/dashboard/VisualAnalytics";
import { useSearchState } from "@/hooks/useSearchState";
import { useExport } from "@/hooks/useExport";
import Link from "next/link";

interface Booking {
  id: number;
  booking_number: string;
  status: string;
  service?: { id: number; name: string };
  customer?: { id: number; name: string; email: string };
  provider?: { id: number; business_name: string; user: { id: number; name: string } };
  scheduled_date: string;
}

export default function AdminDashboard() {
  const { user, isLoading: authLoading } = useAuth();
  const { search, setSearch, status, setStatus } = useSearchState();
  const router = useRouter();
  const [stats, setStats] = useState<any>(null);
  const [trends, setTrends] = useState<any>({ users: [], bookings: [], revenue: [] });
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { exportToCSV } = useExport();

  useEffect(() => {
    if (!authLoading && user?.role === 'admin') {
      fetchData(search, status);
    }
  }, [authLoading, user, search, status]);

  useEffect(() => {
    if (!authLoading) {
      if (user?.role === 'admin') {
        // Initial fetch handled by the search/filter effect
      } else if (user) {
        router.push("/dashboard");
      } else {
        router.push("/admin/login?redirect=/admin");
      }
    }
  }, [authLoading, user]);

  const fetchData = async (search = "", status = "") => {
    try {
      const [analyticsRes, bookingsRes] = await Promise.all([
        axiosInstance.get("/api/admin/analytics"),
        axiosInstance.get(`/api/admin/bookings?search=${search}&status=${status}`),
      ]);
      setStats({
        ...analyticsRes.data.summary,
        growth: analyticsRes.data.growth
      });
      setTrends(analyticsRes.data.trends || { users: [], bookings: [], revenue: [] });
      setBookings(bookingsRes.data.data || []);
    } catch (err) {
      console.error("Failed to fetch admin data:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusBadge = (status: string) => {
    const styles: any = {
      pending: "bg-amber-50 text-amber-600 border-amber-100",
      confirmed: "bg-blue-50 text-blue-600 border-blue-100",
      completed: "bg-emerald-50 text-emerald-600 border-emerald-100",
      cancelled: "bg-sky-50 text-sky-600 border-sky-100"
    };
    return (
      <Badge variant="outline" className={`rounded-full px-3 py-1 font-black text-[9px] uppercase tracking-widest border ${styles[status] || "bg-gray-50 text-gray-500"}`}>
        {status}
      </Badge>
    );
  };

  if (isLoading) {
    return (
      <div className="space-y-8 animate-pulse">
        <Skeleton className="h-12 w-64 rounded-2xl" />
        <div className="grid gap-6 md:grid-cols-4">
          {[1,2,3,4].map(i => <Skeleton key={i} className="h-32 w-full rounded-3xl" />)}
        </div>
        <Skeleton className="h-[500px] w-full rounded-[2.5rem]" />
      </div>
    );
  }

  const metricCards = [
    { label: "Total Platform Users", value: stats?.total_users, icon: Users, color: "text-[#1E293B]", bg: "bg-gray-50", trend: `${stats?.growth?.users >= 0 ? '+' : ''}${stats?.growth?.users}% MoM` },
    { label: "Active Bookings", value: stats?.total_bookings, icon: Calendar, color: "text-sky-600", bg: "bg-sky-50", trend: `${stats?.growth?.bookings >= 0 ? '+' : ''}${stats?.growth?.bookings}% MoM` },
    { label: "Market Rating", value: Number(stats?.avg_rating || 4.8).toFixed(1), icon: Star, color: "text-amber-500", bg: "bg-amber-50", trend: "Top rated" },
    { label: "Gross Revenue", value: `$${Number(stats?.platform_revenue || 0).toLocaleString()}`, icon: Banknote, color: "text-emerald-600", bg: "bg-emerald-50", trend: `${stats?.growth?.revenue >= 0 ? '+' : ''}${stats?.growth?.revenue}% MoM` },
  ];

  return (
    <div className="max-w-[1400px] mx-auto space-y-10 pb-12">
      {/* Admin Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div className="space-y-2">
            <h1 className="text-4xl md:text-5xl font-black text-[#1E293B] tracking-tight">
                <span className="text-sky-600">Kuba</span> Control Center
            </h1>
            <p className="text-gray-400 font-bold text-sm italic flex items-center gap-2">
                <Activity className="w-4 h-4 text-[#1E293B]" />
                Platform is operational and performing at peak capacity.
            </p>
        </div>
        <div className="flex items-center gap-3">
            <button 
                onClick={async () => {
                    try {
                        const response = await axiosInstance.get("/api/admin/reports/generate?type=bookings", {
                            responseType: 'blob'
                        });
                        const url = window.URL.createObjectURL(new Blob([response.data]));
                        const link = document.createElement('a');
                        link.href = url;
                        link.setAttribute('download', 'kuba_bookings_report.csv');
                        document.body.appendChild(link);
                        link.click();
                        link.remove();
                    } catch (err) {
                        console.error("Failed to generate report:", err);
                    }
                }}
                className="h-12 border border-gray-100 bg-white text-[#1E293B] hover:bg-gray-50 rounded-xl font-black px-6 transition-all uppercase tracking-widest text-[10px]"
            >
                Generate Report
            </button>
            <Link 
                href="/admin/settings"
                className="h-12 bg-[#1E293B] hover:bg-sky-600 text-white rounded-xl font-black px-8 shadow-lg shadow-gray-200 transition-all uppercase tracking-widest text-[10px] flex items-center justify-center p-0"
            >
                System Config
            </Link>
        </div>
      </div>

      {/* Analytics Visualization */}
      <div className="grid gap-8 md:grid-cols-2">
        <VisualAnalytics 
            data={trends.revenue.map((d: any) => ({ name: d.date, value: d.count }))} 
            title="Revenue Velocity" 
            dataKey="value" 
            categoryKey="name"
            color="#0ea5e9"
        />
        <VisualAnalytics 
            data={trends.users.map((d: any) => ({ name: d.date, value: d.count }))} 
            title="User Acquisition" 
            type="bar"
            dataKey="value" 
            categoryKey="name"
            color="#8b5cf6"
        />
      </div>

      {/* Activity Monitor */}
      <Card className="premium-card overflow-hidden border-none shadow-premium">
        <div className="p-10 border-b border-gray-50 flex flex-col md:flex-row justify-between items-center gap-6 bg-white/50 backdrop-blur-md">
            <div className="space-y-1">
                <h2 className="text-sm font-black text-[#1E293B] uppercase tracking-[0.2em] flex items-center gap-2">
                    <Briefcase className="w-4 h-4 text-sky-600" />
                    Transaction Monitor
                </h2>
                <p className="text-xs font-bold text-gray-400 italic">Tracking latest marketplace movements across Kuba.</p>
            </div>
            
            <div className="flex items-center gap-3 w-full md:w-auto">
                <div className="relative flex-1 md:w-80 group">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-sky-600 transition-colors" />
                    <input 
                        type="text" 
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder="Search by ID or Customer..." 
                        className="w-full h-12 pl-12 pr-4 bg-[#F8FAFC] border-none rounded-xl text-xs font-bold focus:ring-2 focus:ring-sky-100 transition-all placeholder:text-gray-300 placeholder:italic"
                    />
                </div>
                <select 
                    value={status}
                    onChange={(e) => setStatus(e.target.value)}
                    className="h-12 border border-gray-100 bg-white hover:bg-sky-50 hover:text-sky-600 hover:border-sky-100 px-4 rounded-xl transition-all text-[10px] font-black uppercase tracking-widest appearance-none cursor-pointer"
                >
                    <option value="">All Monitor</option>
                    <option value="pending">Pending</option>
                    <option value="confirmed">Confirmed</option>
                    <option value="completed">Completed</option>
                    <option value="cancelled">Cancelled</option>
                </select>
            </div>
        </div>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent border-gray-50">
                <TableHead className="pl-10 h-16 uppercase text-[10px] font-black tracking-[0.2em] text-gray-400">Order Ref</TableHead>
                <TableHead className="h-16 uppercase text-[10px] font-black tracking-[0.2em] text-gray-400">Service Category</TableHead>
                <TableHead className="h-16 uppercase text-[10px] font-black tracking-[0.2em] text-gray-400">Merchant / Customer</TableHead>
                <TableHead className="h-16 uppercase text-[10px] font-black tracking-[0.2em] text-gray-400">Scheduled Date</TableHead>
                <TableHead className="h-16 uppercase text-[10px] font-black tracking-[0.2em] text-gray-400">Status</TableHead>
                <TableHead className="h-16 pr-10"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {bookings.slice(0, 10).map((booking: any) => (
                <TableRow key={booking.id} className="hover:bg-gray-50/50 transition-colors border-gray-50 group">
                  <TableCell className="pl-10 py-6">
                    <span className="text-[10px] font-black text-sky-600 uppercase tracking-widest group-hover:scale-105 transition-transform inline-block">
                        #{booking.booking_number || 'KR-882'}
                    </span>
                  </TableCell>
                  <TableCell className="py-6">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-gray-50 flex items-center justify-center text-[#1E293B]">
                            <Briefcase className="w-4 h-4" />
                        </div>
                        <span className="font-black text-[#1E293B] text-sm">{booking.service?.name}</span>
                    </div>
                  </TableCell>
                  <TableCell className="py-6">
                    <div className="space-y-0.5">
                        <p className="text-xs font-black text-[#1E293B]">{booking.customer?.name}</p>
                        <p className="text-[10px] font-bold text-gray-400 italic">via {booking.provider?.business_name || 'Individual'}</p>
                    </div>
                  </TableCell>
                  <TableCell className="py-6">
                    <div className="space-y-0.5 text-[#1E293B]">
                        <p className="text-[11px] font-black">{new Date(booking.scheduled_date).toLocaleDateString()}</p>
                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-tighter">Market Confirmed</p>
                    </div>
                  </TableCell>
                  <TableCell className="py-6">
                    {getStatusBadge(booking.status)}
                  </TableCell>
                  <TableCell className="pr-10 py-6 text-right">
                    <button className="p-2 text-gray-200 hover:text-sky-600 transition-colors group/btn">
                        <ArrowUpRight className="w-5 h-5 group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5 transition-transform" />
                    </button>
                  </TableCell>
                </TableRow>
              ))}
              {bookings.length === 0 && (
                <TableRow>
                  <TableCell colSpan={6} className="h-80 text-center">
                    <div className="flex flex-col items-center justify-center gap-4 text-gray-200">
                        <Activity className="h-16 w-16 opacity-10" />
                        <p className="text-[10px] font-black uppercase tracking-[0.2em] italic">Waiting for platform activity...</p>
                    </div>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
          
          <div className="p-10 border-t border-gray-50 flex justify-center bg-gray-50/10">
              <button className="flex items-center gap-2 text-[10px] font-black text-[#1E293B] hover:text-sky-600 transition-all uppercase tracking-[0.2em] group">
                Full Transaction History
                <ChevronRight className="w-4 h-4 transform group-hover:translate-x-2 transition-transform" />
              </button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

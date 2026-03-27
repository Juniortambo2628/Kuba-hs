"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import axiosInstance from "@/lib/axios";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Users, 
  Calendar, 
  Banknote, 
  Star, 
  Briefcase,
  Search,
  ArrowUpRight,
  Activity,
  ChevronRight,
  Download,
} from "lucide-react";
import { MetricCard } from "@/components/shared/MetricCard";
import { VisualAnalytics } from "@/components/dashboard/VisualAnalytics";
import { useSearchState } from "@/hooks/useSearchState";
import { useExport } from "@/hooks/useExport";
import { useApiData } from "@/hooks/useApiData";
import Link from "next/link";

import { Booking, User, Provider } from "@/types";
import { DashboardPageHeader } from "@/components/shared/DashboardPageHeader";
import { BookingStatusBadge } from "@/components/shared/BookingStatusBadge";
import { Suspense } from "react";

interface AdminStats {
  total_users: number;
  total_bookings: number;
  avg_rating: number;
  platform_revenue: number;
  growth: {
    users: number;
    bookings: number;
    revenue: number;
  };
}

function AdminDashboardContent() {
  const { user, isLoading: authLoading } = useAuth();
  const { search, setSearch, status, setStatus } = useSearchState();
  const router = useRouter();
  const [trends, setTrends] = useState<any>({ users: [], bookings: [], revenue: [] });
  const { data: analyticsData, isLoading: analyticsLoading } = useApiData<any>("/api/admin/analytics");
  const { data: bookingsData, isLoading: bookingsLoading, refetch: fetchBookings } = useApiData<any>(`/api/admin/bookings?search=${search}&status=${status}`, { initialData: null });
  
  const stats = analyticsData ? { ...analyticsData.summary, growth: analyticsData.growth } as AdminStats : null;
  const bookings = (bookingsData?.data || []) as Booking[];
  const isLoading = analyticsLoading || bookingsLoading;
  const { exportToCSV } = useExport();

  useEffect(() => {
    if (analyticsData?.trends) {
      setTrends(analyticsData.trends);
    }
  }, [analyticsData]);

  if (isLoading) {
    return (
      <div className="space-y-6 animate-pulse max-w-6xl mx-auto">
        <Skeleton className="h-10 w-48 rounded-lg" />
        <div className="grid gap-4 md:grid-cols-4">
          {[1,2,3,4].map(i => <Skeleton key={i} className="h-28 w-full rounded-xl" />)}
        </div>
        <Skeleton className="h-[400px] w-full rounded-xl" />
      </div>
    );
  }

  const metricCards = [
    { label: "Total Users", value: stats?.total_users, icon: Users, trend: `${(stats?.growth?.users ?? 0) >= 0 ? '+' : ''}${stats?.growth?.users ?? 0}%` },
    { label: "Active Bookings", value: stats?.total_bookings, icon: Calendar, trend: `${(stats?.growth?.bookings ?? 0) >= 0 ? '+' : ''}${stats?.growth?.bookings ?? 0}%` },
    { label: "Avg Rating", value: stats?.avg_rating ? Number(stats?.avg_rating).toFixed(1) : '—', icon: Star, trend: "Market Leading" },
    { label: "Revenue", value: `KES ${Number(stats?.platform_revenue || 0).toLocaleString()}`, icon: Banknote, trend: `${(stats?.growth?.revenue ?? 0) >= 0 ? '+' : ''}${stats?.growth?.revenue ?? 0}%` },
  ];

  const handleExport = async () => {
    try {
      const response = await axiosInstance.get("/api/admin/reports/generate?type=bookings", { responseType: 'blob' });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'kuba_bookings_report.csv');
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (err) { console.error("Failed to generate report:", err); }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-12">
      {/* Page Header */}
      <DashboardPageHeader 
        title="Dashboard" 
        subtitle="Overview of your platform performance."
      >
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={handleExport}>
            <Download className="w-4 h-4 mr-1.5" />
            Export
          </Button>
          <Button asChild size="sm">
            <Link href="/admin/settings">Settings</Link>
          </Button>
        </div>
      </DashboardPageHeader>

      {/* Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {metricCards.map((card, i) => (
          <MetricCard 
            key={i} 
            label={card.label} 
            value={card.value || '—'} 
            icon={card.icon} 
            trend={card.trend} 
          />
        ))}
      </div>

      {/* Charts */}
      <div className="grid gap-6 md:grid-cols-2">
        <VisualAnalytics 
          data={trends.revenue.map((d: any) => ({ name: d.date, value: d.count }))} 
          title="Revenue" 
          dataKey="value" 
          categoryKey="name"
          color="#71717a"
        />
        <VisualAnalytics 
          data={trends.users.map((d: any) => ({ name: d.date, value: d.count }))} 
          title="New Users" 
          type="bar"
          dataKey="value" 
          categoryKey="name"
          color="#a1a1aa"
        />
      </div>

      {/* Bookings Table */}
      <Card className="border border-border overflow-hidden rounded-dashboard">
        <CardHeader className="border-b border-border px-4 sm:px-6 py-4">
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
            <div>
              <CardTitle className="text-base font-semibold text-foreground">Recent Bookings</CardTitle>
              <p className="text-sm text-muted-foreground mt-0.5">Latest marketplace activity.</p>
            </div>
            <div className="flex flex-col sm:flex-row items-center gap-2 w-full lg:w-auto">
              <div className="relative flex-1 sm:w-64">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input 
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search bookings..." 
                  className="pl-10 h-9"
                />
              </div>
              <select 
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="h-9 border border-input bg-background px-3 rounded-lg text-sm appearance-none cursor-pointer text-foreground"
              >
                <option value="">All</option>
                <option value="pending">Pending</option>
                <option value="confirmed">Confirmed</option>
                <option value="completed">Completed</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto custom-scrollbar">
            <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent border-border bg-muted/20">
                <TableHead className="pl-6 text-[11px] font-bold text-muted-foreground tracking-tight h-10">Order</TableHead>
                <TableHead className="text-[11px] font-bold text-muted-foreground tracking-tight h-10">Service</TableHead>
                <TableHead className="text-[11px] font-bold text-muted-foreground tracking-tight h-10">Customer</TableHead>
                <TableHead className="text-[11px] font-bold text-muted-foreground tracking-tight h-10">Date</TableHead>
                <TableHead className="text-[11px] font-bold text-muted-foreground tracking-tight h-10">Status</TableHead>
                <TableHead className="pr-6 text-right text-[11px] font-bold text-muted-foreground tracking-tight h-10">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {bookings.slice(0, 10).map((booking) => (
                <TableRow key={booking.id} className="group border-border hover:bg-muted/30 transition-colors">
                  <TableCell className="pl-6 font-bold text-primary text-xs">
                    <Link href={`/admin/bookings/${booking.id}`}>
                      #{booking.booking_number}
                    </Link>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Briefcase className="w-4 h-4 text-muted-foreground" />
                      <span className="text-sm font-semibold text-foreground">{booking.service?.name}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div>
                      <p className="text-sm font-bold text-foreground">{booking.customer?.name}</p>
                      <p className="text-[10px] text-muted-foreground">via {booking.provider?.business_name || 'Individual'}</p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <p className="text-sm font-medium text-foreground">{new Date(booking.scheduled_date).toLocaleDateString()}</p>
                  </TableCell>
                  <TableCell>
                    <BookingStatusBadge status={booking.status} />
                  </TableCell>
                  <TableCell className="pr-6 text-right">
                    <Link href={`/admin/bookings/${booking.id}`}>
                      <button className="p-1.5 text-muted-foreground hover:text-primary transition-colors rounded-md hover:bg-accent">
                        <ArrowUpRight className="w-4 h-4" />
                      </button>
                    </Link>
                  </TableCell>
                </TableRow>
              ))}
              {bookings.length === 0 && (
                <TableRow>
                  <TableCell colSpan={6} className="h-48 text-center">
                    <div className="flex flex-col items-center justify-center gap-2 text-muted-foreground">
                      <Activity className="h-8 w-8" />
                      <p className="text-sm font-medium">No bookings found</p>
                    </div>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
          </div>
          
          <div className="p-4 border-t border-border flex justify-center">
            <Link href="/admin/bookings" className="flex items-center gap-1.5 text-xs text-primary hover:underline font-bold group">
              View all bookings
              <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default function AdminDashboard() {
  return (
    <Suspense fallback={<div className="max-w-6xl mx-auto p-8"><Skeleton className="h-[600px] w-full rounded-2xl" /></div>}>
      <AdminDashboardContent />
    </Suspense>
  );
}

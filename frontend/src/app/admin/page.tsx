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
import { MetricCard } from "@/components/dashboard/MetricCard";
import { VisualAnalytics } from "@/components/dashboard/VisualAnalytics";
import { useSearchState } from "@/hooks/useSearchState";
import { useExport } from "@/hooks/useExport";
import Link from "next/link";

import { Booking, User, Provider } from "@/types";

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

export default function AdminDashboard() {
  const { user, isLoading: authLoading } = useAuth();
  const { search, setSearch, status, setStatus } = useSearchState();
  const router = useRouter();
  const [stats, setStats] = useState<AdminStats | null>(null);
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
        // handled by search/filter effect
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
    const styles: Record<string, string> = {
      pending: "bg-muted text-foreground border-border",
      confirmed: "bg-muted text-foreground border-border",
      completed: "bg-muted text-foreground border-border",
      cancelled: "bg-muted text-foreground border-border"
    };
    return (
      <Badge variant="outline" className={`rounded-full px-2.5 py-0.5 text-xs font-medium capitalize border ${styles[status] || "bg-muted text-muted-foreground"}`}>
        {status}
      </Badge>
    );
  };

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
    { label: "Avg Rating", value: stats?.avg_rating ? Number(stats?.avg_rating).toFixed(1) : '—', icon: Star, trend: "Top rated" },
    { label: "Revenue", value: `$${Number(stats?.platform_revenue || 0).toLocaleString()}`, icon: Banknote, trend: `${(stats?.growth?.revenue ?? 0) >= 0 ? '+' : ''}${stats?.growth?.revenue ?? 0}%` },
  ];

  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-12">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground tracking-tight">Dashboard</h1>
          <p className="text-sm text-muted-foreground mt-1">Overview of your platform performance.</p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={async () => {
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
            }}
          >
            <Download className="w-4 h-4 mr-1.5" />
            Export
          </Button>
          <Button asChild size="sm">
            <Link href="/admin/settings">Settings</Link>
          </Button>
        </div>
      </div>

      {/* Metric Cards */}
      {/* Metric Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
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
        <CardHeader className="border-b border-border px-6 py-4">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <CardTitle className="text-base font-semibold text-foreground">Recent Bookings</CardTitle>
              <p className="text-sm text-muted-foreground mt-0.5">Latest marketplace activity.</p>
            </div>
            <div className="flex items-center gap-2 w-full sm:w-auto">
              <div className="relative flex-1 sm:w-64">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input 
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search bookings..." 
                  className="pl-9 h-9"
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
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent">
                <TableHead className="pl-6">Order</TableHead>
                <TableHead>Service</TableHead>
                <TableHead>Customer</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="pr-6 text-right">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {bookings.slice(0, 10).map((booking) => (
                <TableRow key={booking.id} className="group">
                  <TableCell className="pl-6 font-medium text-primary text-sm">
                    <Link href={`/admin/bookings/${booking.id}`}>
                      #{booking.booking_number}
                    </Link>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Briefcase className="w-4 h-4 text-muted-foreground" />
                      <span className="text-sm text-foreground">{booking.service?.name}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div>
                      <p className="text-sm font-medium text-foreground">{booking.customer?.name}</p>
                      <p className="text-xs text-muted-foreground">via {booking.provider?.business_name || 'Individual'}</p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <p className="text-sm text-foreground">{new Date(booking.scheduled_date).toLocaleDateString()}</p>
                  </TableCell>
                  <TableCell>
                    {getStatusBadge(booking.status)}
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
                      <p className="text-sm">No bookings found</p>
                    </div>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
          
          <div className="p-4 border-t border-border flex justify-center">
            <Link href="/admin/bookings" className="flex items-center gap-1.5 text-sm text-primary hover:underline font-medium group">
              View all bookings
              <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

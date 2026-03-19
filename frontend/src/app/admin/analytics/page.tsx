"use client";

import { useEffect, useState } from "react";
import axiosInstance from "@/lib/axios";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { 
  Users, 
  Calendar, 
  TrendingUp, 
  Star,
  Activity,
  BarChart,
  PieChart as PieChartIcon,
  Download
} from "lucide-react";
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  BarChart as RechartsBarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  Legend
} from "recharts";
import { useExport } from "@/hooks/useExport";
import { Button } from "@/components/ui/button";

interface AnalyticsData {
  trends: {
    users: { date: string; count: number }[];
    bookings: { date: string; count: number }[];
    revenue: { date: string; count: number }[];
  };
  growth: {
    users: number;
    bookings: number;
    revenue: number;
  };
  distribution: {
    users: { customers: number; providers: number; admins: number };
    services: { name: string; provider_services_count: number }[];
  };
  summary: {
    total_users: number;
    total_bookings: number;
    platform_revenue: number;
    avg_rating: number;
  };
}

// Monochrome grey palette for charts
const MONO_COLORS = ['#71717a', '#a1a1aa', '#d4d4d8', '#52525b', '#e4e4e7'];

export default function AdminAnalytics() {
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { exportToCSV } = useExport();

  useEffect(() => { fetchAnalytics(); }, []);

  const fetchAnalytics = async () => {
    try { const res = await axiosInstance.get("/api/admin/analytics"); setData(res.data); }
    catch (err) { console.error("Failed to fetch analytics:", err); }
    finally { setIsLoading(false); }
  };

  if (isLoading) {
    return (
      <div className="max-w-6xl mx-auto space-y-6 animate-pulse">
        <Skeleton className="h-10 w-48 rounded-lg" />
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map(i => <Skeleton key={i} className="h-28 rounded-xl" />)}
        </div>
        <Skeleton className="h-80 rounded-xl" />
      </div>
    );
  }

  if (!data) return null;

  const userDistributionData = [
    { name: 'Customers', value: data.distribution.users.customers },
    { name: 'Providers', value: data.distribution.users.providers },
    { name: 'Admins', value: data.distribution.users.admins },
  ].filter(d => d.value > 0);

  const formatCurrency = (val: number) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(val);

  const stats = [
    { label: "Revenue", value: formatCurrency(data.summary.platform_revenue), icon: TrendingUp, growth: data.growth.revenue },
    { label: "Bookings", value: data.summary.total_bookings.toLocaleString(), icon: Calendar, growth: data.growth.bookings },
    { label: "Users", value: data.summary.total_users.toLocaleString(), icon: Users, growth: data.growth.users },
    { label: "Avg Rating", value: Number(data.summary.avg_rating).toFixed(1), icon: Star, growth: 0 }
  ];

  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground tracking-tight">Analytics</h1>
          <p className="text-sm text-muted-foreground mt-1">Platform health and growth metrics.</p>
        </div>
        <Button 
          onClick={() => { if (data) exportToCSV(data.trends.revenue, 'revenue_trends'); }}
          variant="outline" size="sm"
        >
          <Download className="w-4 h-4 mr-1.5" /> Export
        </Button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, i) => (
          <Card key={i} className="border border-border">
            <CardContent className="p-5">
              <div className="flex items-center justify-between mb-3">
                <div className="p-2 bg-muted rounded-lg text-muted-foreground">
                  <stat.icon className="w-4 h-4" />
                </div>
                {stat.label !== "Avg Rating" && (
                  <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${stat.growth > 0 ? 'bg-muted text-foreground' : stat.growth < 0 ? 'bg-muted text-foreground' : 'bg-muted text-muted-foreground'}`}>
                    {stat.growth > 0 ? '+' : ''}{stat.growth}%
                  </span>
                )}
              </div>
              <p className="text-2xl font-bold text-foreground tracking-tight">{stat.value}</p>
              <p className="text-xs text-muted-foreground mt-0.5">{stat.label}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Revenue Chart */}
      <Card className="border border-border">
        <CardHeader className="px-6 py-4 border-b border-border">
          <div className="flex items-center gap-2">
            <BarChart className="w-4 h-4 text-muted-foreground" />
            <div>
              <CardTitle className="text-base font-semibold text-foreground">Revenue (30 Days)</CardTitle>
              <p className="text-sm text-muted-foreground">Daily platform fee revenue.</p>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-6">
          <div className="h-[350px] w-full" style={{ minWidth: 0 }}>
            <ResponsiveContainer width="100%" height="100%" minWidth={0}>
              <AreaChart data={data.trends.revenue} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="currentColor" stopOpacity={0.15}/>
                    <stop offset="95%" stopColor="currentColor" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border)" />
                <XAxis dataKey="date" tick={{fontSize: 11}} tickLine={false} axisLine={false} stroke="var(--muted-foreground)" />
                <YAxis tickFormatter={(val) => `$${val}`} tick={{fontSize: 11}} tickLine={false} axisLine={false} stroke="var(--muted-foreground)" />
                <Tooltip 
                  contentStyle={{ borderRadius: '8px', border: '1px solid var(--border)', background: 'var(--card)', color: 'var(--foreground)', fontSize: 13 }}
                  formatter={(value: any) => [`$${value}`, 'Revenue']}
                />
                <Area type="monotone" dataKey="count" stroke="#71717a" strokeWidth={2} fillOpacity={1} fill="url(#colorRevenue)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Row 2: Bar + Pie */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Bookings Bar Chart */}
        <Card className="border border-border">
          <CardHeader className="px-6 py-4 border-b border-border">
            <div className="flex items-center gap-2">
              <Activity className="w-4 h-4 text-muted-foreground" />
              <div>
                <CardTitle className="text-base font-semibold text-foreground">Bookings Activity</CardTitle>
                <p className="text-sm text-muted-foreground">Daily bookings trend.</p>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-6">
            <div className="h-[280px] w-full" style={{ minWidth: 0 }}>
              <ResponsiveContainer width="100%" height="100%" minWidth={0}>
                <RechartsBarChart data={data.trends.bookings} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border)" />
                  <XAxis dataKey="date" tick={{fontSize: 11}} tickLine={false} axisLine={false} stroke="var(--muted-foreground)" />
                  <YAxis tick={{fontSize: 11}} tickLine={false} axisLine={false} stroke="var(--muted-foreground)" />
                  <Tooltip contentStyle={{ borderRadius: '8px', border: '1px solid var(--border)', background: 'var(--card)', color: 'var(--foreground)', fontSize: 13 }} />
                  <Bar dataKey="count" name="Bookings" fill="#71717a" radius={[3, 3, 0, 0]} />
                </RechartsBarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* User Distribution Pie */}
        <Card className="border border-border">
          <CardHeader className="px-6 py-4 border-b border-border">
            <div className="flex items-center gap-2">
              <PieChartIcon className="w-4 h-4 text-muted-foreground" />
              <div>
                <CardTitle className="text-base font-semibold text-foreground">User Distribution</CardTitle>
                <p className="text-sm text-muted-foreground">Roles across the platform.</p>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-6 flex justify-center">
            <div className="h-[280px] w-full" style={{ minWidth: 0 }}>
              <ResponsiveContainer width="100%" height="100%" minWidth={0}>
                <PieChart>
                  <Pie data={userDistributionData} cx="50%" cy="50%" innerRadius={70} outerRadius={100} paddingAngle={3} dataKey="value" stroke="none">
                    {userDistributionData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={MONO_COLORS[index % MONO_COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={{ borderRadius: '8px', border: '1px solid var(--border)', background: 'var(--card)', color: 'var(--foreground)', fontSize: 13 }} />
                  <Legend iconType="circle" wrapperStyle={{ fontSize: '12px' }} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

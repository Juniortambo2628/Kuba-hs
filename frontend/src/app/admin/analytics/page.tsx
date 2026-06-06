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
  BarChart as RechartsBarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  Legend
} from "recharts";
import { useExport } from "@/hooks/useExport";
import { Button } from "@/components/ui/button";
import { DashboardPageHeader } from "@/components/shared/DashboardPageHeader";
import { DashboardPageContainer } from "@/components/shared/DashboardPageContainer";
import { ChartContainer } from "@/components/shared/ChartContainer";
import { DashboardPageSkeleton } from "@/components/shared/DashboardPageSkeleton";
import { MetricCard } from "@/components/shared/MetricCard";
import { useApiData } from "@/hooks/useApiData";

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
  const { data, isLoading, refetch: fetchAnalytics } = useApiData<AnalyticsData>("/api/admin/analytics", { initialData: null });
  const { exportToCSV } = useExport();


  if (isLoading) {
    return <DashboardPageSkeleton width="default" metrics={4} bodyHeight="h-80" />;
  }

  if (!data) return null;

  const userDistributionData = [
    { name: 'Customers', value: data.distribution.users.customers },
    { name: 'Providers', value: data.distribution.users.providers },
    { name: 'Admins', value: data.distribution.users.admins },
  ].filter(d => d.value > 0);

  const formatCurrency = (val: number) => `KES ${Number(val).toLocaleString()}`;

  const stats = [
    { label: "Revenue", value: formatCurrency(data.summary.platform_revenue), icon: TrendingUp, trend: `${data.growth.revenue >= 0 ? '+' : ''}${data.growth.revenue}%` },
    { label: "Bookings", value: data.summary.total_bookings.toLocaleString(), icon: Calendar, trend: `${data.growth.bookings >= 0 ? '+' : ''}${data.growth.bookings}%` },
    { label: "Users", value: data.summary.total_users.toLocaleString(), icon: Users, trend: `${data.growth.users >= 0 ? '+' : ''}${data.growth.users}%` },
    { label: "Avg Rating", value: Number(data.summary.avg_rating).toFixed(1), icon: Star, trend: "Platform avg" }
  ];

  return (
    <DashboardPageContainer width="default">
      {/* Header */}
      <DashboardPageHeader 
        title="Analytics" 
        subtitle="Platform health and growth metrics."
      >
        <Button 
          onClick={() => { if (data) exportToCSV(data.trends.revenue, 'revenue_trends'); }}
          variant="outline" size="sm"
        >
          <Download className="w-4 h-4 mr-1.5" /> Export
        </Button>
      </DashboardPageHeader>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, i) => (
          <MetricCard 
            key={i} 
            label={stat.label} 
            value={stat.value} 
            icon={stat.icon} 
            trend={stat.trend} 
          />
        ))}
      </div>

      {/* Revenue Chart */}
      <Card className="border border-border">
        <CardHeader className="px-6 py-4 border-b border-border">
          <div className="flex items-center gap-2">
            <BarChart className="w-4 h-4 text-muted-foreground" />
            <div>
              <CardTitle className="text-base font-semibold text-foreground">Revenue (30 Days)</CardTitle>
              <p className="text-sm text-muted-foreground mt-0.5">Daily platform fee revenue.</p>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-6">
          <ChartContainer height={350}>
              <AreaChart data={data.trends.revenue} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="currentColor" stopOpacity={0.15}/>
                    <stop offset="95%" stopColor="currentColor" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border)" />
                <XAxis dataKey="date" tick={{fontSize: 11}} tickLine={false} axisLine={false} stroke="var(--muted-foreground)" />
                <YAxis tickFormatter={(val) => `KES ${val}`} tick={{fontSize: 11}} tickLine={false} axisLine={false} stroke="var(--muted-foreground)" />
                <Tooltip 
                  contentStyle={{ borderRadius: '8px', border: '1px solid var(--border)', background: 'var(--card)', color: 'var(--foreground)', fontSize: 13 }}
                  formatter={(value: any) => [`KES ${Number(value).toLocaleString()}`, 'Revenue']}
                />
                <Area type="monotone" dataKey="count" stroke="#71717a" strokeWidth={2} fillOpacity={1} fill="url(#colorRevenue)" />
              </AreaChart>
          </ChartContainer>
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
                <p className="text-sm text-muted-foreground mt-0.5">Daily bookings trend.</p>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-6">
            <ChartContainer height={280}>
                <RechartsBarChart data={data.trends.bookings} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border)" />
                  <XAxis dataKey="date" tick={{fontSize: 11}} tickLine={false} axisLine={false} stroke="var(--muted-foreground)" />
                  <YAxis tick={{fontSize: 11}} tickLine={false} axisLine={false} stroke="var(--muted-foreground)" />
                  <Tooltip contentStyle={{ borderRadius: '8px', border: '1px solid var(--border)', background: 'var(--card)', color: 'var(--foreground)', fontSize: 13 }} />
                  <Bar dataKey="count" name="Bookings" fill="#71717a" radius={[3, 3, 0, 0]} />
                </RechartsBarChart>
            </ChartContainer>
          </CardContent>
        </Card>

        {/* User Distribution Pie */}
        <Card className="border border-border">
          <CardHeader className="px-6 py-4 border-b border-border">
            <div className="flex items-center gap-2">
              <PieChartIcon className="w-4 h-4 text-muted-foreground" />
              <div>
                <CardTitle className="text-base font-semibold text-foreground">User Distribution</CardTitle>
                <p className="text-sm text-muted-foreground mt-0.5">Roles across the platform.</p>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-6 flex justify-center">
            <ChartContainer height={280}>
                <PieChart>
                  <Pie data={userDistributionData} cx="50%" cy="50%" innerRadius={70} outerRadius={100} paddingAngle={3} dataKey="value" stroke="none">
                    {userDistributionData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={MONO_COLORS[index % MONO_COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={{ borderRadius: '8px', border: '1px solid var(--border)', background: 'var(--card)', color: 'var(--foreground)', fontSize: 13 }} />
                  <Legend iconType="circle" wrapperStyle={{ fontSize: '12px' }} />
                </PieChart>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>
    </DashboardPageContainer>
  );
}

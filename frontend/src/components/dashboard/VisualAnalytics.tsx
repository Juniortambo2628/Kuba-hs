"use client";

import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  BarChart,
  Bar,
  Cell
} from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface AnalyticsProps {
  data: any[];
  title: string;
  type?: 'area' | 'bar';
  dataKey: string;
  categoryKey: string;
  color?: string;
}

export function VisualAnalytics({ 
  data, 
  title, 
  type = 'area', 
  dataKey, 
  categoryKey,
  color = "#71717a"
}: AnalyticsProps) {
  const gradientId = `grad-${title.replace(/\\s+/g, '')}`;

  return (
    <Card className="border border-border overflow-hidden group shadow-sm">
      <CardHeader className="px-6 py-5 border-b border-border">
        <CardTitle className="text-base font-semibold text-foreground tracking-tight">{title}</CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        <div className="h-[300px] w-full" style={{ minWidth: 0 }}>
          <ResponsiveContainer width="100%" height="100%" minWidth={0}>
            {type === 'area' ? (
              <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={color} stopOpacity={0.25}/>
                    <stop offset="95%" stopColor={color} stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="4 4" vertical={false} stroke="hsl(var(--border))" opacity={0.6} />
                <XAxis 
                  dataKey={categoryKey} 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }}
                  dy={10}
                />
                <YAxis 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }}
                  dx={-10}
                />
                <Tooltip 
                  cursor={{ stroke: "hsl(var(--muted-foreground))", strokeWidth: 1, strokeDasharray: "4 4" }}
                  contentStyle={{ 
                    borderRadius: '12px', 
                    border: '1px solid hsl(var(--border))', 
                    background: 'hsl(var(--card))',
                    color: 'hsl(var(--foreground))',
                    fontSize: '12px',
                    fontWeight: 600,
                    boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
                  }} 
                  itemStyle={{ color: 'hsl(var(--foreground))' }}
                />
                <Area 
                  type="monotone" 
                  dataKey={dataKey} 
                  stroke={color} 
                  fill={`url(#${gradientId})`} 
                  strokeWidth={3}
                  activeDot={{ r: 6, strokeWidth: 0, fill: color }}
                />
              </AreaChart>
            ) : (
              <BarChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }} barSize={32}>
                <CartesianGrid strokeDasharray="4 4" vertical={false} stroke="hsl(var(--border))" opacity={0.6} />
                <XAxis 
                  dataKey={categoryKey} 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }}
                  dy={10}
                />
                <YAxis 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }}
                  dx={-10}
                />
                <Tooltip 
                  cursor={{ fill: "hsl(var(--muted))", opacity: 0.5 }}
                  contentStyle={{ 
                    borderRadius: '12px', 
                    border: '1px solid hsl(var(--border))', 
                    background: 'hsl(var(--card))',
                    color: 'hsl(var(--foreground))',
                    fontSize: '12px',
                    fontWeight: 600,
                    boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
                  }} 
                  itemStyle={{ color: 'hsl(var(--foreground))' }}
                />
                <Bar 
                  dataKey={dataKey} 
                  fill={color} 
                  radius={[6, 6, 0, 0]}
                />
              </BarChart>
            )}
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}

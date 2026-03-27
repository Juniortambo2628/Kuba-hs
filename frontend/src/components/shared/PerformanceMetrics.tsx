"use client";

import { Card, CardContent } from "@/components/ui/card";
import { TrendingUp, Star, CheckCircle2, Wallet } from "lucide-react";

interface PerformanceMetricsProps {
    stats: {
        totalEarnings: number;
        avgRating: number;
        completionRate: number;
        totalJobs: number;
    };
}

export function PerformanceMetrics({ stats }: PerformanceMetricsProps) {
    const metrics = [
        {
            label: "Total Earnings",
            value: `KES ${stats.totalEarnings.toLocaleString()}`,
            icon: <Wallet className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />,
            bgColor: "bg-emerald-100 dark:bg-emerald-500/10",
            textColor: "text-emerald-600 dark:text-emerald-400"
        },
        {
            label: "Avg. Rating",
            value: stats.avgRating.toFixed(1),
            icon: <Star className="w-5 h-5 text-amber-600 dark:text-amber-400 fill-amber-600 dark:fill-amber-400" />,
            bgColor: "bg-amber-100 dark:bg-amber-500/10",
            textColor: "text-amber-600 dark:text-amber-400"
        },
        {
            label: "Completion Rate",
            value: `${stats.completionRate}%`,
            icon: <CheckCircle2 className="w-5 h-5 text-blue-600 dark:text-blue-400" />,
            bgColor: "bg-blue-100 dark:bg-blue-500/10",
            textColor: "text-blue-600 dark:text-blue-400"
        },
        {
            label: "Total Jobs",
            value: stats.totalJobs,
            icon: <TrendingUp className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />,
            bgColor: "bg-indigo-100 dark:bg-indigo-500/10",
            textColor: "text-indigo-600 dark:text-indigo-400"
        }
    ];

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {metrics.map((metric, i) => (
                <Card key={i} className="border-none bg-white dark:bg-white/5 shadow-sm rounded-3xl overflow-hidden hover:shadow-md transition-all group">
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between mb-4">
                            <div className={`w-12 h-12 rounded-2xl ${metric.bgColor} flex items-center justify-center group-hover:scale-110 transition-transform`}>
                                {metric.icon}
                            </div>
                        </div>
                        <div>
                            <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">{metric.label}</p>
                            <h3 className={`text-2xl font-black ${metric.textColor} mt-1 tabular-nums tracking-tight`}>
                                {metric.value}
                            </h3>
                        </div>
                    </CardContent>
                </Card>
            ))}
        </div>
    );
}

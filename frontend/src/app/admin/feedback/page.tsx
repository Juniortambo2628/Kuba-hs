"use client";

import { DashboardPageContainer } from "@/components/shared/DashboardPageContainer";
import {
  DashboardDataCard,
  DashboardTableHead,
  DashboardTableHeaderRow,
} from "@/components/shared/DashboardTable";
import { dashboardUi } from "@/lib/dashboard-ui";
import { DashboardPageSkeleton } from "@/components/shared/DashboardPageSkeleton";

import { useEffect, useState } from "react";
import axiosInstance from "@/lib/axios";
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableHeader, TableBody, TableRow, TableCell } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Star, Search, Filter, MessageSquare, AlertCircle, ShieldCheck, MoreHorizontal, User as UserIcon, Briefcase, Zap, Trash2 } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { DashboardListToolbar } from "@/components/shared/DashboardListToolbar";
import { DashboardPageHeader } from "@/components/shared/DashboardPageHeader";
import { DashboardStatusBadge } from "@/components/shared/DashboardStatusBadge";
import { useApiData } from "@/hooks/useApiData";
import { toast } from "sonner";
import { ReviewStatusBadge } from "@/components/shared/ReviewStatusBadge";

interface Review {
 id: string;
 rating: number;
 comment: string;
 status: 'published' | 'hidden' | 'resolved';
 created_at: string;
 user?: { name: string };
 booking?: {
  service: { name: string };
  provider: { user: { name: string } };
 };
}

export default function AdminFeedback() {
    const [search, setSearch] = useState("");
    const [ratingFilter, setRatingFilter] = useState("");
    const [viewMode, setViewMode] = useState<'grid'|'list'>('grid');

    const { data: feedbackData, isLoading, refetch: fetchFeedback } = useApiData<{
      data: Review[];
      stats: { total: number; avg: number; poor_ratings: number };
    }>(`/api/admin/feedback?search=${search}&rating=${ratingFilter}`, { preserveEnvelope: true, initialData: null });

    const reviews = (feedbackData?.data || []) as Review[];
    const stats = feedbackData?.stats || null;


    const renderStars = (rating: number) => {
        return (
            <div className="flex gap-0.5">
                {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} className={`w-3 h-3 ${i < rating ? "fill-amber-400 text-amber-400" : "text-gray-100"}`} />
                ))}
            </div>
        );
    };

    const handleStatusUpdate = async (id: string, newStatus: string) => {
        try {
            await axiosInstance.put(`/api/admin/feedback/${id}`, { status: newStatus });
            toast.success("Sentiment status updated");
            fetchFeedback();
        } catch (err) {
            toast.error("Cloud synchronization failed");
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm("Delete this review permanently?")) return;
        try {
            await axiosInstance.delete(`/api/admin/feedback/${id}`);
            toast.success("Review deleted");
            fetchFeedback();
        } catch {
            toast.error("Failed to delete review");
        }
    };

    if (isLoading && !reviews.length) {
        return <DashboardPageSkeleton metrics={3} bodyHeight="h-[500px]" />;
    }

    return (
        <DashboardPageContainer className="space-y-10">
            {/* Standard Dashboard Header */}
            <DashboardPageHeader 
                title="Market Sentiment" 
                subtitle="Monitor service quality, platform satisfaction metrics, and customer feedback trends."
            />

   {stats && (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {[
       { label: "Total Submissions", value: stats.total, icon: MessageSquare, color: "text-primary", bg: "bg-muted", trend: "Market feedback" },
       { label: "Kuba Satisfaction", value: `${stats.avg}/5`, icon: Star, color: "text-muted-foreground", bg: "bg-muted", trend: "Elite performance" },
       { label: "Critical Alerts", value: stats.poor_ratings, icon: AlertCircle, color: "text-primary", bg: "bg-muted", trend: "Attention required" }
      ].map((stat, i) => (
       <Card key={i} className="border border-border group border-none">
        <CardContent className="p-8 flex items-center justify-between">
                                <div className="space-y-3">
                                    <p className="text-[10px] font-bold text-muted-foreground">{stat.label}</p>
                                    <div className="flex items-center gap-2">
                                        <span className="text-2xl font-bold text-foreground group-hover:text-primary transition-colors tracking-tight">{stat.value}</span>
                                        <span className="text-[9px] font-bold text-muted-foreground">{stat.trend}</span>
                                    </div>
                                </div>
         <div className={`p-4 ${stat.bg} rounded-2xl ${stat.color} group-hover:scale-110 transition-transform duration-500`}>
          <stat.icon className="w-5 h-5" />
         </div>
        </CardContent>
       </Card>
      ))}
    </div>
   )}

   {search && (
    <p className="text-xs text-muted-foreground">Results for &quot;{search}&quot;</p>
   )}

   <DashboardListToolbar
    hint="Use ⌘K Quick Jump to search feedback"
    viewMode={viewMode}
    onViewChange={setViewMode}
    filters={[
     {
      id: 'rating',
      label: 'Rating',
      value: ratingFilter,
      onChange: setRatingFilter,
      options: [
       { label: 'All Ratings', value: '' },
       { label: 'Excellent (5)', value: '5' },
       { label: 'Great (4)', value: '4' },
       { label: 'Average (3)', value: '3' },
       { label: 'Poor (2)', value: '2' },
       { label: 'Critical (1)', value: '1' }
      ]
     }
    ]}
   />

            {viewMode === 'list' ? (
                <DashboardDataCard>
                        <Table>
                            <TableHeader>
                                <DashboardTableHeaderRow>
                                    <DashboardTableHead position="first" className="!pl-10 h-16">Order Context</DashboardTableHead>
                                    <DashboardTableHead className="h-16">Contributor</DashboardTableHead>
                                    <DashboardTableHead className="h-16">Assessment</DashboardTableHead>
                                    <DashboardTableHead className="h-16">Review Narrative</DashboardTableHead>
                                    <DashboardTableHead className="h-16 text-center">Status</DashboardTableHead>
                                    <DashboardTableHead position="last" className="h-16 text-right">Actions</DashboardTableHead>
                                </DashboardTableHeaderRow>
                            </TableHeader>
                            <TableBody>
                                {reviews.map((review) => (
                                    <TableRow key={review.id} className="hover:bg-muted/50 transition-colors border-border group">
                                        <TableCell className="pl-10 py-6">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 bg-muted rounded-xl flex items-center justify-center text-foreground group-hover:bg-white transition-all">
                                                    <Briefcase className="w-5 h-5" />
                                                </div>
                                                <div className="space-y-0.5">
                                                    <p className="text-sm font-bold text-foreground group-hover:text-primary transition-colors">{review.booking?.service.name}</p>
                                                    <p className="text-[10px] font-bold text-muted-foreground">Merchant: {review.booking?.provider?.user.name}</p>
                                                </div>
                                            </div>
                                        </TableCell>
                                        <TableCell className="py-6 font-semibold text-foreground text-xs">
                                            <div className="flex items-center gap-2">
                                                <UserIcon className="w-3.5 h-3.5 text-muted-foreground" />
                                                {review.user?.name}
                                            </div>
                                        </TableCell>
                                        <TableCell className="py-6">
                                            <div className="space-y-1.5">
                                                {renderStars(review.rating)}
                                                <span className="text-[9px] font-bold text-foreground bg-muted px-2 py-0.5 rounded-md border border-border/40 shadow-sm">Score: {review.rating}.0</span>
                                            </div>
                                        </TableCell>
                                        <TableCell className="py-6">
                                            <p className="text-xs font-bold text-muted-foreground max-w-sm line-clamp-2">"{review.comment}"</p>
                                        </TableCell>
                                        <TableCell className="py-6 text-center">
                                            <ReviewStatusBadge status={review.status || 'published'} />
                                        </TableCell>
                                        <TableCell className="pr-10 py-6 text-right">
                                            <div className="flex items-center justify-end gap-2">
                                                <select 
                                                    onChange={(e) => handleStatusUpdate(review.id, e.target.value)}
                                                    value={review.status || 'published'}
                                                    className="text-[10px] font-bold bg-muted border border-border rounded-md px-2 py-1 outline-none focus:ring-1 focus:ring-primary"
                                                >
                                                    <option value="published">Published</option>
                                                    <option value="hidden">Hidden</option>
                                                    <option value="resolved">Resolved</option>
                                                </select>
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    className="h-8 w-8 text-red-500 hover:text-red-600 hover:bg-red-50"
                                                    onClick={() => handleDelete(review.id)}
                                                    aria-label="Delete review"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </Button>
                                                <span className="text-[10px] text-muted-foreground ml-2">
                                                    {new Date(review.created_at).toLocaleDateString(undefined, { day: '2-digit', month: 'short' })}
                                                </span>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))}
                                {reviews.length === 0 && (
                                    <TableRow>
                                        <TableCell colSpan={5} className="h-80 text-center">
                                            <div className="flex flex-col items-center justify-center gap-4 text-muted-foreground">
                                                <Zap className="h-16 w-16 opacity-10" />
                                                <p className="text-xs font-bold text-muted-foreground">No market sentiment recorded yet</p>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                </DashboardDataCard>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {reviews.length === 0 ? (
                        <div className={`col-span-full h-80 ${dashboardUi.table.emptyDashed}`}>
                            <Zap className="h-16 w-16 opacity-10" />
                            <p className="text-xs font-bold text-muted-foreground">No market sentiment recorded in the registry</p>
                        </div>
                    ) : reviews.map((review) => (
                        <Card key={review.id} className="border border-border/40 border-none bg-card/50 backdrop-blur-md shadow-sm rounded-2xl hover:shadow-md transition-all group overflow-hidden flex flex-col">
                            <CardContent className="p-5 flex-1 flex flex-col">
                                <div className="flex items-start justify-between mb-4">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-xl bg-muted flex items-center justify-center text-primary border border-border">
                                            <Briefcase className="w-4 h-4" />
                                        </div>
                                        <div>
                                            <h3 className="text-sm font-semibold text-foreground group-hover:text-primary transition-colors line-clamp-1">{review.booking?.service.name}</h3>
                                            <p className="text-xs text-muted-foreground flex items-center gap-1 line-clamp-1">
                                                Merchant: {review.booking?.provider?.user.name}
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                <div className="mb-4 space-y-2">
                                    {renderStars(review.rating)}
                                </div>

                                <p className="text-sm text-foreground line-clamp-4 flex-1 mb-4 flex flex-col">
                                    "{review.comment}"
                                </p>

                                <div className="flex items-center justify-between border-t border-border/50 pt-4">
                                    <div className="flex items-center gap-2">
                                        <ReviewStatusBadge status={review.status || 'published'} className="text-[9px] px-1.5 py-0" />
                                        <select 
                                            onChange={(e) => handleStatusUpdate(review.id, e.target.value)}
                                            value={review.status || 'published'}
                                            className="text-[9px] font-bold bg-muted border border-border rounded-sm px-1 py-0.5 outline-none"
                                        >
                                            <option value="published">Set Published</option>
                                            <option value="hidden">Set Hidden</option>
                                            <option value="resolved">Set Resolved</option>
                                        </select>
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            className="h-7 w-7 text-red-500"
                                            onClick={() => handleDelete(review.id)}
                                            aria-label="Delete review"
                                        >
                                            <Trash2 className="w-3.5 h-3.5" />
                                        </Button>
                                    </div>
                                    <span className="text-[10px] font-bold text-muted-foreground">
                                        {new Date(review.created_at).toLocaleDateString(undefined, { day: '2-digit', month: 'short' })}
                                    </span>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            )}
   
            <div className="flex justify-center mt-6">
                <Button onClick={fetchFeedback} variant="outline" className="h-12 border-border/60 bg-white text-foreground hover:bg-black hover:text-white rounded-xl font-bold px-10 transition-all text-xs shadow-sm">
                    Refresh Global Sentiment
                </Button>
            </div>
  </DashboardPageContainer>
 );
}

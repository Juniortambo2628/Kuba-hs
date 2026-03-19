"use client";

import { useEffect, useState } from "react";
import axiosInstance from "@/lib/axios";
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableHeader, TableBody, TableHead, TableRow, TableCell } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Star, Search, Filter, MessageSquare, AlertCircle, ShieldCheck, MoreHorizontal, User as UserIcon, Briefcase, Zap } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { DataToolbar } from "@/components/shared/DataToolbar";

interface Review {
 id: string;
 rating: number;
 comment: string;
 created_at: string;
 user?: { name: string };
 booking?: {
  service: { name: string };
  provider: { user: { name: string } };
 };
}

export default function AdminFeedback() {
 const [reviews, setReviews] = useState<Review[]>([]);
 const [stats, setStats] = useState<any>(null);
 const [isLoading, setIsLoading] = useState(true);
 const [search, setSearch] = useState("");
 const [ratingFilter, setRatingFilter] = useState("");
 const [viewMode, setViewMode] = useState<'grid'|'list'>('grid');

 useEffect(() => {
  fetchFeedback();
 }, [ratingFilter]);

 const fetchFeedback = async () => {
  setIsLoading(true);
  try {
   const params = new URLSearchParams();
   if (search) params.append('search', search);
   if (ratingFilter) params.append('rating', ratingFilter);
   
   const res = await axiosInstance.get(`/api/admin/feedback?${params.toString()}`);
   setReviews(res.data.data || []);
   setStats(res.data.stats);
  } catch (err) {
   console.error("Failed to fetch feedback:", err);
  } finally {
   setIsLoading(false);
  }
 };

 const renderStars = (rating: number) => {
  return (
   <div className="flex gap-0.5">
    {Array.from({ length: 5 }).map((_, i) => (
     <Star key={i} className={`w-3 h-3 ${i < rating ? "fill-amber-400 text-amber-400" : "text-gray-100"}`} />
    ))}
   </div>
  );
 };

 if (isLoading && !reviews.length) {
  return (
   <div className="max-w-[1400px] mx-auto space-y-8 animate-pulse">
    <Skeleton className="h-12 w-64 rounded-2xl" />
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
     {[1,2,3].map(i => <Skeleton key={i} className="h-32 w-full rounded-3xl" />)}
    </div>
    <Skeleton className="h-[500px] w-full rounded-[2.5rem]" />
   </div>
  );
 }

 return (
  <div className="max-w-[1400px] mx-auto space-y-10 pb-12">
   <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
    <div className="space-y-2">
      <h1 className="text-4xl md:text-5xl font-semibold text-foreground tracking-tight uppercase">
        Market <span className="text-primary">Sentiment</span>
      </h1>
      <p className="text-muted-foreground font-bold text-sm flex items-center gap-2">
        <ShieldCheck className="w-4 h-4 text-muted-foreground" />
        Monitoring service quality and platform satisfaction metrics.
      </p>
    </div>
   </div>

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
          <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wide">{stat.label}</p>
          <div className="flex items-center gap-2">
            <span className="text-2xl font-semibold text-foreground group-hover:text-primary transition-colors uppercase tracking-tight">{stat.value}</span>
            <span className="text-[8px] font-semibold text-muted-foreground uppercase tracking-normal">{stat.trend}</span>
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

   <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-2 mt-4 px-1">
    <div>
     <h2 className="text-2xl font-bold text-foreground tracking-tight">Quality Review Log</h2>
     <p className="text-sm font-medium text-muted-foreground mt-1">Inspect detailed customer reviews and merchant performance indicators.</p>
    </div>
   </div>

   <DataToolbar 
    search={search}
    onSearchChange={setSearch}
    searchPlaceholder="Search comments or users..."
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
    <Card className="border border-border overflow-hidden border-none shadow-sm bg-card/50 backdrop-blur-md">
     <CardContent className="p-0">
      <Table>
       <TableHeader>
        <TableRow className="hover:bg-transparent border-border">
         <TableHead className="pl-10 h-16 uppercase text-[10px] font-semibold tracking-wide text-muted-foreground">Order Context</TableHead>
         <TableHead className="h-16 uppercase text-[10px] font-semibold tracking-wide text-muted-foreground">Contributor</TableHead>
         <TableHead className="h-16 uppercase text-[10px] font-semibold tracking-wide text-muted-foreground">Assessment</TableHead>
         <TableHead className="h-16 uppercase text-[10px] font-semibold tracking-wide text-muted-foreground">Review Narrative</TableHead>
         <TableHead className="h-16 pr-10 text-right uppercase text-[10px] font-semibold tracking-wide text-muted-foreground">Date</TableHead>
        </TableRow>
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
               <p className="text-sm font-semibold text-foreground group-hover:text-primary transition-colors">{review.booking?.service.name}</p>
               <p className="text-[10px] font-bold text-muted-foreground ">Merchant: {review.booking?.provider?.user.name}</p>
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
             <span className="text-[8px] font-semibold uppercase tracking-normal text-foreground bg-muted px-2 py-0.5 rounded-full">Score: {review.rating}.0</span>
           </div>
          </TableCell>
          <TableCell className="py-6">
           <p className="text-xs font-bold text-muted-foreground max-w-sm line-clamp-2">"{review.comment}"</p>
          </TableCell>
          <TableCell className="pr-10 py-6 text-right font-semibold text-muted-foreground text-[10px] uppercase">
           {new Date(review.created_at).toLocaleDateString()}
          </TableCell>
         </TableRow>
        ))}
        {reviews.length === 0 && (
         <TableRow>
          <TableCell colSpan={5} className="h-80 text-center">
           <div className="flex flex-col items-center justify-center gap-4 text-muted-foreground">
             <Zap className="h-16 w-16 opacity-10" />
             <p className="text-[10px] font-semibold uppercase tracking-wide ">No market sentiment recorded</p>
           </div>
          </TableCell>
         </TableRow>
        )}
       </TableBody>
      </Table>
     </CardContent>
    </Card>
   ) : (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
     {reviews.length === 0 ? (
      <div className="col-span-full h-80 flex flex-col items-center justify-center gap-4 text-muted-foreground border border-dashed border-border rounded-xl">
        <Zap className="h-16 w-16 opacity-10" />
        <p className="text-[10px] font-semibold uppercase tracking-wide ">No market sentiment recorded</p>
      </div>
     ) : reviews.map((review) => (
      <Card key={review.id} className="border border-border bg-card hover:shadow-md transition-all group overflow-hidden flex flex-col">
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

        <div className="flex items-center justify-between border-t border-border pt-4">
         <div className="flex items-center gap-2 text-xs font-semibold text-foreground">
          <UserIcon className="w-3.5 h-3.5 text-muted-foreground" />
          {review.user?.name}
         </div>
         <span className="text-[10px] font-semibold text-muted-foreground uppercase">
          {new Date(review.created_at).toLocaleDateString()}
         </span>
        </div>
       </CardContent>
      </Card>
     ))}
    </div>
   )}
   
   <div className="flex justify-center">
    <Button onClick={fetchFeedback} variant="outline" className="h-12 border-border bg-white text-foreground hover:bg-muted hover:text-primary rounded-xl font-semibold px-10 transition-all uppercase tracking-normal text-[10px]">
      Refresh All Sentiment
    </Button>
   </div>
  </div>
 );
}

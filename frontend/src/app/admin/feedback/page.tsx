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
            <h1 className="text-4xl md:text-5xl font-black text-[#1E293B] tracking-tight uppercase">
                Market <span className="text-sky-600">Sentiment</span>
            </h1>
            <p className="text-gray-400 font-bold text-sm italic flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-500" />
                Monitoring service quality and platform satisfaction metrics.
            </p>
        </div>
      </div>

      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { label: "Total Submissions", value: stats.total, icon: MessageSquare, color: "text-sky-600", bg: "bg-sky-50", trend: "Market feedback" },
              { label: "Kuba Satisfaction", value: `${stats.avg}/5`, icon: Star, color: "text-amber-500", bg: "bg-amber-50", trend: "Elite performance" },
              { label: "Critical Alerts", value: stats.poor_ratings, icon: AlertCircle, color: "text-sky-600", bg: "bg-sky-50", trend: "Attention required" }
            ].map((stat, i) => (
              <Card key={i} className="premium-card group border-none">
                <CardContent className="p-8 flex items-center justify-between">
                  <div className="space-y-3">
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">{stat.label}</p>
                    <div className="flex items-center gap-2">
                        <span className="text-2xl font-black text-[#1E293B] group-hover:text-sky-600 transition-colors uppercase tracking-tight">{stat.value}</span>
                        <span className="text-[8px] font-black text-gray-300 uppercase italic tracking-widest">{stat.trend}</span>
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

      <Card className="premium-card overflow-hidden border-none shadow-premium">
        <div className="p-10 border-b border-gray-50 flex flex-col md:flex-row justify-between items-center gap-6 bg-white/50 backdrop-blur-md">
            <div className="space-y-1">
                <h2 className="text-sm font-black text-[#1E293B] uppercase tracking-[0.2em]">Quality Review Log</h2>
                <p className="text-xs font-bold text-gray-400 italic">Inspect detailed customer reviews and merchant performance indicators.</p>
            </div>
            
            <div className="flex gap-4 flex-1 max-w-2xl justify-end">
                <div className="relative flex-1 group">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-sky-600 transition-colors" />
                    <Input 
                        placeholder="Search comments or users..." 
                        className="h-12 pl-12 pr-4 bg-[#F8FAFC] border-none rounded-xl text-xs font-bold focus:ring-2 focus:ring-sky-100 placeholder:italic"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && fetchFeedback()}
                    />
                </div>
                <select 
                    className="h-12 bg-[#F8FAFC] border-none text-[#1E293B] text-[10px] uppercase font-black tracking-widest rounded-xl px-6 outline-none focus:ring-2 focus:ring-sky-100 transition-all cursor-pointer"
                    value={ratingFilter}
                    onChange={(e) => setRatingFilter(e.target.value)}
                >
                    <option value="">All Ratings</option>
                    <option value="5">Excellent (5)</option>
                    <option value="4">Great (4)</option>
                    <option value="3">Average (3)</option>
                    <option value="2">Poor (2)</option>
                    <option value="1">Critical (1)</option>
                </select>
            </div>
        </div>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent border-gray-50">
                <TableHead className="pl-10 h-16 uppercase text-[10px] font-black tracking-[0.2em] text-gray-400">Order Context</TableHead>
                <TableHead className="h-16 uppercase text-[10px] font-black tracking-[0.2em] text-gray-400">Contributor</TableHead>
                <TableHead className="h-16 uppercase text-[10px] font-black tracking-[0.2em] text-gray-400">Assessment</TableHead>
                <TableHead className="h-16 uppercase text-[10px] font-black tracking-[0.2em] text-gray-400">Review Narrative</TableHead>
                <TableHead className="h-16 pr-10 text-right uppercase text-[10px] font-black tracking-[0.2em] text-gray-400">Date</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {reviews.map((review) => (
                <TableRow key={review.id} className="hover:bg-gray-50/50 transition-colors border-gray-50 group">
                  <TableCell className="pl-10 py-6">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gray-50 rounded-xl flex items-center justify-center text-[#1E293B] group-hover:bg-white transition-all">
                            <Briefcase className="w-5 h-5" />
                        </div>
                        <div className="space-y-0.5">
                            <p className="text-sm font-black text-[#1E293B] group-hover:text-sky-600 transition-colors">{review.booking?.service.name}</p>
                            <p className="text-[10px] font-bold text-gray-300 italic">Merchant: {review.booking?.provider?.user.name}</p>
                        </div>
                    </div>
                  </TableCell>
                  <TableCell className="py-6 font-black text-[#1E293B] text-xs">
                    <div className="flex items-center gap-2">
                        <UserIcon className="w-3.5 h-3.5 text-gray-300" />
                        {review.user?.name}
                    </div>
                  </TableCell>
                  <TableCell className="py-6">
                    <div className="space-y-1.5">
                        {renderStars(review.rating)}
                        <span className="text-[8px] font-black uppercase tracking-widest text-[#1E293B] bg-gray-50 px-2 py-0.5 rounded-full">Score: {review.rating}.0</span>
                    </div>
                  </TableCell>
                  <TableCell className="py-6">
                    <p className="text-xs font-bold text-gray-400 italic max-w-sm line-clamp-2">"{review.comment}"</p>
                  </TableCell>
                  <TableCell className="pr-10 py-6 text-right font-black text-gray-300 text-[10px] uppercase">
                    {new Date(review.created_at).toLocaleDateString()}
                  </TableCell>
                </TableRow>
              ))}
              {reviews.length === 0 && (
                <TableRow>
                  <TableCell colSpan={5} className="h-80 text-center">
                    <div className="flex flex-col items-center justify-center gap-4 text-gray-200">
                        <Zap className="h-16 w-16 opacity-10" />
                        <p className="text-[10px] font-black uppercase tracking-[0.2em] italic">No market sentiment recorded</p>
                    </div>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
      
      <div className="flex justify-center">
        <Button onClick={fetchFeedback} variant="outline" className="h-12 border-gray-100 bg-white text-[#1E293B] hover:bg-sky-50 hover:text-sky-600 rounded-xl font-black px-10 transition-all uppercase tracking-widest text-[10px]">
            Refresh All Sentiment
        </Button>
      </div>
    </div>
  );
}

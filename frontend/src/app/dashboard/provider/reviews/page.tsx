"use client";

import { useEffect, useState } from "react";
import axiosInstance from "@/lib/axios";
import { Card, CardContent } from "@/components/ui/card";
import { 
 Star, 
 User as UserIcon, 
 Calendar,
 MessageSquare,
 Loader2,
 Zap,
 TrendingUp,
 Briefcase
} from "lucide-react";
import { toast } from "sonner";

export default function ReviewsManagement() {
 const [reviews, setReviews] = useState<any[]>([]);
 const [stats, setStats] = useState<any>(null);
 const [isLoading, setIsLoading] = useState(true);

 useEffect(() => {
  fetchReviews();
 }, []);

 const fetchReviews = async () => {
  try {
   const res = await axiosInstance.get("/api/provider/reviews");
   setStats(res.data.stats);
   const reviewsData = res.data.reviews?.data || res.data.reviews || [];
   setReviews(reviewsData.map((r: any) => ({
    ...r,
    customer_name: r.customer?.name,
    service_name: r.booking?.service?.name,
   })));
  } catch (err) {
   toast.error("Failed to load reviews");
  } finally {
   setIsLoading(false);
  }
 };

 const renderStars = (rating: number) => {
  return (
   <div className="flex gap-1">
    {[1, 2, 3, 4, 5].map((star) => (
     <Star 
      key={star} 
      className={`w-4 h-4 ${star <= rating ? 'text-amber-400 fill-amber-400' : 'text-muted-foreground'}`} 
     />
    ))}
   </div>
  );
 };

 if (isLoading) {
  return <div className="flex items-center justify-center h-64"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>;
 }

 return (
  <div className="max-w-[1000px] mx-auto space-y-8 pb-12">
   <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 px-4">
    <div>
     <h1 className="text-2xl font-bold text-foreground tracking-tight">Merchant Feedback</h1>
     <p className="text-sm text-muted-foreground mt-1">Monitor your reputation across the Kuba network.</p>
    </div>
    <div className="flex items-center gap-2 px-4 py-2 bg-card/50 backdrop-blur-md rounded-xl border border-border">
      <TrendingUp className="w-4 h-4 text-primary" />
      <span className="text-sm font-semibold text-foreground">Reputation Score: {stats?.reputation_score || 0}%</span>
    </div>
   </div>

   <div className="grid grid-cols-1 gap-6">
    {reviews.length === 0 ? (
     <div className="bg-white rounded-3xl p-20 flex flex-col items-center gap-4 text-muted-foreground border-2 border-dashed border-border ">
      <MessageSquare className="w-12 h-12 opacity-10" />
      <p className="text-[10px] font-semibold tracking-normal">No merchant reviews yet</p>
     </div>
    ) : reviews.map((review: any) => (
     <Card key={review.id} className="border border-border group border-none">
      <CardContent className="p-8 space-y-6">
       <div className="flex justify-between items-start">
        <div className="flex items-center gap-6">
         <div className="w-14 h-14 bg-muted rounded-2xl flex items-center justify-center text-primary group-hover:bg-white transition-all shadow-sm">
          <UserIcon className="w-6 h-6" />
         </div>
         <div className="space-y-1">
          <h3 className="text-lg font-semibold text-foreground tracking-tight">{review.customer_name}</h3>
          <div className="flex items-center gap-4 text-[10px] font-bold text-muted-foreground tracking-tighter">
           <span className="flex items-center gap-2"><Briefcase className="w-3.5 h-3.5" /> {review.service_name}</span>
           <span className="flex items-center gap-2"><Calendar className="w-3.5 h-3.5" /> {new Date(review.created_at).toLocaleDateString()}</span>
          </div>
         </div>
        </div>
        <div className="flex flex-col items-end gap-2">
          {renderStars(review.rating)}
          <span className="text-[8px] font-semibold text-muted-foreground tracking-normal ">{review.rating}.0 Rating</span>
        </div>
       </div>

       <div className="bg-muted/50 p-6 rounded-2xl relative">
         <div className="absolute -top-3 left-6 w-6 h-6 bg-muted/50 rotate-45 border-l border-t border-transparent"></div>
         <p className="text-sm font-bold text-muted-foreground leading-relaxed">
          "{review.comment || 'No comment provided'}"
         </p>
       </div>

       <div className="flex justify-end pt-4 border-t border-border">
         <button className="text-[10px] font-semibold tracking-normal text-primary hover:text-foreground transition-colors flex items-center gap-2">
          Submit Response <Zap className="w-3.5 h-3.5" />
         </button>
       </div>
      </CardContent>
     </Card>
    ))}
   </div>
  </div>
 );
}

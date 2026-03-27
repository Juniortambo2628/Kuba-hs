"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import axiosInstance, { handleApiError } from "@/lib/axios";
import { User, LoyaltyTransaction, LoyaltyTier } from "@/types";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { 
 Gift, 
 Star, 
 TrendingUp, 
 History, 
 CheckCircle,
 Zap,
 Award,
 ShieldCheck,
 Loader2
} from "lucide-react";
import { toast } from "sonner";

export default function LoyaltyProgram() {
 const { user, isLoading: authLoading } = useAuth();
 const [loyaltyData, setLoyaltyData] = useState<{
  points: number;
  tier: LoyaltyTier;
  available_rewards: LoyaltyTier[];
  history: LoyaltyTransaction[];
 } | null>(null);
 const [isLoading, setIsLoading] = useState(true);
 const [isRedeeming, setIsRedeeming] = useState(false);

 useEffect(() => {
  if (!authLoading && user) {
   fetchLoyaltyData();
  }
 }, [authLoading, user]);

 const fetchLoyaltyData = async () => {
  try {
   const res = await axiosInstance.get("/api/client/loyalty");
   setLoyaltyData(res.data);
  } catch (err) {
   console.error("Failed to fetch loyalty data:", err);
  } finally {
   setIsLoading(false);
  }
 };

 const handleRedeem = async (reward: LoyaltyTier) => {
  if ((loyaltyData?.points || 0) < reward.min_points) {
   toast.error(`You need at least ${reward.min_points} points for this reward`);
   return;
  }

  setIsRedeeming(true);
  try {
   const res = await axiosInstance.post("/api/client/loyalty/redeem", {
    reward_type: reward.name,
    points: reward.min_points
   });
   toast.success(res.data.message);
   await fetchLoyaltyData();
  } catch (err: any) {
   toast.error(handleApiError(err));
  } finally {
   setIsRedeeming(false);
  }
 };

 if (isLoading) {
  return (
   <div className="max-w-[1400px] mx-auto space-y-8 animate-pulse">
    <Skeleton className="h-12 w-64 rounded-2xl" />
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <Skeleton className="lg:col-span-2 h-[400px] rounded-[2.5rem]" />
      <Skeleton className="h-[400px] rounded-[2.5rem]" />
    </div>
   </div>
  );
 }

 const colorThemes = [
  { color: "text-foreground", bg: "bg-muted" },
  { color: "text-primary", bg: "bg-muted" },
  { color: "text-amber-600", bg: "bg-muted" },
  { color: "text-purple-600", bg: "bg-purple-50" },
 ];

 const rewards = (loyaltyData?.available_rewards || []).map((reward: LoyaltyTier, index: number) => ({
  ...reward,
  description: reward.benefits?.[0] || `Unlock ${reward.name} status and benefits.`,
  ...colorThemes[index % colorThemes.length]
 }));

 return (
  <div className="max-w-[1400px] mx-auto space-y-10 pb-12">
   <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
    <div>
     <h1 className="text-2xl font-bold text-foreground tracking-tight">Loyalty Rewards</h1>
     <p className="text-sm text-muted-foreground mt-1">Exclusive benefits and status orchestration for elite Kuba clients.</p>
    </div>
    <div className="flex flex-col items-end gap-1">
      <span className="text-xs font-semibold text-muted-foreground">Current Standing</span>
      <div className="flex items-center gap-2 bg-card/50 backdrop-blur-md px-4 py-2 rounded-xl border border-border">
        <Star className="w-4 h-4 text-muted-foreground fill-primary" />
        <span className="text-sm font-semibold text-foreground">
          {loyaltyData?.tier?.name || 'Standard Member'}
        </span>
      </div>
    </div>
   </div>

   <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
    <div className="lg:col-span-2 space-y-10">
     {/* Main Points Card */}
     <Card className="border border-border/40 bg-card/50 backdrop-blur-md shadow-sm rounded-[2rem] overflow-hidden relative group">
      <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-transparent"></div>
      <CardContent className="p-12 relative z-10">
       <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
        <div className="space-y-6">
          <div className="space-y-1">
            <p className="text-[11px] font-semibold text-primary uppercase tracking-[0.3em]">Total Points Engine</p>
            <h2 className="text-6xl font-semibold tabular-nums tracking-tighter text-foreground">
              {loyaltyData?.points || 0}
            </h2>
          </div>
          <div className="space-y-2">
            <div className="h-3 w-full bg-card/5 rounded-full overflow-hidden">
              <div 
                className="h-full bg-primary rounded-full shadow-[0_0_20px_rgba(2,132,199,0.5)] transition-all duration-1000" 
                style={{ width: `${Math.min(100, ((loyaltyData?.points || 0) % 1000) / 10)}%` }}
              ></div>
            </div>
            <div className="flex justify-between items-center text-[10px] font-semibold uppercase tracking-normal text-muted-foreground ">
              <span>Points Accumulated</span>
              <span>{1000 - ((loyaltyData?.points || 0) % 1000)} to next milestone</span>
            </div>
          </div>
        </div>
        <div className="flex justify-center md:justify-end">
          <div className="w-48 h-48 rounded-full border-2 border-border/40 flex items-center justify-center relative bg-background/50 backdrop-blur-md shadow-inner">
            <div className="absolute inset-0 border-t-2 border-primary rounded-full animate-spin duration-[10s]"></div>
            <Gift className="w-20 h-20 text-muted-foreground/20 group-hover:text-primary/50 transition-colors duration-700" />
            <div className="absolute inset-0 flex items-center justify-center flex-col">
              <Star className="w-12 h-12 text-muted-foreground fill-amber-500" />
            </div>
          </div>
        </div>
       </div>
      </CardContent>
     </Card>

     {/* Reward Options */}
     <div className="space-y-6">
      <h3 className="text-[10px] font-semibold text-muted-foreground uppercase tracking-[0.3em] px-2 flex items-center gap-2">
        <Zap className="w-3.5 h-3.5 text-primary" />
        Available Redemptions
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {rewards.map((reward: any) => (
          <Card key={reward.name} className="border border-border/40 bg-card/50 backdrop-blur-md shadow-sm rounded-3xl group hover:translate-y-[-8px] transition-all duration-500 hover:shadow-md">
            <CardContent className="p-8 flex flex-col h-full space-y-6">
              <div className={`w-12 h-12 rounded-2xl ${reward.bg} ${reward.color} flex items-center justify-center group-hover:scale-110 transition-transform`}>
                <Award className="w-6 h-6" />
              </div>
              <div className="space-y-2 flex-grow">
                <h4 className="text-sm font-semibold text-foreground uppercase tracking-tight">{reward.name}</h4>
                <p className="text-[10px] font-bold text-muted-foreground leading-relaxed ">{reward.description}</p>
              </div>
              <div className="space-y-4">
                <div className="text-lg font-semibold text-foreground ">{reward.min_points} <span className="text-[10px] text-muted-foreground uppercase not-">Pts</span></div>
                <Button 
                  onClick={() => handleRedeem(reward)}
                  disabled={isRedeeming || (loyaltyData?.points || 0) < reward.min_points}
                  className={`w-full h-11 rounded-xl font-semibold text-[9px] tracking-normal uppercase transition-all ${
                    (loyaltyData?.points || 0) >= reward.min_points 
                    ? 'bg-primary text-white hover:bg-primary' 
                    : 'bg-gray-100 text-muted-foreground cursor-not-allowed'
                  }`}
                >
                  {isRedeeming ? <Loader2 className="w-3 h-3 animate-spin" /> : 'REDEEM'}
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
     </div>
    </div>

    <div className="space-y-10">
      {/* History Card */}
      <Card className="border border-border/40 bg-card/50 backdrop-blur-md shadow-sm rounded-[2rem] overflow-hidden">
        <div className="p-8 border-b border-border/40 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <History className="w-5 h-5 text-primary" />
            <h3 className="text-[10px] font-semibold text-foreground uppercase tracking-normal">Transaction Log</h3>
          </div>
        </div>
        <CardContent className="p-8 space-y-6">
          {loyaltyData?.history && loyaltyData.history.length > 0 ? (
            loyaltyData.history.map((item: LoyaltyTransaction, i: number) => (
              <div key={i} className="flex justify-between items-start gap-4 group">
                <div className="space-y-1">
                  <p className="text-[10px] font-semibold text-foreground uppercase group-hover:text-primary transition-colors">
                    {item.description || 'Reward Redemption'}
                  </p>
                  <p className="text-[9px] font-bold text-muted-foreground uppercase tracking-tighter">
                    {new Date(item.created_at).toLocaleDateString()}
                  </p>
                </div>
                <span className={`text-[11px] font-semibold tabular-nums ${item.points > 0 ? 'text-muted-foreground' : 'text-red-500'}`}>
                  {item.points > 0 ? '+' : ''}{item.points}
                </span>
              </div>
            ))
          ) : (
            <div className="py-12 text-center space-y-4">
              <TrendingUp className="w-10 h-10 text-gray-100 mx-auto" strokeWidth={1} />
              <p className="text-[10px] font-bold text-muted-foreground uppercase ">No orbital telemetry detected</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Benefits Card */}
      <Card className="border border-border/40 bg-card/50 backdrop-blur-md shadow-sm rounded-[2rem] relative overflow-hidden">
        <div className="absolute -top-10 -right-10 w-40 h-40 bg-primary/10 rounded-full blur-3xl"></div>
        <CardContent className="p-8 space-y-6 relative z-10">
          <div className="flex items-center gap-3 text-primary">
            <CheckCircle className="w-5 h-5" />
            <h3 className="text-[10px] font-semibold uppercase tracking-normal">Tier Benefits</h3>
          </div>
          <ul className="space-y-4">
            {[
              "Priority Marketplace Dispatch",
              "Specialized Premium Discounts",
              "Reduced Platform Service Fees",
              "24/7 Concierge Support Access"
            ].map((benefit, i) => (
              <li key={i} className="flex items-start gap-3">
                <div className="mt-1 w-1.5 h-1.5 rounded-full bg-primary/30"></div>
                <span className="text-[10px] font-bold text-foreground opacity-60 leading-tight ">{benefit}</span>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>
    </div>
   </div>
  </div>
 );
}

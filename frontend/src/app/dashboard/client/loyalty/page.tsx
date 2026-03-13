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
    { color: "text-emerald-600", bg: "bg-emerald-50" },
    { color: "text-sky-600", bg: "bg-sky-50" },
    { color: "text-amber-600", bg: "bg-amber-50" },
    { color: "text-purple-600", bg: "bg-purple-50" },
  ];

  const rewards = (loyaltyData?.available_rewards || []).map((reward: LoyaltyTier, index: number) => ({
    ...reward,
    description: reward.benefits?.[0] || `Unlock ${reward.name} status and benefits.`,
    ...colorThemes[index % colorThemes.length]
  }));

  return (
    <div className="max-w-[1400px] mx-auto space-y-10 pb-12">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 text-glow-red">
        <div className="space-y-2">
            <h1 className="text-4xl md:text-5xl font-black text-[#1E293B] tracking-tight uppercase">
                Loyalty <span className="text-sky-600">Rewards</span>
            </h1>
            <p className="text-gray-400 font-bold text-sm italic flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-500" />
                Exclusive benefits and status orchestration for elite Kuba clients.
            </p>
        </div>
        <div className="flex flex-col items-end gap-1">
            <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Current Standing</span>
            <div className="flex items-center gap-3 bg-white px-6 py-2 rounded-2xl shadow-sm border border-gray-50">
                <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
                <span className="text-lg font-black text-[#1E293B] uppercase tracking-tighter">
                    {loyaltyData?.tier?.name || 'Standard Member'}
                </span>
            </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        <div className="lg:col-span-2 space-y-10">
          {/* Main Points Card */}
          <Card className="premium-card bg-[#1E293B] border-none text-white overflow-hidden relative group">
            <div className="absolute inset-0 bg-gradient-to-br from-sky-600/20 to-transparent"></div>
            <CardContent className="p-12 relative z-10">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
                <div className="space-y-6">
                    <div className="space-y-1">
                        <p className="text-[11px] font-black text-sky-500 uppercase tracking-[0.3em]">Total Points Engine</p>
                        <h2 className="text-6xl font-black tabular-nums tracking-tighter italic">
                            {loyaltyData?.points || 0}
                        </h2>
                    </div>
                    <div className="space-y-2">
                        <div className="h-3 w-full bg-white/5 rounded-full overflow-hidden">
                            <div 
                                className="h-full bg-sky-600 rounded-full shadow-[0_0_20px_rgba(2,132,199,0.5)] transition-all duration-1000" 
                                style={{ width: `${Math.min(100, ((loyaltyData?.points || 0) % 1000) / 10)}%` }}
                            ></div>
                        </div>
                        <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest text-gray-400 italic">
                            <span>Points Accumulated</span>
                            <span>{1000 - ((loyaltyData?.points || 0) % 1000)} to next milestone</span>
                        </div>
                    </div>
                </div>
                <div className="flex justify-center md:justify-end">
                    <div className="w-48 h-48 rounded-full border-2 border-white/5 flex items-center justify-center relative">
                        <div className="absolute inset-0 border-t-2 border-sky-500 rounded-full animate-spin duration-[10s]"></div>
                        <Gift className="w-20 h-20 text-white/10 group-hover:text-sky-500/50 transition-colors duration-700" />
                        <div className="absolute inset-0 flex items-center justify-center flex-col">
                            <Star className="w-12 h-12 text-amber-500 fill-amber-500 shadow-xl" />
                        </div>
                    </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Reward Options */}
          <div className="space-y-6">
            <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.3em] px-2 flex items-center gap-2">
                <Zap className="w-3.5 h-3.5 text-sky-600" />
                Available Redemptions
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {rewards.map((reward: any) => (
                    <Card key={reward.name} className="premium-card group border-none hover:translate-y-[-8px] transition-all duration-500 bg-white shadow-xl shadow-gray-100">
                        <CardContent className="p-8 flex flex-col h-full space-y-6">
                            <div className={`w-12 h-12 rounded-2xl ${reward.bg} ${reward.color} flex items-center justify-center group-hover:scale-110 transition-transform`}>
                                <Award className="w-6 h-6" />
                            </div>
                            <div className="space-y-2 flex-grow">
                                <h4 className="text-sm font-black text-[#1E293B] uppercase tracking-tight">{reward.name}</h4>
                                <p className="text-[10px] font-bold text-gray-400 leading-relaxed italic">{reward.description}</p>
                            </div>
                            <div className="space-y-4">
                                <div className="text-lg font-black text-[#1E293B] italic">{reward.min_points} <span className="text-[10px] text-gray-300 uppercase not-italic">Pts</span></div>
                                <Button 
                                    onClick={() => handleRedeem(reward)}
                                    disabled={isRedeeming || (loyaltyData?.points || 0) < reward.min_points}
                                    className={`w-full h-11 rounded-xl font-black text-[9px] tracking-widest uppercase transition-all ${
                                        (loyaltyData?.points || 0) >= reward.min_points 
                                        ? 'bg-[#1E293B] text-white hover:bg-sky-600' 
                                        : 'bg-gray-100 text-gray-400 cursor-not-allowed'
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
            <Card className="premium-card border-none bg-white shadow-premium overflow-hidden">
                <div className="p-8 border-b border-gray-50 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <History className="w-5 h-5 text-sky-600" />
                        <h3 className="text-[10px] font-black text-[#1E293B] uppercase tracking-widest">Transaction Log</h3>
                    </div>
                </div>
                <CardContent className="p-8 space-y-6">
                    {loyaltyData?.history && loyaltyData.history.length > 0 ? (
                        loyaltyData.history.map((item: LoyaltyTransaction, i: number) => (
                            <div key={i} className="flex justify-between items-start gap-4 group">
                                <div className="space-y-1">
                                    <p className="text-[10px] font-black text-[#1E293B] uppercase group-hover:text-sky-600 transition-colors">
                                        {item.description || 'Reward Redemption'}
                                    </p>
                                    <p className="text-[9px] font-bold text-gray-400 uppercase tracking-tighter">
                                        {new Date(item.created_at).toLocaleDateString()}
                                    </p>
                                </div>
                                <span className={`text-[11px] font-black tabular-nums ${item.points > 0 ? 'text-emerald-500' : 'text-red-500'}`}>
                                    {item.points > 0 ? '+' : ''}{item.points}
                                </span>
                            </div>
                        ))
                    ) : (
                        <div className="py-12 text-center space-y-4">
                            <TrendingUp className="w-10 h-10 text-gray-100 mx-auto" strokeWidth={1} />
                            <p className="text-[10px] font-bold text-gray-300 uppercase italic">No orbital telemetry detected</p>
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* Benefits Card */}
            <Card className="premium-card border-none bg-sky-50 relative overflow-hidden">
                <div className="absolute -top-10 -right-10 w-40 h-40 bg-sky-600/5 rounded-full blur-3xl"></div>
                <CardContent className="p-8 space-y-6 relative z-10">
                    <div className="flex items-center gap-3 text-sky-600">
                        <CheckCircle className="w-5 h-5" />
                        <h3 className="text-[10px] font-black uppercase tracking-widest">Tier Benefits</h3>
                    </div>
                    <ul className="space-y-4">
                        {[
                            "Priority Marketplace Dispatch",
                            "Specialized Premium Discounts",
                            "Reduced Platform Service Fees",
                            "24/7 Concierge Support Access"
                        ].map((benefit, i) => (
                            <li key={i} className="flex items-start gap-3">
                                <div className="mt-1 w-1.5 h-1.5 rounded-full bg-sky-600/30"></div>
                                <span className="text-[10px] font-bold text-[#1E293B] opacity-60 leading-tight italic">{benefit}</span>
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

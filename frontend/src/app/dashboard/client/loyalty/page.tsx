"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import axiosInstance, { handleApiError } from "@/lib/axios";
import { User, LoyaltyTransaction, LoyaltyTier } from "@/types";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Gift, Star, History, CheckCircle, Award, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { DashboardPageContainer } from "@/components/shared/DashboardPageContainer";
import {
  DashboardGreetingBar,
  DashboardFrostedStatCard,
  DashboardFrostedStatGrid,
  DashboardPanelCard,
  DashboardStatusBadge,
} from "@/components/dashboard/workspace";
import { workspaceUi } from "@/lib/dashboard-workspace-ui";
import { cn } from "@/lib/utils";

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
    if (!authLoading && user) fetchLoyaltyData();
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
        points: reward.min_points,
      });
      toast.success(res.data.message);
      await fetchLoyaltyData();
    } catch (err: unknown) {
      toast.error(handleApiError(err));
    } finally {
      setIsRedeeming(false);
    }
  };

  const points = loyaltyData?.points ?? 0;
  const nextMilestone = 1000 - (points % 1000);
  const progress = Math.min(100, ((points % 1000) / 1000) * 100);

  if (isLoading) {
    return (
      <DashboardPageContainer width="default" className={workspaceUi.page}>
        <Skeleton className="h-10 w-48 rounded-xl" />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
          <Skeleton className="lg:col-span-2 h-64 rounded-[1.75rem]" />
          <Skeleton className="h-64 rounded-[1.75rem]" />
        </div>
      </DashboardPageContainer>
    );
  }

  const rewards = (loyaltyData?.available_rewards || []).map((reward: LoyaltyTier) => ({
    ...reward,
    description: reward.benefits?.[0] || `Unlock ${reward.name} benefits.`,
  }));

  const tierBenefits = [
    "Priority booking support",
    "Member-only discounts",
    "Lower service fees on select jobs",
    "Extended support hours",
  ];

  return (
    <DashboardPageContainer width="default" className={workspaceUi.page}>
      <DashboardGreetingBar
        greeting="Loyalty rewards"
        subtitle="Earn points on bookings and redeem them for perks."
        actions={
          <DashboardStatusBadge
            status="active"
            label={loyaltyData?.tier?.name || "Member"}
            tone="info"
          />
        }
      />

      <DashboardFrostedStatGrid columns={3}>
        <DashboardFrostedStatCard icon={Gift} label="Your points" value={points} tone="primary" />
        <DashboardFrostedStatCard
          icon={Star}
          label="Current tier"
          value={loyaltyData?.tier?.name || "Standard"}
          tone="warning"
        />
        <DashboardFrostedStatCard
          icon={Award}
          label="Next milestone"
          value={`${nextMilestone} pts`}
          tone="neutral"
          hint="Points until the next 1,000-pt mark"
        />
      </DashboardFrostedStatGrid>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <div className="lg:col-span-2 space-y-5">
          <DashboardPanelCard title="Points balance" icon={Gift}>
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
              <div>
                <p className="text-5xl font-bold tracking-tight text-foreground tabular-nums">{points}</p>
                <p className="text-sm text-muted-foreground mt-2">Available to redeem</p>
              </div>
              <div className="flex-1 max-w-md space-y-2">
                <div className="h-2 w-full rounded-full bg-muted overflow-hidden">
                  <div
                    className="h-full bg-primary rounded-full transition-all duration-700"
                    style={{ width: `${progress}%` }}
                  />
                </div>
                <p className="text-xs text-muted-foreground">
                  {nextMilestone} points to your next 1,000-pt milestone
                </p>
              </div>
            </div>
          </DashboardPanelCard>

          <div className="space-y-3">
            <h2 className="text-sm font-semibold text-foreground px-1">Redeem rewards</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
              {rewards.map((reward) => {
                const canRedeem = points >= reward.min_points;
                return (
                  <div key={reward.name} className={cn(workspaceUi.frosted.surface, "p-5 flex flex-col gap-4")}>
                    <Award className="h-8 w-8 text-primary" />
                    <div className="flex-1 space-y-1">
                      <p className="text-sm font-semibold text-foreground">{reward.name}</p>
                      <p className="text-xs text-muted-foreground leading-relaxed">{reward.description}</p>
                    </div>
                    <p className="text-lg font-bold tabular-nums">
                      {reward.min_points} <span className="text-xs font-medium text-muted-foreground">pts</span>
                    </p>
                    <Button
                      className="rounded-full w-full"
                      disabled={isRedeeming || !canRedeem}
                      onClick={() => handleRedeem(reward)}
                    >
                      {isRedeeming ? <Loader2 className="h-4 w-4 animate-spin" /> : "Redeem"}
                    </Button>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        <div className="space-y-5">
          <DashboardPanelCard title="Activity" icon={History}>
            {loyaltyData?.history && loyaltyData.history.length > 0 ? (
              <ul className="space-y-4">
                {loyaltyData.history.map((item, i) => (
                  <li key={i} className="flex justify-between gap-3 text-sm">
                    <div className="min-w-0">
                      <p className="font-medium text-foreground truncate">
                        {item.description || "Points activity"}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {new Date(item.created_at).toLocaleDateString()}
                      </p>
                    </div>
                    <span
                      className={cn(
                        "font-semibold tabular-nums shrink-0",
                        item.points > 0 ? "text-emerald-600" : "text-red-500"
                      )}
                    >
                      {item.points > 0 ? "+" : ""}
                      {item.points}
                    </span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-muted-foreground text-center py-8">No activity yet</p>
            )}
          </DashboardPanelCard>

          <DashboardPanelCard title="Member benefits" icon={CheckCircle}>
            <ul className="space-y-3">
              {tierBenefits.map((benefit) => (
                <li key={benefit} className="flex items-start gap-2 text-sm text-muted-foreground">
                  <CheckCircle className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                  {benefit}
                </li>
              ))}
            </ul>
          </DashboardPanelCard>
        </div>
      </div>
    </DashboardPageContainer>
  );
}

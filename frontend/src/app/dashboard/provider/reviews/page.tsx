"use client";

import { useEffect, useState } from "react";
import axiosInstance from "@/lib/axios";
import {
  Star,
  MessageSquare,
  Loader2,
  TrendingUp,
} from "lucide-react";
import { toast } from "sonner";
import { DashboardPageContainer } from "@/components/shared/DashboardPageContainer";
import {
  DashboardGreetingBar,
  DashboardFrostedStatCard,
  DashboardFrostedStatGrid,
  DashboardPanelCard,
  DashboardUserAvatar,
} from "@/components/dashboard/workspace";
import { workspaceUi } from "@/lib/dashboard-ui";
import { cn } from "@/lib/utils";

interface ReviewRow {
  id: string;
  rating: number;
  comment?: string;
  created_at: string;
  customer_name?: string;
  service_name?: string;
}

export default function ReviewsManagement() {
  const [reviews, setReviews] = useState<ReviewRow[]>([]);
  const [stats, setStats] = useState<{ reputation_score?: number; avg_rating?: number } | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchReviews();
  }, []);

  const fetchReviews = async () => {
    try {
      const res = await axiosInstance.get("/api/provider/reviews");
      setStats(res.data.stats ?? null);
      const raw = res.data.reviews?.data ?? res.data.reviews ?? [];
      setReviews(
        (Array.isArray(raw) ? raw : []).map((r: Record<string, unknown>) => ({
          id: String(r.id),
          rating: Number(r.rating ?? 0),
          comment: r.comment as string | undefined,
          created_at: String(r.created_at ?? ""),
          customer_name: (r.customer as { name?: string })?.name ?? (r.customer_name as string),
          service_name: (r.booking as { service?: { name?: string } })?.service?.name ?? (r.service_name as string),
        }))
      );
    } catch {
      toast.error("Failed to load reviews");
    } finally {
      setIsLoading(false);
    }
  };

  const renderStars = (rating: number) => (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          className={cn(
            "h-4 w-4",
            star <= rating ? "text-amber-400 fill-amber-400" : "text-muted-foreground/30"
          )}
        />
      ))}
    </div>
  );

  const avgRating =
    reviews.length > 0
      ? (reviews.reduce((s, r) => s + r.rating, 0) / reviews.length).toFixed(1)
      : "—";

  if (isLoading) {
    return (
      <DashboardPageContainer width="default" className={workspaceUi.page}>
        <div className="flex h-64 items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </DashboardPageContainer>
    );
  }

  return (
    <DashboardPageContainer width="default" className={workspaceUi.page}>
      <DashboardGreetingBar
        greeting="Reviews"
        subtitle="See what clients say about your work and track your reputation."
      />

      <DashboardFrostedStatGrid columns={3}>
        <DashboardFrostedStatCard
          icon={Star}
          label="Average rating"
          value={stats?.avg_rating ?? avgRating}
          tone="warning"
        />
        <DashboardFrostedStatCard
          icon={MessageSquare}
          label="Total reviews"
          value={reviews.length}
          tone="primary"
        />
        <DashboardFrostedStatCard
          icon={TrendingUp}
          label="Reputation score"
          value={stats?.reputation_score != null ? `${stats.reputation_score}%` : "—"}
          tone="success"
        />
      </DashboardFrostedStatGrid>

      {reviews.length === 0 ? (
        <DashboardPanelCard>
          <div className="py-16 text-center">
            <MessageSquare className="mx-auto h-12 w-12 text-muted-foreground/25 mb-4" />
            <p className="text-sm font-medium text-foreground">No reviews yet</p>
            <p className="text-xs text-muted-foreground mt-1 max-w-sm mx-auto">
              Reviews appear here after clients complete bookings with you.
            </p>
          </div>
        </DashboardPanelCard>
      ) : (
        <ul className="space-y-4">
          {reviews.map((review) => (
            <li key={review.id}>
              <DashboardPanelCard contentClassName="space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                  <div className="flex items-start gap-3">
                    <DashboardUserAvatar name={review.customer_name} size="md" />
                    <div>
                      <p className="text-sm font-semibold text-foreground">
                        {review.customer_name ?? "Client"}
                      </p>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        {review.service_name ?? "Service"} ·{" "}
                        {review.created_at
                          ? new Date(review.created_at).toLocaleDateString()
                          : ""}
                      </p>
                    </div>
                  </div>
                  <div className="flex flex-col items-start sm:items-end gap-1">
                    {renderStars(review.rating)}
                    <p className="text-xs text-muted-foreground tabular-nums">{review.rating} out of 5</p>
                  </div>
                </div>
                <blockquote
                  className={cn(
                    workspaceUi.frosted.inset,
                    "text-sm text-foreground/90 leading-relaxed p-4"
                  )}
                >
                  {review.comment ? `"${review.comment}"` : "No written comment."}
                </blockquote>
              </DashboardPanelCard>
            </li>
          ))}
        </ul>
      )}
    </DashboardPageContainer>
  );
}

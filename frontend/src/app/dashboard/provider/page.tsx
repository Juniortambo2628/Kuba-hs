"use client";

import { useMemo, useState } from "react";
import useSWR from "swr";
import Link from "next/link";
import { useAuth } from "@/contexts/AuthContext";
import axiosInstance, { handleApiError } from "@/lib/axios";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Loader2,
  Wallet,
  Briefcase,
  Star,
  ShieldCheck,
  CheckCircle2,
} from "lucide-react";
import { toast } from "sonner";
import { DashboardPageContainer } from "@/components/shared/DashboardPageContainer";
import { DashboardGreetingBar } from "@/components/dashboard/workspace/DashboardGreetingBar";
import { DashboardInsightCard } from "@/components/dashboard/workspace/DashboardInsightCard";
import { DashboardSchedulePanel } from "@/components/dashboard/workspace/DashboardSchedulePanel";
import { DashboardJobsTable } from "@/components/dashboard/workspace/DashboardJobsTable";
import {
  DashboardFrostedStatCard,
  DashboardFrostedStatGrid,
} from "@/components/dashboard/workspace";
import { EmptyState } from "@/components/shared/ui/EmptyState";
import { workspaceUi } from "@/lib/dashboard-ui";
import { AppConfirmDialog } from "@/components/shared/dialog/AppConfirmDialog";
import type { Booking, Provider } from "@/types";
import { extractApiList } from "@/lib/api-response";

interface ProviderStats {
  total_earnings: number;
  active_bookings: number;
  completed_bookings: number;
  avg_rating: number;
  reputation_score: number;
}

interface ProviderVerificationSummary {
  is_verified: boolean;
  documents_submitted: number;
  documents_approved: number;
  needs_action: boolean;
}

interface ProviderDashboardPayload {
  stats: ProviderStats;
  recent_bookings: Booking[];
  profile?: Partial<Provider>;
  verification?: ProviderVerificationSummary;
}

function normalizeDashboard(raw: unknown): ProviderDashboardPayload | null {
  if (!raw || typeof raw !== "object") return null;
  const body = (raw as { data?: ProviderDashboardPayload }).data ?? raw;
  const b = body as ProviderDashboardPayload;
  if (!b.stats) return null;
  return {
    stats: b.stats,
    recent_bookings: extractApiList(b.recent_bookings),
    profile: b.profile,
    verification: b.verification,
  };
}

function timeGreeting(): string {
  const h = new Date().getHours();
  if (h < 12) return "Good morning";
  if (h < 17) return "Good afternoon";
  return "Good evening";
}

function isSameCalendarDay(iso: string | undefined, ref: Date): boolean {
  if (!iso) return false;
  const d = new Date(iso);
  return (
    d.getFullYear() === ref.getFullYear() &&
    d.getMonth() === ref.getMonth() &&
    d.getDate() === ref.getDate()
  );
}

function pickScheduleBookings(bookings: Booking[]) {
  const now = new Date();
  const today = bookings.filter((b) => isSameCalendarDay(b.scheduled_date, now));
  const actionable = bookings.filter((b) =>
    ["pending", "confirmed", "in_progress"].includes(b.status)
  );
  const pool = today.length > 0 ? today : actionable.length > 0 ? actionable : bookings;
  return {
    featured: pool[0] ?? null,
    upcoming: pool.slice(1, 4),
    jobCount: pool.length,
  };
}

export default function ProviderOverview() {
  const { user, isLoading: authLoading } = useAuth();
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [acceptJobId, setAcceptJobId] = useState<string | null>(null);

  const { data: raw, isLoading: isDashboardLoading, error, mutate } = useSWR(
    user?.role === "provider" ? "/api/provider/dashboard" : null,
    (url) => axiosInstance.get(url).then((res) => res.data)
  );

  const data = useMemo(() => normalizeDashboard(raw), [raw]);
  const isLoading = authLoading || isDashboardLoading;

  const bookings = data?.recent_bookings ?? [];
  const stats = data?.stats;
  const verification = data?.verification;
  const { featured, upcoming, jobCount } = pickScheduleBookings(bookings);

  const pendingCount = bookings.filter((b) =>
    ["pending", "confirmed", "in_progress"].includes(b.status)
  ).length;

  const handleStatusUpdate = async (bookingId: string, status: string) => {
    setUpdatingId(bookingId);
    try {
      await axiosInstance.patch(`/api/bookings/${bookingId}/status`, { status });
      toast.success(
        status === "confirmed"
          ? "Job accepted"
          : status === "in_progress"
            ? "Job started"
            : "Job marked complete"
      );
      await mutate();
    } catch (err: unknown) {
      toast.error(handleApiError(err));
    } finally {
      setUpdatingId(null);
    }
  };

  const featuredActions =
    featured?.status === "pending" ? (
      <>
        <Button
          className="w-full rounded-xl font-semibold"
          disabled={updatingId === featured.id}
          onClick={() => setAcceptJobId(featured.id)}
        >
          {updatingId === featured.id ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            "Accept job"
          )}
        </Button>
        <AppConfirmDialog
          open={acceptJobId === featured.id}
          onOpenChange={(open) => !open && setAcceptJobId(null)}
          title="Accept this job?"
          introDescription="You will be committed to fulfill this booking for the client."
          description="The client will be notified immediately once you confirm."
          icon={Briefcase}
          confirmLabel="Accept job"
          isLoading={updatingId === featured.id}
          onConfirm={() => {
            handleStatusUpdate(featured.id, "confirmed");
            setAcceptJobId(null);
          }}
        />
      </>
    ) : featured?.status === "confirmed" ? (
      <div className="flex flex-col gap-2">
        <Button
          className="w-full rounded-xl font-semibold"
          disabled={updatingId === featured.id}
          onClick={() => handleStatusUpdate(featured.id, "in_progress")}
        >
          {updatingId === featured.id ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            "Start job"
          )}
        </Button>
        <Button
          variant="outline"
          className="w-full rounded-xl"
          disabled={updatingId === featured.id}
          onClick={() => handleStatusUpdate(featured.id, "completed")}
        >
          Mark complete
        </Button>
      </div>
    ) : featured?.status === "in_progress" ? (
      <Button
        className="w-full rounded-xl font-semibold bg-emerald-600 hover:bg-emerald-700"
        disabled={updatingId === featured.id}
        onClick={() => handleStatusUpdate(featured.id, "completed")}
      >
        {updatingId === featured.id ? (
          <Loader2 className="w-4 h-4 animate-spin" />
        ) : (
          "Mark complete"
        )}
      </Button>
    ) : null;

  if (isLoading) {
    return (
      <DashboardPageContainer width="xl" className={workspaceUi.page}>
        <Skeleton className="h-24 w-full rounded-[1.75rem]" />
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <Skeleton key={i} className="h-28 rounded-[1.75rem]" />
          ))}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <Skeleton className="h-[420px] lg:col-span-4 rounded-[1.75rem]" />
          <div className="lg:col-span-8 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {[1, 2, 3].map((i) => (
                <Skeleton key={i} className="h-36 rounded-[1.75rem]" />
              ))}
            </div>
            <Skeleton className="h-64 rounded-[1.75rem]" />
          </div>
        </div>
      </DashboardPageContainer>
    );
  }

  if (!data) {
    return (
      <DashboardPageContainer width="xl" className={workspaceUi.page}>
        <EmptyState
          variant="dashboard"
          icon={Briefcase}
          title="Could not load workspace"
          description={
            error
              ? "Check that you are signed in as a provider and the API is running."
              : "Your provider dashboard data is unavailable."
          }
        >
          <Button className="rounded-full mt-4" onClick={() => mutate()}>
            Retry
          </Button>
          <Button asChild variant="outline" className="rounded-full mt-2">
            <Link href="/dashboard/provider/profile">Set up profile</Link>
          </Button>
        </EmptyState>
      </DashboardPageContainer>
    );
  }

  const today = new Date().toLocaleDateString(undefined, {
    weekday: "long",
    day: "numeric",
  });

  const verificationTitle = verification?.is_verified
    ? "Verified on marketplace"
    : verification?.needs_action
      ? "Complete verification"
      : "Verification in review";

  const verificationDescription = verification?.is_verified
    ? "Clients can see your verified badge. Keep documents current."
    : verification?.needs_action
      ? `${verification.documents_approved}/2 documents approved — upload ID and business license.`
      : "Documents submitted. Typical review window is 24–48 hours.";

  return (
    <DashboardPageContainer width="xl" className={workspaceUi.page}>
      <DashboardGreetingBar
        greeting={`${timeGreeting()}, ${user?.name?.split(" ")[0] ?? "there"}`}
        subtitle={
          data?.profile?.business_name
            ? `${data.profile.business_name} — provider workspace`
            : "Manage jobs, verification, and your storefront"
        }
        stats={[
          { label: "Active jobs", value: stats?.active_bookings ?? 0 },
          { label: "Completed", value: stats?.completed_bookings ?? 0 },
          {
            label: "Rating",
            value: `${Number(stats?.avg_rating ?? 0).toFixed(1)}/5`,
          },
        ]}
        actions={
          <>
            <Button asChild variant="outline" className="rounded-xl h-10">
              <Link href="/dashboard/provider/profile">Business profile</Link>
            </Button>
            <Button asChild className="rounded-xl h-10">
              <Link href="/dashboard/provider/services">Manage services</Link>
            </Button>
          </>
        }
      />

      <DashboardFrostedStatGrid columns={4}>
        <DashboardFrostedStatCard
          icon={Wallet}
          label="Total earnings"
          value={`KES ${Number(stats?.total_earnings ?? 0).toLocaleString()}`}
          tone="primary"
          hint="Completed payments"
        />
        <DashboardFrostedStatCard
          icon={Briefcase}
          label="Active pipeline"
          value={stats?.active_bookings ?? 0}
          tone="neutral"
          hint="Pending, confirmed, or in progress"
        />
        <DashboardFrostedStatCard
          icon={CheckCircle2}
          label="Completed jobs"
          value={stats?.completed_bookings ?? 0}
          tone="success"
        />
        <DashboardFrostedStatCard
          icon={Star}
          label="Reputation"
          value={`${stats?.reputation_score ?? 100}%`}
          tone="warning"
          badge={`${Number(stats?.avg_rating ?? 0).toFixed(1)}★`}
          badgeTone="good"
        />
      </DashboardFrostedStatGrid>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-4">
          <DashboardSchedulePanel
            dateLabel={today}
            jobCount={jobCount}
            featured={featured}
            upcoming={upcoming}
            featuredActions={featuredActions}
          />
        </div>

        <div className="lg:col-span-8 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <DashboardInsightCard
              className="md:col-span-2"
              tone={verification?.is_verified ? "primary" : "warm"}
              title={verificationTitle}
              description={verificationDescription}
              metric={
                verification?.is_verified
                  ? "Verified"
                  : `${verification?.documents_approved ?? 0}/2`
              }
              href="/dashboard/provider/verification"
            />
            <DashboardInsightCard
              tone="neutral"
              title="Trust documents"
              description="Upload and track verification status for your provider badge."
              metric={verification?.documents_submitted ?? 0}
              href="/dashboard/provider/verification"
            />
            <DashboardInsightCard
              tone="primary"
              title="Active pipeline"
              metric={stats?.active_bookings ?? 0}
              description="Jobs awaiting action or in progress."
              href="/dashboard/provider/bookings"
            />
            <DashboardInsightCard
              tone="warm"
              title="Your services"
              description="Add offerings clients can book from the marketplace."
              href="/dashboard/provider/services"
            />
          </div>

          <DashboardJobsTable
            title={`Recent jobs · ${bookings.length}`}
            subtitle={
              pendingCount > 0
                ? `${pendingCount} need attention`
                : "All caught up for now"
            }
            bookings={bookings.slice(0, 8)}
          />

          {!verification?.is_verified && (
            <div className="flex items-center gap-3 rounded-2xl border border-amber-500/20 bg-amber-500/5 px-5 py-4">
              <ShieldCheck className="h-5 w-5 text-amber-600 shrink-0" />
              <p className="text-sm text-foreground flex-1">
                Finish verification to unlock the verified badge and improve booking conversions.
              </p>
              <Button asChild size="sm" className="rounded-full shrink-0">
                <Link href="/dashboard/provider/verification">Verify now</Link>
              </Button>
            </div>
          )}
        </div>
      </div>
    </DashboardPageContainer>
  );
}

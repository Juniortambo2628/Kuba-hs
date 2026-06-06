"use client";

import { DashboardPageContainer } from "@/components/shared/DashboardPageContainer";

import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import axiosInstance from "@/lib/axios";
import { Button } from "@/components/ui/button";
import { 
  ShieldCheck, 
  Loader2,
  Map,
  Briefcase,
  Star,
  Pencil,
} from "lucide-react";
import { toast } from "sonner";
import { KubaFilePond } from "@/components/ui/filepond";
import { ProviderCardBanner } from "@/components/marketplace/ProviderCardBanner";
import {
  ProviderBusinessProfileDialog,
  type ProviderBusinessForm,
} from "@/components/dashboard/ProviderBusinessProfileDialog";
import {
  BrandMediaPanel,
  DashboardUserAvatar,
  DashboardGreetingBar,
  DashboardPanelCard,
  DashboardStatusBadge,
} from "@/components/dashboard/workspace";
import { workspaceUi } from "@/lib/dashboard-workspace-ui";
import Link from "next/link";
import Image from "next/image";
import { getMediaUrl, cn } from "@/lib/utils";

function toBusinessForm(profile: Record<string, unknown>, userPhone?: string): ProviderBusinessForm {
  const skills = profile.specialized_skills;
  return {
    business_name: (profile.business_name as string) || "",
    bio: (profile.bio as string) || "",
    location_name: (profile.location_name as string) || "",
    phone: (profile.phone as string) || userPhone || "+254",
    latitude: (profile.latitude as number) ?? null,
    longitude: (profile.longitude as number) ?? null,
    experience_years: Number(profile.experience_years) || 0,
    service_radius: Number(profile.service_radius) || 10,
    specialized_skills: Array.isArray(skills)
      ? (skills as string[])
      : typeof skills === "string"
        ? (skills as string).split(",").map((s) => s.trim()).filter(Boolean)
        : [],
  };
}

export default function ProviderProfile() {
  const { user, checkAuth } = useAuth();
  const [profile, setProfile] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [businessDialogOpen, setBusinessDialogOpen] = useState(false);

  useEffect(() => {
    fetchProfile();
  }, []);

  const emptyProfile = () => ({
    business_name: "",
    bio: "",
    location_name: "",
    phone: user?.phone || "+254",
    latitude: null,
    longitude: null,
    experience_years: 0,
    service_radius: 10,
    specialized_skills: [] as string[],
  });

  const fetchProfile = async () => {
    try {
      const res = await axiosInstance.get("/api/provider/dashboard");
      const body = res.data?.data ?? res.data;
      const profileData = body?.profile ?? body;
      setProfile({ ...emptyProfile(), ...(profileData || {}) });
    } catch (err: unknown) {
      const status = (err as { response?: { status?: number } })?.response?.status;
      if (status === 403) {
        toast.error("Sign in with a provider account to manage this profile.");
      } else {
        toast.error("Failed to load profile");
      }
      setProfile(emptyProfile());
    } finally {
      setIsLoading(false);
    }
  };

  const handleBusinessSaved = async () => {
    await fetchProfile();
    await checkAuth();
  };

  if (isLoading) {
    return (
      <DashboardPageContainer width="default" className="space-y-8 animate-pulse p-4">
        <div className="h-10 w-48 bg-muted rounded-xl"></div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1 h-96 bg-muted rounded-2xl"></div>
          <div className="lg:col-span-2 h-[600px] bg-muted rounded-2xl"></div>
        </div>
      </DashboardPageContainer>
    );
  }

  if (!profile) {
    return (
      <DashboardPageContainer width="default" className="py-12 text-center text-muted-foreground text-sm">
        Unable to load provider profile. Refresh the page or contact support.
      </DashboardPageContainer>
    );
  }

  return (
    <DashboardPageContainer width="default" className={workspaceUi.page}>
      <DashboardGreetingBar
        greeting="Business profile"
        subtitle="Logo and banner are your storefront on marketplace cards. Your personal photo is only for account identity (header, chat, team views)."
        actions={
          <Button
            onClick={() => setBusinessDialogOpen(true)}
            className="rounded-xl h-10 font-semibold"
          >
            <Pencil className="w-4 h-4 mr-2" />
            Edit business profile
          </Button>
        }
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Profile Sidebar */}
        <div className="lg:col-span-1 space-y-6">
          {profile?.id && (
            <>
              <BrandMediaPanel
                title="Storefront banner"
                description="Wide header image on your public provider card when no logo is set."
              >
                <div className="h-28 rounded-2xl overflow-hidden border border-border mb-4">
                  <ProviderCardBanner
                    bannerUrl={profile.banner}
                    businessName={profile.business_name || user?.name || "Provider"}
                    priority
                  />
                </div>
                <KubaFilePond
                  modelType="provider"
                  modelId={String(profile.id)}
                  collection="banners"
                  onSuccess={() => {
                    toast.success("Banner updated");
                    fetchProfile();
                  }}
                />
              </BrandMediaPanel>

              <BrandMediaPanel
                title="Business logo"
                description="Primary brand mark on marketplace search and provider cards."
              >
                {profile.logo && (
                  <div className="relative h-24 w-24 mx-auto mb-4 rounded-2xl overflow-hidden border border-border bg-muted">
                    <Image
                      src={getMediaUrl(profile.logo, "avatar")}
                      alt={`${profile.business_name || "Provider"} logo`}
                      fill
                      sizes="96px"
                      className="object-cover"
                    />
                  </div>
                )}
                <KubaFilePond
                  modelType="provider"
                  modelId={String(profile.id)}
                  collection="logos"
                  onSuccess={() => {
                    toast.success("Logo updated");
                    fetchProfile();
                  }}
                />
              </BrandMediaPanel>
            </>
          )}

          <BrandMediaPanel
            title="Personal photo"
            description="Your face for the dashboard header, messages, and account menu — not shown as the business logo."
          >
            <div className="flex flex-col items-center text-center gap-4">
              <DashboardUserAvatar name={user?.name} avatarUrl={user?.avatar_url} size="xl" />
              {user?.id && (
                <div className="w-full max-w-xs">
                  <KubaFilePond
                    modelType="user"
                    modelId={String(user.id)}
                    collection="avatars"
                    onSuccess={() => {
                      toast.success("Personal photo updated");
                      checkAuth();
                    }}
                  />
                </div>
              )}
              <div className="space-y-2">
                <h2 className="text-xl font-bold text-foreground tracking-tight">
                  {profile?.business_name || user?.name || "Provider"}
                </h2>
                <div className="flex items-center justify-center gap-2 flex-wrap">
                  <DashboardStatusBadge status="active" label="Provider" tone="info" />
                  {profile?.is_verified && (
                    <DashboardStatusBadge status="verified" label="Verified" tone="good" />
                  )}
                </div>
              </div>

              <div className="space-y-4 pt-6 mt-2 border-t border-border w-full">
                <div className={cn(workspaceUi.frosted.inset, "p-4 w-full")}>
                  <div className="flex items-center justify-between mb-1">
                    <p className="text-xs font-medium text-muted-foreground">Rating</p>
                    <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                  </div>
                  <p className="text-lg font-semibold text-foreground">Building reputation</p>
                  <p className="text-xs text-muted-foreground mt-1">Reviews improve your ranking</p>
                </div>
                {profile?.id && (
                  <Button variant="outline" className="w-full rounded-full" asChild>
                    <Link href={`/providers/${profile.id}`}>View public profile</Link>
                  </Button>
                )}
              </div>
            </div>
          </BrandMediaPanel>

          <DashboardPanelCard title="Account security" icon={ShieldCheck} contentClassName="space-y-3">
            <div className="h-1.5 w-full bg-muted rounded-full overflow-hidden">
              <div className="h-full w-[95%] bg-primary rounded-full" />
            </div>
            <p className="text-xs text-muted-foreground text-center leading-relaxed">
              Your login and verification details look good.
            </p>
          </DashboardPanelCard>
        </div>

        {/* Main Panel */}
        <div className="lg:col-span-2 space-y-8">
          <DashboardPanelCard
            title="Business details"
            description="How clients see your business on the marketplace"
            icon={Briefcase}
            action={
              <Button
                variant="outline"
                size="sm"
                className="rounded-full"
                onClick={() => setBusinessDialogOpen(true)}
              >
                <Pencil className="h-3.5 w-3.5 mr-1" />
                Edit
              </Button>
            }
          >
            <dl className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-4 text-sm">
              <div className="sm:col-span-2">
                <dt className="text-xs font-medium text-muted-foreground">Business name</dt>
                <dd className="font-semibold text-foreground mt-0.5">
                  {profile.business_name || "—"}
                </dd>
              </div>
              <div>
                <dt className="text-xs font-medium text-muted-foreground">Phone</dt>
                <dd className="font-medium text-foreground mt-0.5">{profile.phone || "—"}</dd>
              </div>
              <div>
                <dt className="text-xs font-medium text-muted-foreground">Base city</dt>
                <dd className="font-medium text-foreground mt-0.5">
                  {profile.location_name || "—"}
                </dd>
              </div>
              <div className="sm:col-span-2">
                <dt className="text-xs font-medium text-muted-foreground">Bio</dt>
                <dd className="text-foreground mt-0.5 leading-relaxed whitespace-pre-wrap">
                  {profile.bio || "No bio yet"}
                </dd>
              </div>
              <div className="sm:col-span-2">
                <dt className="text-xs font-medium text-muted-foreground">Skills</dt>
                <dd className="text-foreground mt-0.5">
                  {Array.isArray(profile.specialized_skills) && profile.specialized_skills.length
                    ? profile.specialized_skills.join(", ")
                    : "—"}
                </dd>
              </div>
              <div>
                <dt className="text-xs font-medium text-muted-foreground">Experience</dt>
                <dd className="font-medium text-foreground mt-0.5">
                  {profile.experience_years ?? 0} years
                </dd>
              </div>
              <div>
                <dt className="text-xs font-medium text-muted-foreground">Service radius</dt>
                <dd className="font-medium text-foreground mt-0.5">
                  {profile.service_radius ?? 10} km
                </dd>
              </div>
            </dl>
          </DashboardPanelCard>

          <DashboardPanelCard
            title="Service area"
            description="Where you operate on the map"
            icon={Map}
            action={
              <Button
                variant="outline"
                size="sm"
                className="rounded-full"
                onClick={() => setBusinessDialogOpen(true)}
              >
                <Pencil className="h-3.5 w-3.5 mr-1" />
                Edit on map
              </Button>
            }
          >
            <div className="grid grid-cols-2 gap-4">
              <div className={cn(workspaceUi.frosted.inset, "p-4")}>
                <p className="text-xs font-medium text-muted-foreground mb-1">Latitude</p>
                <p className="text-sm font-semibold text-foreground tabular-nums">
                  {profile.latitude?.toFixed(6) || "—"}
                </p>
              </div>
              <div className={cn(workspaceUi.frosted.inset, "p-4")}>
                <p className="text-xs font-medium text-muted-foreground mb-1">Longitude</p>
                <p className="text-sm font-semibold text-foreground tabular-nums">
                  {profile.longitude?.toFixed(6) || "—"}
                </p>
              </div>
            </div>
            <p className="text-xs text-muted-foreground mt-4 leading-relaxed">
              Open the editor to pin your base location and adjust coverage radius.
            </p>
          </DashboardPanelCard>
        </div>
      </div>

      <ProviderBusinessProfileDialog
        open={businessDialogOpen}
        onOpenChange={setBusinessDialogOpen}
        initial={toBusinessForm(profile, user?.phone)}
        onSuccess={handleBusinessSaved}
      />
    </DashboardPageContainer>
  );
}

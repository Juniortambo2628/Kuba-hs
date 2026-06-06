"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import axiosInstance from "@/lib/axios";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Input } from "@/components/ui/input";
import {
  User,
  Mail,
  Phone,
  Save,
  Lock,
  Loader2,
  Shield,
  MapPin,
} from "lucide-react";
import { toast } from "sonner";
import { KubaFilePond } from "@/components/ui/filepond";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { FieldLabel } from "@/components/shared/ui";
import { DashboardPageContainer } from "@/components/shared/DashboardPageContainer";
import {
  BrandMediaPanel,
  DashboardUserAvatar,
  DashboardGreetingBar,
  DashboardPanelCard,
  DashboardStatusBadge,
} from "@/components/dashboard/workspace";
import { workspaceUi } from "@/lib/dashboard-workspace-ui";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { ProfileEditDialog } from "@/components/dashboard/ProfileEditDialog";

export default function ClientProfilePage() {
  const { user, isLoading: authLoading, checkAuth } = useAuth();
  const [editOpen, setEditOpen] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [isSavingPassword, setIsSavingPassword] = useState(false);
  const [passwordForm, setPasswordForm] = useState({
    current_password: "",
    password: "",
    password_confirmation: "",
  });
  const [profileForm, setProfileForm] = useState({
    name: "",
    first_name: "",
    last_name: "",
    email: "",
    phone: "",
  });

  useEffect(() => {
    if (!authLoading && user) {
      setProfileForm({
        name: user.name || "",
        first_name: user.first_name || "",
        last_name: user.last_name || "",
        email: user.email || "",
        phone: user.phone || "",
      });
    }
  }, [authLoading, user]);

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSavingPassword(true);
    try {
      await axiosInstance.patch("/api/client/password", passwordForm);
      toast.success("Password updated");
      setIsChangingPassword(false);
      setPasswordForm({ current_password: "", password: "", password_confirmation: "" });
    } catch (err: unknown) {
      const message =
        (err as { response?: { data?: { message?: string } } })?.response?.data?.message ||
        "Failed to update password";
      toast.error(message);
    } finally {
      setIsSavingPassword(false);
    }
  };

  if (authLoading) {
    return (
      <DashboardPageContainer width="default" className={workspaceUi.page}>
        <Skeleton className="h-10 w-48 rounded-xl" />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <Skeleton className="h-80 rounded-2xl" />
          <Skeleton className="h-96 rounded-2xl lg:col-span-2" />
        </div>
      </DashboardPageContainer>
    );
  }

  if (!user) return null;

  const memberSince = user.created_at ? new Date(user.created_at).getFullYear() : null;

  return (
    <DashboardPageContainer width="default" className={workspaceUi.page}>
      <DashboardGreetingBar
        greeting="Your profile"
        subtitle="Name, contact details, and account security."
        actions={
          <Button className="rounded-full" onClick={() => setEditOpen(true)}>
            Edit profile
          </Button>
        }
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1 space-y-6">
          <BrandMediaPanel title="Profile photo" description="Shown in messages and your account menu.">
            <div className="flex flex-col items-center text-center gap-4">
              <DashboardUserAvatar name={user.name} avatarUrl={user.avatar_url} size="xl" />
              {user.id && (
                <div className="w-full max-w-xs">
                  <KubaFilePond
                    modelType="user"
                    modelId={String(user.id)}
                    collection="avatars"
                    onSuccess={() => {
                      toast.success("Photo updated");
                      checkAuth();
                    }}
                  />
                </div>
              )}
              <div className="space-y-2">
                <h2 className="text-xl font-semibold text-foreground">{user.name}</h2>
                <div className="flex items-center justify-center gap-2 flex-wrap">
                  <DashboardStatusBadge status="active" label="Client" tone="info" />
                  {memberSince && (
                    <DashboardStatusBadge
                      status="member"
                      label={`Member since ${memberSince}`}
                      tone="muted"
                    />
                  )}
                </div>
              </div>
            </div>
          </BrandMediaPanel>

          <DashboardPanelCard title="Saved addresses" icon={MapPin} contentClassName="space-y-3">
            <p className="text-sm text-muted-foreground leading-relaxed">
              Manage home and office locations on the addresses page — used when you book services.
            </p>
            <Button variant="outline" className="w-full rounded-full" asChild>
              <Link href="/dashboard/client/services">Open saved addresses</Link>
            </Button>
          </DashboardPanelCard>
        </div>

        <div className="lg:col-span-2 space-y-8">
          <DashboardPanelCard
            title="Contact information"
            description="Used for booking confirmations and provider contact"
            icon={User}
          >
            <dl className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
              <div>
                <dt className="text-muted-foreground text-xs font-medium">Email</dt>
                <dd className="font-medium text-foreground mt-0.5">{profileForm.email || "—"}</dd>
              </div>
              <div>
                <dt className="text-muted-foreground text-xs font-medium">Phone</dt>
                <dd className="font-medium text-foreground mt-0.5">{profileForm.phone || "—"}</dd>
              </div>
              <div>
                <dt className="text-muted-foreground text-xs font-medium">First name</dt>
                <dd className="font-medium text-foreground mt-0.5">{profileForm.first_name || "—"}</dd>
              </div>
              <div>
                <dt className="text-muted-foreground text-xs font-medium">Last name</dt>
                <dd className="font-medium text-foreground mt-0.5">{profileForm.last_name || "—"}</dd>
              </div>
            </dl>
            <Button variant="outline" className="rounded-full mt-4" onClick={() => setEditOpen(true)}>
              Edit contact details
            </Button>
          </DashboardPanelCard>

          <DashboardPanelCard title="Password" description="Change your login password" icon={Lock}>
            <p className="text-sm text-muted-foreground mb-4">
              Use a strong password you do not share with anyone.
            </p>
            <Button
              variant="outline"
              className="rounded-full"
              type="button"
              onClick={() => setIsChangingPassword(true)}
            >
              <Lock className="h-4 w-4 mr-2" />
              Change password
            </Button>
          </DashboardPanelCard>
        </div>
      </div>

      <Dialog open={isChangingPassword} onOpenChange={setIsChangingPassword}>
        <DialogContent className="sm:max-w-md rounded-2xl">
          <DialogHeader>
            <DialogTitle>Change password</DialogTitle>
            <DialogDescription>
              Enter your current password, then choose a new one.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleChangePassword} className="space-y-4 pt-2">
            <div className="space-y-2">
              <FieldLabel>Current password</FieldLabel>
              <Input
                type="password"
                value={passwordForm.current_password}
                onChange={(e) =>
                  setPasswordForm({ ...passwordForm, current_password: e.target.value })
                }
                className="h-11 rounded-xl"
                required
              />
            </div>
            <div className="space-y-2">
              <FieldLabel>New password</FieldLabel>
              <Input
                type="password"
                value={passwordForm.password}
                onChange={(e) =>
                  setPasswordForm({ ...passwordForm, password: e.target.value })
                }
                className="h-11 rounded-xl"
                required
              />
            </div>
            <div className="space-y-2">
              <FieldLabel>Confirm new password</FieldLabel>
              <Input
                type="password"
                value={passwordForm.password_confirmation}
                onChange={(e) =>
                  setPasswordForm({
                    ...passwordForm,
                    password_confirmation: e.target.value,
                  })
                }
                className="h-11 rounded-xl"
                required
              />
            </div>
            <DialogFooter className="pt-2 gap-2 sm:gap-0">
              <Button
                type="button"
                variant="ghost"
                className="rounded-full"
                onClick={() => setIsChangingPassword(false)}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isSavingPassword} className="rounded-full">
                {isSavingPassword ? (
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                ) : (
                  <Shield className="h-4 w-4 mr-2" />
                )}
                Update password
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <ProfileEditDialog
        open={editOpen}
        onOpenChange={setEditOpen}
        initial={profileForm}
        saveUrl="/api/client/profile"
        onSuccess={checkAuth}
      />
    </DashboardPageContainer>
  );
}

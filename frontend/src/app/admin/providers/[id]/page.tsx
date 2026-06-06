"use client";

import { use, useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import axiosInstance from "@/lib/axios";
import { Provider } from "@/types";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Skeleton } from "@/components/ui/skeleton";
import { DashboardPageHeader } from "@/components/shared/DashboardPageHeader";
import { DashboardStatusBadge } from "@/components/shared/DashboardStatusBadge";
import { ComplianceStatusBadge } from "@/components/shared/ComplianceStatusBadge";
import { ChevronLeft, Loader2, ShieldCheck, Star, Wallet } from "lucide-react";
import { toast } from "sonner";
import { getMediaUrl } from "@/lib/utils";
import { ConfirmDeleteDialog } from "@/components/shared/ConfirmDeleteDialog";
import { DashboardPageContainer } from "@/components/shared/DashboardPageContainer";
import { KubaFilePond } from "@/components/ui/filepond";

export default function AdminProviderDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const [provider, setProvider] = useState<Provider | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [showDeactivate, setShowDeactivate] = useState(false);
  const [form, setForm] = useState({
    business_name: "",
    bio: "",
    experience_years: 0,
    location_name: "",
    service_radius: 25,
    availability_status: "available",
    first_name: "",
    last_name: "",
    email: "",
    phone: "",
    application_status: "pending",
    is_verified: false,
    compliance_status: "pending",
  });

  const loadProvider = useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await axiosInstance.get(`/api/admin/providers/${id}`);
      const p: Provider = res.data.data ?? res.data.provider ?? res.data;
      setProvider(p);
      setForm({
        business_name: p.business_name || "",
        bio: p.bio || "",
        experience_years: p.experience_years ?? 0,
        location_name: p.location_name || "",
        service_radius: p.service_radius ?? 25,
        availability_status: p.availability_status || "available",
        first_name: p.user?.first_name || "",
        last_name: p.user?.last_name || "",
        email: p.user?.email || "",
        phone: p.user?.phone || "",
        application_status: p.application_status || "pending",
        is_verified: !!p.is_verified,
        compliance_status: p.compliance_status || "pending",
      });
    } catch {
      toast.error("Failed to load provider");
      router.push("/admin/providers");
    } finally {
      setIsLoading(false);
    }
  }, [id, router]);

  useEffect(() => {
    loadProvider();
  }, [loadProvider]);

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      await axiosInstance.put(`/api/admin/providers/${id}`, {
        business_name: form.business_name,
        bio: form.bio,
        experience_years: form.experience_years,
        location_name: form.location_name,
        service_radius: form.service_radius,
        availability_status: form.availability_status,
        first_name: form.first_name,
        last_name: form.last_name,
        email: form.email,
        phone: form.phone,
      });
      toast.success("Profile saved");
      loadProvider();
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to save");
    } finally {
      setIsSaving(false);
    }
  };

  const handleSaveStatus = async () => {
    setIsSaving(true);
    try {
      await axiosInstance.patch(`/api/admin/providers/${id}/status`, {
        application_status: form.application_status,
        is_verified: form.is_verified,
        availability_status: form.availability_status,
        compliance_status: form.compliance_status,
      });
      toast.success("Status updated");
      loadProvider();
    } catch {
      toast.error("Failed to update status");
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeactivate = async () => {
    try {
      await axiosInstance.delete(`/api/admin/providers/${id}`);
      toast.success("Provider deactivated");
      router.push("/admin/providers");
    } catch {
      toast.error("Failed to deactivate");
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-8">
        <Skeleton className="h-12 w-64" />
        <Skeleton className="h-96 w-full rounded-2xl" />
      </div>
    );
  }

  if (!provider) return null;

  return (
    <DashboardPageContainer width="narrow" className="space-y-10">
      <div className="flex items-center gap-4">
        <Link href="/admin/providers">
          <Button variant="ghost" size="icon" className="rounded-xl">
            <ChevronLeft className="w-5 h-5" />
          </Button>
        </Link>
        <DashboardPageHeader title={provider.business_name} subtitle="Provider workforce profile" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="border border-border">
          <CardContent className="p-6 space-y-1">
            <p className="text-[10px] font-bold uppercase text-muted-foreground">Rating</p>
            <p className="text-2xl font-black flex items-center gap-2">
              <Star className="w-5 h-5 text-amber-500 fill-amber-500" />
              {(provider.rating ?? 0).toFixed(1)}
            </p>
          </CardContent>
        </Card>
        <Card className="border border-border">
          <CardContent className="p-6 space-y-1">
            <p className="text-[10px] font-bold uppercase text-muted-foreground">Bookings</p>
            <p className="text-2xl font-black">{provider.bookings_count ?? 0}</p>
          </CardContent>
        </Card>
        <Card className="border border-border">
          <CardContent className="p-6 space-y-1">
            <p className="text-[10px] font-bold uppercase text-muted-foreground flex items-center gap-1">
              <Wallet className="w-3.5 h-3.5" /> Balance
            </p>
            <p className="text-2xl font-black">KES {(provider.balance ?? 0).toLocaleString()}</p>
          </CardContent>
        </Card>
      </div>

      <form onSubmit={handleSaveProfile} className="space-y-8">
        <Card className="border border-border">
          <CardHeader>
            <CardTitle className="text-lg">Business profile</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Business name</Label>
              <Input value={form.business_name} onChange={(e) => setForm({ ...form, business_name: e.target.value })} required />
            </div>
            <div className="space-y-2">
              <Label>Bio</Label>
              <Textarea value={form.bio} onChange={(e) => setForm({ ...form, bio: e.target.value })} rows={4} />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Experience (years)</Label>
                <Input type="number" min={0} value={form.experience_years} onChange={(e) => setForm({ ...form, experience_years: parseInt(e.target.value) || 0 })} />
              </div>
              <div className="space-y-2">
                <Label>Service radius (km)</Label>
                <Input type="number" min={1} value={form.service_radius} onChange={(e) => setForm({ ...form, service_radius: parseInt(e.target.value) || 25 })} />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Location</Label>
              <Input value={form.location_name} onChange={(e) => setForm({ ...form, location_name: e.target.value })} />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>First name</Label>
                <Input value={form.first_name} onChange={(e) => setForm({ ...form, first_name: e.target.value })} />
              </div>
              <div className="space-y-2">
                <Label>Last name</Label>
                <Input value={form.last_name} onChange={(e) => setForm({ ...form, last_name: e.target.value })} />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Email</Label>
                <Input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
              </div>
              <div className="space-y-2">
                <Label>Phone</Label>
                <Input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
              </div>
            </div>
            <Button type="submit" disabled={isSaving} className="rounded-xl font-bold">
              {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : "Save profile"}
            </Button>
          </CardContent>
        </Card>
      </form>

      <Card className="border border-border">
        <CardHeader>
          <CardTitle className="text-lg">Brand media</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <p className="text-xs text-muted-foreground">
            Logo and banner appear on marketplace provider cards when set.
          </p>
          <div className="space-y-2">
            <Label>Business logo</Label>
            <KubaFilePond
              modelType="provider"
              modelId={id}
              collection="logos"
              onSuccess={() => {
                toast.success("Logo updated");
                loadProvider();
              }}
            />
          </div>
          <div className="space-y-2">
            <Label>Storefront banner</Label>
            <KubaFilePond
              modelType="provider"
              modelId={id}
              collection="banners"
              onSuccess={() => {
                toast.success("Banner updated");
                loadProvider();
              }}
            />
          </div>
        </CardContent>
      </Card>

      <Card className="border border-border">
        <CardHeader>
          <CardTitle className="text-lg">Status & compliance</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-wrap gap-3 items-center">
            <DashboardStatusBadge status={form.application_status} />
            <ComplianceStatusBadge status={form.compliance_status} />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Application status</Label>
              <select
                className="w-full h-11 rounded-xl border border-border bg-card px-3 text-sm font-medium"
                value={form.application_status}
                onChange={(e) => setForm({ ...form, application_status: e.target.value })}
              >
                <option value="pending">Pending</option>
                <option value="approved">Approved</option>
                <option value="active">Active</option>
                <option value="rejected">Rejected</option>
                <option value="suspended">Suspended</option>
              </select>
            </div>
            <div className="space-y-2">
              <Label>Availability</Label>
              <select
                className="w-full h-11 rounded-xl border border-border bg-card px-3 text-sm font-medium"
                value={form.availability_status}
                onChange={(e) => setForm({ ...form, availability_status: e.target.value })}
              >
                <option value="available">Available</option>
                <option value="busy">Busy</option>
                <option value="offline">Offline</option>
              </select>
            </div>
            <div className="space-y-2">
              <Label>Compliance status</Label>
              <select
                className="w-full h-11 rounded-xl border border-border bg-card px-3 text-sm font-medium"
                value={form.compliance_status}
                onChange={(e) => setForm({ ...form, compliance_status: e.target.value })}
              >
                <option value="pending">Pending</option>
                <option value="compliant">Compliant</option>
                <option value="non_compliant">Non-compliant</option>
                <option value="expiring_soon">Expiring soon</option>
              </select>
            </div>
            <div className="space-y-2 flex items-end">
              <label className="flex items-center gap-2 text-sm font-medium cursor-pointer">
                <input
                  type="checkbox"
                  checked={form.is_verified}
                  onChange={(e) => setForm({ ...form, is_verified: e.target.checked })}
                  className="rounded"
                />
                Verified provider
              </label>
            </div>
          </div>
          <Button type="button" onClick={handleSaveStatus} disabled={isSaving} variant="secondary" className="rounded-xl font-bold">
            Update status
          </Button>
        </CardContent>
      </Card>

      {provider.verification_documents && provider.verification_documents.length > 0 && (
        <Card className="border border-border">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-lg flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-primary" /> Verification documents
            </CardTitle>
            <Button asChild variant="outline" size="sm" className="rounded-xl">
              <Link href="/admin/compliance">Open compliance</Link>
            </Button>
          </CardHeader>
          <CardContent className="space-y-3">
            {provider.verification_documents.map((doc) => (
              <div key={doc.id} className="flex items-center justify-between p-3 rounded-xl border border-border bg-muted/20">
                <div>
                  <p className="text-sm font-bold capitalize">{doc.document_type.replace(/_/g, " ")}</p>
                  <p className="text-xs text-muted-foreground">{doc.status}</p>
                </div>
                {doc.url && (
                  <Button asChild variant="ghost" size="sm">
                    <a href={getMediaUrl(doc.url || doc.file_path)} target="_blank" rel="noopener noreferrer">
                      View
                    </a>
                  </Button>
                )}
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      <div className="flex justify-between pt-4 border-t border-border">
        <p className="text-xs text-muted-foreground">
          Total earned: KES {(provider.total_earned ?? 0).toLocaleString()} · Quality score: {provider.quality_score ?? 0}
        </p>
        <Button variant="destructive" onClick={() => setShowDeactivate(true)} className="rounded-xl">
          Deactivate provider
        </Button>
      </div>

      <ConfirmDeleteDialog
        isOpen={showDeactivate}
        onClose={() => setShowDeactivate(false)}
        onConfirm={handleDeactivate}
        title="Deactivate provider?"
        description="Suspends the account and marks the provider offline. This does not delete booking history."
        confirmLabel="Deactivate"
      />
    </DashboardPageContainer>
  );
}

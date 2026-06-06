"use client";

import { useEffect, useState } from "react";
import axiosInstance from "@/lib/axios";
import { Button } from "@/components/ui/button";
import {
  ShieldCheck,
  FileText,
  Loader2,
  CheckCircle2,
  XCircle,
  Clock,
  AlertCircle,
  Briefcase,
  Upload,
} from "lucide-react";
import { VerificationUploadDialog } from "@/components/dashboard/VerificationUploadDialog";
import { toast } from "sonner";
import { DashboardPageContainer } from "@/components/shared/DashboardPageContainer";
import {
  DashboardGreetingBar,
  DashboardFrostedStatGrid,
  DashboardFrostedStatCard,
  DashboardPanelCard,
  DashboardStatusBadge,
} from "@/components/dashboard/workspace";
import { formatDocumentType } from "@/lib/dashboard-copy";
import { workspaceUi } from "@/lib/dashboard-workspace-ui";
import { cn } from "@/lib/utils";
import type { VerificationDocument } from "@/types";

function statusIcon(status: string) {
  switch (status) {
    case "approved":
      return <CheckCircle2 className="h-5 w-5 text-emerald-500" />;
    case "rejected":
      return <XCircle className="h-5 w-5 text-red-500" />;
    case "pending":
      return <Clock className="h-5 w-5 text-amber-500" />;
    default:
      return <AlertCircle className="h-5 w-5 text-muted-foreground" />;
  }
}

export default function ProviderVerification() {
  const [documents, setDocuments] = useState<VerificationDocument[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [uploadOpen, setUploadOpen] = useState(false);

  useEffect(() => {
    fetchDocuments();
  }, []);

  const fetchDocuments = async () => {
    try {
      const res = await axiosInstance.get("/api/provider/verification");
      const raw = res.data?.data ?? res.data;
      setDocuments(Array.isArray(raw) ? raw : raw?.documents ?? []);
    } catch {
      toast.error("Failed to load verification status");
    } finally {
      setIsLoading(false);
    }
  };

  const idDoc = documents.find((d) => d.document_type === "id_card");
  const licenseDoc = documents.find((d) => d.document_type === "business_license");
  const approvedCount = documents.filter((d) => d.status === "approved").length;

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
        greeting="Trust & verification"
        subtitle="Upload ID and business documents to unlock the verified badge on your profile."
      />

      <DashboardFrostedStatGrid columns={3}>
        <DashboardFrostedStatCard
          icon={ShieldCheck}
          label="Documents submitted"
          value={documents.length}
          tone="primary"
        />
        <DashboardFrostedStatCard
          icon={CheckCircle2}
          label="Approved"
          value={approvedCount}
          tone="success"
          badge={approvedCount >= 2 ? "Complete" : undefined}
          badgeTone="good"
        />
        <DashboardFrostedStatCard
          icon={Clock}
          label="Review time"
          value="24–48h"
          tone="neutral"
          hint="Typical processing window"
        />
      </DashboardFrostedStatGrid>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <DashboardPanelCard
          title="What you need"
          description="Two approved documents unlock marketplace verification."
          icon={ShieldCheck}
        >
          <div className="space-y-3">
            {[
              { doc: idDoc, label: "Government ID", hint: "Passport or national ID" },
              { doc: licenseDoc, label: "Business license", hint: "Registration or permit" },
            ].map(({ doc, label, hint }) => (
              <div
                key={label}
                className={cn(
                  workspaceUi.frosted.inset,
                  "flex items-center justify-between gap-3 p-4",
                  doc?.status === "approved" && "ring-1 ring-emerald-500/20"
                )}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <FileText className="h-4 w-4 shrink-0 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium text-foreground">{label}</p>
                    <p className="text-xs text-muted-foreground">{hint}</p>
                  </div>
                </div>
                {doc ? (
                  <div className="flex items-center gap-2 shrink-0">
                    <DashboardStatusBadge status={doc.status} />
                    {statusIcon(doc.status)}
                  </div>
                ) : (
                  <DashboardStatusBadge status="pending" label="Not uploaded" tone="muted" />
                )}
              </div>
            ))}
          </div>
          <p className="text-xs text-muted-foreground mt-4 leading-relaxed">
            Verified providers get higher visibility and more booking conversions.
          </p>
        </DashboardPanelCard>

        <DashboardPanelCard
          title="Submit documents"
          description="Upload ID, license, or certification for review"
          icon={Upload}
          action={
            <Button className="rounded-full" size="sm" onClick={() => setUploadOpen(true)}>
              <Upload className="h-3.5 w-3.5 mr-1" />
              Upload
            </Button>
          }
        >
          <p className="text-sm text-muted-foreground leading-relaxed">
            Use the upload dialog to submit PDF, PNG, or JPG files (max 5MB). You will see status updates here once submitted.
          </p>
        </DashboardPanelCard>
      </div>

      <VerificationUploadDialog
        open={uploadOpen}
        onOpenChange={setUploadOpen}
        onSuccess={fetchDocuments}
      />

      {documents.length > 0 && (
        <DashboardPanelCard title="Submission history" icon={Briefcase}>
          <ul className="space-y-3">
            {documents.map((doc) => (
              <li
                key={doc.id}
                className={cn(
                  workspaceUi.frosted.inset,
                  "flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4"
                )}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="h-12 w-12 rounded-xl bg-muted flex items-center justify-center overflow-hidden border border-border/50 shrink-0">
                    {doc.url?.match(/\.(jpg|jpeg|png|gif|webp)$/i) ? (
                      <img src={doc.url} alt="" className="h-full w-full object-cover" />
                    ) : (
                      <FileText className="h-5 w-5 text-muted-foreground" />
                    )}
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-foreground">
                      {formatDocumentType(doc.document_type)}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Submitted {doc.created_at ? new Date(doc.created_at).toLocaleDateString() : 'Unknown'}
                    </p>
                    {doc.rejection_reason && (
                      <p className="text-xs text-red-600 mt-1">{doc.rejection_reason}</p>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <DashboardStatusBadge status={doc.status} />
                  {statusIcon(doc.status)}
                </div>
              </li>
            ))}
          </ul>
        </DashboardPanelCard>
      )}
    </DashboardPageContainer>
  );
}

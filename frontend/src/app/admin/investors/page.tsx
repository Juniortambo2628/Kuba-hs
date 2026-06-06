"use client";

import { useMemo, useState } from "react";
import axiosInstance from "@/lib/axios";
import {
  Briefcase,
  MoreVertical,
  CheckCircle,
  XCircle,
  Clock,
  Mail,
  Building2,
  DollarSign,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableCell,
} from "@/components/ui/table";
import {
  DashboardDataCard,
  DashboardTableHead,
  DashboardTableHeaderRow,
} from "@/components/shared/DashboardTable";
import { DashboardPageContainer } from "@/components/shared/DashboardPageContainer";
import { DashboardStatusBadge } from "@/components/shared/DashboardStatusBadge";
import { ConfirmDeleteDialog } from "@/components/shared/ConfirmDeleteDialog";
import {
  DashboardGreetingBar,
  DashboardFrostedStatCard,
  DashboardFrostedStatGrid,
  DashboardPanelCard,
} from "@/components/dashboard/workspace";
import { workspaceUi } from "@/lib/dashboard-workspace-ui";
import { useApiData } from "@/hooks/useApiData";
import { InvestorInquiry } from "@/types";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

export default function AdminInvestorsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [deleteTarget, setDeleteTarget] = useState<InvestorInquiry | null>(null);
  const { data: inquiriesRaw, isLoading, refetch } = useApiData<unknown>("/api/admin/investors", {
    initialData: [],
  });
  const inquiries = (
    Array.isArray(inquiriesRaw) ? inquiriesRaw : (inquiriesRaw as { data?: InvestorInquiry[] })?.data || []
  ) as InvestorInquiry[];

  const updateStatus = async (id: string, status: string) => {
    try {
      await axiosInstance.patch(`/api/admin/investors/${id}/status`, { status });
      refetch();
      toast.success("Status updated");
    } catch {
      toast.error("Failed to update status");
    }
  };

  const deleteInquiry = async (id: string) => {
    try {
      await axiosInstance.delete(`/api/admin/investors/${id}`);
      toast.success("Inquiry removed");
      refetch();
    } catch {
      toast.error("Failed to delete inquiry");
    }
  };

  const filtered = useMemo(() => {
    const q = searchTerm.toLowerCase();
    return inquiries.filter(
      (i) =>
        i.name.toLowerCase().includes(q) ||
        i.email.toLowerCase().includes(q) ||
        (i.company || "").toLowerCase().includes(q)
    );
  }, [inquiries, searchTerm]);

  const pendingCount = inquiries.filter((i) =>
    ["pending", "new", "submitted"].includes(String(i.status).toLowerCase())
  ).length;

  return (
    <DashboardPageContainer width="default" className={workspaceUi.page}>
      <DashboardGreetingBar
        greeting="Investor inquiries"
        subtitle="Partnership and funding requests from the public investors page."
      />

      <DashboardFrostedStatGrid columns={3}>
        <DashboardFrostedStatCard
          icon={Briefcase}
          label="Total inquiries"
          value={isLoading ? "—" : inquiries.length}
          isLoading={isLoading}
        />
        <DashboardFrostedStatCard
          icon={Clock}
          label="Needs review"
          value={isLoading ? "—" : pendingCount}
          tone={pendingCount > 0 ? "warning" : "neutral"}
          isLoading={isLoading}
        />
        <DashboardFrostedStatCard
          icon={CheckCircle}
          label="Contacted"
          value={
            isLoading
              ? "—"
              : inquiries.filter((i) => i.status === "contacted").length
          }
          tone="success"
          isLoading={isLoading}
        />
      </DashboardFrostedStatGrid>

      <div className="relative max-w-md">
        <Input
          placeholder="Search by name, email, or company…"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="h-10 rounded-full bg-muted/30 border-border/60"
        />
      </div>

      <DashboardPanelCard title="All inquiries" icon={Briefcase} padding={false} contentClassName="p-0">
        <DashboardDataCard variant="base" className="border-0 shadow-none rounded-none">
          <Table>
            <TableHeader>
              <DashboardTableHeaderRow>
                <DashboardTableHead position="first" className="!pl-6">
                  Contact
                </DashboardTableHead>
                <DashboardTableHead>Company & range</DashboardTableHead>
                <DashboardTableHead>Submitted</DashboardTableHead>
                <DashboardTableHead>Status</DashboardTableHead>
                <DashboardTableHead position="last" className="!pr-6 text-right">
                  Actions
                </DashboardTableHead>
              </DashboardTableHeaderRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                Array.from({ length: 4 }).map((_, i) => (
                  <TableRow key={i}>
                    <TableCell colSpan={5} className="py-6">
                      <Skeleton className="h-10 w-full rounded-lg" />
                    </TableCell>
                  </TableRow>
                ))
              ) : filtered.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="h-40 text-center text-sm text-muted-foreground">
                    No investor inquiries match your search.
                  </TableCell>
                </TableRow>
              ) : (
                filtered.map((inquiry) => (
                  <TableRow key={inquiry.id} className="hover:bg-muted/30 border-border/40">
                    <TableCell className="pl-6 py-4">
                      <p className="text-sm font-medium text-foreground">{inquiry.name}</p>
                      <p className="text-xs text-muted-foreground flex items-center gap-1 mt-0.5">
                        <Mail className="h-3 w-3" />
                        {inquiry.email}
                      </p>
                    </TableCell>
                    <TableCell className="py-4">
                      <p className="text-sm flex items-center gap-1">
                        <Building2 className="h-3.5 w-3.5 text-muted-foreground" />
                        {inquiry.company || "—"}
                      </p>
                      <p className="text-xs text-primary mt-0.5 flex items-center gap-1">
                        <DollarSign className="h-3 w-3" />
                        {inquiry.investment_range || "Not specified"}
                      </p>
                    </TableCell>
                    <TableCell className="py-4 text-sm text-muted-foreground">
                      {new Date(inquiry.created_at).toLocaleDateString(undefined, {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })}
                    </TableCell>
                    <TableCell className="py-4">
                      <DashboardStatusBadge status={inquiry.status} />
                    </TableCell>
                    <TableCell className="pr-6 py-4 text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-9 w-9 rounded-full">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="rounded-xl">
                          <DropdownMenuItem onClick={() => updateStatus(inquiry.id, "reviewed")}>
                            <Clock className="h-4 w-4 mr-2" />
                            Mark reviewed
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => updateStatus(inquiry.id, "contacted")}>
                            <CheckCircle className="h-4 w-4 mr-2" />
                            Mark contacted
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => updateStatus(inquiry.id, "rejected")}
                            className="text-destructive focus:text-destructive"
                          >
                            <XCircle className="h-4 w-4 mr-2" />
                            Reject
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => setDeleteTarget(inquiry)}
                            className="text-destructive focus:text-destructive"
                          >
                            <XCircle className="h-4 w-4 mr-2" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </DashboardDataCard>
      </DashboardPanelCard>

      {!isLoading && filtered.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filtered.slice(0, 4).map((inquiry) => (
            <article
              key={`card-${inquiry.id}`}
              className={cn(workspaceUi.frosted.inset, "p-5 space-y-3")}
            >
              <div className="flex items-start justify-between gap-2">
                <div>
                  <p className="font-semibold text-foreground">{inquiry.name}</p>
                  <p className="text-xs text-muted-foreground">{inquiry.email}</p>
                </div>
                <DashboardStatusBadge status={inquiry.status} />
              </div>
              <p className="text-sm text-muted-foreground line-clamp-3">{inquiry.message}</p>
            </article>
          ))}
        </div>
      )}

      <ConfirmDeleteDialog
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={async () => {
          if (deleteTarget) await deleteInquiry(deleteTarget.id);
          setDeleteTarget(null);
        }}
        title="Delete this inquiry?"
        description={`Remove the inquiry from ${deleteTarget?.name ?? "this contact"} permanently.`}
      />
    </DashboardPageContainer>
  );
}

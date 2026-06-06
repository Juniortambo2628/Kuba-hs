"use client";

import { DashboardPageContainer } from "@/components/shared/DashboardPageContainer";

import { useState } from "react";
import { useApiData } from "@/hooks/useApiData";
import { extractApiList } from "@/lib/api-response";
import {
  DashboardDataCard,
  DashboardTableHead,
  DashboardTableHeaderRow,
} from "@/components/shared/DashboardTable";
import { Table, TableBody, TableCell, TableHeader, TableRow } from "@/components/ui/table";
import { 
  FileText, 
  Download, 
  Users, 
  Briefcase, 
  DollarSign, 
  Loader2,
  CheckCircle2
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { toast } from "sonner";
import { DashboardPageHeader } from "@/components/shared/DashboardPageHeader";
import { AppPill } from "@/components/shared/ui";
import axiosInstance from "@/lib/axios";

const REPORT_TYPES = [
  {
    id: "bookings",
    name: "Bookings Report",
    description: "Detailed export of all service requests, schedules, and fulfillment statuses.",
    icon: Briefcase,
    color: "text-blue-500",
    bgColor: "bg-blue-50"
  },
  {
    id: "users",
    name: "User Directory",
    description: "Full export of platform participants including roles, activity status, and join dates.",
    icon: Users,
    color: "text-purple-500",
    bgColor: "bg-purple-50"
  },
  {
    id: "revenue",
    name: "Financial Revenue",
    description: "Comprehensive financial report including transaction IDs, platform fees, and net payouts.",
    icon: DollarSign,
    color: "text-emerald-500",
    bgColor: "bg-emerald-50"
  }
];

interface ExportLogRow {
  id: string;
  report_type: string;
  ip_address?: string;
  created_at: string;
  user?: { first_name?: string; last_name?: string; email?: string };
}

export default function AdminReportsPage() {
  const [downloading, setDownloading] = useState<string | null>(null);
  const { data: historyEnvelope, isLoading: historyLoading, refetch: refetchHistory } = useApiData<unknown>(
    "/api/admin/reports/history",
    { preserveEnvelope: true, initialData: null }
  );
  const exportHistory = extractApiList<ExportLogRow>(historyEnvelope);

  const handleDownload = async (type: string) => {
    setDownloading(type);
    try {
      const response = await axiosInstance.get(`/api/admin/reports/generate`, {
        params: { type },
        responseType: 'blob'
      });
      
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `kuba_${type}_report_${new Date().toISOString().split('T')[0]}.csv`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      
      toast.success(`${type.charAt(0).toUpperCase() + type.slice(1)} report downloaded.`);
      refetchHistory();
    } catch (error) {
      console.error("Export failed", error);
      toast.error("Failed to generate report.");
    } finally {
      setDownloading(null);
    }
  };

  return (
    <DashboardPageContainer className="space-y-10">
      {/* Standard Dashboard Header */}
      <DashboardPageHeader 
        title="Intelligence & Data Analytics" 
        subtitle="Export high-fidelity system datasets for executive auditing and business growth analysis."
      />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {REPORT_TYPES.map((report) => (
          <Card key={report.id} className="border border-border relative overflow-hidden group hover:shadow-xl transition-all duration-500">
            <CardHeader className="p-6">
              <div className={`w-12 h-12 rounded-2xl ${report.bgColor} ${report.color} flex items-center justify-center mb-4 transition-transform group-hover:scale-110 duration-500`}>
                <report.icon className="w-6 h-6" />
              </div>
              <CardTitle className="text-lg font-bold text-foreground mb-1">{report.name}</CardTitle>
              <CardDescription className="text-xs leading-relaxed font-bold text-muted-foreground/80">
                {report.description}
              </CardDescription>
            </CardHeader>
            <CardContent className="p-6 pt-0">
              <Button 
                onClick={() => handleDownload(report.id)}
                disabled={downloading === report.id}
                className="w-full h-12 bg-primary hover:bg-black text-white rounded-xl font-bold text-xs transition-all gap-2 shadow-lg shadow-primary/10"
              >
                {downloading === report.id ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Download className="w-4 h-4" />
                )}
                <span>Initialize CSV Export</span>
              </Button>
            </CardContent>
            
            {/* Decorative element */}
            <div className="absolute -right-4 -bottom-4 opacity-5 group-hover:opacity-10 transition-opacity">
              <report.icon className="w-24 h-24 rotate-12" />
            </div>
          </Card>
        ))}
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-bold text-foreground tracking-tight flex items-center gap-2">
            <FileText className="w-5 h-5 text-primary" />
            Export audit log
          </h3>
          <AppPill variant="accent" className="!bg-emerald-50 !text-emerald-600 !border-emerald-100">
            <CheckCircle2 className="w-4 h-4" />
            Live governance trail
          </AppPill>
        </div>
        <p className="text-xs text-muted-foreground max-w-2xl">
          Each CSV export is recorded with admin user, report type, IP address, and timestamp.
        </p>
        <DashboardDataCard>
          <Table>
            <TableHeader>
              <DashboardTableHeaderRow>
                <DashboardTableHead position="first">When</DashboardTableHead>
                <DashboardTableHead>Admin</DashboardTableHead>
                <DashboardTableHead>Report</DashboardTableHead>
                <DashboardTableHead position="last">IP</DashboardTableHead>
              </DashboardTableHeaderRow>
            </TableHeader>
            <TableBody>
              {historyLoading ? (
                <TableRow>
                  <TableCell colSpan={4} className="py-12 text-center">
                    <Loader2 className="w-6 h-6 animate-spin mx-auto text-muted-foreground" />
                  </TableCell>
                </TableRow>
              ) : exportHistory.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={4} className="py-12 text-center text-sm text-muted-foreground">
                    No exports logged yet. Run an export above to create the first entry.
                  </TableCell>
                </TableRow>
              ) : (
                exportHistory.map((row) => (
                  <TableRow key={row.id}>
                    <TableCell className="text-xs text-muted-foreground">
                      {new Date(row.created_at).toLocaleString()}
                    </TableCell>
                    <TableCell className="text-sm font-medium">
                      {row.user
                        ? `${row.user.first_name ?? ""} ${row.user.last_name ?? ""}`.trim() || row.user.email
                        : "—"}
                    </TableCell>
                    <TableCell className="capitalize text-sm">{row.report_type}</TableCell>
                    <TableCell className="text-xs font-mono text-muted-foreground">
                      {row.ip_address ?? "—"}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </DashboardDataCard>
      </div>
    </DashboardPageContainer>
  );
}

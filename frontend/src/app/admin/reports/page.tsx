"use client";

import { useState } from "react";
import { 
  FileText, 
  Download, 
  Users, 
  Briefcase, 
  DollarSign, 
  Loader2,
  Calendar,
  AlertCircle,
  CheckCircle2
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { toast } from "sonner";
import { DashboardPageHeader } from "@/components/shared/DashboardPageHeader";
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

export default function AdminReportsPage() {
  const [downloading, setDownloading] = useState<string | null>(null);

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
    } catch (error) {
      console.error("Export failed", error);
      toast.error("Failed to generate report.");
    } finally {
      setDownloading(null);
    }
  };

  return (
    <div className="max-w-[1400px] mx-auto space-y-10 pb-12">
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

      {/* Audit Log / History placeholder */}
      <Card className="border border-dashed border-border/60 bg-muted/20 rounded-[2.5rem]">
        <CardContent className="p-12 flex flex-col items-center text-center space-y-5">
          <div className="w-20 h-20 rounded-[2rem] bg-white flex items-center justify-center text-muted-foreground/40 border border-border shadow-inner">
            <AlertCircle className="w-10 h-10 opacity-30" />
          </div>
          <div className="max-w-md space-y-2">
            <h3 className="text-lg font-bold text-foreground tracking-tight">Export Governance & Security</h3>
            <p className="text-[11px] font-bold text-muted-foreground leading-relaxed">
              All high-fidelity data exports are strictly logged for enterprise security auditing. Handle downloaded datasets in accordance with institutional data privacy protocols and platform governance.
            </p>
          </div>
          <div className="flex items-center gap-2 text-[10px] font-bold text-emerald-600 bg-emerald-50 px-4 py-1.5 rounded-xl border border-emerald-100 shadow-sm">
            <CheckCircle2 className="w-4 h-4" />
            Governance System Audited
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

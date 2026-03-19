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
      const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
      const downloadUrl = `${baseUrl}/api/admin/reports/generate?type=${type}`;
      
      // We use window.open for CSV downloads as they trigger browser download behavior
      window.open(downloadUrl, '_blank');
      
      toast.success(`${type.charAt(0).toUpperCase() + type.slice(1)} report requested.`);
    } catch (error) {
      console.error("Export failed", error);
      toast.error("Failed to generate report.");
    } finally {
      setTimeout(() => setDownloading(null), 2000);
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-10 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground tracking-tight uppercase">Intelligence & Reports</h1>
          <p className="text-sm text-muted-foreground mt-1">Export system datasets for auditing and business analysis.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {REPORT_TYPES.map((report) => (
          <Card key={report.id} className="border border-border relative overflow-hidden group hover:shadow-xl transition-all duration-500">
            <CardHeader className="p-6">
              <div className={`w-12 h-12 rounded-2xl ${report.bgColor} ${report.color} flex items-center justify-center mb-4 transition-transform group-hover:scale-110 duration-500`}>
                <report.icon className="w-6 h-6" />
              </div>
              <CardTitle className="text-lg font-bold text-foreground mb-1">{report.name}</CardTitle>
              <CardDescription className="text-xs leading-relaxed font-medium">
                {report.description}
              </CardDescription>
            </CardHeader>
            <CardContent className="p-6 pt-0">
              <Button 
                onClick={() => handleDownload(report.id)}
                disabled={downloading === report.id}
                className="w-full h-11 bg-foreground text-background hover:bg-muted hover:text-foreground rounded-xl font-bold text-[10px] tracking-widest uppercase transition-all gap-2"
              >
                {downloading === report.id ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Download className="w-4 h-4" />
                )}
                <span>Generate CSV</span>
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
      <Card className="border border-dashed border-border bg-muted/30">
        <CardContent className="p-10 flex flex-col items-center text-center space-y-4">
          <div className="w-16 h-16 rounded-full bg-background flex items-center justify-center text-muted-foreground border border-border">
            <AlertCircle className="w-8 h-8 opacity-20" />
          </div>
          <div className="max-w-xs space-y-2">
            <h3 className="text-sm font-semibold text-foreground uppercase tracking-tight">Export Security</h3>
            <p className="text-[10px] font-bold text-muted-foreground uppercase leading-relaxed">
              All data exports are logged for security auditing. Ensure you handle downloaded datasets according to platform data privacy policies.
            </p>
          </div>
          <div className="flex items-center gap-2 text-[9px] font-bold text-emerald-500 bg-emerald-50 px-3 py-1 rounded-full uppercase tracking-wider">
            <CheckCircle2 className="w-3.5 h-3.5" />
            System Audited
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

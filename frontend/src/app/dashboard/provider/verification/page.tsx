"use client";

import { useEffect, useState } from "react";
import axiosInstance from "@/lib/axios";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  ShieldCheck, 
  Upload, 
  FileText, 
  CheckCircle2, 
  XCircle, 
  Clock,
  AlertCircle,
  Loader2
} from "lucide-react";
import { toast } from "sonner";

export default function ProviderVerification() {
  const [documents, setDocuments] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isUploading, setIsUploading] = useState(false);
  const [selectedType, setSelectedType] = useState("id_card");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  useEffect(() => {
    fetchDocuments();
  }, []);

  const fetchDocuments = async () => {
    try {
      const res = await axiosInstance.get("/api/provider/verification");
      setDocuments(res.data);
    } catch (err) {
      toast.error("Failed to load verification status");
    } finally {
      setIsLoading(false);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      toast.error("File is too large (max 5MB)");
      return;
    }

    setSelectedFile(file);
    if (file.type.startsWith('image/')) {
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
    } else {
      setPreviewUrl(null); // Clear image preview for PDFs
    }
  };

  const clearSelection = () => {
    setSelectedFile(null);
    setPreviewUrl(null);
    const input = document.getElementById('doc-upload') as HTMLInputElement;
    if (input) input.value = '';
  };

  const handleUpload = async () => {
    if (!selectedFile) return;

    const formData = new FormData();
    formData.append("file", selectedFile);
    formData.append("document_type", selectedType);

    setIsUploading(true);
    try {
      await axiosInstance.post("/api/provider/verification", formData, {
        headers: { "Content-Type": "multipart/form-data" }
      });
      toast.success("Document submitted successfully");
      clearSelection();
      fetchDocuments();
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Upload failed. Please try again.");
    } finally {
      setIsUploading(false);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'approved': return <CheckCircle2 className="w-5 h-5 text-emerald-500" />;
      case 'rejected': return <XCircle className="w-5 h-5 text-red-500" />;
      case 'pending': return <Clock className="w-5 h-5 text-amber-500" />;
      default: return <AlertCircle className="w-5 h-5 text-muted-foreground" />;
    }
  };

  if (isLoading) {
    return <div className="flex items-center justify-center h-64"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>;
  }

  const idDoc = documents.find(d => d.document_type === 'id_card');
  const licenseDoc = documents.find(d => d.document_type === 'business_license');

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-12">
      <div className="px-2">
        <h1 className="text-2xl font-bold text-foreground tracking-tight">Trust & Verification</h1>
        <p className="text-sm text-muted-foreground mt-1">Verify your identity and business credentials to unlock full marketplace access.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Document Requirements */}
        <Card className="border border-border bg-card/50 backdrop-blur-md shadow-sm rounded-2xl overflow-hidden">
          <CardContent className="p-6 space-y-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <h2 className="font-bold text-foreground">Verification Roadmap</h2>
            </div>
            
            <div className="space-y-4">
              <div className={`p-4 rounded-xl border flex items-center justify-between ${idDoc?.status === 'approved' ? 'bg-emerald-50/30 border-emerald-100' : 'bg-muted/30 border-border'}`}>
                <div className="flex items-center gap-3">
                  <FileText className={`w-4 h-4 ${idDoc?.status === 'approved' ? 'text-emerald-600' : 'text-muted-foreground'}`} />
                  <div>
                    <p className="text-sm font-bold text-foreground">Government ID</p>
                    <p className="text-[10px] text-muted-foreground">Passport or National ID card</p>
                  </div>
                </div>
                {idDoc ? getStatusIcon(idDoc.status) : <AlertCircle className="w-5 h-5 text-muted-foreground opacity-20" />}
              </div>

              <div className={`p-4 rounded-xl border flex items-center justify-between ${licenseDoc?.status === 'approved' ? 'bg-emerald-50/30 border-emerald-100' : 'bg-muted/30 border-border'}`}>
                <div className="flex items-center gap-3">
                  <Briefcase className={`w-4 h-4 ${licenseDoc?.status === 'approved' ? 'text-emerald-600' : 'text-muted-foreground'}`} />
                  <div>
                    <p className="text-sm font-bold text-foreground">Business License</p>
                    <p className="text-[10px] text-muted-foreground">Company registration document</p>
                  </div>
                </div>
                {licenseDoc ? getStatusIcon(licenseDoc.status) : <AlertCircle className="w-5 h-5 text-muted-foreground opacity-20" />}
              </div>
            </div>

            <div className="p-4 bg-primary/5 rounded-xl border border-primary/10">
              <p className="text-[11px] font-semibold text-primary leading-relaxed">
                Verification takes 24-48 hours. Once verified, you'll receive the "Kuba Verified" badge, significantly increasing booking conversion.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Upload Portal */}
        <Card className="border border-border bg-card shadow-sm rounded-2xl overflow-hidden">
          <CardContent className="p-6 space-y-6">
            <h2 className="font-bold text-foreground">Upload Credentials</h2>
            
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-muted-foreground tracking-wider ml-1">Document Type</label>
                <select 
                  className="w-full h-12 bg-muted/50 border border-border rounded-xl px-4 text-sm font-bold outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                  value={selectedType}
                  onChange={(e) => setSelectedType(e.target.value)}
                >
                  <option value="id_card">Government ID Card</option>
                  <option value="business_license">Business License / Permit</option>
                  <option value="certification">Professional Certification</option>
                </select>
              </div>

              <div className="relative group">
                <input 
                  type="file" 
                  className="hidden" 
                  id="doc-upload"
                  onChange={handleFileSelect}
                  disabled={isUploading}
                  accept=".pdf,.jpg,.jpeg,.png"
                />
                {!selectedFile ? (
                  <label 
                    htmlFor="doc-upload"
                    className="flex flex-col items-center justify-center w-full h-48 border-2 border-dashed border-border rounded-2xl bg-muted/20 hover:bg-muted/40 cursor-pointer transition-all hover:border-primary/50"
                  >
                    <Upload className="w-8 h-8 text-muted-foreground mb-3 group-hover:text-primary transition-all" />
                    <p className="text-sm font-bold text-foreground">Click to upload or drag & drop</p>
                    <p className="text-[10px] text-muted-foreground mt-1 uppercase font-bold tracking-widest">PDF, PNG or JPG (Max 5MB)</p>
                  </label>
                ) : (
                  <div className="relative w-full h-64 border border-border rounded-2xl bg-muted/20 overflow-hidden flex flex-col">
                    <div className="flex-1 flex items-center justify-center bg-background/50">
                      {previewUrl ? (
                        <img src={previewUrl} className="max-h-full max-w-full object-contain" alt="Preview" />
                      ) : (
                        <div className="flex flex-col items-center gap-3">
                          <FileText className="w-12 h-12 text-primary" />
                          <p className="text-sm font-bold text-foreground">{selectedFile.name}</p>
                        </div>
                      )}
                    </div>
                    <div className="p-4 bg-background border-t border-border flex items-center justify-between gap-4">
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={clearSelection}
                        disabled={isUploading}
                        className="text-[10px] font-bold uppercase tracking-widest text-red-500 hover:text-red-600 hover:bg-red-50"
                      >
                        Change File
                      </Button>
                      <Button 
                        size="sm" 
                        onClick={handleUpload}
                        disabled={isUploading}
                        className="text-[10px] font-black uppercase tracking-widest bg-primary text-white hover:bg-primary/90 min-w-32 shadow-lg shadow-primary/20"
                      >
                        {isUploading ? (
                          <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                          "Submit Document"
                        )}
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* History */}
      {documents.length > 0 && (
        <Card className="border border-border bg-card/50 backdrop-blur-sm rounded-2xl overflow-hidden">
          <CardContent className="p-6">
            <h2 className="font-bold text-foreground mb-6">Submission History</h2>
            <div className="space-y-3">
              {documents.map((doc) => (
                <div key={doc.id} className="flex items-center justify-between p-4 bg-background border border-border rounded-xl">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-lg bg-muted flex items-center justify-center text-muted-foreground overflow-hidden border border-border">
                      {doc.url?.match(/\.(jpg|jpeg|png|gif)$/i) ? (
                        <img src={doc.url} className="w-full h-full object-cover" alt="Preview" />
                      ) : (
                        <FileText className="w-5 h-5" />
                      )}
                    </div>
                    <div>
                      <p className="text-xs font-bold text-foreground capitalize">{doc.document_type.replace('_', ' ')}</p>
                      <p className="text-[10px] text-muted-foreground">Submitted on {new Date(doc.created_at).toLocaleDateString()}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <div className="flex items-center gap-1 justify-end">
                        <span className="text-[10px] font-bold uppercase tracking-widest">{doc.status}</span>
                        {getStatusIcon(doc.status)}
                      </div>
                      {doc.rejection_reason && (
                        <p className="text-[9px] text-red-500 font-bold mt-0.5">{doc.rejection_reason}</p>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

import { Briefcase } from "lucide-react";

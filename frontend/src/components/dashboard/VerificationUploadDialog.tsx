"use client";

import { useEffect, useState } from "react";
import { Upload, FileText } from "lucide-react";
import { FieldLabel } from "@/components/shared/ui";
import { CrudFormDialog } from "@/components/shared/dialog/CrudFormDialog";
import { workspaceUi } from "@/lib/dashboard-workspace-ui";
import { cn } from "@/lib/utils";
import axiosInstance, { handleApiError } from "@/lib/axios";
import { compressImageFile } from "@/lib/image-compression";
import { toast } from "sonner";

interface VerificationUploadDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

export function VerificationUploadDialog({
  open,
  onOpenChange,
  onSuccess,
}: VerificationUploadDialogProps) {
  const [selectedType, setSelectedType] = useState("id_card");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  useEffect(() => {
    if (!open) {
      setSelectedType("id_card");
      setSelectedFile(null);
      setPreviewUrl(null);
    }
  }, [open]);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      toast.error("File is too large (max 5MB)");
      return;
    }
    setSelectedFile(file);
    setPreviewUrl(file.type.startsWith("image/") ? URL.createObjectURL(file) : null);
  };

  const clearSelection = () => {
    setSelectedFile(null);
    setPreviewUrl(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedFile) {
      toast.error("Choose a file to upload");
      return;
    }
    const optimized = selectedFile.type.startsWith("image/")
      ? await compressImageFile(selectedFile, { preset: "document" })
      : selectedFile;

    const formData = new FormData();
    formData.append("file", optimized);
    formData.append("document_type", selectedType);

    setIsUploading(true);
    try {
      await axiosInstance.post("/api/provider/verification", formData);
      toast.success("Document submitted for review");
      onOpenChange(false);
      onSuccess();
    } catch (err: unknown) {
      toast.error(handleApiError(err));
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <CrudFormDialog
      open={open}
      onOpenChange={onOpenChange}
      introTitle="Upload a document"
      introDescription="Submit government ID or business license for verification. PDF, PNG, or JPG up to 5MB."
      formId="verification-upload-form"
      submitLabel="Submit for review"
      isSubmitting={isUploading}
      submitDisabled={!selectedFile}
    >
      <form id="verification-upload-form" onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <FieldLabel>Document type</FieldLabel>
          <select
            className={workspaceUi.input}
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value)}
          >
            <option value="id_card">Government ID</option>
            <option value="business_license">Business license</option>
            <option value="certification">Professional certification</option>
          </select>
        </div>

        <input
          type="file"
          className="hidden"
          id="verification-dialog-upload"
          onChange={handleFileSelect}
          disabled={isUploading}
          accept=".pdf,.jpg,.jpeg,.png"
        />

        {!selectedFile ? (
          <label
            htmlFor="verification-dialog-upload"
            className={cn(
              workspaceUi.frosted.inset,
              "flex flex-col items-center justify-center h-44 cursor-pointer hover:bg-muted/40 transition-colors"
            )}
          >
            <Upload className="h-8 w-8 text-muted-foreground mb-2" />
            <p className="text-sm font-medium text-foreground">Choose a file</p>
            <p className="text-xs text-muted-foreground mt-1">PDF, PNG or JPG · max 5MB</p>
          </label>
        ) : (
          <div className={cn(workspaceUi.frosted.inset, "overflow-hidden")}>
            <div className="flex h-40 items-center justify-center bg-muted/20">
              {previewUrl ? (
                <img src={previewUrl} alt="Preview" className="max-h-full max-w-full object-contain" />
              ) : (
                <div className="flex flex-col items-center gap-2 px-4 text-center">
                  <FileText className="h-10 w-10 text-primary" />
                  <p className="text-sm font-medium truncate max-w-full">{selectedFile.name}</p>
                </div>
              )}
            </div>
            <div className="flex gap-2 p-3 border-t border-border/30">
              <button
                type="button"
                className="flex-1 text-sm font-medium text-muted-foreground hover:text-foreground"
                onClick={clearSelection}
                disabled={isUploading}
              >
                Change file
              </button>
            </div>
          </div>
        )}
      </form>
    </CrudFormDialog>
  );
}

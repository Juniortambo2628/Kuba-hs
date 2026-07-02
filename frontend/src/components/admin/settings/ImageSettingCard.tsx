"use client";

import { useState } from "react";
import NextImage from "next/image";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import { FieldLabel } from "@/components/shared/ui";
import { FilePond, registerPlugin } from "react-filepond";
import "filepond/dist/filepond.min.css";
import "filepond-plugin-image-preview/dist/filepond-plugin-image-preview.css";
import FilePondPluginImagePreview from "filepond-plugin-image-preview";
import { toast } from "sonner";
import { dashboardUi } from "@/lib/dashboard-ui";
import { Image as ImageIcon, Plus, Trash2, X } from "lucide-react";
import type { Setting } from "./types";

registerPlugin(FilePondPluginImagePreview);

interface ImageSettingCardProps {
  setting: Setting;
  pendingFile?: File;
  onSetFile: (file: File) => void;
  onRemove: () => void;
  getMediaUrl: (url: string) => string;
}

export function ImageSettingCard({
  setting,
  pendingFile,
  onSetFile,
  onRemove,
  getMediaUrl,
}: ImageSettingCardProps) {
  const [isOpen, setIsOpen] = useState(false);
  const currentUrl = pendingFile ? URL.createObjectURL(pendingFile) : setting.image_url ? getMediaUrl(setting.image_url) : null;

  return (
    <Card className="border border-border/40 bg-white dark:bg-zinc-900 rounded-2xl shadow-sm overflow-hidden group/media-card hover:border-primary/20 transition-all flex flex-col">
      <div className="p-4 border-b border-border/10 bg-muted/5 flex items-center justify-between">
        <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground truncate max-w-[80%]">
          {setting.label || setting.key.replace(/_/g, " ")}
        </span>
        <ImageIcon className="w-3.5 h-3.5 text-muted-foreground/40" />
      </div>

      <div className="relative aspect-video group/asset overflow-hidden bg-muted/5">
        {currentUrl ? (
          <NextImage src={currentUrl} alt={setting.label} fill unoptimized className="object-cover transition-transform duration-700 group-hover/media-card:scale-105" />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center gap-2 text-muted-foreground/30">
            <Plus className="w-8 h-8" />
            <span className="text-[10px] font-bold uppercase tracking-widest">No Visual Set</span>
          </div>
        )}

        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover/asset:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-[2px]">
          <ImageManagementDialog
            setting={setting}
            pendingFile={pendingFile}
            onSetFile={onSetFile}
            onRemove={onRemove}
            getMediaUrl={getMediaUrl}
            isOpen={isOpen}
            onOpenChange={setIsOpen}
          />
        </div>
      </div>

      {pendingFile && (
        <div className="p-2 px-4 bg-primary/10 border-t border-primary/10 flex items-center justify-between">
          <span className="text-[9px] font-black text-primary uppercase tracking-widest italic">Pending Upload</span>
          <div className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
        </div>
      )}
    </Card>
  );
}

function ImageManagementDialog({
  setting,
  pendingFile,
  onSetFile,
  onRemove,
  getMediaUrl,
  isOpen,
  onOpenChange,
}: {
  setting: Setting;
  pendingFile?: File;
  onSetFile: (file: File) => void;
  onRemove: () => void;
  getMediaUrl: (url: string) => string;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const savedUrl = setting.image_url ? getMediaUrl(setting.image_url) : null;
  const previewUrl = pendingFile ? URL.createObjectURL(pendingFile) : null;

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>
        <Button size="sm" className="bg-white text-black hover:bg-white/90 rounded-full font-bold text-[10px] tracking-widest px-6 h-10 shadow-xl">
          MANAGE ASSET
        </Button>
      </DialogTrigger>
      <DialogContent className={dashboardUi.dialog.content}>
        <DialogHeader className={dashboardUi.dialog.header}>
          <div className="flex items-center gap-3 mb-2">
            <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
              <ImageIcon className="w-4 h-4" />
            </div>
            <DialogTitle className="text-xl font-black uppercase tracking-tight">Manage Asset</DialogTitle>
          </div>
          <DialogDescription className="text-xs font-medium text-muted-foreground uppercase tracking-widest">
            {setting.group.replace(/_/g, " ")} / {setting.label || setting.key}
          </DialogDescription>
        </DialogHeader>

        <div className={dashboardUi.dialog.body}>
          <div className="grid grid-cols-1 gap-6">
            <div className="space-y-3">
              <FieldLabel>Current State</FieldLabel>
              <div className="relative aspect-video rounded-3xl overflow-hidden bg-muted border border-border/10 shadow-inner group">
                {previewUrl || savedUrl ? (
                  <NextImage src={previewUrl || savedUrl || ""} alt="Preview" fill unoptimized className="object-cover" />
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center gap-3 text-muted-foreground/30">
                    <div className="w-12 h-12 rounded-2xl bg-muted-foreground/5 flex items-center justify-center">
                      <X className="w-6 h-6" />
                    </div>
                    <span className="text-[10px] font-bold uppercase tracking-widest">No visual configured</span>
                  </div>
                )}
                {previewUrl && (
                  <div className="absolute top-4 right-4 px-3 py-1.5 bg-primary text-white text-[9px] font-black uppercase tracking-[0.2em] rounded-full shadow-lg">
                    Unsaved Change
                  </div>
                )}
              </div>
            </div>

            <div className="space-y-3">
              <FieldLabel>Update Content</FieldLabel>
              <div className="premium-dropzone">
                <FilePond
                  onupdatefiles={(fileItems) => {
                    const file = fileItems[0]?.file as File | undefined;
                    if (file) {
                      onSetFile(file);
                    }
                  }}
                  allowMultiple={false}
                  maxFiles={1}
                  labelIdle='<div class="flex flex-col items-center gap-2"><div class="w-10 h-10 rounded-full bg-primary/5 flex items-center justify-center border border-primary/10"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" class="text-primary"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg></div><div class="flex flex-col"><span class="text-foreground font-black uppercase text-[10px] tracking-widest mb-1">Upload New Asset</span><span class="text-[9px] text-muted-foreground/50 tracking-tight font-medium">Drag & Drop or <span class="text-primary">Browse Files</span></span></div></div>'
                  className="w-full"
                />
              </div>
            </div>
          </div>
        </div>

        <DialogFooter className={dashboardUi.dialog.footer}>
          {(previewUrl || savedUrl) && (
            <Button
              variant="destructive"
              size="lg"
              className="bg-red-500/10 hover:bg-red-500 text-red-500 hover:text-white border border-red-500/10 rounded-2xl text-[10px] font-black tracking-widest h-14 px-8 group/trash transition-all"
              onClick={() => {
                onRemove();
                onOpenChange(false);
              }}
            >
              <Trash2 className="w-4 h-4 mr-2 group-hover/trash:animate-bounce" />
              REMOVE ASSET
            </Button>
          )}
          <div className="flex-1" />
          <Button
            variant="outline"
            size="lg"
            className="rounded-2xl text-[10px] font-black tracking-widest h-14 px-10 border-border dark:border-white/10"
            onClick={() => onOpenChange(false)}
          >
            CANCEL
          </Button>
          <Button
            size="lg"
            className="bg-primary hover:bg-primary/90 text-white rounded-2xl text-[10px] font-black tracking-widest h-14 px-12 shadow-xl shadow-primary/20"
            onClick={() => {
              toast.info("Asset staged! Click 'Save Configuration' at the top to apply changes.", { duration: 4000 });
              onOpenChange(false);
            }}
          >
            STAGE FOR UPLOAD
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

"use client";

import { Building2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { QuoteRequestForm } from "@/components/marketing/QuoteRequestForm";
import { cn } from "@/lib/utils";

interface CorporateQuoteRequestDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title?: string;
  description?: string;
}

export function CorporateQuoteRequestDialog({
  open,
  onOpenChange,
  title = "Request a business plan",
  description = "Tell us about your organization and we’ll design a service package with consolidated billing and dedicated support.",
}: CorporateQuoteRequestDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className={cn(
          "w-[calc(100%-1.5rem)] sm:max-w-lg p-0 gap-0 overflow-hidden",
          "rounded-[1.75rem] border border-border/60 shadow-2xl",
          "max-h-[calc(100dvh-5.75rem)] flex flex-col top-[calc((100dvh+5.75rem)/2)] translate-x-[-50%] translate-y-[-50%]"
        )}
      >
        <DialogHeader className="shrink-0 px-6 pt-6 pb-4 text-left space-y-2 border-b border-border/40 bg-muted/20">
          <div className="flex items-start gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <Building2 className="h-5 w-5" />
            </div>
            <div className="min-w-0 space-y-1">
              <DialogTitle className="text-xl font-bold tracking-tight pr-6">{title}</DialogTitle>
              <DialogDescription className="text-sm text-muted-foreground leading-relaxed">
                {description}
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="flex-1 min-h-0 overflow-y-auto overscroll-contain px-6 py-5 kuba-scroll">
          <QuoteRequestForm
            compact
            source="landing_corporate"
            submitLabel="Submit request"
            onSuccess={() => onOpenChange(false)}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
}

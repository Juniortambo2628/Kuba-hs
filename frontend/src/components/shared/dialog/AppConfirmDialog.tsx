"use client";

import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { crudDialogUi } from "@/lib/crud-dialog-ui";
import { cn } from "@/lib/utils";
import type { LucideIcon } from "lucide-react";
import type { ReactNode } from "react";

interface AppConfirmDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description?: ReactNode;
  introDescription?: string;
  icon?: LucideIcon;
  confirmLabel?: string;
  cancelLabel?: string;
  onConfirm: () => void;
  isLoading?: boolean;
  variant?: "primary" | "destructive";
}

/** Confirmation alerts aligned with CrudFormDialog split layout */
export function AppConfirmDialog({
  open,
  onOpenChange,
  title,
  description,
  introDescription,
  icon: Icon,
  confirmLabel = "Confirm",
  cancelLabel = "Cancel",
  onConfirm,
  isLoading = false,
  variant = "primary",
}: AppConfirmDialogProps) {
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent
        className={cn(
          crudDialogUi.content,
          "max-w-lg p-0 gap-0 [&>button.absolute]:hidden"
        )}
      >
        <AlertDialogTitle className="sr-only">{title}</AlertDialogTitle>
        <AlertDialogDescription className="sr-only">
          {typeof description === "string" ? description : introDescription ?? title}
        </AlertDialogDescription>

        <div className={cn(crudDialogUi.layout, "min-h-0 max-h-none")}>
          <aside className={cn(crudDialogUi.intro, "md:w-[42%]")}>
            {Icon && (
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary mb-4">
                <Icon className="h-5 w-5" />
              </div>
            )}
            <h2 className={crudDialogUi.introTitle}>{title}</h2>
            {introDescription && (
              <p className={crudDialogUi.introDesc}>{introDescription}</p>
            )}
          </aside>

          <div className={cn(crudDialogUi.main, "min-h-[auto]")}>
            {description && (
              <div className={cn(crudDialogUi.formWrap, "py-6")}>
                <div className={crudDialogUi.formCard}>
                  <div className="text-sm text-muted-foreground leading-relaxed">
                    {description}
                  </div>
                </div>
              </div>
            )}
            <footer className={crudDialogUi.footer}>
              <Button
                type="button"
                variant="outline"
                className={crudDialogUi.cancelBtn}
                onClick={() => onOpenChange(false)}
                disabled={isLoading}
              >
                {cancelLabel}
              </Button>
              <Button
                type="button"
                className={cn(
                  crudDialogUi.submitBtn,
                  variant === "destructive" &&
                    "bg-destructive hover:bg-destructive/90 text-destructive-foreground"
                )}
                onClick={onConfirm}
                disabled={isLoading}
              >
                {confirmLabel}
              </Button>
            </footer>
          </div>
        </div>
      </AlertDialogContent>
    </AlertDialog>
  );
}

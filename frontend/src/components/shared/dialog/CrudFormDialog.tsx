"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { crudDialogUi } from "@/lib/crud-dialog-ui";
import { cn } from "@/lib/utils";

interface CrudFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  introTitle: string;
  introDescription?: string;
  introFooter?: React.ReactNode;
  children: React.ReactNode;
  submitLabel?: string;
  cancelLabel?: string;
  onSubmit?: () => void;
  formId?: string;
  isSubmitting?: boolean;
  submitDisabled?: boolean;
  hideFooter?: boolean;
  className?: string;
}

export function CrudFormDialog({
  open,
  onOpenChange,
  introTitle,
  introDescription,
  introFooter,
  children,
  submitLabel = "Save",
  cancelLabel = "Cancel",
  onSubmit,
  formId,
  isSubmitting = false,
  submitDisabled = false,
  hideFooter = false,
  className,
}: CrudFormDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className={cn(crudDialogUi.content, "[&>button.absolute]:hidden", className)}>
        <DialogTitle className="sr-only">{introTitle}</DialogTitle>
        <DialogDescription className="sr-only">{introDescription ?? introTitle}</DialogDescription>

        <div className={crudDialogUi.layout}>
          <aside className={crudDialogUi.intro}>
            <div>
              <h2 className={crudDialogUi.introTitle}>{introTitle}</h2>
              {introDescription && (
                <p className={crudDialogUi.introDesc}>{introDescription}</p>
              )}
            </div>
            {introFooter}
          </aside>

          <div className={crudDialogUi.main}>
            <div className={crudDialogUi.formWrap}>
              <div className={crudDialogUi.formCard}>{children}</div>
            </div>

            {!hideFooter && (
              <footer className={crudDialogUi.footer}>
                <Button
                  type="button"
                  variant="outline"
                  className={crudDialogUi.cancelBtn}
                  onClick={() => onOpenChange(false)}
                  disabled={isSubmitting}
                >
                  {cancelLabel}
                </Button>
                <Button
                  type={formId ? "submit" : "button"}
                  form={formId}
                  className={crudDialogUi.submitBtn}
                  onClick={formId ? undefined : onSubmit}
                  disabled={isSubmitting || submitDisabled}
                >
                  {isSubmitting ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    submitLabel
                  )}
                </Button>
              </footer>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

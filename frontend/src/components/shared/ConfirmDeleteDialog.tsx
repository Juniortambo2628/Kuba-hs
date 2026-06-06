import React from "react";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  DashboardAlertCancel,
  DashboardAlertAction,
} from "@/components/shared/DashboardAlertActions";

interface ConfirmDeleteDialogProps {
  trigger?: React.ReactNode;
  isOpen?: boolean;
  onClose?: () => void;
  title: string;
  description: React.ReactNode;
  onConfirm: () => void;
  confirmLabel?: string;
  cancelLabel?: string;
  destructive?: boolean;
}

/**
 * A reusable confirmation dialog for delete/destructive actions.
 * Consolidates the standard AlertDialog boilerplate used across admin pages.
 */
export function ConfirmDeleteDialog({
  trigger,
  isOpen,
  onClose,
  title,
  description,
  onConfirm,
  confirmLabel = "Confirm Deletion",
  cancelLabel = "Cancel",
  destructive = true,
}: ConfirmDeleteDialogProps) {
  const handleOpenChange = (open: boolean) => {
    if (!open && onClose) {
      onClose();
    }
  };

  return (
    <AlertDialog open={isOpen} onOpenChange={handleOpenChange}>
      {trigger && (
        <AlertDialogTrigger asChild>
          {trigger}
        </AlertDialogTrigger>
      )}
      <AlertDialogContent className="rounded-[2rem] border-border shadow-2xl backdrop-blur-xl">
        <AlertDialogHeader>
          <AlertDialogTitle className="text-xl font-bold tracking-tight">{title}</AlertDialogTitle>
          <AlertDialogDescription className="text-muted-foreground font-medium leading-relaxed">
            {description}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className="mt-6 flex gap-2">
          <DashboardAlertCancel>{cancelLabel}</DashboardAlertCancel>
          <DashboardAlertAction
            onClick={onConfirm}
            variant={destructive ? "destructive" : "primary"}
            className={!destructive ? "shadow-lg shadow-primary/20" : "shadow-lg shadow-red-600/20"}
          >
            {confirmLabel}
          </DashboardAlertAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

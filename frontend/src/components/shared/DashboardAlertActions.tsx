"use client";

import {
  AlertDialogAction,
  AlertDialogCancel,
} from "@/components/ui/alert-dialog";
import { crudDialogUi } from "@/lib/crud-dialog-ui";
import { cn } from "@/lib/utils";
import type { ComponentProps } from "react";

export function DashboardAlertCancel({
  className,
  ...props
}: ComponentProps<typeof AlertDialogCancel>) {
  return (
    <AlertDialogCancel className={cn(crudDialogUi.cancelBtn, className)} {...props} />
  );
}

export function DashboardAlertAction({
  className,
  variant = "primary",
  ...props
}: ComponentProps<typeof AlertDialogAction> & {
  variant?: "primary" | "destructive";
}) {
  return (
    <AlertDialogAction
      className={cn(
        crudDialogUi.submitBtn,
        variant === "destructive" &&
          "bg-destructive hover:bg-destructive/90 text-destructive-foreground",
        className
      )}
      {...props}
    />
  );
}

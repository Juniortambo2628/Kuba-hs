"use client";

import { ReactNode } from "react";
import { motion } from "framer-motion";
import { LucideIcon, ClipboardList, Search } from "lucide-react";
import Link from "next/link";
import { Card } from "@/components/ui/card";
import { uiPrimitives } from "@/lib/ui-primitives";
import { cn } from "@/lib/utils";
import { AppButton } from "@/components/shared/ui/AppButton";

export type EmptyStateVariant = "dashboard" | "marketing" | "premium";

interface EmptyStateProps {
  variant?: EmptyStateVariant;
  icon?: LucideIcon;
  title: string;
  description?: string;
  children?: ReactNode;
  className?: string;
  actionLabel?: string;
  actionHref?: string;
  onAction?: () => void;
}

export function EmptyState({
  variant = "dashboard",
  icon,
  title,
  description,
  children,
  className,
  actionLabel,
  actionHref,
  onAction,
}: EmptyStateProps) {
  const Icon =
    icon ?? (variant === "marketing" ? Search : variant === "premium" ? ClipboardList : ClipboardList);

  if (variant === "dashboard") {
    return (
      <Card className={cn(uiPrimitives.empty.dashboard, className)}>
        <div className={uiPrimitives.empty.dashboardIcon}>
          <Icon className="w-8 h-8 opacity-50" />
        </div>
        <div className="space-y-2">
          <p className={uiPrimitives.empty.dashboardTitle}>{title}</p>
          {description && <p className={uiPrimitives.empty.dashboardDescription}>{description}</p>}
        </div>
        {children}
      </Card>
    );
  }

  if (variant === "premium") {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className={cn(
          "flex flex-col items-center justify-center py-20 px-6 text-center max-w-lg mx-auto",
          className
        )}
      >
        <div className="relative mb-8">
          <div className="absolute inset-0 bg-primary/10 blur-[50px] rounded-full animate-pulse" />
          <div className={uiPrimitives.empty.premiumIcon}>
            <Icon className="w-10 h-10 text-primary" />
          </div>
        </div>
        <h3 className={uiPrimitives.empty.premiumTitle}>{title}</h3>
        {description && <p className={uiPrimitives.empty.premiumDescription}>{description}</p>}
        {actionLabel && actionHref && (
          <Link href={actionHref}>
            <AppButton tone="primary" scale="lg">
              {actionLabel}
            </AppButton>
          </Link>
        )}
        {children}
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn(uiPrimitives.empty.marketing, className)}
    >
      <div className={uiPrimitives.empty.marketingIconWrap}>
        <Icon className="w-10 h-10 text-muted-foreground/40" />
      </div>
      <h3 className={uiPrimitives.empty.marketingTitle}>{title}</h3>
      {description && <p className={uiPrimitives.empty.marketingDescription}>{description}</p>}
      {actionLabel && (actionHref ? (
        <Link href={actionHref}>
          <AppButton tone="secondary" scale="md">
            {actionLabel}
          </AppButton>
        </Link>
      ) : onAction ? (
        <AppButton tone="secondary" scale="md" onClick={onAction}>
          {actionLabel}
        </AppButton>
      ) : null)}
      {children}
    </motion.div>
  );
}

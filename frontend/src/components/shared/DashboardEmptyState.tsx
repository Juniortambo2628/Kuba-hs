"use client";

import { EmptyState } from "@/components/shared/ui/EmptyState";
import type { ComponentProps } from "react";

type DashboardEmptyStateProps = Omit<ComponentProps<typeof EmptyState>, "variant">;

export function DashboardEmptyState(props: DashboardEmptyStateProps) {
  return <EmptyState variant="dashboard" {...props} />;
}

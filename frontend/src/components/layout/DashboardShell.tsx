"use client";

import { ReactNode } from "react";
import { SidebarProvider } from "@/components/ui/sidebar";
import { KubaSidebar } from "@/components/layout/KubaSidebar";
import { DashboardHeader } from "@/components/layout/DashboardHeader";
import { Loader2 } from "lucide-react";
import { dashboardUi } from "@/lib/dashboard-ui";
import { cn } from "@/lib/utils";

interface DashboardShellProps {
  children: ReactNode;
  /** Show admin command palette slot (rendered by parent for admin layout) */
  headerAdmin?: boolean;
  /** Extra header slot (e.g. AdminCommandPalette) */
  headerSlot?: ReactNode;
  contentClassName?: string;
  contentPadding?: "md" | "lg";
  isLoading?: boolean;
  loadingLabel?: string;
}

/**
 * Shared dashboard chrome: sidebar + sticky header + client-side route transitions (no full reload).
 */
export function DashboardShell({
  children,
  headerAdmin = false,
  headerSlot,
  contentClassName,
  contentPadding = "md",
  isLoading = false,
  loadingLabel = "Loading...",
}: DashboardShellProps) {
  if (isLoading) {
    return (
      <div className="flex h-screen w-screen items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-10 w-10 animate-spin text-primary" />
          <p className="text-xs font-medium text-muted-foreground">{loadingLabel}</p>
        </div>
      </div>
    );
  }

  return (
    <SidebarProvider>
      <KubaSidebar />
      {headerSlot}
      <main className={dashboardUi.shell.main}>
        <DashboardHeader isAdmin={headerAdmin} />
        <div
          className={cn(
            dashboardUi.shell.content,
            contentPadding === "lg" ? dashboardUi.shell.contentPaddingLg : dashboardUi.shell.contentPadding,
            contentClassName
          )}
        >
          {children}
        </div>
      </main>
    </SidebarProvider>
  );
}

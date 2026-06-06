import { ReactNode } from "react";
import { MarketingShell } from "@/components/layout/MarketingShell";
import { designSystem } from "@/lib/design-system";
import { cn } from "@/lib/utils";

interface LegalPageLayoutProps {
  title: string;
  children: ReactNode;
}

/** Shared layout for terms, privacy, and provider agreement pages. */
export function LegalPageLayout({ title, children }: LegalPageLayoutProps) {
  return (
    <MarketingShell className="min-h-screen bg-background">
      <div className={cn(designSystem.layouts.container, "max-w-4xl pt-32 pb-24")}>
        <h1 className={designSystem.typography.legal.h1}>{title}</h1>
        <div className="prose prose-blue dark:prose-invert max-w-none space-y-8">{children}</div>
      </div>
    </MarketingShell>
  );
}

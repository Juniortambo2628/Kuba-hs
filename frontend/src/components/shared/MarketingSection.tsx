import { ReactNode } from "react";
import { PageContainer } from "@/components/shared/ui/PageContainer";
import { uiPrimitives } from "@/lib/ui-primitives";
import { cn } from "@/lib/utils";

interface MarketingSectionProps {
  children: ReactNode;
  className?: string;
  id?: string;
  /** Full-bleed background with inner container (for banded sections on `contained={false}` pages). */
  band?: string;
}

/** Standard vertical section inside MarketingPage (container applied by parent unless `band`). */
export function MarketingSection({ children, className, id, band }: MarketingSectionProps) {
  if (band) {
    return (
      <section id={id} className={cn("w-full", band, className)}>
        <PageContainer section>{children}</PageContainer>
      </section>
    );
  }
  return (
    <section id={id} className={cn(uiPrimitives.layout.section, className)}>
      {children}
    </section>
  );
}

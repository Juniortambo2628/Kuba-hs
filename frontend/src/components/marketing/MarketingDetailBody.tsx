import { ReactNode } from "react";
import { PageContainer } from "@/components/shared/ui/PageContainer";
import { marketingUi } from "@/lib/marketing-ui";
import { cn } from "@/lib/utils";

interface MarketingDetailBodyProps {
  children: ReactNode;
  className?: string;
}

/** Standard content band below marketing hero on entity detail pages. */
export function MarketingDetailBody({ children, className }: MarketingDetailBodyProps) {
  return (
    <div className={cn(marketingUi.detail.body, className)}>
      <PageContainer as="main" className={marketingUi.detail.container}>
        {children}
      </PageContainer>
    </div>
  );
}

import { ReactNode } from "react";
import { PageContainer } from "@/components/shared/ui/PageContainer";
import { marketingUi } from "@/lib/marketing-ui";
import { cn } from "@/lib/utils";

interface MarketingListingBodyProps {
  children: ReactNode;
  className?: string;
}

/** Standard full-bleed listing content area below marketing hero (providers, services). */
export function MarketingListingBody({ children, className }: MarketingListingBodyProps) {
  return (
    <div className={cn(marketingUi.listing.body, className)}>
      <PageContainer>{children}</PageContainer>
    </div>
  );
}

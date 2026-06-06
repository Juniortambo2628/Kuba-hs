"use client";

import { ReactNode } from "react";
import { marketingUi } from "@/lib/marketing-ui";
import { cn } from "@/lib/utils";

interface MarketingListingToolbarProps {
  count: number;
  countLabel: string;
  children?: ReactNode;
  className?: string;
}

export function MarketingListingToolbar({
  count,
  countLabel,
  children,
  className,
}: MarketingListingToolbarProps) {
  return (
    <div className={cn(marketingUi.listing.toolbar, className)}>
      <p className={marketingUi.listing.resultsMeta}>
        {countLabel.includes("{count}") ? (
          countLabel.replace("{count}", String(count))
        ) : (
          <>
            Showing <span className="font-bold text-foreground">{count}</span> {countLabel}
          </>
        )}
      </p>
      {children && <div className="flex items-center gap-4 flex-wrap">{children}</div>}
    </div>
  );
}

"use client";

import { ReactNode } from "react";
import { SlidersHorizontal } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { marketingUi } from "@/lib/marketing-ui";
import { cn } from "@/lib/utils";

interface MarketingFilterCardProps {
  children: ReactNode;
  title?: string;
  variant?: "default" | "rounded";
  onReset?: () => void;
  showReset?: boolean;
  activeCount?: number;
  className?: string;
}

export function MarketingFilterCard({
  children,
  title = "Filter",
  variant = "default",
  onReset,
  showReset,
  activeCount = 0,
  className,
}: MarketingFilterCardProps) {
  const isRounded = variant === "rounded";

  return (
    <Card
      className={cn(
        isRounded ? marketingUi.listing.filterCardAlt : marketingUi.listing.filterCard,
        className
      )}
    >
      <CardContent
        className={cn(
          isRounded ? marketingUi.listing.filterCardContentLg : marketingUi.listing.filterCardContent
        )}
      >
        <div className="flex items-center justify-between pb-4 border-b border-border/40">
          <h3
            className="text-lg font-black text-foreground"
          >
            {title}
          </h3>
          {showReset && onReset && (
            <button
              type="button"
              onClick={onReset}
              className="text-xs font-semibold text-muted-foreground hover:text-foreground hover:underline cursor-pointer transition-colors"
            >
              Clear all filter{activeCount > 0 ? ` (${activeCount})` : ""}
            </button>
          )}
        </div>
        <div className="divide-y divide-border/40">
          {children}
        </div>
      </CardContent>
    </Card>
  );
}

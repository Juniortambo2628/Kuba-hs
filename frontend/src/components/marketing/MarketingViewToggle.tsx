"use client";

import { LayoutGrid, List, Map } from "lucide-react";
import { Button } from "@/components/ui/button";
import { marketingUi, type MarketingViewMode } from "@/lib/marketing-ui";
import { cn } from "@/lib/utils";

interface MarketingViewToggleProps {
  view: MarketingViewMode;
  onViewChange: (view: MarketingViewMode) => void;
  modes?: MarketingViewMode[];
  variant?: "default" | "pill";
  className?: string;
}

const MODE_ICONS = {
  grid: LayoutGrid,
  list: List,
  map: Map,
} as const;

export function MarketingViewToggle({
  view,
  onViewChange,
  modes = ["grid", "list"],
  variant = "default",
  className,
}: MarketingViewToggleProps) {
  const isPill = variant === "pill";

  return (
    <div
      className={cn(
        isPill ? marketingUi.listing.viewToggleAlt : marketingUi.listing.viewToggle,
        className
      )}
    >
      {modes.map((mode) => {
        const Icon = MODE_ICONS[mode];
        const active = view === mode;
        return (
          <Button
            key={mode}
            type="button"
            variant="ghost"
            size={isPill ? "sm" : "icon"}
            onClick={() => onViewChange(mode)}
            className={cn(
              isPill
                ? `rounded-xl px-4 h-9 font-bold text-[10px] tracking-widest transition-all ${
                    active ? "bg-white dark:bg-black shadow-sm text-primary" : "text-muted-foreground"
                  }`
                : `h-8 w-8 rounded-md ${active ? marketingUi.listing.viewBtnActive : marketingUi.listing.viewBtnInactive}`
            )}
            aria-label={`${mode} view`}
          >
            <Icon className={cn("w-4 h-4", isPill && "mr-2")} />
            {isPill && <span className="capitalize">{mode}</span>}
          </Button>
        );
      })}
    </div>
  );
}

"use client";

import { marketplaceUi } from "@/lib/marketplace-ui";
import { cn } from "@/lib/utils";
import type { LucideIcon } from "lucide-react";
import type { ReactNode } from "react";

export interface ListingMetaItem {
  icon?: LucideIcon;
  iconClassName?: string;
  label: ReactNode;
  key?: string;
}

interface ListingCardMetaProps {
  items: ListingMetaItem[];
  className?: string;
  size?: "default" | "lg";
}

/** Bottom meta chips for marketplace listing cards */
const metaChipSize = {
  default: {
    chip: marketplaceUi.listing.metaChip,
    icon: "w-3.5 h-3.5",
    text: "text-xs",
  },
  lg: {
    chip: "inline-flex items-center gap-2 rounded-full border border-border/60 bg-muted/50 dark:bg-white/5 px-4 py-2 text-sm font-semibold text-foreground",
    icon: "w-4 h-4",
    text: "text-sm",
  },
} as const;

export function ListingCardMeta({ items, className, size = "default" }: ListingCardMetaProps) {
  const visible = items.filter((item) => item.label != null && item.label !== "");
  if (visible.length === 0) return null;

  const tokens = metaChipSize[size];

  return (
    <div className={cn(marketplaceUi.listing.metaRow, size === "lg" && "gap-3 pt-2", className)}>
      {visible.map((item, i) => {
        const Icon = item.icon;
        return (
          <span key={item.key ?? i} className={tokens.chip}>
            {Icon && <Icon className={cn(tokens.icon, "shrink-0", item.iconClassName)} />}
            <span className={tokens.text}>{item.label}</span>
          </span>
        );
      })}
    </div>
  );
}

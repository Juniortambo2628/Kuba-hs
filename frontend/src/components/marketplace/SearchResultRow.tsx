"use client";

import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { marketplaceUi } from "@/lib/marketplace-ui";
import { cn } from "@/lib/utils";

interface SearchResultRowProps {
  title: string;
  icon: React.ReactNode;
  meta?: React.ReactNode;
  subtitle?: string;
  href?: string;
  onClick?: () => void;
  selected?: boolean;
  showChevron?: boolean;
  className?: string;
  /** Command palette style (smaller padding, selection ring) */
  variant?: "modal" | "command";
}

export function SearchResultRow({
  title,
  icon,
  meta,
  subtitle,
  href,
  onClick,
  selected,
  showChevron = true,
  className,
  variant = "modal",
}: SearchResultRowProps) {
  const isCommand = variant === "command";

  const content = (
    <div
      className={cn(
        isCommand ? marketplaceUi.search.rowSelectable : marketplaceUi.search.row,
        isCommand && selected && marketplaceUi.search.rowSelected,
        className
      )}
    >
      <div
        className={cn(
          isCommand && "w-10 h-10 rounded-lg flex items-center justify-center transition-colors shrink-0",
          isCommand &&
            (selected ? "bg-white dark:bg-sky-500/20 text-primary shadow-sm" : "bg-muted text-muted-foreground")
        )}
      >
        {icon}
      </div>
      <div className="flex-1 min-w-0">
        <h5
          className={cn(
            "font-bold truncate transition-colors",
            isCommand
              ? cn("text-sm", selected ? "text-primary" : "text-foreground")
              : "text-foreground text-base group-hover:text-primary"
          )}
        >
          {title}
        </h5>
        {meta}
        {subtitle && isCommand && (
          <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest leading-none mt-1">
            {subtitle}
          </p>
        )}
      </div>
      {showChevron && !isCommand && (
        <div className={marketplaceUi.search.chevron}>
          <ChevronRight className="w-5 h-5" />
        </div>
      )}
      {showChevron && isCommand && selected && (
        <ChevronRight className="w-4 h-4 text-primary animate-in fade-in slide-in-from-left-2 duration-300" />
      )}
    </div>
  );

  if (href) {
    return (
      <Link href={href} onClick={onClick} className="block">
        {content}
      </Link>
    );
  }

  if (onClick) {
    return (
      <button type="button" onClick={onClick} className="block w-full text-left">
        {content}
      </button>
    );
  }

  return content;
}

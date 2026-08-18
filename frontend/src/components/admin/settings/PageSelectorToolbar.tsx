"use client";

import { cn } from "@/lib/utils";

interface PageSelectorToolbarProps {
  pages: { id: string; label: string }[];
  selectedPage: string;
  onSelect: (pageId: string) => void;
  counts?: Record<string, number>;
}

export function PageSelectorToolbar({
  pages,
  selectedPage,
  onSelect,
  counts,
}: PageSelectorToolbarProps) {
  return (
    <div className="flex items-center gap-2 overflow-x-auto kuba-scroll-hidden pb-2">
      {pages.map((page) => {
        const isActive = page.id === selectedPage;
        const count = counts?.[page.id] ?? 0;
        return (
          <button
            key={page.id}
            onClick={() => onSelect(page.id)}
            className={cn(
              "flex items-center gap-2 rounded-xl px-4 py-2.5 text-xs font-bold transition-all border whitespace-nowrap shrink-0",
              isActive
                ? "bg-primary text-primary-foreground border-primary shadow-lg shadow-primary/20"
                : "bg-white dark:bg-zinc-900 text-muted-foreground border-border/40 hover:border-primary/40 hover:text-foreground"
            )}
          >
            {page.label}
            {count > 0 && (
              <span
                className={cn(
                  "px-1.5 py-0.5 rounded-md text-[10px] font-black",
                  isActive
                    ? "bg-white/20 text-white"
                    : "bg-primary/5 text-primary border border-primary/10"
                )}
              >
                {count}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}

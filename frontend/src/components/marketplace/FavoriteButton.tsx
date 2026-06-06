"use client";

import { Heart } from "lucide-react";
import { cn } from "@/lib/utils";

interface FavoriteButtonProps {
  isFavorited: boolean;
  onToggle: () => void;
  className?: string;
  /** "overlay" positions it absolutely over a card media area; "inline" for list views */
  variant?: "overlay" | "inline";
}

/**
 * Reusable heart/favorite toggle button used on both grid and list cards.
 * Handles visual state and delegates toggling to the parent via onToggle.
 */
export function FavoriteButton({
  isFavorited,
  onToggle,
  className,
  variant = "overlay",
}: FavoriteButtonProps) {
  const isOverlay = variant === "overlay";

  return (
    <button
      type="button"
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        onToggle();
      }}
      aria-label={isFavorited ? "Remove from favorites" : "Add to favorites"}
      className={cn(
        "flex items-center justify-center transition-all duration-200 cursor-pointer",
        isOverlay
          ? "absolute top-3 right-3 z-20 w-9 h-9 rounded-full bg-white/80 dark:bg-zinc-900/80 backdrop-blur-sm shadow-md hover:bg-white dark:hover:bg-zinc-800 hover:scale-110"
          : "w-10 h-10 rounded-xl border border-border/60 hover:bg-red-500/5 hover:border-red-500/30",
        isFavorited
          ? "text-red-500"
          : isOverlay
            ? "text-zinc-600 dark:text-zinc-300 hover:text-red-500"
            : "text-muted-foreground hover:text-red-500",
        className
      )}
    >
      <Heart
        className={cn(
          "w-4 h-4 transition-transform duration-200",
          isFavorited && "fill-red-500 scale-110"
        )}
      />
    </button>
  );
}

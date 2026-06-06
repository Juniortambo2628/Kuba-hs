"use client";

import { KubaBrandLogo } from "@/components/shared/KubaBrandLogo";
import { cn } from "@/lib/utils";

interface MarketingHeroLogoFallbackProps {
  className?: string;
}

/** Large theme-aware logo when a marketing hero has no background image. */
export function MarketingHeroLogoFallback({ className }: MarketingHeroLogoFallbackProps) {
  return (
    <div
      className={cn(
        "absolute inset-0 z-0 flex items-center justify-center bg-slate-100 dark:bg-zinc-950",
        className
      )}
    >
      <KubaBrandLogo
        className="h-24 w-[min(85%,28rem)] md:h-32 md:w-[min(80%,36rem)] opacity-[0.35] dark:opacity-[0.4]"
        sizes="(max-width: 768px) 400px, 576px"
        priority
      />
      <div className="absolute inset-0 bg-white/50 dark:bg-black/60 z-[1]" />
      <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent z-[2]" />
    </div>
  );
}

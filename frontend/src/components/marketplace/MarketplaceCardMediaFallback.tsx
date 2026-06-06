"use client";

import { KubaBrandLogo } from "@/components/shared/KubaBrandLogo";
import { cn } from "@/lib/utils";

interface MarketplaceCardMediaFallbackProps {
  className?: string;
  logoClassName?: string;
}

/** Theme-aware Kuba logo when a marketplace card has no configured image. */
export function MarketplaceCardMediaFallback({
  className,
  logoClassName = "h-[86%] w-[90%] max-w-none min-h-0 opacity-90",
}: MarketplaceCardMediaFallbackProps) {
  return (
    <div
      className={cn(
        "absolute inset-0 flex items-center justify-center bg-slate-50 dark:bg-zinc-900 p-[10%]",
        className
      )}
    >
      <KubaBrandLogo className={cn("relative aspect-[5/2]", logoClassName)} sizes="(max-width:768px) 280px, 400px" />
    </div>
  );
}

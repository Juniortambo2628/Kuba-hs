"use client";

import Image from "next/image";
import { getMediaUrl, cn } from "@/lib/utils";
import { KubaBrandLogo } from "@/components/shared/KubaBrandLogo";

interface ProviderCardBannerProps {
  bannerUrl?: string | null;
  businessName: string;
  className?: string;
  /** Set on above-the-fold hero banners to satisfy LCP */
  priority?: boolean;
}

export function ProviderCardBanner({
  bannerUrl,
  businessName,
  className,
  priority = false,
}: ProviderCardBannerProps) {
  const resolved = bannerUrl ? getMediaUrl(bannerUrl) : null;

  if (resolved) {
    return (
      <div className={cn("relative w-full h-full", className)}>
        <Image
          src={resolved}
          alt={`${businessName} banner`}
          fill
          sizes="(max-width: 768px) 100vw, 400px"
          priority={priority}
          loading={priority ? "eager" : "lazy"}
          className="object-cover group-hover:scale-105 transition-transform duration-700"
        />
      </div>
    );
  }

  return (
    <div
      className={cn(
        "relative w-full h-full flex items-center justify-center bg-slate-50 dark:bg-zinc-900 px-6",
        className
      )}
    >
      <KubaBrandLogo className="h-10 w-40 max-w-[70%] opacity-90" sizes="160px" />
    </div>
  );
}

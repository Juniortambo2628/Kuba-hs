"use client";

import Image from "next/image";
import { getMediaUrl, cn } from "@/lib/utils";
import { marketplaceUi } from "@/lib/marketplace-ui";
import { KubaBrandLogo } from "@/components/shared/KubaBrandLogo";

export interface ProviderSearchAvatarData {
  business_name: string;
  logo?: string | null;
  services?: { service_thumbnail_url?: string }[];
  user?: { avatar_url?: string | null };
}

interface ProviderSearchAvatarProps {
  provider: ProviderSearchAvatarData;
  size?: "md" | "sm";
  className?: string;
}

export function ProviderSearchAvatar({ provider, size = "md", className }: ProviderSearchAvatarProps) {
  const thumb = provider.services?.[0]?.service_thumbnail_url;
  const src = thumb
    ? getMediaUrl(thumb, "service")
    : provider.logo
      ? getMediaUrl(provider.logo, "avatar")
      : null;

  const boxClass = size === "sm" ? marketplaceUi.search.avatarBoxSm : marketplaceUi.search.avatarBox;

  if (src) {
    return (
      <div className={cn(boxClass, className)}>
        <Image src={src} alt={provider.business_name} fill sizes={size === "sm" ? "40px" : "56px"} className="object-cover" />
      </div>
    );
  }

  return (
    <div className={cn(boxClass, "flex items-center justify-center p-1.5", className)}>
      <KubaBrandLogo className={size === "sm" ? "h-5 w-14" : "h-6 w-16"} sizes="64px" />
    </div>
  );
}

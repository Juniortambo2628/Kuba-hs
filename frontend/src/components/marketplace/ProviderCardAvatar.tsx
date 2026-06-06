"use client";

import Image from "next/image";
import {
  resolveProviderCardImageUrl,
  type ProviderImageFields,
} from "@/lib/provider-media";
import { cn } from "@/lib/utils";

interface ProviderCardAvatarProps extends ProviderImageFields {
  businessName: string;
  size?: "lg" | "sm";
  className?: string;
}

function providerInitials(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "?";
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
}

export function ProviderCardAvatar({
  businessName,
  logo,
  banner,
  user,
  size = "lg",
  className,
}: ProviderCardAvatarProps) {
  const mediaSrc = resolveProviderCardImageUrl({ logo, banner, user });
  const isLg = size === "lg";

  if (mediaSrc) {
    return (
      <Image
        src={mediaSrc}
        alt={businessName}
        fill
        className={cn("object-cover", className)}
        sizes={isLg ? "280px" : "80px"}
      />
    );
  }

  return (
    <div
      className={cn(
        "w-full h-full flex items-center justify-center bg-primary/10 text-primary font-bold",
        isLg ? "text-3xl md:text-4xl" : "text-lg",
        className
      )}
      aria-hidden
    >
      {providerInitials(businessName)}
    </div>
  );
}

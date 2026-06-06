"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { getAvatarDisplayUrl, getInitials } from "@/lib/avatar-url";
import { cn } from "@/lib/utils";

interface DashboardUserAvatarProps {
  name?: string | null;
  avatarUrl?: string | null;
  size?: "sm" | "md" | "lg" | "xl";
  className?: string;
}

const sizeMap = {
  sm: "h-8 w-8 text-[10px]",
  md: "h-10 w-10 text-xs",
  lg: "h-16 w-16 text-sm",
  xl: "h-28 w-28 text-xl",
};

/** Personal account photo (you) — not business logo or storefront banner */
export function DashboardUserAvatar({
  name,
  avatarUrl,
  size = "md",
  className,
}: DashboardUserAvatarProps) {
  const src = getAvatarDisplayUrl(avatarUrl);

  return (
    <Avatar className={cn(sizeMap[size], "rounded-2xl border-2 border-border/60", className)}>
      {src ? <AvatarImage src={src} alt={name || "Account"} className="object-cover" /> : null}
      <AvatarFallback className="rounded-2xl bg-primary/10 text-primary font-bold">
        {getInitials(name)}
      </AvatarFallback>
    </Avatar>
  );
}

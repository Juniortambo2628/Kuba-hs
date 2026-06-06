"use client";

import { ArrowUpRight } from "lucide-react";
import { authUi } from "@/lib/auth-ui";

interface AuthSocialProofBannerProps {
  title: string;
  subtitle: string;
}

const AVATAR_COLORS = ["#0d9488", "#14b8a6", "#2dd4bf"];

export function AuthSocialProofBanner({ title, subtitle }: AuthSocialProofBannerProps) {
  return (
    <div className={authUi.socialStrip}>
      <div className="flex -space-x-2 shrink-0">
        {AVATAR_COLORS.map((bg, i) => (
          <div
            key={i}
            className="h-9 w-9 rounded-full border-2 border-card flex items-center justify-center text-[10px] font-bold text-white"
            style={{ backgroundColor: bg }}
          >
            {String.fromCharCode(65 + i)}
          </div>
        ))}
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-sm font-semibold text-foreground truncate">{title}</p>
        <p className="text-xs text-muted-foreground leading-snug line-clamp-2">{subtitle}</p>
      </div>
      <div
        className="shrink-0 h-10 w-10 rounded-full border border-border/60 flex items-center justify-center text-muted-foreground"
        aria-hidden
      >
        <ArrowUpRight className="h-4 w-4" />
      </div>
    </div>
  );
}

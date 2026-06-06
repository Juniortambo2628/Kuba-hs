"use client";

import Image from "next/image";
import { useCMS } from "@/contexts/CMSContext";
import { KUBA_LOGO_DARK, KUBA_LOGO_LIGHT } from "@/lib/branding";
import { cn } from "@/lib/utils";

interface KubaBrandLogoProps {
  className?: string;
  sizes?: string;
  priority?: boolean;
}

/** Theme-aware Kuba wordmark — light asset in light mode, dark asset in dark mode. */
export function KubaBrandLogo({ className, sizes = "192px", priority }: KubaBrandLogoProps) {
  const { getImg } = useCMS();
  const lightSrc = getImg("identity", "logo_light", KUBA_LOGO_LIGHT);
  const darkSrc = getImg("identity", "logo_dark", KUBA_LOGO_DARK);

  return (
    <>
      <div className={cn("relative dark:hidden", className)}>
        <Image src={lightSrc} alt="Kuba" fill sizes={sizes} className="object-contain" priority={priority} />
      </div>
      <div className={cn("relative hidden dark:block", className)}>
        <Image src={darkSrc} alt="Kuba" fill sizes={sizes} className="object-contain" priority={priority} />
      </div>
    </>
  );
}

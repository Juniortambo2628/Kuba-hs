"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import Image from "next/image";

function getRouteGroup(pathname: string): "public" | "auth" {
  if (pathname.startsWith("/dashboard") || pathname.startsWith("/admin")) {
    return "auth";
  }
  return "public";
}

/**
 * Shows a pulsing Kuba logo on a clean background when crossing between
 * public and authenticated route groups. Does NOT show when navigating
 * within the same group (e.g. between dashboard sub-pages).
 */
export function RouteLoader() {
  const pathname = usePathname();
  const currentGroup = getRouteGroup(pathname);
  const [prevGroup, setPrevGroup] = useState<"public" | "auth">(currentGroup);
  const [isLoading, setIsLoading] = useState(false);

  // Crossing the public/auth boundary — show loader
  if (currentGroup !== prevGroup) {
    setPrevGroup(currentGroup);
    setIsLoading(true);
  }

  useEffect(() => {
    if (!isLoading) return;

    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1200);

    return () => clearTimeout(timer);
  }, [isLoading, prevGroup]);

  if (!isLoading) return null;

  return (
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-white dark:bg-background transition-opacity duration-300"
      aria-label="Loading page"
    >
      <div className="relative w-20 h-20 sm:w-28 sm:h-28 animate-pulse">
        <Image
          src="/logos/Kuba-Header-footter-Logo-for-Light-Mode.png"
          alt="Loading..."
          fill
          className="object-contain"
          priority
        />
      </div>
    </div>
  );
}

"use client";

import { useEffect, useState } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import Image from "next/image";

/**
 * Shows a pulsing Kuba logo on a clean background during client-side route changes.
 * Works by detecting pathname/searchParams changes and showing for a brief minimum duration.
 */
export function RouteLoader() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isLoading, setIsLoading] = useState(false);
  const [prevPath, setPrevPath] = useState("");

  useEffect(() => {
    const currentKey = `${pathname}?${searchParams.toString()}`;

    // First mount — just record path, no loader
    if (!prevPath) {
      setPrevPath(currentKey);
      return;
    }

    // Same path — no loader
    if (currentKey === prevPath) return;

    // Route changed — show loader
    setIsLoading(true);
    setPrevPath(currentKey);

    // Show for at least 1200ms to prevent a single-frame flash and allow content to load
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1200);

    return () => clearTimeout(timer);
  }, [pathname, searchParams]);

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

"use client";

import { useCMS } from "@/contexts/CMSContext";
import { useEffect } from "react";

export function DynamicFavicon() {
  const { getS } = useCMS();
  const favicon = getS('identity', 'favicon', '/favicon.png');

  useEffect(() => {
    const link = document.querySelector("link[rel~='icon']") as HTMLLinkElement;
    if (link) {
      link.href = favicon;
    } else {
        const newLink = document.createElement('link');
        newLink.rel = 'icon';
        newLink.href = favicon;
        document.head.appendChild(newLink);
    }
  }, [favicon]);

  return null;
}

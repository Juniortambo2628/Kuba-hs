"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { useMap } from "react-leaflet";
import { ProviderMapHoverPreview } from "@/components/marketplace";
import type { MapViewProvider } from "@/components/shared/MapView";

const PREVIEW_WIDTH = 248;
const TOP_SAFE = 150;

interface MapHoverPreviewOverlayProps {
  provider: MapViewProvider;
  latitude: number;
  longitude: number;
}

/** Fixed-position hover preview (escapes overflow-hidden parents). */
export function MapHoverPreviewOverlay({
  provider,
  latitude,
  longitude,
}: MapHoverPreviewOverlayProps) {
  const map = useMap();
  const [mounted, setMounted] = useState(false);
  const [style, setStyle] = useState<React.CSSProperties | null>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const update = () => {
      const mapEl = map.getContainer();
      const rect = mapEl.getBoundingClientRect();
      const point = map.latLngToContainerPoint([latitude, longitude]);
      const placement = point.y < TOP_SAFE ? "below" : "above";

      const centerX = Math.max(
        PREVIEW_WIDTH / 2 + 8,
        Math.min(rect.width - PREVIEW_WIDTH / 2 - 8, point.x)
      );

      const fixedLeft = rect.left + centerX;
      const fixedTop =
        placement === "below"
          ? rect.top + point.y + 36
          : rect.top + point.y - 14;

      setStyle({
        position: "fixed",
        left: fixedLeft,
        top: fixedTop,
        width: PREVIEW_WIDTH,
        transform:
          placement === "below"
            ? "translate(-50%, 0)"
            : "translate(-50%, -100%)",
        zIndex: 9999,
      });
    };

    update();
    map.on("move zoom zoomend moveend resize viewreset", update);
    window.addEventListener("scroll", update, true);
    window.addEventListener("resize", update);
    return () => {
      map.off("move zoom zoomend moveend resize viewreset", update);
      window.removeEventListener("scroll", update, true);
      window.removeEventListener("resize", update);
    };
  }, [map, latitude, longitude]);

  if (!mounted || !style) return null;

  return createPortal(
    <div className="pointer-events-none" style={style}>
      <ProviderMapHoverPreview provider={provider} />
    </div>,
    document.body
  );
}

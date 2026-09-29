"use client";

import { useEffect, useRef, useState, useSyncExternalStore, type ReactElement } from "react";
import { ResponsiveContainer } from "recharts";
import { cn } from "@/lib/utils";

const emptySubscribe = () => () => {};

interface ChartContainerProps {
  height?: number;
  className?: string;
  children: ReactElement;
}

/**
 * Defers Recharts until after mount and gives the parent a stable box
 * (avoids ResponsiveContainer width/height -1 warnings during layout/animation).
 * Also verifies the container has positive dimensions before rendering the chart.
 */
export function ChartContainer({
  height = 300,
  className,
  children,
}: ChartContainerProps) {
  const ready = useSyncExternalStore(emptySubscribe, () => true, () => false);
  const [hasDimensions, setHasDimensions] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!ready || !containerRef.current) return;
    const el = containerRef.current;
    const observer = new ResizeObserver(([entry]) => {
      const { width, height: h } = entry.contentRect;
      setHasDimensions(width > 0 && h > 0);
    });
    observer.observe(el);
    return () => observer.disconnect();
  }, [ready]);

  return (
    <div
      ref={containerRef}
      className={cn("w-full relative", className)}
      style={{ height, minWidth: 0 }}
    >
      {ready && hasDimensions ? (
        <div className="absolute inset-0">
          <ResponsiveContainer width="100%" height="100%">
            {children}
          </ResponsiveContainer>
        </div>
      ) : null}
    </div>
  );
}

"use client";

import { useEffect, useState, type ReactElement } from "react";
import { ResponsiveContainer } from "recharts";
import { cn } from "@/lib/utils";

interface ChartContainerProps {
  height?: number;
  className?: string;
  children: ReactElement;
}

/**
 * Defers Recharts until after mount and gives the parent a stable box
 * (avoids ResponsiveContainer width/height -1 warnings during layout/animation).
 */
export function ChartContainer({
  height = 300,
  className,
  children,
}: ChartContainerProps) {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setReady(true);
  }, []);

  return (
    <div
      className={cn("w-full", className)}
      style={{ height, minWidth: 1, minHeight: height }}
    >
      {ready ? (
        <ResponsiveContainer width="99%" height="100%" minWidth={1} minHeight={1} debounce={50}>
          {children}
        </ResponsiveContainer>
      ) : null}
    </div>
  );
}

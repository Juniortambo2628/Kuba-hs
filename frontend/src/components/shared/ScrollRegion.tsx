"use client";

import { forwardRef } from "react";
import { cn } from "@/lib/utils";
import { scrollUi } from "@/lib/scroll-ui";

type ScrollAxis = "y" | "x" | "both";

export interface ScrollRegionProps extends React.ComponentProps<"div"> {
  axis?: ScrollAxis;
  /** Hide scrollbar chrome while keeping scroll behavior */
  hideScrollbar?: boolean;
}

/**
 * DRY scroll container — use instead of ad-hoc overflow + kuba-scroll classes.
 */
export const ScrollRegion = forwardRef<HTMLDivElement, ScrollRegionProps>(
  function ScrollRegion(
    { axis = "y", hideScrollbar = false, className, children, ...props },
    ref
  ) {
    const token = hideScrollbar
      ? axis === "x"
        ? scrollUi.xHidden
        : axis === "both"
          ? scrollUi.bothHidden
          : scrollUi.yHidden
      : axis === "x"
        ? scrollUi.x
        : axis === "both"
          ? scrollUi.both
          : scrollUi.y;

    return (
      <div ref={ref} className={cn(token, className)} {...props}>
        {children}
      </div>
    );
  }
);

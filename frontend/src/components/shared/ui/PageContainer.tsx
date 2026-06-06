import { pageContainerClass, type PageContainerVariant } from "@/lib/layout-ui";
import { uiPrimitives } from "@/lib/ui-primitives";
import { cn } from "@/lib/utils";
import type { ElementType, ReactNode } from "react";

interface PageContainerProps {
  children: ReactNode;
  variant?: PageContainerVariant;
  /** Apply standard section vertical padding */
  section?: boolean | "md" | "sm";
  as?: ElementType;
  className?: string;
}

/** Consistent max-width + horizontal padding across surfaces */
export function PageContainer({
  children,
  variant = "marketing",
  section,
  as: Tag = "div",
  className,
}: PageContainerProps) {
  const sectionPad =
    section === true
      ? uiPrimitives.layout.section
      : section === "md"
        ? uiPrimitives.layout.sectionMd
        : section === "sm"
          ? uiPrimitives.layout.sectionSm
          : "";

  return (
    <Tag className={cn(pageContainerClass(variant), sectionPad, className)}>{children}</Tag>
  );
}

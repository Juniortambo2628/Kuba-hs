import { AppPill } from "@/components/shared/ui/AppPill";
import { designSystem } from "@/lib/design-system";
import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

interface SectionHeaderProps {
  title: ReactNode;
  subtitle?: string;
  badge?: ReactNode;
  badgeVariant?: "count" | "accent" | "muted";
  actions?: ReactNode;
  className?: string;
  titleClassName?: string;
}

/** Standard section title row — listing/detail pages */
export function SectionHeader({
  title,
  subtitle,
  badge,
  badgeVariant = "count",
  actions,
  className,
  titleClassName,
}: SectionHeaderProps) {
  return (
    <div className={cn("flex flex-col md:flex-row md:items-end justify-between gap-4", className)}>
      <div className="space-y-2 min-w-0">
        <h2
          className={cn(
            designSystem.typography.section.title.replace("mb-6", "mb-0"),
            "text-3xl",
            titleClassName
          )}
        >
          {title}
        </h2>
        {subtitle && (
          <p className={cn(designSystem.typography.section.paragraph, "text-sm mt-0")}>{subtitle}</p>
        )}
      </div>
      {(badge || actions) && (
        <div className="flex items-center gap-3 shrink-0">
          {badge &&
            (typeof badge === "string" ? (
              <AppPill variant={badgeVariant}>{badge}</AppPill>
            ) : (
              badge
            ))}
          {actions}
        </div>
      )}
    </div>
  );
}

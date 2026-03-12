import { cn } from "@/lib/utils";
import { Card, CardContent } from "@/Components/ui/card";

/**
 * StatsCard — A clean stat card used in dashboard overview rows.
 * Shows an icon, label, and value with consistent styling.
 *
 * @param {string} label - Stat label (e.g., "Total Bookings")
 * @param {string|number} value - Stat value (e.g., "24" or "$1,240")
 * @param {React.ComponentType} icon - Lucide icon component
 * @param {string} iconClassName - Optional class for icon color/bg
 * @param {string} trend - Optional trend text (e.g., "+12% from last month")
 * @param {string} trendType - "up" | "down" | "neutral"
 * @param {string} className - Additional classes
 */
export default function StatsCard({
  label,
  value,
  icon: Icon,
  iconClassName,
  trend,
  trendType = "neutral",
  className,
}) {
  const trendColors = {
    up: "text-emerald-600",
    down: "text-red-500",
    neutral: "text-muted-foreground",
  };

  return (
    <Card className={cn("relative overflow-hidden", className)}>
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div className="space-y-2">
            <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              {label}
            </p>
            <p className="text-2xl font-bold tracking-tight text-foreground">
              {value}
            </p>
            {trend && (
              <p className={cn("text-xs font-medium", trendColors[trendType])}>
                {trend}
              </p>
            )}
          </div>
          {Icon && (
            <div
              className={cn(
                "flex h-12 w-12 shrink-0 items-center justify-center rounded-lg",
                iconClassName || "bg-primary/10 text-primary"
              )}
            >
              <Icon className="h-6 w-6" />
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

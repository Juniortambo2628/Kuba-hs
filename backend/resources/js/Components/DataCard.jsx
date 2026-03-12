import * as React from "react";
import { cn } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/Components/ui/card";
import { Button } from "@/Components/ui/button";
import { Link } from "@inertiajs/react";

/**
 * DataCard — A reusable content card with header, optional action link, and content.
 * Used for "Upcoming Appointments", "Recent Reviews", "Loyalty Rewards", etc.
 *
 * @param {string} title - Card title
 * @param {string} description - Optional sub-description
 * @param {React.ComponentType} icon - Optional Lucide icon for the title area
 * @param {string} iconClassName - Optional class for icon styling
 * @param {object} action - Optional action { label, href, onClick }
 * @param {React.ReactNode} children - Card body content
 * @param {string} className - Additional classes
 */
export default function DataCard({
  title,
  description,
  icon: Icon,
  iconClassName,
  action,
  children,
  className,
}) {
  return (
    <Card className={cn(className)}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
        <div className="flex items-center gap-3">
          {Icon && (
            <div
              className={cn(
                "flex h-8 w-8 items-center justify-center rounded-md",
                iconClassName || "bg-primary/10 text-primary"
              )}
            >
              <Icon className="h-4 w-4" />
            </div>
          )}
          <div>
            <CardTitle className="text-sm font-semibold uppercase tracking-wider">
              {title}
            </CardTitle>
            {description && (
              <CardDescription className="text-xs mt-0.5">
                {description}
              </CardDescription>
            )}
          </div>
        </div>
        {action && (
          action.href ? (
            <Button variant="ghost" size="sm" asChild className="text-xs font-semibold uppercase tracking-wider text-primary hover:text-primary">
              <Link href={action.href}>{action.label}</Link>
            </Button>
          ) : (
            <Button variant="ghost" size="sm" onClick={action.onClick} className="text-xs font-semibold uppercase tracking-wider text-primary hover:text-primary">
              {action.label}
            </Button>
          )
        )}
      </CardHeader>
      <CardContent>
        {children}
      </CardContent>
    </Card>
  );
}

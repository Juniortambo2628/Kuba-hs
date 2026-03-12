import { cn } from "@/lib/utils";
import { Button } from "@/Components/ui/button";
import { Link } from "@inertiajs/react";

/**
 * DashboardShell — A consistent page wrapper for all dashboard pages.
 * Provides a standardized header with title, subtitle, and optional action button.
 *
 * @param {string} title - Page title (e.g., "Portal Overview")
 * @param {string} subtitle - Page subtitle (e.g., "Welcome back, Kevin!")
 * @param {object|null} action - Optional action button { label, href, icon, onClick }
 * @param {React.ReactNode} children - Page content
 * @param {string} className - Additional classes for the content area
 */
export default function DashboardShell({ title, subtitle, action, children, className }) {
  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">
            {title}
          </h1>
          {subtitle && (
            <p className="text-sm text-muted-foreground mt-1">
              {subtitle}
            </p>
          )}
        </div>

        {action && (
          action.href ? (
            <Button asChild size="default" className="shrink-0">
              <Link href={action.href}>
                {action.icon && <action.icon className="h-4 w-4 mr-2" />}
                {action.label}
              </Link>
            </Button>
          ) : (
            <Button size="default" onClick={action.onClick} className="shrink-0">
              {action.icon && <action.icon className="h-4 w-4 mr-2" />}
              {action.label}
            </Button>
          )
        )}
      </div>

      {/* Page Content */}
      <div className={cn(className)}>
        {children}
      </div>
    </div>
  );
}

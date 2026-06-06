"use client";

import { ChevronDown, type LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface NativeSelectFieldProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  icon?: LucideIcon;
  wrapperClassName?: string;
}

/** Native select with a single custom chevron (no browser default arrow). */
export function NativeSelectField({
  icon: Icon,
  className,
  wrapperClassName,
  children,
  ...props
}: NativeSelectFieldProps) {
  return (
    <div className={cn("relative flex items-center gap-2 min-w-0 flex-1", wrapperClassName)}>
      {Icon && <Icon className="h-4 w-4 text-muted-foreground shrink-0" />}
      <div className="relative flex-1 min-w-0">
        <select
          className={cn(
            "w-full bg-transparent text-xs font-bold text-foreground",
            "appearance-none cursor-pointer focus:outline-none pr-5",
            className
          )}
          {...props}
        >
          {children}
        </select>
        <ChevronDown
          className="pointer-events-none absolute right-0 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground"
          aria-hidden
        />
      </div>
    </div>
  );
}

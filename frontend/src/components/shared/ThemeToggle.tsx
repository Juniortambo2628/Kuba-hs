"use client";

import { useTheme } from "next-themes";
import { Sun, Moon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

interface ThemeToggleProps {
  className?: string;
  variant?: "ghost" | "outline" | "solid";
  showLabel?: boolean;
}

export function ThemeToggle({ className, variant = "ghost", showLabel = false }: ThemeToggleProps) {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <Button variant={variant === "solid" ? "default" : variant} size="icon" className={cn("rounded-full h-10 w-10", className)} disabled>
        <Sun className="h-5 w-5" />
      </Button>
    );
  }

  return (
    <Button
      variant={variant === "solid" ? "default" : variant}
      size={showLabel ? "default" : "icon"}
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
      className={cn(
        "rounded-full h-10 transition-all duration-300 relative overflow-hidden",
        !showLabel && "w-10",
        variant === "solid" && "bg-foreground text-background hover:bg-muted hover:text-foreground",
        className
      )}
    >
      <div className="flex items-center gap-2">
        <div className="relative w-5 h-5">
           <Sun className="absolute inset-0 h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
           <Moon className="absolute inset-0 h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
        </div>
        {showLabel && (
          <span className="font-bold text-xs tracking-tight">
            {theme === "dark" ? "Light Mode" : "Dark Mode"}
          </span>
        )}
      </div>
      <span className="sr-only">Toggle theme</span>
    </Button>
  );
}

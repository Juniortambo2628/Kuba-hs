"use client";

import { ReactNode, FormEvent } from "react";
import { cn } from "@/lib/utils";

interface BaseFormWrapperProps {
  onSubmit: (e: FormEvent) => void;
  className?: string;
  children: ReactNode;
  isLoading?: boolean;
}

export function BaseFormWrapper({ onSubmit, className, children, isLoading = false }: BaseFormWrapperProps) {
  return (
    <form
      onSubmit={onSubmit}
      className={cn(
        "space-y-6",
        className
      )}
      noValidate
    >
      {isLoading && (
        <div className="absolute inset-0 bg-background/80 backdrop-blur-sm z-10 flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
        </div>
      )}
      {children}
    </form>
  );
}
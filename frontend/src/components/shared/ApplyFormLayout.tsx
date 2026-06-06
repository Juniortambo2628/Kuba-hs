"use client";

import { AnimatePresence, motion } from "framer-motion";
import { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface ApplyFormLayoutProps {
  sidebar: ReactNode;
  children: ReactNode;
  isSuccess: boolean;
  successView: ReactNode;
  /** Quotes-style card with sidebar column inside one panel */
  variant?: "split-card" | "two-column";
  className?: string;
}

/**
 * Shared layout for public apply flows (enterprise quotes, provider onboarding).
 */
export function ApplyFormLayout({
  sidebar,
  children,
  isSuccess,
  successView,
  variant = "split-card",
  className,
}: ApplyFormLayoutProps) {
  if (variant === "two-column") {
    return (
      <div className={cn("grid grid-cols-1 lg:grid-cols-2 gap-16 items-start", className)}>
        {sidebar}
        <div className="bg-white dark:bg-white/5 rounded-[3rem] border border-gray-100 dark:border-white/10 p-12 shadow-2xl relative overflow-hidden">
          <AnimatePresence mode="wait">
            {isSuccess ? (
              <motion.div
                key="success"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
              >
                {successView}
              </motion.div>
            ) : (
              <motion.div key="form" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                {children}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    );
  }

  return (
    <div
      className={cn(
        "bg-white dark:bg-white/5 rounded-[3rem] border border-gray-100 dark:border-white/10 overflow-hidden shadow-2xl",
        className
      )}
    >
      <div className="grid grid-cols-1 md:grid-cols-5 h-full">
        <div className="md:col-span-2 bg-muted/30 p-12 space-y-8 border-r border-gray-100 dark:border-white/10">
          {sidebar}
        </div>
        <div className="md:col-span-3 p-12">
          <AnimatePresence mode="wait">
            {isSuccess ? (
              <motion.div
                key="success"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="h-full flex flex-col items-center justify-center text-center space-y-6"
              >
                {successView}
              </motion.div>
            ) : (
              <motion.div key="form" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                {children}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}

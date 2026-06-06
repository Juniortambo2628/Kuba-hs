"use client";

import { motion } from "framer-motion";
import { AppPill } from "@/components/shared/ui/AppPill";
import { designSystem } from "@/lib/design-system";
import { cn } from "@/lib/utils";

interface LandingSectionHeaderProps {
  badge?: string;
  title: string | React.ReactNode;
  subtitle?: string | React.ReactNode;
  className?: string;
  align?: "center" | "left";
  titleClassName?: string;
  children?: React.ReactNode;
}

export function LandingSectionHeader({
  badge,
  title,
  subtitle,
  className,
  align = "center",
  titleClassName,
  children,
}: LandingSectionHeaderProps) {
  return (
    <motion.div
      className={cn(
        "mb-16",
        align === "center" ? "text-center" : "text-left",
        className
      )}
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.6 }}
    >
      {badge && <AppPill variant="section">{badge}</AppPill>}
      <h2 className={cn(designSystem.typography.section.title, titleClassName)}>
        {title}
      </h2>
      {subtitle && (
        <p className={cn(designSystem.typography.section.subtitle, align === "center" ? "mx-auto" : "")}>
          {subtitle}
        </p>
      )}
      {children}
    </motion.div>
  );
}

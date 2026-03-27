"use client";

import { motion } from "framer-motion";
import { LucideIcon, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

interface PremiumEmptyStateProps {
  icon?: LucideIcon;
  title: string;
  description: string;
  actionLabel?: string;
  actionHref?: string;
}

export function PremiumEmptyState({ 
  icon: Icon = Sparkles, 
  title, 
  description, 
  actionLabel, 
  actionHref 
}: PremiumEmptyStateProps) {
  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="flex flex-col items-center justify-center py-20 px-6 text-center max-w-lg mx-auto"
    >
      <div className="relative mb-8">
        <div className="absolute inset-0 bg-primary/10 blur-[50px] rounded-full animate-pulse" />
        <div className="relative h-24 w-24 bg-slate-50 dark:bg-white/5 border border-border/50 rounded-[2.5rem] flex items-center justify-center shadow-xl shadow-primary/5">
          <Icon className="w-10 h-10 text-primary" />
        </div>
      </div>

      <h3 className="text-2xl font-bold text-foreground mb-4 tracking-tight">
        {title}
      </h3>
      <p className="text-muted-foreground mb-10 leading-relaxed font-medium">
        {description}
      </p>

      {actionLabel && actionHref && (
        <Link href={actionHref}>
          <Button className="rounded-xl h-12 px-8 font-bold text-[10px] uppercase tracking-widest bg-primary hover:bg-primary/90 text-white shadow-xl shadow-primary/20">
            {actionLabel}
          </Button>
        </Link>
      )}
    </motion.div>
  );
}

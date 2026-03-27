"use client";

import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

interface SkeletonProps {
  className?: string;
}

export function CardSkeleton({ className }: SkeletonProps) {
  return (
    <div className={cn("rounded-[2.5rem] overflow-hidden border border-border/50 bg-card p-8 space-y-6", className)}>
      <Skeleton className="h-48 w-full rounded-2xl" />
      <div className="space-y-3">
        <Skeleton className="h-6 w-3/4" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-1/2" />
      </div>
      <div className="flex justify-between items-center pt-4">
        <Skeleton className="h-8 w-24 rounded-xl" />
        <Skeleton className="h-10 w-32 rounded-xl" />
      </div>
    </div>
  );
}

export function HeroSkeleton() {
  return (
    <div className="w-full bg-muted/30 pt-32 pb-24 overflow-hidden relative">
      <div className="container mx-auto px-6 space-y-8">
        <Skeleton className="h-6 w-32 rounded-lg" />
        <div className="space-y-4">
          <Skeleton className="h-16 md:h-24 w-2/3 rounded-3xl" />
          <Skeleton className="h-6 w-1/2 rounded-xl" />
        </div>
        <div className="flex gap-4">
          <Skeleton className="h-12 w-48 rounded-2xl" />
          <Skeleton className="h-12 w-48 rounded-2xl" />
        </div>
      </div>
      {/* Visual flair for hero skeleton */}
      <div className="absolute top-1/2 right-10 -translate-y-1/2 w-64 h-64 bg-primary/5 rounded-full blur-3xl animate-pulse" />
    </div>
  );
}

export function ListSkeleton({ count = 3 }: { count?: number }) {
  return (
    <div className="space-y-4">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="flex items-center gap-4 p-4 border border-border/50 rounded-2xl bg-card">
          <Skeleton className="h-16 w-16 rounded-xl shrink-0" />
          <div className="flex-1 space-y-2">
            <Skeleton className="h-5 w-1/3" />
            <Skeleton className="h-4 w-1/2 opacity-60" />
          </div>
          <Skeleton className="h-8 w-20 rounded-lg" />
        </div>
      ))}
    </div>
  );
}

export function StatsSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {Array.from({ length: 4 }).map((_, i) => (
        <div key={i} className="p-8 rounded-[2rem] bg-card border border-border/50 space-y-4">
          <div className="flex justify-between items-start">
            <Skeleton className="h-10 w-10 rounded-xl" />
            <Skeleton className="h-4 w-12 rounded-lg" />
          </div>
          <div className="space-y-1">
            <Skeleton className="h-8 w-24" />
            <Skeleton className="h-4 w-32 opacity-60" />
          </div>
        </div>
      ))}
    </div>
  );
}

export function ShimmerImage({ className }: SkeletonProps) {
    return (
        <div className={cn("relative overflow-hidden bg-muted", className)}>
            <div className="absolute inset-0 -translate-x-full animate-[shimmer_2s_infinite] bg-gradient-to-r from-transparent via-white/20 to-transparent" />
        </div>
    );
}

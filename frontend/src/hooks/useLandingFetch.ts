"use client";

import { useSwrList } from "@/hooks/useData";

interface UseLandingFetchResult<T> {
  data: T[];
  isLoading: boolean;
  error: string | null;
}

/**
 * Generic data-fetching hook for landing page sections.
 * Thin wrapper over the shared SWR list hook - FAQ, FeaturedProviders,
 * Testimonials and the category sections all hit the same cache.
 */
export function useLandingFetch<T = any>(url: string): UseLandingFetchResult<T> {
  const { list, isLoading, error } = useSwrList<T>(url);
  return { data: list, isLoading, error };
}

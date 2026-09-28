"use client";

import type { Category } from "@/types";
import { useSwrList } from "@/hooks/useData";

interface UseCategoriesOptions {
  /** Pass false to stay mounted without fetching - used by modals and the megamenu. */
  enabled?: boolean;
}

/**
 * The one `/api/categories` reader. Every caller shares a single SWR key,
 * so a route that mounts several of them (layout megamenu, search, filters,
 * landing sections) issues one request instead of one per component.
 */
export function useCategories<T = Category>(options: UseCategoriesOptions = {}) {
  const { list, isLoading, error, refetch } = useSwrList<T>("/api/categories", options);

  return { categories: list, isLoading, error, refetch };
}

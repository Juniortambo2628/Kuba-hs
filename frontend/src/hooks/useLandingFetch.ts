"use client";

import { useEffect, useState } from "react";
import axiosInstance from "@/lib/axios";

interface UseLandingFetchResult<T> {
  data: T[];
  isLoading: boolean;
  error: string | null;
}

/**
 * Generic data-fetching hook for landing page sections.
 * Replaces the duplicated useEffect + useState + axiosInstance.get pattern
 * found in FeaturedServices, Categories, FeaturedProviders, Testimonials, FAQ.
 */
export function useLandingFetch<T = any>(url: string): UseLandingFetchResult<T> {
  const [data, setData] = useState<T[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    const fetchData = async () => {
      try {
        const response = await axiosInstance.get(url);
        if (!cancelled) {
          setData(response.data.data ?? response.data ?? []);
        }
      } catch (err) {
        if (!cancelled) {
          console.error(`Failed to fetch ${url}:`, err);
          setError(err instanceof Error ? err.message : "Failed to load data");
        }
      } finally {
        if (!cancelled) {
          setIsLoading(false);
        }
      }
    };

    fetchData();

    return () => {
      cancelled = true;
    };
  }, [url]);

  return { data, isLoading, error };
}

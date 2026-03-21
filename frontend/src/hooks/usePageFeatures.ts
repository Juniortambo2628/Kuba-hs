import { useEffect, useState } from "react";
import axiosInstance from "@/lib/axios";

interface PageFeature {
  id: number;
  title: string;
  subtitle?: string;
  description?: string;
  icon?: string;
  metadata?: Record<string, any>;
}

/**
 * Fetches page-specific features from the CMS API.
 * Replaces the identical useEffect + useState pattern duplicated
 * across About, Commercial, Cooperatives, and Investors pages.
 */
export function usePageFeatures(pageName: string) {
  const [features, setFeatures] = useState<PageFeature[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(true);
    axiosInstance
      .get(`/api/page-features?page=${pageName}`)
      .then((res) => {
        const data = res.data?.data ?? res.data;
        setFeatures(Array.isArray(data) ? data : []);
      })
      .catch((err) => console.error(`Failed to load ${pageName} features`, err))
      .finally(() => setIsLoading(false));
  }, [pageName]);

  return { features, isLoading };
}

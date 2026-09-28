import { useSwrList } from "@/hooks/useData";

export interface PageFeature {
  id: number;
  title: string;
  subtitle?: string;
  description?: string;
  icon?: string;
  image_url?: string | null;
  metadata?: Record<string, any>;
}

/**
 * Fetches page-specific features from the CMS API.
 * Thin wrapper over the shared SWR list hook, so two pages asking for the
 * same pageName (or a remount) reuse one request instead of refetching.
 */
export function usePageFeatures(pageName: string) {
  const { list, isLoading } = useSwrList<PageFeature>(
    `/api/page-features?page=${pageName}`
  );

  return { features: list, isLoading };
}

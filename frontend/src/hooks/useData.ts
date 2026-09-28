import useSWR, { SWRConfiguration } from "swr";
import axiosInstance from "@/lib/axios";
import { normalizeApiResponse } from "@/lib/api-response";
import type { AxiosError } from "axios";

export const fetcher = <T>(url: string): Promise<T> =>
  axiosInstance.get(url).then((res) => normalizeApiResponse<T>(res.data));

export function prefetchData<T>(url: string) {
  return fetcher<T>(url);
}

export interface UseApiDataOptions<T> extends SWRConfiguration<T> {
  /** Extract a specific key from the response envelope */
  extractKey?: string;
  /** Keep full JSON body (e.g. responses with `stats` + `data`) */
  preserveEnvelope?: boolean;
  /** Fallback data while loading or on error */
  initialData?: T | null;
}

/**
 * Unified data-fetching hook backed by SWR.
 * Replaces both the original `useData` and `useApiData` hooks.
 */
export function useData<T>(
  url: string | null,
  options: UseApiDataOptions<T> = {}
) {
  const { extractKey, preserveEnvelope, initialData, ...swrOptions } = options;

  const { data, error, isLoading, mutate, isValidating } = useSWR<T>(
    url,
    url
      ? async (endpoint: string) => {
          const response = await axiosInstance.get(endpoint);
          let result: unknown = response.data;

          if (preserveEnvelope) {
            return result as T;
          }

          if (
            extractKey &&
            result &&
            typeof result === "object" &&
            extractKey in (result as object)
          ) {
            result = (result as Record<string, unknown>)[extractKey];
          } else {
            result = normalizeApiResponse(result);
          }

          return result as T;
        }
      : null,
    {
      revalidateOnFocus: false,
      revalidateIfStale: false,
      onErrorRetry: (err, _key, _config, revalidate, { retryCount }) => {
        const status = (err as AxiosError)?.response?.status;
        if (status === 401 || status === 403 || status === 404) return;
        if (retryCount >= 3) return;
        setTimeout(() => revalidate({ retryCount }), 5000);
      },
      ...swrOptions,
    }
  );

  const resolved = (data ?? initialData ?? null) as T;

  return {
    data: resolved,
    isLoading,
    isError: error,
    isValidating,
    mutate,
    setData: (value: T) => mutate(value, false),
    refetch: () => mutate(),
  };
}

export interface UseSwrListResult<T> {
  list: T[];
  isLoading: boolean;
  isError: unknown;
  error: string | null;
  refetch: () => void;
}

/**
 * List-shaped sibling of `useData`: one SWR key, the shared `fetcher`, and
 * always an array. Everything that used to fetch a list in its own
 * useEffect (useLandingFetch, usePageFeatures, the category call sites)
 * sits on top of this so two components asking for the same URL share
 * one request instead of racing.
 *
 * Pass `enabled: false` to keep the hook mounted but unfetching - that
 * is how the modals/megamenu preserve "only fetch when opened".
 */
export function useSwrList<T>(
  url: string | null,
  options: { enabled?: boolean } & SWRConfiguration<T[]> = {}
): UseSwrListResult<T> {
  const { enabled = true, ...swrOptions } = options;
  const key = enabled && url ? url : null;

  const { data, error, isLoading, mutate } = useSWR<T[]>(key, fetcher, {
    revalidateOnFocus: false,
    revalidateIfStale: false,
    ...swrOptions,
  });

  return {
    list: data ?? [],
    isLoading,
    isError: error,
    error: error instanceof Error ? error.message : error ? String(error) : null,
    refetch: () => mutate(),
  };
}

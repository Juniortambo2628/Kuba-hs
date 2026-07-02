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
        if (status === 404 || status === 403) return;
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

import useSWR from "swr";
import axiosInstance from "@/lib/axios";
import { normalizeApiResponse } from "@/lib/api-response";

export interface UseApiDataOptions<T> {
  extractKey?: string;
  /** Keep full JSON body (e.g. responses with `stats` + `data`) */
  preserveEnvelope?: boolean;
  initialData?: T | null;
}

/**
 * Admin-friendly data hook backed by SWR (same network layer as useData).
 */
export function useApiData<T>(url: string, options: UseApiDataOptions<T> = {}) {
  const { data, error, isLoading, mutate } = useSWR<T>(
    url || null,
    async (endpoint: string) => {
      const response = await axiosInstance.get(endpoint);
      let result: unknown = response.data;

      if (options.preserveEnvelope) {
        return result as T;
      }

      if (
        options.extractKey &&
        result &&
        typeof result === "object" &&
        options.extractKey in (result as object)
      ) {
        result = (result as Record<string, unknown>)[options.extractKey];
      } else {
        result = normalizeApiResponse(result);
      }

      return result as T;
    },
    { revalidateOnFocus: false }
  );

  const resolved = (data ?? options.initialData ?? null) as T;

  return {
    data: resolved,
    isLoading,
    error,
    setData: (value: T) => mutate(value, false),
    refetch: () => mutate(),
  };
}

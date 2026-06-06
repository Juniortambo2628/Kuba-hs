import useSWR, { SWRConfiguration } from "swr";
import axiosInstance from "@/lib/axios";
import { normalizeApiResponse } from "@/lib/api-response";
import type { AxiosError } from "axios";

export const fetcher = <T>(url: string): Promise<T> =>
  axiosInstance.get(url).then((res) => normalizeApiResponse<T>(res.data));

export function prefetchData<T>(url: string) {
  return fetcher<T>(url);
}

export function useData<T>(url: string | null, options?: SWRConfiguration<T>) {
  const { data, error, isLoading, mutate, isValidating } = useSWR<T>(
    url,
    url ? fetcher<T> : null,
    {
      revalidateOnFocus: false,
      revalidateIfStale: false,
      onErrorRetry: (err, _key, _config, revalidate, { retryCount }) => {
        const status = (err as AxiosError)?.response?.status;
        if (status === 404 || status === 403) return;
        if (retryCount >= 3) return;
        setTimeout(() => revalidate({ retryCount }), 5000);
      },
      ...options,
    }
  );

  return {
    data,
    isLoading,
    isError: error,
    isValidating,
    mutate,
  };
}

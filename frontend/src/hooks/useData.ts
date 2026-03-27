import useSWR, { SWRConfiguration } from 'swr';
import axiosInstance from '@/lib/axios';

export const fetcher = (url: string) => axiosInstance.get(url).then(res => res.data.data || res.data);

export function prefetchData(url: string) {
  return fetcher(url);
}

export function useData<T>(url: string | null, options?: SWRConfiguration) {
  const { data, error, isLoading, mutate, isValidating } = useSWR<T>(url, fetcher, {
    revalidateOnFocus: false,
    revalidateIfStale: false,
    onErrorRetry: (error, _key, _config, revalidate, { retryCount }) => {
      // Don't retry on 404 or 403 — these won't recover by retrying
      if (error?.response?.status === 404 || error?.response?.status === 403) return;
      // Only retry up to 3 times for other errors
      if (retryCount >= 3) return;
      setTimeout(() => revalidate({ retryCount }), 5000);
    },
    ...options
  });

  return {
    data,
    isLoading,
    isError: error,
    isValidating,
    mutate
  };
}

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

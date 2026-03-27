import { useState, useEffect, useCallback } from "react";
import axiosInstance from "@/lib/axios";

interface UseApiDataOptions {
  extractKey?: string;
  initialData?: any;
}

/**
 * A reusable hook to fetch data from an API endpoint with loading and error states.
 * Consolidates the boilerplate pattern used across many components.
 * 
 * @param url The API endpoint to fetch from
 * @param options Configuration for data extraction and initial state
 */
export function useApiData<T>(url: string, options: UseApiDataOptions = {}) {
  const [data, setData] = useState<T>(options.initialData ?? null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<any>(null);

  const fetchData = useCallback(async () => {
    if (!url) {
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError(null);
    try {
      const response = await axiosInstance.get(url);
      let result = response.data;
      
      // Handle the common Laravel/Sanctum response structure
      if (options.extractKey && result && typeof result === 'object' && options.extractKey in result) {
        result = result[options.extractKey];
      } else if (result && result.data !== undefined) {
        // Default to .data if it exists (common for paginated or wrapped responses)
        result = result.data;
      }
      
      setData(result);
    } catch (err: any) {
      console.error(`API Fetch Error [${url}]:`, err);
      setError(err);
    } finally {
      setIsLoading(false);
    }
  }, [url, options.extractKey]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { 
    data, 
    isLoading, 
    error, 
    setData, 
    refetch: fetchData 
  };
}

import axios from 'axios';
import { getApiBaseUrl } from '@/lib/api-base-url';

const axiosInstance = axios.create({
    baseURL: getApiBaseUrl(),
    headers: {
        'X-Requested-With': 'XMLHttpRequest',
        'Accept': 'application/json',
    },
    withCredentials: true,
    withXSRFToken: true,
});

interface ApiErrorLike {
    response?: {
        status?: number;
        data?: {
            errors?: Record<string, string[]>;
            message?: string;
        };
    };
    message?: string;
}

export const handleApiError = (err: unknown): string => {
    const apiError = (err ?? {}) as ApiErrorLike;
    if (apiError.response?.status === 422) {
        const firstError = Object.values(apiError.response.data?.errors ?? {})[0]?.[0];
        if (firstError) return firstError;
    }
    return apiError.response?.data?.message || apiError.message || "An unexpected error occurred";
};

export default axiosInstance;

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

export const handleApiError = (err: any) => {
    if (err.response?.status === 422 && err.response?.data?.errors) {
        const errors = err.response.data.errors;
        const firstErrorKey = Object.keys(errors)[0];
        return errors[firstErrorKey][0];
    }
    return err.response?.data?.message || err.message || "An unexpected error occurred";
};

export default axiosInstance;

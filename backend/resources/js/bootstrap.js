import axios from 'axios';
window.axios = axios;

window.axios.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest';

// Send CSRF token from cookie on every request so POST (e.g. logout) passes verification
window.axios.interceptors.request.use((config) => {
    const match = document.cookie.match(/XSRF-TOKEN=([^;]+)/);
    if (match) {
        config.headers['X-XSRF-TOKEN'] = decodeURIComponent(match[1]);
    }
    return config;
});

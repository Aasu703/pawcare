import axios from 'axios';
import { API_CONFIG } from './config';

const BASE_URL = `${API_CONFIG.BASE_URL}`;

function readClientCookie(name: string): string | null {
    if (typeof document === 'undefined') return null;
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) {
        const cookieValue = parts.pop()?.split(';').shift() || null;
        return cookieValue ? decodeURIComponent(cookieValue) : null;
    }
    return null;
}

function getClientAuthToken(): string | null {
    const cookieToken = readClientCookie('auth_token');
    if (cookieToken && cookieToken !== 'undefined') return cookieToken;

    if (typeof window !== 'undefined') {
        const stored = window.localStorage.getItem('auth_token');
        if (stored && stored !== 'undefined') return stored;
    }

    return null;
}

const axiosInstance = axios.create(
    {
        baseURL: BASE_URL,
        headers: {
            'Content-Type': 'application/json',
        }
    }
);

axiosInstance.interceptors.request.use(
    async (config) => {
        let token: string | null = null;

        if (typeof window === 'undefined') {
            const { getAuthToken } = await import('../cookie');
            token = await getAuthToken();
        } else {
            token = getClientAuthToken();
        }

        if(token && config.headers){
            config.headers['Authorization'] = `Bearer ${token}`;
        }
        // Debug: log outgoing requests to help diagnose 404s in browser
        try{
            const fullUrl = `${config.baseURL || ''}${config.url || ''}`;
            // eslint-disable-next-line no-console
            console.debug('[API Request]', config.method?.toUpperCase(), fullUrl);
        }catch(e){/* ignore */}
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

export default axiosInstance;

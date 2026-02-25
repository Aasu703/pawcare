import axios from 'axios';
import { API_CONFIG } from './config';
// Axios is a popular HTTP client library for making API requests. 
// This module configures a custom Axios instance with a base URL and an interceptor to automatically include the authentication token in the headers of each request. 
// The token is retrieved from cookies or local storage, depending on whether the code is running on the server or client side.
const BASE_URL = `${API_CONFIG.BASE_URL}`;

function readClientCookie(name: string): string | null {
    // This function reads a cookie value from the document.cookie string. 
    // It returns the decoded value of the specified cookie name, or null if the cookie is not found.
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
    // This function retrieves the authentication token from cookies or local storage on the client side.
    // It first checks for the token in cookies using the readClientCookie function. If not found, it checks local storage.

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
    // This interceptor function is called before each request is sent. 
    // It retrieves the authentication token and adds it to the Authorization header of the request if it exists.
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

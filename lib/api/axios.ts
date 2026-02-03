import axios from "axios";

// Client-safe cookie helper
function getCookie(name: string): string | null {
  if (typeof document === 'undefined') return null;
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop()?.split(';').shift() || null;
  return null;
}

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL 
    || "http://localhost:5050";
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
        const token = getCookie('auth_token');
        if(token && config.headers){
            config.headers['Authorization'] = `Bearer ${token}`;
        }
        // Debug: Log outgoing requests
        console.log(`🚀 [${config.method?.toUpperCase()}] ${config.baseURL}${config.url}`);
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Debug: Log responses
axiosInstance.interceptors.response.use(
    (response) => {
        console.log(`✅ [${response.status}] ${response.config.url}`, response.data);
        return response;
    },
    (error) => {
        console.error(`❌ [${error.response?.status || 'Network Error'}] ${error.config?.url}`, error.response?.data || error.message);
        return Promise.reject(error);
    }
);

export default axiosInstance;
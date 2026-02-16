import axios from "axios";

// Client-safe cookie helper
function getCookie(name: string): string | null {
  if (typeof document === "undefined") return null;
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) {
    const cookieValue = parts.pop()?.split(";").shift() || null;
    return cookieValue ? decodeURIComponent(cookieValue) : null;
  }
  return null;
}

const BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL ||
  process.env.API_BASE_URL ||
  "http://localhost:5050";

const normalizedBaseUrl = BASE_URL.replace(/\/+$/, "");

const axiosInstance = axios.create({
  baseURL: normalizedBaseUrl,
  headers: {
    "Content-Type": "application/json",
  },
});

axiosInstance.interceptors.request.use(
  async (config) => {
    const token = getCookie("auth_token");
    if (token && config.headers) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }

    // Don't set Content-Type if FormData is being sent (let browser handle it)
    if (config.data instanceof FormData) {
      delete config.headers["Content-Type"];
    }

    const requestUrl = `${config.baseURL || ""}${config.url || ""}`;
    console.log(`[HTTP REQUEST] [${config.method?.toUpperCase()}] ${requestUrl}`);
    return config;
  },
  (error) => Promise.reject(error)
);

axiosInstance.interceptors.response.use(
  (response) => {
    console.log(`[HTTP RESPONSE] [${response.status}] ${response.config.url}`, response.data);
    return response;
  },
  (error) => {
    try {
      const cfg = error?.config || {};
      const method = (cfg.method || "").toUpperCase();
      const errorUrl = `${cfg.baseURL || ""}${cfg.url || ""}` || cfg.url || "<unknown>";
      const reqData = cfg.data ? (typeof cfg.data === 'string' ? cfg.data : JSON.stringify(cfg.data)) : undefined;
      const status = error.response?.status || "Network Error";
      const respData = error.response?.data;

      console.error(
        `[HTTP ERROR] [${status}] [${method}] ${errorUrl}`,
        reqData ? { requestBody: reqData } : undefined,
        respData || error.message
      );
    } catch (logErr) {
      // Fallback logging if anything goes wrong here
      console.error('[HTTP ERROR] (failed to format error)', error?.message || error, logErr);
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;



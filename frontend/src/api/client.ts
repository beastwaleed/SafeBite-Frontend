import axios, { AxiosInstance, InternalAxiosRequestConfig } from "axios";
import { ENV } from "../config/env";
import { secureStorage } from "../storage/secureStore";

let activeToken: string | null = null;
let onUnauthorizedCallback: (() => void) | null = null;

export const setAuthTokenInMemory = (token: string | null) => {
  activeToken = token;
};

export const setOnUnauthorizedCallback = (callback: () => void) => {
  onUnauthorizedCallback = callback;
};

export const apiClient: AxiosInstance = axios.create({
  baseURL: ENV.API_BASE_URL,
  timeout: ENV.API_TIMEOUT_MS,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

// Request Interceptor: Attach Bearer Token
apiClient.interceptors.request.use(
  async (config: InternalAxiosRequestConfig) => {
    // If not in memory, try to read from SecureStore
    if (!activeToken) {
      activeToken = await secureStorage.getToken();
    }

    if (activeToken && !config.headers.Authorization) {
      config.headers.Authorization = `Bearer ${activeToken}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// Response Interceptor: Handle Global 401 Unauthorized
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      // Don't auto-clear if it was a failed login attempt
      const url = error.config?.url || "";
      const isLoginRequest = url.includes("/login") || url.includes("/signup");

      if (!isLoginRequest) {
        activeToken = null;
        await secureStorage.clearSession();
        if (onUnauthorizedCallback) {
          onUnauthorizedCallback();
        }
      }
    }
    return Promise.reject(error);
  }
);

export default apiClient;


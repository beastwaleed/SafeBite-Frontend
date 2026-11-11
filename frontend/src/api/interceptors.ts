import { AxiosInstance, InternalAxiosRequestConfig, AxiosError } from "axios";
import { secureStorage } from "../storage/secureStore";
import { parseApiError } from "./error-handler";
import { ApiErrorResponse } from "../types/api.types";

let activeToken: string | null = null;
let onUnauthorizedCallback: (() => void) | null = null;

export const setAuthTokenInMemory = (token: string | null): void => {
  activeToken = token;
};

export const getAuthTokenFromMemory = (): string | null => {
  return activeToken;
};

export const setOnUnauthorizedCallback = (callback: () => void): void => {
  onUnauthorizedCallback = callback;
};

/**
 * Configure request and response interceptors for the centralized Axios client.
 */
export function setupInterceptors(client: AxiosInstance): void {
  // ─── Request Interceptor: Attach Bearer Token ─────────────────────
  client.interceptors.request.use(
    async (config: InternalAxiosRequestConfig) => {
      // If no token in memory, read from secure storage
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

  // ─── Response Interceptor: 401 Unauthorized Session Expiration ─────
  client.interceptors.response.use(
    (response) => response,
    async (error: AxiosError<ApiErrorResponse>) => {
      if (error.response?.status === 401) {
        const url = error.config?.url || "";
        const isAuthAttempt = url.includes("/login") || url.includes("/signup");

        // Only auto-invalidate session if 401 happened on an authenticated endpoint
        if (!isAuthAttempt) {
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
}

export default setupInterceptors;


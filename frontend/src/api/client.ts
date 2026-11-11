import axios, { AxiosInstance } from "axios";
import { ENV } from "../config/env";
import { setupInterceptors } from "./interceptors";

export const apiClient: AxiosInstance = axios.create({
  baseURL: ENV.API_BASE_URL,
  timeout: ENV.API_TIMEOUT_MS,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
    "X-Tunnel-Skip-Anti-Abuse-Page": "true",
  },
});

// Attach request and response interceptors
setupInterceptors(apiClient);

export default apiClient;
export {
  setAuthTokenInMemory,
  getAuthTokenFromMemory,
  setOnUnauthorizedCallback,
} from "./interceptors";

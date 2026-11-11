import axios, { AxiosError } from "axios";
import { ApiErrorResponse } from "../types/api.types";

export interface ParsedApiError {
  message: string;
  statusCode?: number;
  fieldErrors?: Record<string, string>;
  isNetworkError: boolean;
  isSessionExpired: boolean;
}

/**
 * Parses any API or Axios error into a normalized, user-friendly structure.
 */
export function parseApiError(error: unknown): ParsedApiError {
  if (axios.isAxiosError(error)) {
    const axiosError = error as AxiosError<ApiErrorResponse>;

    // Network disconnect or timeout
    if (!axiosError.response) {
      console.warn("API Network Failure:", {
        code: axiosError.code,
        message: axiosError.message,
        url: axiosError.config?.url,
      });

      if (axiosError.code === "ECONNABORTED" || axiosError.message.includes("timeout")) {
        return {
          message:
            "Request timed out connecting to backend devtunnel. Please check the tunnel connection and tap Retry.",
          isNetworkError: true,
          isSessionExpired: false,
        };
      }
      return {
        message:
          "Cannot reach SafeBite backend devtunnel (q136wfhl-3000). Please verify the devtunnel is active and tap Retry.",
        isNetworkError: true,
        isSessionExpired: false,
      };
    }

    const { status, data } = axiosError.response;

    // Field-level validation errors (HTTP 400 from Zod validator)
    const fieldErrors: Record<string, string> = {};
    if (data?.errors && Array.isArray(data.errors)) {
      for (const item of data.errors) {
        if (item.field && item.message) {
          fieldErrors[item.field] = item.message;
        }
      }
    }

    // Default message from backend or fallback
    let message = data?.message || "An unexpected error occurred. Please try again.";

    if (status === 401) {
      message = data?.message || "Invalid email or password.";
      return {
        message,
        statusCode: 401,
        fieldErrors,
        isNetworkError: false,
        isSessionExpired: true,
      };
    }

    if (status === 409) {
      message = data?.message || "An account with this email already exists.";
    } else if (status === 429) {
      message = "Too many attempts. Please wait a few minutes before trying again.";
    } else if (status >= 500) {
      message = "SafeBite server encountered an error. Please try again later.";
    }

    return {
      message,
      statusCode: status,
      fieldErrors: Object.keys(fieldErrors).length > 0 ? fieldErrors : undefined,
      isNetworkError: false,
      isSessionExpired: false,
    };
  }

  if (error instanceof Error) {
    return {
      message: error.message,
      isNetworkError: false,
      isSessionExpired: false,
    };
  }

  return {
    message: "An unknown error occurred.",
    isNetworkError: false,
    isSessionExpired: false,
  };
}


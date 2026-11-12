/**
 * SafeBite Centralized API Endpoints
 * All paths must match the exact backend routing table.
 */

export const ENDPOINTS = {
  // System Health & Readiness
  HEALTH: "/health",
  READY: "/ready",

  // Authentication & Verification
  AUTH: {
    VALIDATE_EMAIL: "/api/auth/validate-email",
    SIGN_UP: "/api/auth/signup",
    VERIFY_EMAIL: "/api/auth/verify-email",
    RESEND_VERIFICATION_OTP: "/api/auth/resend-verification-otp",
    SIGN_IN: "/api/auth/login",
    PROFILE: "/api/auth/profile",
    LOGOUT: "/api/auth/logout",
    FORGOT_PASSWORD: "/api/auth/forgot-password",
    VERIFY_RESET_OTP: "/api/auth/verify-reset-otp",
    RESET_PASSWORD: "/api/auth/reset-password",
  },

  // User Data (Phase 2 endpoints implemented on backend)
  USER: {
    HISTORY: "/api/user/history",
    HISTORY_SCAN: "/api/user/history/scan",
    HISTORY_SEARCH: "/api/user/history/search",
    FAVORITES: "/api/user/favorites",
    FAVORITE_ITEM: (productId: string) => `/api/user/favorites/${productId}`,
    WATCHLIST: "/api/user/watchlist",
    WATCHLIST_ITEM: (productId: string) => `/api/user/watchlist/${productId}`,
    HEALTH_PROFILE: "/api/user/health-profile",
    HEALTH_CONSENT: "/api/user/health-profile/consent",
    HEALTH_TAGS: "/api/user/health-profile/tags",
  },

  // Storage (Phase 2)
  STORAGE: {
    UPLOAD: "/api/storage/upload",
    SIGNED_UPLOAD: "/api/storage/signed-upload",
    SIGNED_URL: "/api/storage/signed-url",
    FILES: "/api/storage/files",
  },
} as const;

export default ENDPOINTS;

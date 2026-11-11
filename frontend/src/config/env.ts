/**
 * SafeBite Mobile App - Environment Configuration
 * Reads from Expo environment variables with safe fallbacks.
 */

export const ENV = {
  API_BASE_URL:
    process.env.EXPO_PUBLIC_API_URL || "https://q136wfhl-3000.inc1.devtunnels.ms",
  API_TIMEOUT_MS: 30000, // 30s accommodates devtunnel relay latency
  APP_NAME: "SafeBite",
  APP_VERSION: "1.0.0",
} as const;

export default ENV;


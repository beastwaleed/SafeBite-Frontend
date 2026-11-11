import * as SecureStore from "expo-secure-store";
import { Platform } from "react-native";

/**
 * Key constants for encrypted storage in Expo SecureStore.
 */
const TOKEN_KEY = "safebite_auth_token";
const USER_KEY = "safebite_user_cache";

const isWeb = Platform.OS === "web";

export const secureStorage = {
  /**
   * Save the JWT authentication token securely.
   */
  async setToken(token: string): Promise<void> {
    try {
      if (isWeb && typeof window !== "undefined" && window.localStorage) {
        window.localStorage.setItem(TOKEN_KEY, token);
        return;
      }
      await SecureStore.setItemAsync(TOKEN_KEY, token);
    } catch (error) {
      console.warn("SecureStore setToken error:", error);
    }
  },

  /**
   * Retrieve the stored JWT token.
   */
  async getToken(): Promise<string | null> {
    try {
      if (isWeb && typeof window !== "undefined" && window.localStorage) {
        return window.localStorage.getItem(TOKEN_KEY);
      }
      return await SecureStore.getItemAsync(TOKEN_KEY);
    } catch (error) {
      console.warn("SecureStore getToken error:", error);
      return null;
    }
  },

  /**
   * Remove the stored JWT token.
   */
  async removeToken(): Promise<void> {
    try {
      if (isWeb && typeof window !== "undefined" && window.localStorage) {
        window.localStorage.removeItem(TOKEN_KEY);
        return;
      }
      await SecureStore.deleteItemAsync(TOKEN_KEY);
    } catch (error) {
      console.warn("SecureStore removeToken error:", error);
    }
  },

  /**
   * Check whether an authentication token currently exists in secure storage.
   */
  async hasToken(): Promise<boolean> {
    try {
      if (isWeb && typeof window !== "undefined" && window.localStorage) {
        const token = window.localStorage.getItem(TOKEN_KEY);
        return Boolean(token && token.trim().length > 0);
      }
      const token = await SecureStore.getItemAsync(TOKEN_KEY);
      return Boolean(token && token.trim().length > 0);
    } catch (error) {
      console.warn("SecureStore hasToken error:", error);
      return false;
    }
  },

  /**
   * Cache user profile snapshot for instant cold-start hydration.
   */
  async setUserCache(user: object): Promise<void> {
    try {
      if (isWeb && typeof window !== "undefined" && window.localStorage) {
        window.localStorage.setItem(USER_KEY, JSON.stringify(user));
        return;
      }
      await SecureStore.setItemAsync(USER_KEY, JSON.stringify(user));
    } catch (error) {
      console.warn("SecureStore setUserCache error:", error);
    }
  },

  /**
   * Retrieve cached user profile.
   */
  async getUserCache<T>(): Promise<T | null> {
    try {
      if (isWeb && typeof window !== "undefined" && window.localStorage) {
        const data = window.localStorage.getItem(USER_KEY);
        return data ? JSON.parse(data) : null;
      }
      const data = await SecureStore.getItemAsync(USER_KEY);
      return data ? JSON.parse(data) : null;
    } catch (error) {
      console.warn("SecureStore getUserCache error:", error);
      return null;
    }
  },

  /**
   * Clear all authenticated session data on sign out.
   */
  async clearSession(): Promise<void> {
    try {
      if (isWeb && typeof window !== "undefined" && window.localStorage) {
        window.localStorage.removeItem(TOKEN_KEY);
        window.localStorage.removeItem(USER_KEY);
        return;
      }
      await Promise.all([
        SecureStore.deleteItemAsync(TOKEN_KEY),
        SecureStore.deleteItemAsync(USER_KEY),
      ]);
    } catch (error) {
      console.warn("SecureStore clearSession error:", error);
    }
  },
};

export default secureStorage;


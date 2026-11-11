import * as SecureStore from "expo-secure-store";

/**
 * Key constants for encrypted storage in Expo SecureStore.
 */
const TOKEN_KEY = "safebite_auth_token";
const USER_KEY = "safebite_user_cache";

export const secureStorage = {
  /**
   * Save the JWT authentication token securely.
   */
  async setToken(token: string): Promise<void> {
    try {
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
      await SecureStore.deleteItemAsync(TOKEN_KEY);
    } catch (error) {
      console.warn("SecureStore removeToken error:", error);
    }
  },

  /**
   * Cache user profile snapshot for instant cold-start hydration.
   */
  async setUserCache(user: object): Promise<void> {
    try {
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
      await SecureStore.deleteItemAsync(TOKEN_KEY);
      await SecureStore.deleteItemAsync(USER_KEY);
    } catch (error) {
      console.warn("SecureStore clearSession error:", error);
    }
  },
};

export default secureStorage;


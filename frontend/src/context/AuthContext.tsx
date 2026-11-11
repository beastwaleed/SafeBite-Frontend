import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  ReactNode,
} from "react";
import { secureStorage } from "../storage/secureStore";
import { authService } from "../api/auth.service";
import { setAuthTokenInMemory, setOnUnauthorizedCallback } from "../api/client";
import { parseApiError } from "../api/error-handler";
import {
  UserProfile,
  SignInRequest,
  SignUpRequest,
  UpdateProfileRequest,
} from "../types/api.types";

export interface AuthContextType {
  user: UserProfile | null;
  token: string | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  authError: string | null;
  signIn: (credentials: SignInRequest) => Promise<void>;
  signUp: (data: SignUpRequest) => Promise<void>;
  signOut: () => Promise<void>;
  updateProfile: (data: UpdateProfileRequest) => Promise<void>;
  refreshProfile: () => Promise<void>;
  clearAuthError: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [authError, setAuthError] = useState<string | null>(null);

  const clearAuthError = useCallback(() => {
    setAuthError(null);
  }, []);

  /**
   * Handle unexpected session expiration from 401 responses.
   */
  const handleSessionExpired = useCallback(async () => {
    setUser(null);
    setToken(null);
    setAuthTokenInMemory(null);
    await secureStorage.clearSession();
    setAuthError("Your session has expired. Please sign in again.");
  }, []);

  /**
   * Initialize session on cold start.
   */
  useEffect(() => {
    setOnUnauthorizedCallback(handleSessionExpired);

    const initializeAuth = async () => {
      try {
        const storedToken = await secureStorage.getToken();
        if (!storedToken) {
          setIsLoading(false);
          return;
        }

        setToken(storedToken);
        setAuthTokenInMemory(storedToken);

        // Try hydrating from cache first for instantaneous UI render
        const cachedUser = await secureStorage.getUserCache<UserProfile>();
        if (cachedUser) {
          setUser(cachedUser);
        }

        // Fetch fresh profile from backend
        try {
          const freshProfile = await authService.getProfile();
          setUser(freshProfile);
          await secureStorage.setUserCache(freshProfile);
        } catch (fetchError) {
          const parsed = parseApiError(fetchError);
          if (parsed.isSessionExpired) {
            // Definitively invalid or expired token (HTTP 401)
            await handleSessionExpired();
          } else if (parsed.isNetworkError) {
            // Temporary network failure / offline: preserve stored token & session
            console.warn("Network unavailable during startup auth check; preserved offline session.");
          } else {
            // Unexpected unrecoverable failure
            console.warn("Profile fetch error on startup:", parsed.message);
          }
        }
      } catch (error) {
        console.warn("Auth initialization error:", error);
      } finally {
        setIsLoading(false);
      }
    };

    initializeAuth();
  }, [handleSessionExpired]);

  /**
   * Sign In
   */
  const signIn = async (credentials: SignInRequest) => {
    setIsLoading(true);
    setAuthError(null);
    try {
      const data = await authService.signIn(credentials);
      setToken(data.token);
      setUser(data.user);
      await secureStorage.setToken(data.token);
      await secureStorage.setUserCache(data.user);
    } catch (error) {
      const parsed = parseApiError(error);
      setAuthError(parsed.message);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Sign Up
   */
  const signUp = async (data: SignUpRequest) => {
    setIsLoading(true);
    setAuthError(null);
    try {
      const result = await authService.signUp(data);
      setToken(result.token);
      setUser(result.user);
      await secureStorage.setToken(result.token);
      await secureStorage.setUserCache(result.user);
    } catch (error) {
      const parsed = parseApiError(error);
      setAuthError(parsed.message);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Sign Out
   */
  const signOut = async () => {
    setIsLoading(true);
    try {
      await authService.signOut();
    } catch {
      // Backend is stateless; proceed with local cleanup
    } finally {
      setUser(null);
      setToken(null);
      setAuthTokenInMemory(null);
      await secureStorage.clearSession();
      setAuthError(null);
      setIsLoading(false);
    }
  };

  /**
   * Update Profile (fullName)
   */
  const updateProfile = async (data: UpdateProfileRequest) => {
    setIsLoading(true);
    setAuthError(null);
    try {
      const updatedUser = await authService.updateProfile(data);
      setUser(updatedUser);
      await secureStorage.setUserCache(updatedUser);
    } catch (error) {
      const parsed = parseApiError(error);
      setAuthError(parsed.message);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Refresh authenticated user profile from backend
   */
  const refreshProfile = async () => {
    if (!token) return;
    try {
      const freshUser = await authService.getProfile();
      setUser(freshUser);
      await secureStorage.setUserCache(freshUser);
    } catch (error) {
      const parsed = parseApiError(error);
      if (parsed.isSessionExpired) {
        await handleSessionExpired();
      }
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isLoading,
        isAuthenticated: Boolean(user && token),
        authError,
        signIn,
        signUp,
        signOut,
        updateProfile,
        refreshProfile,
        clearAuthError,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export default AuthContext;

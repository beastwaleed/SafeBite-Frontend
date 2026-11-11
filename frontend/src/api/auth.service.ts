import apiClient, { setAuthTokenInMemory } from "./client";
import { ENDPOINTS } from "./endpoints";
import {
  ApiResponse,
  AuthSuccessData,
  SignInRequest,
  SignUpRequest,
  UpdateProfileRequest,
  ResetPasswordRequest,
  UserProfile,
} from "../types/api.types";

export const authService = {
  /**
   * Register a new SafeBite user account.
   * Backend Endpoint: POST /api/auth/signup
   */
  async signUp(input: SignUpRequest): Promise<AuthSuccessData> {
    const payload: SignUpRequest = {
      email: input.email.trim().toLowerCase(),
      password: input.password,
    };
    if (input.fullName && input.fullName.trim().length > 0) {
      payload.fullName = input.fullName.trim();
    }

    const response = await apiClient.post<ApiResponse<AuthSuccessData>>(
      ENDPOINTS.AUTH.SIGN_UP,
      payload
    );

    if (!response.data.data) {
      throw new Error(response.data.message || "Failed to register account.");
    }

    setAuthTokenInMemory(response.data.data.token);
    return response.data.data;
  },

  /**
   * Authenticate user with email and password.
   * Backend Endpoint: POST /api/auth/login
   */
  async signIn(input: SignInRequest): Promise<AuthSuccessData> {
    const payload: SignInRequest = {
      email: input.email.trim().toLowerCase(),
      password: input.password,
    };

    const response = await apiClient.post<ApiResponse<AuthSuccessData>>(
      ENDPOINTS.AUTH.SIGN_IN,
      payload
    );

    if (!response.data.data) {
      throw new Error(response.data.message || "Authentication failed.");
    }

    setAuthTokenInMemory(response.data.data.token);
    return response.data.data;
  },

  /**
   * Fetch currently authenticated user profile.
   * Backend Endpoint: GET /api/auth/profile
   */
  async getProfile(): Promise<UserProfile> {
    const response = await apiClient.get<ApiResponse<{ user: UserProfile }>>(
      ENDPOINTS.AUTH.PROFILE
    );

    if (!response.data.data?.user) {
      throw new Error("Unable to retrieve user profile.");
    }

    return response.data.data.user;
  },

  /**
   * Update authenticated user's profile information (fullName).
   * Backend Endpoint: PATCH /api/auth/profile
   */
  async updateProfile(input: UpdateProfileRequest): Promise<UserProfile> {
    const payload: UpdateProfileRequest = {};
    if (input.fullName !== undefined) {
      payload.fullName = input.fullName.trim();
    }

    const response = await apiClient.patch<ApiResponse<{ user: UserProfile }>>(
      ENDPOINTS.AUTH.PROFILE,
      payload
    );

    if (!response.data.data?.user) {
      throw new Error(response.data.message || "Failed to update profile.");
    }

    return response.data.data.user;
  },

  /**
   * End session and inform backend.
   * Backend Endpoint: POST /api/auth/logout
   */
  async signOut(): Promise<void> {
    try {
      await apiClient.post(ENDPOINTS.AUTH.LOGOUT);
    } catch {
      // Backend logout is stateless; ignore errors and clear client
    } finally {
      setAuthTokenInMemory(null);
    }
  },

  /**
   * Initiate password recovery request.
   * Backend Endpoint: POST /api/auth/forgot-password
   */
  async forgotPassword(input: ResetPasswordRequest): Promise<string> {
    const payload: ResetPasswordRequest = {
      email: input.email.trim().toLowerCase(),
    };

    const response = await apiClient.post<ApiResponse>(
      ENDPOINTS.AUTH.FORGOT_PASSWORD,
      payload
    );

    return (
      response.data.message ||
      "If an account exists with that email, instructions have been sent."
    );
  },

  /**
   * Health check ping to verify server connectivity.
   */
  async pingHealth(): Promise<boolean> {
    try {
      const response = await apiClient.get(ENDPOINTS.HEALTH, { timeout: 5000 });
      return response.status === 200 && response.data?.success === true;
    } catch {
      return false;
    }
  },
};

export default authService;


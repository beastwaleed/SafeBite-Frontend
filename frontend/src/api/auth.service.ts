import apiClient, { setAuthTokenInMemory } from "./client";
import { ENDPOINTS } from "./endpoints";
import {
  ApiResponse,
  AuthSuccessData,
  SignInRequest,
  SignUpRequest,
  SignUpPendingData,
  VerifyEmailRequest,
  ResendVerificationRequest,
  UpdateProfileRequest,
  ResetPasswordRequest,
  VerifyResetOtpRequest,
  VerifyResetOtpResponseData,
  ResetPasswordWithTokenRequest,
  ValidateEmailResponseData,
  UserProfile,
} from "../types/api.types";

export const authService = {
  /**
   * Validate email syntax, typos, disposable domains, and MX reachability.
   * Backend Endpoint: POST /api/auth/validate-email
   */
  async validateEmail(email: string): Promise<ValidateEmailResponseData> {
    const response = await apiClient.post<ApiResponse<ValidateEmailResponseData>>(
      ENDPOINTS.AUTH.VALIDATE_EMAIL,
      { email: email.trim().toLowerCase() }
    );

    if (!response.data.data) {
      throw new Error("Unable to validate email address.");
    }

    return response.data.data;
  },

  /**
   * Register a new SafeBite user account and trigger verification OTP.
   * Backend Endpoint: POST /api/auth/signup
   */
  async signUp(input: SignUpRequest): Promise<SignUpPendingData> {
    const payload: SignUpRequest = {
      email: input.email.trim().toLowerCase(),
      password: input.password,
    };
    if (input.fullName && input.fullName.trim().length > 0) {
      payload.fullName = input.fullName.trim();
    }

    const response = await apiClient.post<ApiResponse<SignUpPendingData>>(
      ENDPOINTS.AUTH.SIGN_UP,
      payload
    );

    if (!response.data.data) {
      throw new Error(response.data.message || "Failed to register account.");
    }

    return response.data.data;
  },

  /**
   * Confirm newly registered account with 6-digit OTP and obtain 90-day JWT.
   * Backend Endpoint: POST /api/auth/verify-email
   */
  async verifyEmail(input: VerifyEmailRequest): Promise<AuthSuccessData> {
    const payload: VerifyEmailRequest = {
      email: input.email.trim().toLowerCase(),
      otp: input.otp.trim(),
    };

    const response = await apiClient.post<ApiResponse<AuthSuccessData>>(
      ENDPOINTS.AUTH.VERIFY_EMAIL,
      payload
    );

    if (!response.data.data) {
      throw new Error(response.data.message || "Email verification failed.");
    }

    setAuthTokenInMemory(response.data.data.token);
    return response.data.data;
  },

  /**
   * Resend 6-digit account confirmation OTP.
   * Backend Endpoint: POST /api/auth/resend-verification-otp
   */
  async resendVerificationOtp(email: string): Promise<string> {
    const payload: ResendVerificationRequest = {
      email: email.trim().toLowerCase(),
    };

    const response = await apiClient.post<ApiResponse>(
      ENDPOINTS.AUTH.RESEND_VERIFICATION_OTP,
      payload
    );

    return (
      response.data.message ||
      "If an unverified account exists with that email, a 6-digit verification code has been sent."
    );
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
   * Initiate password recovery request. Sends 6-digit reset OTP to email.
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
      "If an account exists with that email, a 6-digit verification code has been sent."
    );
  },

  /**
   * Verify 6-digit password reset OTP and obtain resetToken.
   * Backend Endpoint: POST /api/auth/verify-reset-otp
   */
  async verifyResetOtp(
    input: VerifyResetOtpRequest
  ): Promise<VerifyResetOtpResponseData> {
    const payload: VerifyResetOtpRequest = {
      email: input.email.trim().toLowerCase(),
      otp: input.otp.trim(),
    };

    const response = await apiClient.post<ApiResponse<VerifyResetOtpResponseData>>(
      ENDPOINTS.AUTH.VERIFY_RESET_OTP,
      payload
    );

    if (!response.data.data?.resetToken) {
      throw new Error(response.data.message || "Invalid or expired reset code.");
    }

    return response.data.data;
  },

  /**
   * Complete password reset with verified token.
   * Backend Endpoint: POST /api/auth/reset-password
   */
  async resetPassword(input: ResetPasswordWithTokenRequest): Promise<string> {
    const payload: ResetPasswordWithTokenRequest = {
      resetToken: input.resetToken.trim(),
      newPassword: input.newPassword,
    };

    const response = await apiClient.post<ApiResponse>(
      ENDPOINTS.AUTH.RESET_PASSWORD,
      payload
    );

    return (
      response.data.message ||
      "Password reset successfully. Please sign in with your new password."
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

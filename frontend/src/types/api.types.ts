/**
 * SafeBite API Contract Types
 * Derived strictly from backend OpenAPI spec and Prisma schemas.
 */

export interface ApiResponse<T = any> {
  success: boolean;
  message?: string;
  data?: T;
  statusCode?: number;
}

export interface ApiErrorResponse {
  success: false;
  message: string;
  statusCode?: number;
  errors?: Array<{
    field: string;
    message: string;
  }>;
}

export type HealthTag =
  | "PREGNANCY"
  | "INFANT"
  | "KIDNEY_ISSUE"
  | "HYPERTENSION"
  | "DIABETES"
  | "CELIAC"
  | "NUT_ALLERGY"
  | "HEART_CONDITION"
  | "ELDERLY"
  | "GENERAL_POPULATION";

export interface HealthProfileResponse {
  consent: boolean;
  consentDate: string | null;
  tags: HealthTag[];
}

export interface UserProfile {
  id: string;
  email: string;
  fullName: string | null;
  role: "USER" | "ADMIN";
  emailVerified: boolean;
  emailVerifiedAt: string | null;
  healthConsent: boolean;
  consentDate: string | null;
  healthTags: HealthTag[];
  createdAt: string;
  updatedAt?: string;
}

export interface AuthSuccessData {
  user: UserProfile;
  token: string;
}

export interface SignUpRequest {
  email: string;
  password: string;
  fullName?: string;
}

export interface SignUpPendingData {
  user: UserProfile;
  requiresEmailVerification: boolean;
  expiresInMinutes: number;
}

export interface VerifyEmailRequest {
  email: string;
  otp: string;
}

export interface ResendVerificationRequest {
  email: string;
}

export interface SignInRequest {
  email: string;
  password: string;
}

export interface UpdateProfileRequest {
  fullName?: string;
}

export interface ResetPasswordRequest {
  email: string;
}

export interface VerifyResetOtpRequest {
  email: string;
  otp: string;
}

export interface VerifyResetOtpResponseData {
  resetToken: string;
  expiresInMinutes: number;
}

export interface ResetPasswordWithTokenRequest {
  resetToken: string;
  newPassword: string;
}

export interface ValidateEmailRequest {
  email: string;
}

export interface ValidateEmailChecks {
  syntax: boolean;
  noInvalidChars: boolean;
  notDisposable: boolean;
  noKnownTypo: boolean;
  domainResolvable: boolean | null;
}

export interface ValidateEmailResponseData {
  valid: boolean;
  normalizedEmail: string;
  checks: ValidateEmailChecks;
  suggestion?: string;
  message?: string;
}

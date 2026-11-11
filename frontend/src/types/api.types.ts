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

export interface UserProfile {
  id: string;
  email: string;
  fullName: string | null;
  role: "USER" | "ADMIN";
  healthConsent: boolean;
  consentDate: string | null;
  healthTags: Array<
    | "PREGNANCY"
    | "INFANT"
    | "KIDNEY_ISSUE"
    | "HYPERTENSION"
    | "DIABETES"
    | "CELIAC"
    | "NUT_ALLERGY"
    | "HEART_CONDITION"
    | "ELDERLY"
    | "GENERAL_POPULATION"
  >;
  createdAt: string;
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


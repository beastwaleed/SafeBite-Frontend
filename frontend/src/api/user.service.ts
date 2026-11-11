import apiClient from "./client";
import { ENDPOINTS } from "./endpoints";
import {
  ApiResponse,
  HealthProfileResponse,
  HealthTag,
} from "../types/api.types";

export const userService = {
  /**
   * Fetch current user's health profile (consent & tags).
   * Backend Endpoint: GET /api/user/health-profile
   */
  async getHealthProfile(): Promise<HealthProfileResponse> {
    const response = await apiClient.get<ApiResponse<HealthProfileResponse>>(
      ENDPOINTS.USER.HEALTH_PROFILE
    );
    if (!response.data.data) {
      throw new Error("Unable to retrieve health profile.");
    }
    return response.data.data;
  },

  /**
   * Set explicit health-context consent (true/false).
   * Backend Endpoint: PUT /api/user/health-profile/consent
   */
  async setHealthConsent(consent: boolean): Promise<HealthProfileResponse> {
    const response = await apiClient.put<ApiResponse<HealthProfileResponse>>(
      ENDPOINTS.USER.HEALTH_CONSENT,
      { consent }
    );
    if (!response.data.data) {
      throw new Error(response.data.message || "Failed to update health consent.");
    }
    return response.data.data;
  },

  /**
   * Update active health-context tags.
   * Backend Endpoint: PUT /api/user/health-profile/tags
   */
  async updateHealthTags(tags: HealthTag[]): Promise<HealthProfileResponse> {
    const response = await apiClient.put<ApiResponse<HealthProfileResponse>>(
      ENDPOINTS.USER.HEALTH_TAGS,
      { tags }
    );
    if (!response.data.data) {
      throw new Error(response.data.message || "Failed to update health tags.");
    }
    return response.data.data;
  },

  /**
   * Clear health profile (revokes consent and removes all tags).
   * Backend Endpoint: DELETE /api/user/health-profile
   */
  async clearHealthProfile(): Promise<HealthProfileResponse> {
    const response = await apiClient.delete<
      ApiResponse<HealthProfileResponse>
    >(ENDPOINTS.USER.HEALTH_PROFILE);
    if (!response.data.data) {
      return { consent: false, consentDate: null, tags: [] };
    }
    return response.data.data;
  },

  /**
   * Fetch user's saved favorites.
   * Backend Endpoint: GET /api/user/favorites
   */
  async getFavorites(): Promise<any[]> {
    const response = await apiClient.get<ApiResponse<any[]>>(
      ENDPOINTS.USER.FAVORITES
    );
    return response.data.data || [];
  },

  /**
   * Fetch user's contaminant watchlist.
   * Backend Endpoint: GET /api/user/watchlist
   */
  async getWatchlist(): Promise<any[]> {
    const response = await apiClient.get<ApiResponse<any[]>>(
      ENDPOINTS.USER.WATCHLIST
    );
    return response.data.data || [];
  },

  /**
   * Fetch user scan and search history.
   * Backend Endpoint: GET /api/user/history
   */
  async getHistory(): Promise<{ scanHistory: any[]; searchHistory: any[] }> {
    const response = await apiClient.get<ApiResponse<any>>(
      ENDPOINTS.USER.HISTORY
    );
    return response.data.data || { scanHistory: [], searchHistory: [] };
  },

  /**
   * Clear user scan and search history.
   * Backend Endpoint: DELETE /api/user/history
   */
  async clearHistory(): Promise<void> {
    await apiClient.delete(ENDPOINTS.USER.HISTORY);
  },
};

export default userService;


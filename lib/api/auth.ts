// lib/api/auth.ts
import { apiFetch } from "../api";

/**
 * Auth API Functions
 */
export const authAPI = {
  /**
   * Login user
   */
  login: async (username: string, password: string) => {
    return apiFetch("/auth/login", {
      method: "POST",
      body: JSON.stringify({ username, password }),
    });
  },

  /**
   * Get current user profile
   */
  getProfile: async () => {
    return apiFetch("/auth/me", {
      method: "GET",
    });
  },

  /**
   * Logout user
   */
  logout: async () => {
    return apiFetch("/auth/logout", {
      method: "POST",
    });
  },
};

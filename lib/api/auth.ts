// lib/api/auth.ts
import { apiFetch } from "./client";

export const authAPI = {
  /**
   * Login admin
   */
  login: async (username: string, password: string) => {
    return apiFetch("/auth/login", {
      method: "POST",
      body: JSON.stringify({ username, password }),
    });
  },

  /**
   * Get profile info (admin)
   */
  getProfile: async () => {
    return apiFetch("/auth/me", {
      method: "GET",
    });
  },

  /**
   * Logout
   */
  logout: async () => {
    return apiFetch("/auth/logout", {
      method: "POST",
    });
  },
};

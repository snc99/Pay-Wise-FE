import axios from "axios";

const API_BASE_URL = (
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001"
).replace(/\/$/, "");

export const api = axios.create({
  baseURL: `${API_BASE_URL}/api`,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

// 🔥 RESPONSE INTERCEPTOR
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error?.response?.status;

    if (status === 401) {
      // ⛔ PENTING: jangan redirect kalau sudah di halaman login
      if (
        typeof window !== "undefined" &&
        window.location.pathname !== "/auth/login"
      ) {
        window.location.href = "/auth/login";
      }
    }

    return Promise.reject(error);
  },
);

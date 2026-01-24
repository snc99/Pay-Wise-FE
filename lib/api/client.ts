// lib/api/client.ts
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

function normalizeError(err: any) {
  if (err.response?.data) return err.response.data;
  return {
    success: false,
    message: err.message ?? "Terjadi kesalahan",
  };
}

export async function apiFetch(
  endpoint: string,
  options?: {
    method?: "GET" | "POST" | "PUT" | "DELETE";
    body?: any;
  },
) {
  try {
    const res = await api({
      url: endpoint,
      method: options?.method ?? "GET",
      data: options?.body,
    });
    return res.data;
  } catch (err: any) {
    throw normalizeError(err);
  }
}

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

function normalizeError(err: unknown) {
  if (
    typeof err === "object" &&
    err !== null &&
    "response" in err &&
    typeof (err as { response?: unknown }).response === "object"
  ) {
    const data = (err as { response?: { data?: unknown } }).response?.data;
    if (data) return data;
  }

  if (err instanceof Error) {
    return {
      success: false,
      message: err.message,
    };
  }

  return {
    success: false,
    message: "Terjadi kesalahan",
  };
}

export async function apiFetch(
  endpoint: string,
  options?: {
    method?: "GET" | "POST" | "PUT" | "DELETE";
    body?: unknown;
  },
) {
  try {
    const res = await api({
      url: endpoint,
      method: options?.method ?? "GET",
      data: options?.body,
    });
    return res.data;
  } catch (err: unknown) {
    throw normalizeError(err);
  }
}

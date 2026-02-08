import axios from "axios";
import { api } from "./axios";
import type { AuthResponse } from "@/lib/types/auth";

export const login = async (
  username: string,
  password: string,
): Promise<AuthResponse> => {
  const res = await api.post("/auth/login", { username, password });
  return res.data;
};

export const getProfile = async (): Promise<AuthResponse | null> => {
  try {
    const res = await api.get("/auth/me");
    return res.data;
  } catch (err) {
    if (axios.isAxiosError(err) && err.response?.status === 401) {
      return null;
    }
    throw err;
  }
};

export const logout = async (): Promise<void> => {
  await api.post("/auth/logout");
};

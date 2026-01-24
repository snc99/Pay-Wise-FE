import type { AxiosError } from "axios";

export type ApiError = {
  status?: number;
  message?: string;
  errors?: Record<string, string[]>;
};

export function normalizeApiError(err: unknown): ApiError {
  const e = err as AxiosError<any>;

  return {
    status: e.response?.status,
    message: e.response?.data?.message || e.message,
    errors: e.response?.data?.errors,
  };
}

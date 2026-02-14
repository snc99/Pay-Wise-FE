import type { AxiosError } from "axios";

export type ApiError = {
  status?: number;
  message?: string;
  errors?: Record<string, string[]>;
};

export function normalizeApiError(err: unknown): ApiError {
  const e = err as AxiosError<unknown>;

  const status = e.response?.status;
  const data = e.response?.data;

  if (typeof data === "object" && data !== null) {
    const maybeMessage = "message" in data ? data.message : undefined;
    const maybeErrors = "errors" in data ? data.errors : undefined;

    return {
      status,
      message:
        typeof maybeMessage === "string" ? maybeMessage : "Terjadi kesalahan",
      errors:
        typeof maybeErrors === "object" && maybeErrors !== null
          ? (maybeErrors as Record<string, string[]>)
          : undefined,
    };
  }

  if (e.message) {
    return {
      status,
      message: e.message,
    };
  }

  return {
    status,
    message: "Terjadi kesalahan",
  };
}

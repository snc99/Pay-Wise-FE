export function getErrorMessage(err: unknown): string {
  if (
    typeof err === "object" &&
    err !== null &&
    "response" in err &&
    typeof (err as { response?: unknown }).response === "object"
  ) {
    const data = (err as { response?: { data?: unknown } }).response?.data;

    // kalau ada validation errors
    if (typeof data === "object" && data !== null && "errors" in data) {
      const errors = (data as { errors?: Record<string, unknown> }).errors;

      if (errors && typeof errors === "object") {
        const firstKey = Object.keys(errors)[0];
        const messages = errors[firstKey];

        if (Array.isArray(messages) && messages.length > 0) {
          return String(messages[0]);
        }
      }
    }

    // kalau ada message biasa
    if (typeof data === "object" && data !== null && "message" in data) {
      return String((data as { message?: unknown }).message);
    }
  }

  if (err instanceof Error) {
    if (err.message.toLowerCase().includes("network")) {
      return "Tidak dapat terhubung ke server";
    }
    return err.message;
  }

  return "Terjadi kesalahan. Silakan coba lagi.";
}

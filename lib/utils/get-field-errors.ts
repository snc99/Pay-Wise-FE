export function getFieldErrors(err: unknown): Record<string, string> | null {
  if (
    typeof err === "object" &&
    err !== null &&
    "response" in err &&
    typeof (err as { response?: unknown }).response === "object"
  ) {
    const data = (err as { response?: { data?: unknown } }).response?.data;

    if (typeof data === "object" && data !== null && "errors" in data) {
      const apiErrors = (data as { errors?: Record<string, unknown> }).errors;

      if (apiErrors && typeof apiErrors === "object") {
        const fieldErrors: Record<string, string> = {};

        Object.entries(apiErrors).forEach(([field, messages]) => {
          if (Array.isArray(messages) && messages.length > 0) {
            fieldErrors[field.toLowerCase()] = String(messages[0]);
          }
        });

        return fieldErrors;
      }
    }
  }

  return null;
}

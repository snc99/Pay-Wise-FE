// lib/api.ts
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

interface ApiFetchOptions extends RequestInit {
  auth?: boolean; // default true
}

export async function apiFetch(
  endpoint: string,
  options: ApiFetchOptions = {}
): Promise<any> {
  const { auth = true, headers = {}, ...restOptions } = options;

  // Pastikan endpoint dimulai dengan /
  const url = `${API_BASE_URL}/api${
    endpoint.startsWith("/") ? endpoint : `/${endpoint}`
  }`;

  const fetchOptions: RequestInit = {
    ...restOptions,
    headers: {
      "Content-Type": "application/json",
      ...headers,
    },
    credentials: "include", // ✅ PENTING! Selalu kirim cookie
  };

  try {
    const response = await fetch(url, fetchOptions);

    // Jika response tidak ok, throw error
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(
        errorData.message ||
          `HTTP Error: ${response.status} ${response.statusText}`
      );
    }

    // Parse JSON response
    const data = await response.json();
    return data;
  } catch (error: any) {
    // console.error("API Fetch Error:", error);
    throw error;
  }
}

// Helper untuk logout
export async function logout() {
  try {
    await apiFetch("/auth/logout", {
      method: "POST",
    });
    // Redirect ke login setelah logout
    window.location.href = "/auth/login";
  } catch (error) {
    console.error("Logout error:", error);
  }
}

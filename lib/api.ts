// lib/api.ts
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

interface ApiFetchOptions extends RequestInit {
  auth?: boolean; // default true
}

/**
 * Base fetch function untuk semua API calls
 * - Auto handle cookies dengan credentials: 'include'
 * - Auto throw error dengan response data
 * - Auto prefix /api ke endpoint
 */
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
    const data = await response.json();

    // Jika response tidak ok, throw error dengan full response data
    if (!response.ok) {
      const error: any = new Error(
        data.message || `HTTP Error: ${response.status}`
      );
      error.response = data; // Attach full response for error handling
      throw error;
    }

    return data;
  } catch (error: any) {
    throw error;
  }
}

// Helper untuk logout (optional, bisa dipindah ke auth.ts)
export async function logout() {
  try {
    await apiFetch("/auth/logout", {
      method: "POST",
    });
    // Redirect ke login setelah logout
    window.location.href = "/login";
  } catch (error) {
    console.error("Logout error:", error);
  }
}

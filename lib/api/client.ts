// lib/api/client.ts
const API_BASE_URL = (
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001"
).replace(/\/$/, "");

interface ApiFetchOptions extends RequestInit {
  auth?: boolean;
}

async function safeJson(res: Response) {
  const t = await res.text();
  return t ? JSON.parse(t) : null;
}

export async function apiFetch(
  endpoint: string,
  options: ApiFetchOptions = {}
) {
  const { auth = true, headers = {}, ...rest } = options;
  const path = endpoint.startsWith("/") ? endpoint : `/${endpoint}`;
  const url = `${API_BASE_URL}/api${path}`;

  const fetchOptions: RequestInit = {
    ...rest,
    headers: { "Content-Type": "application/json", ...headers },
    credentials: "include",
  };

  const res = await fetch(url, fetchOptions);
  const data = await safeJson(res);
  if (!res.ok) {
    const err: any = new Error(data?.message || `HTTP ${res.status}`);
    err.status = res.status;
    err.response = data;
    throw err;
  }
  return data;
}

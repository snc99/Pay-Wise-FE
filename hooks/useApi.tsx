// hooks/useApi.tsx
"use client";
import { useCallback } from "react";
import { useRouter } from "next/navigation";
import { apiFetch } from "@/lib/api";

export function useApi() {
  const router = useRouter();

  const fetchWithAuth = useCallback(
    async (path: string, opts?: RequestInit & { auth?: boolean }) => {
      try {
        return await apiFetch(path, opts);
      } catch (err: any) {
        if (err?.status === 401) {
          // already cleared token by apiFetch; do SPA navigation
          router.replace("/auth/login");
          // optionally throw so caller knows request failed
          throw err;
        }
        throw err;
      }
    },
    [router]
  );

  return { fetchWithAuth };
}

"use client";

import { useCallback } from "react";
import { useRouter } from "next/navigation";
import { apiFetch } from "@/lib/api";

type HttpMethod = "GET" | "POST" | "PUT" | "DELETE";

export function useApi() {
  const router = useRouter();

  const fetchWithAuth = useCallback(
    async (path: string, opts?: RequestInit & { auth?: boolean }) => {
      try {
        return await apiFetch(path, {
          method: (opts?.method as HttpMethod) ?? "GET",
          body: opts?.body,
        });
      } catch (err: unknown) {
        if (
          typeof err === "object" &&
          err !== null &&
          "status" in err &&
          err.status === 401
        ) {
          router.replace("/auth/login");
        }

        throw err;
      }
    },
    [router],
  );

  return { fetchWithAuth };
}

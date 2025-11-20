// lib/api/user.ts
import { apiFetch } from "./client";
import type { User } from "@/lib/types/user";

type RawGetUsersRes = {
  success?: boolean;
  status?: number;
  message?: string;
  data?: { items?: User[] };
  pagination?: {
    currentPage?: number;
    totalPages?: number;
    totalItems?: number;
  };
  [k: string]: any;
};

export async function getUsers(
  params: {
    search?: string;
    page?: number;
    limit?: number;
  } = {}
) {
  const qs = new URLSearchParams();

  if (params.search) qs.set("search", params.search);
  if (params.page) qs.set("page", String(params.page));
  qs.set("limit", String(params.limit ?? 7));

  // NOTE: endpoint is singular "/user" per BE
  const url = `/user${qs.toString() ? `?${qs.toString()}` : ""}`;
  // debug
  // console.log("[api] GET", url);

  const res = (await apiFetch(url)) as RawGetUsersRes | any;
  return res;
}

export async function getUserById(id: string) {
  return apiFetch(`/user/${id}`);
}

export async function createUser(body: {
  name: string;
  phone: string;
  address?: string | null;
}) {
  return apiFetch(`/user`, {
    method: "POST",
    body: JSON.stringify(body),
  });
}

export async function updateUser(
  id: string,
  body: Partial<{ name: string; phone: string; address?: string | null }>
) {
  return apiFetch(`/user/${id}`, {
    method: "PUT",
    body: JSON.stringify(body),
  });
}

export async function deleteUser(id: string) {
  return apiFetch(`/user/${id}`, { method: "DELETE" });
}

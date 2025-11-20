// lib/api/user.ts
import { apiFetch } from "./client";

export async function getAdmin(q?: string) {
  const qs = q ? `?q=${encodeURIComponent(q)}` : "";
  return apiFetch(`/admin${qs}`);
}

export async function getAdminById(id: string) {
  return apiFetch(`/admin/${id}`);
}
export async function createUser(payload: { name: string; email: string }) {
  return apiFetch(`/admin`, {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

// lib/api/user.ts
import { apiFetch } from "./client";

export async function getDebt(q?: string) {
  const qs = q ? `?q=${encodeURIComponent(q)}` : "";
  return apiFetch(`/debt${qs}`);
}

export async function getDebtById(id: string) {
  return apiFetch(`/debt/${id}`);
}

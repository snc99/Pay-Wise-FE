// lib/api/payment.ts
import { apiFetch } from "./client";

export async function getPayments(q?: string) {
  const qs = q ? `?q=${encodeURIComponent(q)}` : "";
  return apiFetch(`/payment${qs}`);
}

export async function getPaymentById(id: string) {
  return apiFetch(`/payment/${id}`);
}

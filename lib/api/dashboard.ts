// lib/api/dashboard.ts
import { apiFetch } from "./client";

export interface DashboardCardsData {
  totalUsers: number;
  totalPayments: number;
  totalDebts: number;
  totalPaidUsers: number;
}

// Fetcher function untuk SWR
export async function getDashboardCards(): Promise<DashboardCardsData> {
  const res = await apiFetch("/dashboard/cards", { method: "GET" });
  return res.data;
}

import { api } from "./axios";
import type {
  DashboardOverview,
  DashboardStats,
  RecentPayment,
  TopDebtor,
  DashboardPeriod,
} from "@/lib/types/dashboard";

// GET /api/dashboard/overview
export async function getDashboardOverview(): Promise<DashboardOverview> {
  const res = await api.get("/dashboard/overview");
  return res.data.data;
}

// GET /api/dashboard/stats
export async function getDashboardStats(
  period: DashboardPeriod = "all",
): Promise<DashboardStats> {
  const res = await api.get("/dashboard/stats", { params: { period } });
  return res.data.data;
}

// GET /api/dashboard/recent-payments
export async function getRecentPayments(
  limit: number = 5,
): Promise<RecentPayment[]> {
  const res = await api.get("/dashboard/recent-payments", {
    params: { limit },
  });
  return res.data.data;
}

// GET /api/dashboard/top-debtors
export async function getTopDebtors(limit: number = 5): Promise<TopDebtor[]> {
  const res = await api.get("/dashboard/top-debtors", {
    params: { limit },
  });
  return res.data.data;
}

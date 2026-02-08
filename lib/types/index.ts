// lib/types/index.ts
export * from "./admin";
export * from "./user";
export * from "./debt-item";

/**
 * Common helper types
 */
export type Paginated<T> = {
  data: T[];
  meta?: { page?: number; pageSize?: number; total?: number };
};

/**
 * Dashboard aggregate data shape used in dashboard cards
 */
export type DashboardData = {
  totalUsers: number;
  totalPayments: number; // if backend returns totalPayments as number; if string, change to string
  totalDebts: number; // if backend returns number
  totalPaidUsers: number;
};

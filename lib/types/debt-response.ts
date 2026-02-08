// lib/types/debt-response.ts
import type { DebtItem } from "./debt-item";
import type { DebtCycle } from "./debt-cycle";

export type Pagination = {
  currentPage: number;
  totalPages: number;
  totalItems: number;
};

/**
 * GET /debt
 */
export type DebtListResponse = {
  items: DebtCycle[];
  pagination: Pagination;
};

/**
 * GET /debt/:cycleId
 */
export type DebtDetailResponse = {
  cycle: DebtCycle;
  items: DebtItem[];
};

/**
 * GET /debt/open
 */
export type OpenDebtCycle = {
  cycleId: string;
  userId: string;
  userName: string;
  total: number;
};

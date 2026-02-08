import { api } from "./axios";

import type { PublicDebt } from "@/lib/types/debt-cycle";
import type {
  DebtDetailResponse,
  DebtListResponse,
  OpenDebtCycle,
} from "@/lib/types/debt-response";

/**
 * GET /debt
 */
export type GetDebtsParams = {
  search?: string;
  page?: number;
  limit?: number;
};

export async function getDebts(
  params: GetDebtsParams = {},
): Promise<DebtListResponse> {
  const res = await api.get("/debt", {
    params: {
      search: params.search,
      page: params.page,
      limit: params.limit ?? 7,
    },
  });

  return {
    items: res.data.data.items,
    pagination: res.data.pagination,
  };
}

/**
 * POST /debt
 */
export type CreateDebtPayload = {
  userId: string;
  amount: number;
  note?: string;
  date: string;
};

export type CreateDebtResponse = {
  cycleId: string;
  total: number;
  debt: {
    id: string;
    amount: number;
    date: string;
  };
};

export async function createDebt(
  payload: CreateDebtPayload,
): Promise<CreateDebtResponse> {
  const res = await api.post("/debt", payload);
  return res.data.data;
}

/**
 * GET /debt/open
 */
export async function getOpenDebtCycles(
  search?: string,
  limit = 10,
): Promise<OpenDebtCycle[]> {
  const res = await api.get("/debt/open", {
    params: { search, limit },
  });

  return res.data.data.items;
}

/**
 * GET /debt/public
 */
export async function getPublicDebts(search?: string): Promise<PublicDebt[]> {
  const res = await api.get("/debt/public", {
    params: { search },
  });

  return res.data.data.items;
}

/**
 * GET /debt/:cycleId
 * ambil detail / history satu invoice
 */
export async function getDebtHistory(
  cycleId: string,
): Promise<DebtDetailResponse> {
  const res = await api.get(`/debt/${cycleId}/items`);
  return res.data.data;
}

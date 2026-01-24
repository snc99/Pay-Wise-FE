import { api } from "./axios";

/**
 * GET /debt
 * list + search + pagination
 */
export type GetDebtsParams = {
  search?: string;
  page?: number;
  limit?: number;
};

export async function getDebts(params: GetDebtsParams = {}) {
  const res = await api.get("/debt", {
    params: {
      search: params.search,
      page: params.page,
      limit: params.limit ?? 7,
    },
  });

  return res.data;
}

/**
 * POST /debt
 * create new debt
 */
export type CreateDebtPayload = {
  userId: string;
  amount: number;
  date: string; // ISO string
};

export async function createDebt(payload: CreateDebtPayload) {
  const res = await api.post("/debt", payload);
  return res.data;
}

/**
 * DELETE /debt/:id
 * delete debt (only if all debts are paid)
 */
export async function deleteDebt(id: string) {
  const res = await api.delete(`/debt/${id}`);
  return res.data;
}

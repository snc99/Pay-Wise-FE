import { api } from "./axios";
import type {
  PaymentListResponse,
  CreatePaymentResponse,
  CreatePaymentPayload,
} from "@/lib/types/payment";

export type GetPaymentsParams = {
  search?: string;
  page?: number;
  limit?: number;
};

/**
 * GET /payments
 */
export async function getPayments(
  params: GetPaymentsParams = {},
): Promise<PaymentListResponse> {
  const res = await api.get("/payments", {
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
 * POST /payments
 */
export async function createPayment(
  payload: CreatePaymentPayload,
): Promise<CreatePaymentResponse> {
  const res = await api.post("/payments", payload);
  return res.data.data;
}

/**
 * DELETE /payments/:cycleId
 */
export async function deletePaymentCycle(cycleId: string): Promise<void> {
  await api.delete(`/payments/${cycleId}`);
}

// lib/types/payment.ts
export type Payment = {
  id: string;
  debtId: string;
  amount: string;
  remaining: string;
  paidAt: string;
  createdAt: string;
  updatedAt: string;
  deletedAt?: string | null;
  debt?: { id: string; amount: string } | null;
};

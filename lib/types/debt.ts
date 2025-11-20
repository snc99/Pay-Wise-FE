import { Payment } from "./payment";

// lib/types/debt.ts
export type DebtStatus = "pending" | "overdue" | "paid";

/**
 * NOTE: Prisma Decimal frequently returned as string in JSON.
 * Jika backend mengembalikan number, ganti `string` ke `number`.
 */
export type Debt = {
  id: string;
  userId: string;
  amount: string;
  date: string;
  createdAt: string;
  updatedAt: string;
  payments?: Payment[];
  user?: { id: string; name: string } | null;
};

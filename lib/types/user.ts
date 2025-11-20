import { Debt } from "./debt";

// lib/types/user.ts
export type User = {
  id: string;
  name: string;
  phone: string;
  address?: string | null;
  createdAt: string;
  updatedAt: string;
};

/**
 * Optional: response wrapper when user includes debts
 */
export type UserWithDebts = User & {
  debts?: Debt[];
};

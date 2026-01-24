// lib/types/debt.ts

export type Debt = {
  id: string;
  userId: string;
  amount: string; // Decimal
  date: string;
  createdAt: string;
  updatedAt: string;
  user: {
    id: string;
    name: string;
  };
};

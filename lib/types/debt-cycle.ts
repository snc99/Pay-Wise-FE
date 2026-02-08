// types debt-cycle
export type DebtCycle = {
  id: string;
  user: {
    id: string;
    name: string;
  };
  total: number;
  isPaid: boolean;
  paidAt?: string | null;
  createdAt: string;
};

export interface PublicDebt {
  id: string;
  name: string;
  total: number;
  status: "paid" | "unpaid";
}

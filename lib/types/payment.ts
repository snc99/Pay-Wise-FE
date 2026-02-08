export type PaymentListItem = {
  id: string;
  user: {
    id: string;
    name: string;
  };
  total: number;
  isPaid: boolean;
  paidAt: string | null;
  amountPaid: number;
};

export type Pagination = {
  currentPage: number;
  totalPages: number;
  totalItems: number;
};

export type PaymentListResponse = {
  items: PaymentListItem[];
  pagination: Pagination;
};

export type CreatePaymentPayload = {
  userId: string;
  amount: number;
  paidAt: string;
};

export type CreatePaymentResponse = {
  cycleId: string;
  total: number;
  paidAt: string;
  user: {
    id: string;
    name: string;
  };
};

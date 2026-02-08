export type DashboardStats = {
  totalUsers: number;
  totalDebt: number;
  totalPaid: number;
  pendingDebt: number;
  activeCycles: number;
  overdueCycles: number;
  recentPaymentsCount: number;
};

export type RecentPayment = {
  id: string;
  user: string;
  amount: number;
  paidAt: string;
  status: string;
  totalDebt: number;
};

export type TopDebtor = {
  id: string;
  name: string;
  phone: string;
  totalDebt: number;
  cyclesCount: number;
};

export type DashboardOverview = {
  stats: DashboardStats;
  recentPayments: RecentPayment[];
  topDebtors: TopDebtor[];
};

export type DashboardPeriod = "today" | "this_week" | "this_month" | "all";

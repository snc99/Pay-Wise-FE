"use client";

import useSWR from "swr";
import { Users, DollarSign, Wallet } from "lucide-react";
import { DashboardCard } from "./dashboard-card";
import { DashboardCardSkeleton } from "./dashboard-card-skeleton";
import { getDashboardCards, DashboardCardsData } from "@/lib/api/dashboard";

export const DashboardCards = () => {
  const { data, error, isLoading, mutate } = useSWR<DashboardCardsData>(
    "/dashboard/cards",
    getDashboardCards,
    {
      revalidateOnFocus: true, // ✅ Auto refresh saat balik ke tab
      revalidateOnReconnect: true, // ✅ Auto refresh saat internet balik
      dedupingInterval: 10000, // ✅ Prevent spam request
      // NO refreshInterval             ✅ Ga auto-refresh background
    }
  );

  // Loading state
  if (isLoading) return <DashboardCardSkeleton />;

  // Error state
  if (error) {
    return (
      <div className="text-red-500">
        <p>{error.message}</p>
      </div>
    );
  }

  return (
    <div className="flex flex-1 flex-col">
      <div className="grid auto-rows-min gap-4 md:grid-cols-3">
        <DashboardCard
          title="Total User"
          value={data?.totalUsers?.toString() ?? "-"}
          subtitle="Pengguna"
          icon={<Users className="h-6 w-6" />}
        />

        <DashboardCard
          title="Total Pembayaran"
          value={`Rp ${Number(data?.totalPayments || 0).toLocaleString(
            "id-ID"
          )}`}
          subtitle={`${data?.totalPaidUsers ?? 0} Pengguna`}
          icon={<DollarSign className="h-6 w-6" />}
        />

        <DashboardCard
          title="Total Hutang"
          value={`Rp ${Number(data?.totalDebts || 0).toLocaleString("id-ID")}`}
          subtitle="Pengguna"
          icon={<Wallet className="h-6 w-6" />}
        />
      </div>
    </div>
  );
};

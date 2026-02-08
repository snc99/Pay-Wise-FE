"use client";

import { useDashboard } from "@/hooks/use-dashboard";
import { DashboardHeader } from "@/components/dashboard/dashboard-header";
import { StatsGrid } from "@/components/dashboard/stats-grid";
import { RecentPayments } from "@/components/dashboard/recent-payments";
import { TopDebtors } from "@/components/dashboard/top-debtors";
import { QuickActions } from "@/components/dashboard/quick-actions";
import { DashboardSkeleton } from "@/components/skeleton/Dashboard";

export default function DashboardPage() {
  const { loading, data, refresh } = useDashboard();

  if (loading || !data) {
    return <DashboardSkeleton />;
  }

  return (
    <div className="p-6 space-y-6">
      <DashboardHeader onRefresh={refresh} />
      <StatsGrid stats={data.stats} />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <RecentPayments items={data.recentPayments} />
        <TopDebtors items={data.topDebtors} />
      </div>

      <QuickActions />
    </div>
  );
}

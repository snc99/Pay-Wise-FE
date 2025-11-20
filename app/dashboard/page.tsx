"use client";

import { DashboardCards } from "@/components/dashboard/dashboard-cards";
import DashboardCharts from "@/components/dashboard/dashboard-charts";

export default function DashboardPage() {
  return (
    <div className="flex flex-col gap-4 p-4">
      <DashboardCards />
      <DashboardCharts />{" "}
    </div>
  );
}

"use client";

import { useEffect, useState } from "react";
import { getDashboardOverview } from "@/lib/api/dashboard";
import type { DashboardOverview } from "@/lib/types/dashboard";

export function useDashboard() {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<DashboardOverview | null>(null);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const res = await getDashboardOverview();
      setData(res);
    } catch (error) {
      console.error("Failed to fetch dashboard data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  return { loading, data, refresh: fetchDashboardData };
}

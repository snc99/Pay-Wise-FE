import { Button } from "@/components/ui/button";
import { TrendingUp, CreditCard } from "lucide-react";
import Link from "next/link";

interface Props {
  onRefresh: () => void;
}

export function DashboardHeader({ onRefresh }: Props) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600 mt-1">
          Ringkasan performa bisnis utang-piutang
        </p>
      </div>

      <div className="flex gap-3">
        <Button variant="outline" className="gap-2" onClick={onRefresh}>
          <TrendingUp className="h-4 w-4" />
          Refresh Data
        </Button>

        <Link href="/dashboard/debt">
          <Button className="gap-2 bg-blue-600 hover:bg-blue-700">
            <CreditCard className="h-4 w-4" />
            Buat Utang Baru
          </Button>
        </Link>
      </div>
    </div>
  );
}

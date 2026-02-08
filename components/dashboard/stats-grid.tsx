import {
  Users,
  CreditCard,
  DollarSign,
  Clock,
  ArrowUpRight,
  AlertCircle,
} from "lucide-react";
import { StatCard } from "./stat-card";
import { Card, CardContent } from "../ui/card";

interface Props {
  stats: any;
}

export function StatsGrid({ stats }: Props) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      <Card className="border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 font-medium">Total User</p>
              <h3 className="text-2xl font-bold text-gray-900 mt-2">
                {stats.totalUsers}
              </h3>
              <div className="flex items-center gap-1 mt-2">
                <ArrowUpRight className="h-4 w-4 text-green-500" />
                <span className="text-xs text-green-600 font-medium">
                  Terdaftar
                </span>
              </div>
            </div>
            <div className="p-3 bg-blue-50 rounded-lg">
              <Users className="h-6 w-6 text-blue-600" />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 font-medium">Total Utang</p>
              <h3 className="text-2xl font-bold text-gray-900 mt-2">
                Rp {stats.totalDebt.toLocaleString("id-ID")}
              </h3>
              <div className="flex items-center gap-1 mt-2">
                <AlertCircle className="h-4 w-4 text-amber-500" />
                <span className="text-xs text-amber-600 font-medium">
                  Aktif
                </span>
              </div>
            </div>
            <div className="p-3 bg-amber-50 rounded-lg">
              <CreditCard className="h-6 w-6 text-amber-600" />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 font-medium">
                Total Terbayar
              </p>
              <h3 className="text-2xl font-bold text-gray-900 mt-2">
                Rp {stats.totalPaid.toLocaleString("id-ID")}
              </h3>
              <div className="flex items-center gap-1 mt-2">
                <ArrowUpRight className="h-4 w-4 text-green-500" />
                <span className="text-xs text-green-600 font-medium">
                  Terkumpul
                </span>
              </div>
            </div>
            <div className="p-3 bg-green-50 rounded-lg">
              <DollarSign className="h-6 w-6 text-green-600" />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 font-medium">Belum Lunas</p>
              <h3 className="text-2xl font-bold text-gray-900 mt-2">
                Rp {stats.pendingDebt.toLocaleString("id-ID")}
              </h3>
            </div>
            <div className="p-3 bg-red-50 rounded-lg">
              <Clock className="h-6 w-6 text-red-600" />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

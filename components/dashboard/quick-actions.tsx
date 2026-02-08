import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Users, CreditCard, DollarSign } from "lucide-react";

export function QuickActions() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
      <Link href="/dashboard/user">
        <Card className="border border-gray-200 hover:border-blue-300 hover:shadow-md transition-all cursor-pointer">
          <CardContent className="p-4 flex items-center gap-3">
            <div className="p-2 bg-blue-50 rounded-lg">
              <Users className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <p className="font-medium text-gray-900">Kelola User</p>
              <p className="text-sm text-gray-500">Tambah/edit user</p>
            </div>
          </CardContent>
        </Card>
      </Link>

      <Link href="/dashboard/debt">
        <Card className="border border-gray-200 hover:border-green-300 hover:shadow-md transition-all cursor-pointer">
          <CardContent className="p-4 flex items-center gap-3">
            <div className="p-2 bg-green-50 rounded-lg">
              <CreditCard className="h-5 w-5 text-green-600" />
            </div>
            <div>
              <p className="font-medium text-gray-900">Buat Utang Baru</p>
              <p className="text-sm text-gray-500">Tambah transaksi utang</p>
            </div>
          </CardContent>
        </Card>
      </Link>

      <Link href="/dashboard/payments">
        <Card className="border border-gray-200 hover:border-purple-300 hover:shadow-md transition-all cursor-pointer">
          <CardContent className="p-4 flex items-center gap-3">
            <div className="p-2 bg-purple-50 rounded-lg">
              <DollarSign className="h-5 w-5 text-purple-600" />
            </div>
            <div>
              <p className="font-medium text-gray-900">Catat Pembayaran</p>
              <p className="text-sm text-gray-500">Input pembayaran user</p>
            </div>
          </CardContent>
        </Card>
      </Link>
    </div>
  );
}

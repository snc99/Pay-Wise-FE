"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle, DollarSign } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface Props {
  items: {
    id: string;
    user: string;
    amount: number;
    totalDebt: number;
    paidAt: string | Date;
  }[];
}

export function RecentPayments({ items }: Props) {
  return (
    <Card className="lg:col-span-2 border border-gray-200 shadow-sm">
      {/* HEADER */}
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-semibold flex items-center gap-2">
            <CheckCircle className="h-5 w-5 text-blue-600" />
            Pembayaran Terbaru
          </CardTitle>

          <Link href="/dashboard/payment">
            <Button
              variant="ghost"
              size="sm"
              className="text-blue-600 hover:text-blue-700"
            >
              Lihat Semua
            </Button>
          </Link>
        </div>
      </CardHeader>

      {/* CONTENT */}
      <CardContent>
        <div className="space-y-4">
          {items.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <DollarSign className="h-12 w-12 mx-auto text-gray-300 mb-3" />
              <p>Belum ada pembayaran terbaru</p>
            </div>
          ) : (
            items.map((payment) => (
              <div
                key={payment.id}
                className="flex items-center justify-between p-3 border border-gray-100 rounded-lg hover:bg-gray-50 transition-colors"
              >
                {/* LEFT */}
                <div className="flex items-center gap-3">
                  <div
                    className={cn(
                      "h-8 w-8 rounded-full flex items-center justify-center bg-green-100",
                    )}
                  >
                    <CheckCircle className="h-4 w-4 text-green-600" />
                  </div>

                  <div>
                    <p className="font-medium text-gray-900">{payment.user}</p>
                    <p className="text-xs text-gray-500">
                      {new Date(payment.paidAt).toLocaleDateString("id-ID")}
                    </p>
                  </div>
                </div>

                {/* RIGHT */}
                <div className="text-right">
                  <p className="font-semibold text-gray-900">
                    Rp {payment.amount.toLocaleString("id-ID")}
                  </p>
                  <span className="text-xs text-gray-500">
                    dari Rp {payment.totalDebt.toLocaleString("id-ID")}
                  </span>
                </div>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
}

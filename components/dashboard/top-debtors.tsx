"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertCircle } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

interface Props {
  items: {
    id: string;
    name: string;
    cyclesCount: number;
    totalDebt: number;
  }[];
}

export function TopDebtors({ items }: Props) {
  return (
    <Card className="border border-gray-200 shadow-sm">
      {/* HEADER */}
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-semibold flex items-center gap-2">
            <AlertCircle className="h-5 w-5 text-amber-600" />
            Peminjam Teratas
          </CardTitle>

          <Link href="/dashboard/debt">
            <Button
              variant="ghost"
              size="sm"
              className="text-amber-600 hover:text-amber-700"
            >
              Lihat Semua
            </Button>
          </Link>
        </div>

        <p className="text-sm text-gray-500">User dengan utang terbanyak</p>
      </CardHeader>

      {/* CONTENT */}
      <CardContent>
        <div className="space-y-4">
          {items.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <AlertCircle className="h-12 w-12 mx-auto text-gray-300 mb-3" />
              <p>Tidak ada utang aktif</p>
            </div>
          ) : (
            items.map((debtor, index) => (
              <div
                key={debtor.id}
                className="flex items-center justify-between p-3 border border-gray-100 rounded-lg hover:bg-gray-50 transition-colors"
              >
                {/* LEFT */}
                <div className="flex items-center gap-3">
                  <div className="h-8 w-8 rounded-full bg-linear-to-br from-blue-100 to-blue-200 flex items-center justify-center text-sm font-semibold text-blue-700">
                    {index + 1}
                  </div>

                  <div>
                    <p className="font-medium text-gray-900">{debtor.name}</p>
                    <p className="text-xs text-gray-500">
                      {debtor.cyclesCount}{" "}
                      {debtor.cyclesCount > 1 ? "siklus" : "siklus"}
                    </p>
                  </div>
                </div>

                {/* RIGHT */}
                <div className="text-right">
                  <p className="font-semibold text-red-600">
                    Rp {debtor.totalDebt.toLocaleString("id-ID")}
                  </p>
                  <p className="text-xs text-gray-500">Total utang</p>
                </div>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
}

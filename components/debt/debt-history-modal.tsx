"use client";

import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Loader2, History, Calendar, FileText, User } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { getDebtHistory } from "@/lib/api/debt";

type HistoryTarget = {
  id: string;
  user: {
    id: string;
    name: string;
  };
};

type DebtItem = {
  id: string;
  amount: number;
  note?: string | null;
  date: string;
  createdAt: string;
};

type Props = {
  payment: HistoryTarget;
  children: React.ReactNode;
};

const formatRupiah = (amount: number) => {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
  }).format(amount);
};

const formatDateShort = (dateString: string) => {
  return new Date(dateString).toLocaleDateString("id-ID", {
    day: "numeric",
    month: "short",
  });
};

export default function DebtHistoryModal({ payment, children }: Props) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [items, setItems] = useState<DebtItem[]>([]);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    if (!open) return;

    setLoading(true);
    getDebtHistory(payment.id)
      .then((res) => {
        setItems(res.items);
        setTotal(res.cycle.total);
      })
      .finally(() => setLoading(false));
  }, [open, payment.id]);

  const paidTotal = items.reduce((sum, item) => sum + item.amount, 0);
  const isFullyPaid = paidTotal === total;

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>

      <DialogContent className="w-[95vw] max-w-[95vw] sm:max-w-[500px] rounded-lg p-0 overflow-hidden border shadow-lg mx-2">
        {/* COMPACT HEADER */}
        <div className="bg-linear-to-r from-blue-600 to-indigo-700 px-4 py-3 text-white">
          <DialogHeader className="space-y-1">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="p-1.5 bg-white/20 rounded-md">
                  <History className="h-4 w-4" />
                </div>
                <div>
                  <DialogTitle className="text-base font-semibold text-white">
                    Riwayat Utang
                  </DialogTitle>
                  <p className="text-xs text-blue-100 truncate">
                    {payment.user.name}
                  </p>
                </div>
              </div>
            </div>
          </DialogHeader>
        </div>

        <div className="px-4 py-3 max-h-[70vh] overflow-y-auto">
          {/* USER SUMMARY - SUPER COMPACT */}
          <div className="mb-3">
            <div className="flex items-center gap-2 mb-2">
              <div className="flex h-7 w-7 items-center justify-center rounded-full bg-linear-to-br from-blue-100 to-blue-200 text-xs font-semibold text-blue-700">
                <User className="h-3.5 w-3.5" />
              </div>
              <div>
                <h3 className="text-sm font-semibold text-gray-800">
                  {payment.user.name}
                </h3>
                <p className="text-xs text-gray-500">
                  Total Hutang :{" "}
                  <span className="font-medium text-red-600">
                    {formatRupiah(total)}
                  </span>
                </p>
              </div>
            </div>
          </div>

          {/* LOADING */}
          {loading ? (
            <div className="flex items-center justify-center py-6">
              <div className="text-center">
                <Loader2 className="h-6 w-6 animate-spin text-blue-600 mx-auto mb-1.5" />
                <p className="text-xs text-gray-600">Memuat riwayat...</p>
              </div>
            </div>
          ) : (
            <>
              {/* TRANSACTION LIST - ULTRA COMPACT */}
              <div className="mb-3">
                <div className="flex items-center gap-1.5 mb-2">
                  <Calendar className="h-3.5 w-3.5 text-blue-600" />
                  <h4 className="text-xs font-semibold text-gray-700">
                    Transaksi ({items.length})
                  </h4>
                </div>

                {items.length === 0 ? (
                  <div className="text-center py-4 border border-dashed border-gray-300 rounded-md">
                    <FileText className="h-6 w-6 text-gray-300 mx-auto mb-1.5" />
                    <p className="text-xs text-gray-500">
                      Belum ada transaksi pembayaran
                    </p>
                  </div>
                ) : (
                  <div className="space-y-1.5">
                    {items.map((d, index) => (
                      <div
                        key={d.id}
                        className={cn(
                          "border rounded-md p-2 text-xs",
                          index % 2 === 0 ? "bg-white" : "bg-gray-50",
                        )}
                      >
                        <div className="flex justify-between items-center mb-1">
                          <div className="flex items-center gap-1.5">
                            <Calendar className="h-2.5 w-2.5 text-gray-400" />
                            <span className="font-medium text-gray-700">
                              {formatDateShort(d.date)}
                            </span>
                          </div>
                          <span className="font-bold text-green-600">
                            {formatRupiah(d.amount)}
                          </span>
                        </div>

                        <div className="flex justify-between">
                          <div className="flex items-center gap-1.5">
                            {d.note ? (
                              <>
                                <FileText className="h-2.5 w-2.5 text-gray-400" />
                                <span className="text-gray-600 truncate max-w-[180px]">
                                  {d.note}
                                </span>
                              </>
                            ) : (
                              <span className="text-gray-400 italic text-[10px]">
                                - tanpa catatan -
                              </span>
                            )}
                          </div>
                          <span className="text-[10px] text-gray-500">
                            dibuat: {formatDateShort(d.createdAt)}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* PAYMENT STATUS SUMMARY */}
              <div
                className={cn(
                  "rounded-md p-2 border text-xs mb-3",
                  isFullyPaid
                    ? "bg-emerald-50 border-emerald-100"
                    : "bg-blue-50 border-blue-100",
                )}
              >
                <div className="flex justify-end">
                  <div className="text-right">
                    <p className="text-[10px] text-gray-600">Total</p>
                    <p className="font-semibold text-green-600">
                      {formatRupiah(paidTotal)}
                    </p>
                  </div>
                </div>
              </div>
            </>
          )}

          {/* CLOSE BUTTON - COMPACT */}
          <div className="flex justify-end mt-3 pt-2 border-t">
            <Button
              onClick={() => setOpen(false)}
              className="h-8 px-4 text-xs font-medium bg-blue-600 hover:bg-blue-700 text-white"
            >
              Tutup
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

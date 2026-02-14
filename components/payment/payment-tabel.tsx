"use client";

import React, { memo } from "react";
import Image from "next/image";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal, Eye, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import DebtHistoryModal from "../debt/debt-history-modal";
import PaymentDeleteDialog from "./payment-delete-dialog";
import { PaymentListItem } from "@/lib/types/payment";

type EmptyStateType = "initial" | "search";

type Props = {
  data: PaymentListItem[];
  emptyState?: EmptyStateType;
  onRefresh?: () => void;
};

// Helper functions
const formatRupiah = (v: number | string) =>
  new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
  }).format(Number(v));

const formatDate = (v: string) =>
  new Date(v).toLocaleDateString("id-ID", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });

function PaymentTable({ data, emptyState = "initial", onRefresh }: Props) {
  if (data.length === 0) {
    return (
      <div className="rounded-xl bg-white py-10">
        <div className="mx-6 rounded-xl border border-dashed border-gray-200 py-16">
          <div className="flex flex-col items-center text-center text-muted-foreground">
            <Image
              src={
                emptyState === "search"
                  ? "/empty-state.svg"
                  : "/data-not-found.svg"
              }
              alt="Empty state"
              width={160}
              height={160}
              className="mb-6"
            />

            <h3 className="text-lg font-semibold text-foreground">
              {emptyState === "search"
                ? "Yah, nggak ketemu"
                : "Belum ada pembayaran"}
            </h3>

            <p className="text-sm mt-1 text-gray-500">
              {emptyState === "search"
                ? "Pembayaran yang kamu cari tidak ditemukan"
                : "Belum ada transaksi pembayaran yang tercatat"}
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-xl bg-white">
      <Table>
        <TableHeader className="bg-linear-to-r from-gray-50 to-gray-100/50">
          <TableRow className="border-b">
            <TableHead className="text-gray-700 font-semibold py-3">
              User
            </TableHead>
            <TableHead className="text-gray-700 font-semibold py-3">
              Total Utang
            </TableHead>
            <TableHead className="text-gray-700 font-semibold py-3">
              Status
            </TableHead>
            <TableHead className="text-gray-700 font-semibold py-3">
              Tanggal Bayar
            </TableHead>
            <TableHead className="text-gray-700 font-semibold py-3 text-right">
              Aksi
            </TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {data.map((c) => (
            <TableRow
              key={c.id}
              className="hover:bg-gray-50/50 border-b border-gray-100"
            >
              {/* USER */}
              <TableCell>
                <div className="flex items-center gap-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-linear-to-br from-blue-100 to-blue-200 text-sm font-medium text-blue-700">
                    {c.user.name
                      .split(" ")
                      .map((s) => s[0])
                      .slice(0, 2)
                      .join("")}
                  </div>
                  <div>
                    <span className="font-medium text-gray-800 block">
                      {c.user.name}
                    </span>
                  </div>
                </div>
              </TableCell>

              {/* TOTAL */}
              <TableCell className="font-semibold text-gray-900">
                {formatRupiah(c.total)}
              </TableCell>

              {/* STATUS */}
              <TableCell>
                <span
                  className={cn(
                    "inline-flex items-center rounded-full px-3 py-1 text-xs font-medium",
                    c.isPaid
                      ? "bg-linear-to-r from-green-50 to-emerald-50 border border-green-200 text-green-700"
                      : "bg-linear-to-r from-red-50 to-pink-50 border border-red-200 text-red-700",
                  )}
                >
                  {c.isPaid ? "LUNAS" : "BELUM LUNAS"}
                </span>
              </TableCell>

              {/* PAID DATE */}
              <TableCell>
                <span className="text-gray-900 font-medium block">
                  {c.paidAt ? formatDate(c.paidAt) : "-"}
                </span>
              </TableCell>

              {/* ACTION - Hanya Dropdown dengan Modal */}
              <TableCell className="text-right">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-8 w-8 p-0 hover:bg-gray-100"
                    >
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>

                  <DropdownMenuContent align="end" className="w-48">
                    <DropdownMenuLabel className="text-xs font-semibold">
                      Aksi
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />

                    {/* View Details via Modal */}
                    <div className="relative">
                      <DebtHistoryModal payment={c}>
                        <div className="relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none transition-colors hover:bg-blue-50 hover:text-blue-700 data-disabled:pointer-events-none data-disabled:opacity-50 gap-2">
                          <Eye className="h-4 w-4 text-blue-600" />
                          <span>Lihat Detail</span>
                        </div>
                      </DebtHistoryModal>
                    </div>

                    {/* Delete via Modal (only if paid) */}
                    {c.isPaid && (
                      <div className="relative">
                        <PaymentDeleteDialog payment={c} onDeleted={onRefresh}>
                          <div className="relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none transition-colors hover:bg-red-50 hover:text-red-700 data-disabled:pointer-events-none data-disabled:opacity-50 gap-2">
                            <Trash2 className="h-4 w-4 text-red-600" />
                            <span className="text-red-600">
                              Hapus Pembayaran
                            </span>
                          </div>
                        </PaymentDeleteDialog>
                      </div>
                    )}
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}

export default memo(PaymentTable);

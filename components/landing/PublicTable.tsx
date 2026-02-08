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
import { PublicDebt } from "@/lib/types/debt-cycle";

type EmptyStateType = "initial" | "search";

type Props = {
  items: PublicDebt[];
  loading: boolean;
  emptyState?: EmptyStateType;
};

const formatRupiah = (v: number) =>
  new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(v);

function PublicTable({ items, loading, emptyState = "initial" }: Props) {
  if (loading) {
    return (
      <div className="rounded-xl bg-white py-10 text-center text-gray-500">
        Memuat data...
      </div>
    );
  }

  if (items.length === 0) {
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
                : "Masih kosong nih"}
            </h3>

            <p className="text-sm mt-1 text-gray-500">
              {emptyState === "search" ? (
                <>Data utang yang kamu cari nggak ada.</>
              ) : (
                <>Belum ada data utang yang tercatat.</>
              )}
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-xl bg-white">
      <Table>
        <TableHeader className="bg-muted/40">
          <TableRow>
            <TableHead>Nama</TableHead>
            <TableHead>Total Tagihan</TableHead>
            <TableHead>Status</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {items.map((item) => (
            <TableRow key={item.id} className="hover:bg-gray-50/50">
              <TableCell>
                <div className="flex items-center gap-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-blue-100 to-blue-200 text-sm font-medium text-blue-700">
                    {item.name
                      ?.split(" ")
                      .map((s) => s[0])
                      .slice(0, 2)
                      .join("")}
                  </div>
                  <span className="font-medium text-gray-800">{item.name}</span>
                </div>
              </TableCell>

              <TableCell>
                <span
                  className={
                    item.total > 0
                      ? "font-semibold text-orange-600"
                      : "font-semibold text-green-600"
                  }
                >
                  {formatRupiah(item.total)}
                </span>
              </TableCell>

              <TableCell>
                {item.status === "paid" ? "✅ Lunas" : "❌ Belum Lunas"}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}

export default memo(PublicTable);

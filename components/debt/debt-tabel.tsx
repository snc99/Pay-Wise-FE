"use client";

import React, { memo } from "react";
import type { Debt } from "@/lib/types/debt";
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
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";

type EmptyStateType = "initial" | "search";

type Props = {
  data: Debt[];
  emptyState?: EmptyStateType;
  onDelete?: (debt: Debt) => void;
};

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

function DebtTable({ data, emptyState = "initial", onDelete }: Props) {
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
            <TableHead>Jumlah Utang</TableHead>
            <TableHead>Tanggal Utang</TableHead>
            <TableHead>Dibuat</TableHead>
            <TableHead className="text-right">Aksi</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {data.map((debt) => (
            <TableRow key={debt.id}>
              <TableCell className="font-medium">{debt.user.name}</TableCell>

              <TableCell>{formatRupiah(debt.amount)}</TableCell>

              <TableCell>{formatDate(debt.date)}</TableCell>

              <TableCell>{formatDate(debt.createdAt)}</TableCell>

              {/* ACTIONS */}
              <TableCell className="text-right">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>

                  <DropdownMenuContent align="end">
                    <DropdownMenuLabel className="text-blue-800">
                      Aksi
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />

                    <DropdownMenuItem
                      onClick={() => onDelete?.(debt)}
                      className="
                        text-red-700
                        data-highlighted:bg-red-200
                        data-highlighted:text-red-600
                        focus:bg-red-200
                        focus:text-red-600
                      "
                      aria-label={`Hapus utang ${debt.user.name}`}
                    >
                      <Trash2 className="mr-2 h-4 w-4 text-red-600" />
                      Hapus
                    </DropdownMenuItem>
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

export default memo(DebtTable);

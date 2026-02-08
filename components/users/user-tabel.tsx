"use client";

import React from "react";
import type { User } from "@/lib/types/user";
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
import { MoreHorizontal, Edit, Trash2, Copy } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import UserUpdateDialog from "@/components/users/user-update-dialog";
import UserDeleteDialog from "@/components/users/user-delete-dialog";

type EmptyState = "initial" | "search";

type Props = {
  data: User[];
  emptyState: EmptyState;
  onRefresh?: () => void;
};

async function copyToClipboard(text: string) {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    return false;
  }
}

function UserTable({ data, emptyState = "initial", onRefresh }: Props) {
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
                <>User yang kamu cari nggak ada. Coba pakai kata lain ya</>
              ) : (
                <>Belum ada user. Yuk tambahin dulu biar bisa mulai ngatur</>
              )}
            </p>
          </div>
        </div>
      </div>
    );
  }

  const handleCopy = async (text?: string, label: "phone" = "phone") => {
    if (!text) return;

    const ok = await copyToClipboard(text);
    if (ok) {
      toast.success(
        label === "phone" ? "✅ Nomor telepon disalin" : "✅ Data disalin",
        { duration: 2000 },
      );
    } else {
      toast.error("❌ Gagal menyalin");
    }
  };

  return (
    <div className="rounded-xl bg-white">
      <Table>
        <TableHeader className="bg-muted/40">
          <TableRow>
            <TableHead>Nama</TableHead>
            <TableHead>Telepon</TableHead>
            <TableHead>Alamat</TableHead>
            <TableHead>Dibuat</TableHead>
            <TableHead className="text-right">Aksi</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {data.map((user) => (
            <TableRow key={user.id} className="hover:bg-gray-50/50">
              {/* NAMA */}
              <TableCell>
                <div className="flex items-center gap-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-linear-to-br from-blue-100 to-blue-200 text-sm font-medium text-blue-700">
                    {user.name
                      ? user.name
                          .split(" ")
                          .map((s) => s[0])
                          .slice(0, 2)
                          .join("")
                      : "U"}
                  </div>
                  <span className="text-sm font-medium text-gray-800">
                    {user.name}
                  </span>
                </div>
              </TableCell>

              {/* TELEPON */}
              <TableCell>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-600">{user.phone}</span>
                  <button
                    onClick={() => handleCopy(user.phone, "phone")}
                    className="p-1 text-gray-400 hover:text-blue-600"
                    aria-label={`Salin nomor telepon ${user.phone}`}
                  ></button>
                </div>
              </TableCell>

              {/* ALAMAT */}
              <TableCell>
                <span className="text-sm text-gray-600 truncate block max-w-[250px]">
                  {user.address || "-"}
                </span>
              </TableCell>

              {/* CREATED AT */}
              <TableCell className="text-sm text-gray-600">
                {user.createdAt
                  ? new Date(user.createdAt).toLocaleDateString("id-ID", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })
                  : "-"}
              </TableCell>

              {/* ACTION - Hanya Dropdown */}
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

                  <DropdownMenuContent align="end" className="w-38">
                    <DropdownMenuLabel className="text-xs font-semibold">
                      Aksi
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />

                    {/* Salin Nomor Telepon */}
                    <DropdownMenuItem
                      onClick={() => handleCopy(user.phone, "phone")}
                      className="text-sm cursor-pointer gap-2"
                    >
                      <Copy className="h-4 w-4 text-blue-600" />
                      <span>Salin Telepon</span>
                    </DropdownMenuItem>

                    {/* Edit via Modal */}
                    <div className="relative">
                      <UserUpdateDialog user={user} onUpdated={onRefresh}>
                        <div className="relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none transition-colors hover:bg-blue-50 hover:text-blue-700 data-disabled:pointer-events-none data-disabled:opacity-50 gap-2">
                          <Edit className="h-4 w-4 text-blue-600" />
                          <span>Edit User</span>
                        </div>
                      </UserUpdateDialog>
                    </div>

                    {/* Delete via Modal */}
                    <div className="relative">
                      <UserDeleteDialog user={user} onDeleted={onRefresh}>
                        <div className="relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none transition-colors hover:bg-red-50 hover:text-red-700 data-disabled:pointer-events-none data-disabled:opacity-50 gap-2">
                          <Trash2 className="h-4 w-4 text-red-600" />
                          <span className="text-red-600">Hapus User</span>
                        </div>
                      </UserDeleteDialog>
                    </div>
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

export default UserTable;

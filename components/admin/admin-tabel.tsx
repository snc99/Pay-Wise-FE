"use client";

import React from "react";
import type { Admin } from "@/lib/types/admin";
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
import { MoreHorizontal, Edit, Trash2, Mail, Copy } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import AdminUpdateDialog from "@/components/admin/admin-update-dialog";
import AdminDeleteDialog from "@/components/admin/admin-delete-dialog";

type EmptyState = "initial" | "search";

type Props = {
  data: Admin[];
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

function AdminTable({ data, emptyState = "initial", onRefresh }: Props) {
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
                <>Admin yang kamu cari nggak ada. Coba pakai kata lain ya</>
              ) : (
                <>Belum ada admin. Yuk tambahin dulu biar bisa mulai ngatur</>
              )}
            </p>
          </div>
        </div>
      </div>
    );
  }

  const handleCopy = async (
    text?: string,
    label: "username" | "email" = "username",
  ) => {
    if (!text) return;

    const ok = await copyToClipboard(text);
    if (ok) {
      toast.success(
        label === "username" ? "Username disalin" : "Email disalin",
        { duration: 2000 },
      );
    } else {
      toast.error("Gagal menyalin");
    }
  };

  const handleCopyEmail = (email: string) => {
    handleCopy(email, "email");
  };

  return (
    <div className="rounded-xl bg-white">
      <Table>
        <TableHeader className="bg-muted/40">
          <TableRow>
            <TableHead>Nama</TableHead>
            <TableHead>Username</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Role</TableHead>
            <TableHead>Dibuat</TableHead>
            <TableHead className="text-right">Aksi</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {data.map((admin) => (
            <TableRow key={admin.id} className="hover:bg-gray-50/50">
              {/* NAMA */}
              <TableCell>
                <div className="flex items-center gap-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-linear-to-br from-blue-100 to-blue-200 text-sm font-medium text-blue-700">
                    {admin.name
                      ? admin.name
                          .split(" ")
                          .map((s) => s[0])
                          .slice(0, 2)
                          .join("")
                      : admin.username[0]}
                  </div>
                  <span className="text-sm font-medium text-gray-800">
                    {admin.name}
                  </span>
                </div>
              </TableCell>

              {/* USERNAME */}
              <TableCell>
                <div className="flex items-center gap-2">
                  <span className="text-sm  text-gray-700">
                    {admin.username}
                  </span>
                </div>
              </TableCell>

              {/* EMAIL */}
              <TableCell>
                <span className="text-sm text-gray-600 truncate block max-w-[200px]">
                  {admin.email}
                </span>
              </TableCell>

              {/* ROLE */}
              <TableCell>
                <span
                  className={`inline-flex items-center rounded-sm px-3 py-1 text-xs font-medium
                 ${
                   admin.role === "SUPERADMIN"
                     ? "bg-linear-to-r from-red-50 to-pink-50 border border-red-200 text-red-700"
                     : "bg-linear-to-r from-blue-50 to-cyan-50 border border-blue-200 text-blue-700"
                 }`}
                >
                  {admin.role === "SUPERADMIN" ? "Super Admin" : "Admin"}
                </span>
              </TableCell>

              {/* CREATED AT */}
              <TableCell className="text-sm text-gray-600">
                {admin.createdAt
                  ? new Date(admin.createdAt).toLocaleDateString("id-ID", {
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

                  <DropdownMenuContent align="end" className="w-48">
                    <DropdownMenuLabel className="text-xs font-semibold">
                      Aksi untuk {admin.name}
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />

                    {/* Salin Username */}
                    <DropdownMenuItem
                      onClick={() => handleCopy(admin.username, "username")}
                      className="text-sm cursor-pointer gap-2"
                    >
                      <Copy className="h-4 w-4 text-blue-600" />
                      <span>Salin Username</span>
                    </DropdownMenuItem>

                    {/* Salin Email */}
                    <DropdownMenuItem
                      onClick={() => handleCopyEmail(admin.email)}
                      className="text-sm cursor-pointer gap-2"
                    >
                      <Mail className="h-4 w-4 text-blue-600" />
                      <span>Salin Email</span>
                    </DropdownMenuItem>

                    <DropdownMenuSeparator />

                    {/* Edit via Modal */}
                    <div className="relative">
                      <AdminUpdateDialog admin={admin} onUpdated={onRefresh}>
                        <div className="relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none transition-colors hover:bg-blue-50 hover:text-blue-700 data-disabled:pointer-events-none data-disabled:opacity-50 gap-2">
                          <Edit className="h-4 w-4 text-blue-600" />
                          <span>Edit Admin</span>
                        </div>
                      </AdminUpdateDialog>
                    </div>

                    {/* Delete via Modal */}
                    <div className="relative">
                      <AdminDeleteDialog admin={admin} onDeleted={onRefresh}>
                        <div className="relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none transition-colors hover:bg-red-50 hover:text-red-700 data-disabled:pointer-events-none data-disabled:opacity-50 gap-2">
                          <Trash2 className="h-4 w-4 text-red-600" />
                          <span className="text-red-600">Hapus Admin</span>
                        </div>
                      </AdminDeleteDialog>
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

export default AdminTable;

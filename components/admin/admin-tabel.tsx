"use client";

import React, { memo } from "react";
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
import { MoreHorizontal, Edit, Trash2, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

type EmptyState = "initial" | "search";

type Props = {
  data: Admin[];
  emptyState: EmptyState;
  onEdit: (admin: Admin) => void;
  onDelete: (admin: Admin) => void;
};

async function copyToClipboard(text: string) {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    return false;
  }
}

function AdminTable({ data, emptyState = "initial", onEdit, onDelete }: Props) {
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
                <>"Belum ada admin. Yuk tambahin dulu biar bisa mulai ngatur</>
              )}
            </p>
          </div>
        </div>
      </div>
    );
  }

  const handlecopy = async (
    text?: string,
    label: "username" | "email" = "username",
  ) => {
    if (!text) return;

    const ok = await copyToClipboard(text);
    if (ok) {
      toast.info(label === "username" ? "Username disalin" : "Email disalin");
    }
  };

  return (
    <div className="rounded-xl bg-white">
      <Table>
        <TableHeader className="bg-muted/40">
          <TableRow>
            <TableHead>Nama</TableHead>
            <TableHead>User Name</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Role</TableHead>
            <TableHead>Dibuat</TableHead>
            <TableHead className="text-right">Aksi</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {data.map((admin) => (
            <TableRow key={admin.id}>
              {/* NAMA */}
              <TableCell>
                <div className="flex items-center gap-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-muted text-sm font-medium">
                    {admin.name
                      ? admin.name
                          .split(" ")
                          .map((s) => s[0])
                          .slice(0, 2)
                          .join("")
                      : admin.username[0]}
                  </div>
                  <span className="text-sm font-medium">{admin.name}</span>
                </div>
              </TableCell>

              {/* USERNAME */}
              <TableCell className="text-sm">{admin.username}</TableCell>

              {/* EMAIL */}
              <TableCell className="text-sm">{admin.email}</TableCell>

              {/* ROLE */}
              <TableCell>
                <span
                  className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium
                 ${
                   admin.role === "SUPERADMIN"
                     ? "border border-red-500 bg-red-100 text-red-700"
                     : "border border-blue-500 bg-blue-100 text-blue-700"
                 }`}
                >
                  {admin.role}
                </span>
              </TableCell>

              {/* CREATED */}
              <TableCell className="text-sm">
                {admin.createdAt
                  ? new Date(admin.createdAt).toLocaleDateString("id-ID", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })
                  : "-"}
              </TableCell>

              {/* ACTION */}
              <TableCell className="text-right">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>

                  <DropdownMenuContent align="end">
                    <DropdownMenuLabel>Aksi</DropdownMenuLabel>
                    <DropdownMenuSeparator />

                    <DropdownMenuItem
                      onClick={() => handlecopy(admin.username, "username")}
                      className=" text-blue-800
                          data-highlighted:bg-blue-200
                          data-highlighted:text-blue-600
                          focus:bg-blue-200
                          focus:text-blue-400"
                      aria-label={`Salin username ${admin.username}`}
                    >
                      <Mail className="mr-2 h-4 w-4 text-blue-600" />
                      Salin Username
                    </DropdownMenuItem>

                    <DropdownMenuItem
                      onClick={() => onEdit(admin)}
                      className=" 
                          text-blue-800
                          data-highlighted:bg-blue-200
                          data-highlighted:text-blue-600
                          focus:bg-blue-200
                          focus:text-blue-400"
                      aria-label={`Edit user ${admin.name}`}
                    >
                      <Edit className="mr-2 h-4 w-4 text-blue-600" />
                      Edit
                    </DropdownMenuItem>

                    <DropdownMenuItem
                      onClick={() => onDelete(admin)}
                      className="te text-red-700
                          data-highlighted:bg-red-200
                          data-highlighted:text-red-600
                          focus:bg-red-200
                          focus:text-red-600
  "
                      aria-label={`Hapus user ${admin.name}`}
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

export default memo(AdminTable);

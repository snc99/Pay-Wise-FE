"use client";

import React, { memo } from "react";
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
import { MoreHorizontal, Edit, Trash2, Phone, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

type EmptyStateType = "initial" | "search";

type Props = {
  data: User[];
  emptyState?: EmptyStateType;
  onEdit: (user: User) => void;
  onDelete: (user: User) => void;
};

async function copyToClipboard(text: string) {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    return false;
  }
}

function UserTable({ data, emptyState = "initial", onEdit, onDelete }: Props) {
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

  const handleCopy = async (
    text?: string,
    label: "telepon" | "alamat" = "telepon",
  ) => {
    if (!text) return;

    const ok = await copyToClipboard(text);
    if (ok) {
      toast.info(
        label === "telepon" ? "Nomor telepon disalin" : "Alamat disalin",
      );
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
            <TableRow key={user.id}>
              <TableCell>
                <div className="flex items-center gap-3">
                  <div
                    aria-hidden
                    className="flex h-8 w-8 items-center justify-center rounded-full bg-muted text-sm font-medium"
                    title={user.name}
                  >
                    {user.name
                      ? user.name
                          .split(" ")
                          .map((s) => s[0])
                          .slice(0, 2)
                          .join("")
                      : "U"}
                  </div>
                  <span className="text-sm font-medium text-foreground">
                    {user.name ?? "-"}
                  </span>
                </div>
              </TableCell>
              <TableCell className="text-sm">{user.phone ?? "-"}</TableCell>
              <TableCell className="text-sm">{user.address ?? "-"}</TableCell>
              <TableCell className="text-sm">
                {user.createdAt
                  ? new Date(user.createdAt).toLocaleDateString("id-ID", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })
                  : "-"}
              </TableCell>

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
                      onClick={() => handleCopy(user.phone, "telepon")}
                      className=" 
                          text-blue-800
                          data-highlighted:bg-blue-200
                          data-highlighted:text-blue-600
                          focus:bg-blue-200
                          focus:text-blue-400"
                      aria-label={` ${user.name}Nomor telepon berhasil disalin`}
                    >
                      <Phone className="mr-2 h-4 w-4 text-blue-600" />
                      Salin Telepon
                    </DropdownMenuItem>

                    <DropdownMenuItem
                      onClick={() =>
                        handleCopy(user.address ?? undefined, "alamat")
                      }
                      className=" 
                          text-blue-800
                          data-highlighted:bg-blue-200
                          data-highlighted:text-blue-600
                          focus:bg-blue-200
                          focus:text-blue-400"
                      aria-label={`Salin alamat ${user.name}`}
                    >
                      <MapPin className="mr-2 h-4 w-4 text-blue-600" />
                      Salin Alamat
                    </DropdownMenuItem>

                    <DropdownMenuItem
                      onClick={() => onEdit(user)}
                      className=" 
                          text-blue-800
                          data-highlighted:bg-blue-200
                          data-highlighted:text-blue-600
                          focus:bg-blue-200
                          focus:text-blue-400"
                      aria-label={`Edit user ${user.name}`}
                    >
                      <Edit className="mr-2 h-4 w-4 text-blue-600" />
                      Edit
                    </DropdownMenuItem>

                    <DropdownMenuItem
                      onClick={() => onDelete(user)}
                      className="
                          text-red-700
                          data-highlighted:bg-red-200
                          data-highlighted:text-red-600
                          focus:bg-red-200
                          focus:text-red-600
  "
                      aria-label={`Hapus user ${user.name}`}
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

export default memo(UserTable);

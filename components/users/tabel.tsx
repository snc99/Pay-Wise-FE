// components/users/tabel.tsx
"use client";

import React, { memo, useCallback } from "react";
import type { User } from "@/lib/types/user";
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
import { Edit, MoreHorizontal, Trash2, Phone, MapPin } from "lucide-react";
import { Button } from "../ui/button";
import Image from "next/image";

interface UserTableProps {
  data?: User[] | null;
  onEdit?: (user: User) => void;
  onDelete?: (user: User) => void;
}

async function copyToClipboard(text: string) {
  if (!text) return false;
  try {
    if (navigator.clipboard?.writeText) {
      await navigator.clipboard.writeText(text);
      return true;
    }
  } catch {
    // fallthrough to fallback
  }

  // fallback: textarea
  try {
    const ta = document.createElement("textarea");
    ta.value = text;
    ta.style.position = "fixed";
    ta.style.left = "-9999px";
    document.body.appendChild(ta);
    ta.select();
    document.execCommand("copy");
    document.body.removeChild(ta);
    return true;
  } catch {
    return false;
  }
}

function noop() {}

function UserTableComponent({
  data,
  onEdit = noop,
  onDelete = noop,
}: UserTableProps) {
  const rows: User[] = Array.isArray(data) ? data : [];

  const handleEdit = useCallback(
    (user: User) => {
      if (document.activeElement instanceof HTMLElement)
        document.activeElement.blur();
      requestAnimationFrame(() => onEdit(user));
    },
    [onEdit]
  );

  const handleDelete = useCallback(
    (user: User) => {
      if (document.activeElement instanceof HTMLElement)
        document.activeElement.blur();
      requestAnimationFrame(() => onDelete(user));
    },
    [onDelete]
  );

  const handleCopy = useCallback(async (text?: string) => {
    if (!text) return;
    await copyToClipboard(text);
    // optionally show toast here
  }, []);

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
          {rows.length === 0 ? (
            <TableRow>
              <TableCell colSpan={5}>
                <div className="flex flex-col items-center justify-center py-10 text-center text-muted-foreground">
                  <Image
                    src="/data-not-found.svg"
                    alt="Tidak ada data"
                    width={160}
                    height={160}
                    className="mb-6"
                  />
                  <h3 className="text-lg font-semibold text-foreground">
                    Hasil Tidak Ditemukan
                  </h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    Data user belum di masukkan.
                  </p>
                </div>
              </TableCell>
            </TableRow>
          ) : (
            rows.map((user) => (
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
                    <div>
                      <div className="text-sm font-medium text-foreground">
                        {user.name ?? "-"}
                      </div>
                    </div>
                  </div>
                </TableCell>

                <TableCell>
                  <div className="text-sm">{user.phone ?? "-"}</div>
                </TableCell>

                <TableCell>
                  <div className="text-sm">{user.address ?? "-"}</div>
                </TableCell>

                <TableCell>
                  <div className="text-sm">
                    {user.createdAt
                      ? new Date(user.createdAt).toLocaleDateString("id-ID", {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                        })
                      : "-"}
                  </div>
                </TableCell>

                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        aria-label={`Aksi untuk ${user.name}`}
                        title={`Aksi untuk ${user.name}`}
                      >
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>

                    <DropdownMenuContent align="end">
                      <DropdownMenuLabel>Aksi</DropdownMenuLabel>
                      <DropdownMenuSeparator />

                      <DropdownMenuItem
                        onClick={() => handleCopy(user.phone ?? "")}
                        title={
                          user.phone ? "Salin nomor telepon" : "Tidak ada nomor"
                        }
                      >
                        <Phone className="mr-2 h-4 w-4" /> Salin Telepon
                      </DropdownMenuItem>

                      <DropdownMenuItem
                        onClick={() => handleCopy(user.address ?? "")}
                        title={
                          user.address ? "Salin alamat" : "Tidak ada alamat"
                        }
                      >
                        <MapPin className="mr-2 h-4 w-4" /> Salin Alamat
                      </DropdownMenuItem>

                      <DropdownMenuItem onClick={() => handleEdit(user)}>
                        <Edit className="mr-2 h-4 w-4" /> Edit
                      </DropdownMenuItem>

                      <DropdownMenuItem
                        onClick={() => handleDelete(user)}
                        className="text-red-600"
                      >
                        <Trash2 className="mr-2 h-4 w-4 text-red-600" /> Hapus
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}

export default memo(UserTableComponent);

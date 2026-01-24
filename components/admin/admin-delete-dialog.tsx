"use client";

import { useState } from "react";
import Image from "next/image";
import { toast } from "sonner";
import type { Admin } from "@/lib/types/admin";
import { deleteAdmin } from "@/lib/api/admin";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";
import { Loader2 } from "lucide-react";

type Props = {
  admin: Admin;
  onClose: () => void;
  onDeleted: () => void;
};

export default function AdminDeleteDialog({
  admin,
  onClose,
  onDeleted,
}: Props) {
  const [isDeleting, setIsDeleting] = useState(false);

  const submitDelete = async () => {
    setIsDeleting(true);
    try {
      await deleteAdmin(admin.id);

      toast.success(`${admin.name} berhasil dihapus`);
      onDeleted();
    } catch (err: any) {
      const message = err?.response?.data?.message || "Gagal menghapus admin";
      toast.error(message);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <Dialog open onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="sm:max-w-[420px] rounded-2xl px-8 py-10 text-center">
        {/* ACCESSIBILITY */}
        <VisuallyHidden>
          <DialogTitle>Konfirmasi Hapus Admin</DialogTitle>
        </VisuallyHidden>

        {/* IMAGE */}
        <div className="mx-auto mb-6 flex justify-center">
          <Image
            src="/delete-warning.svg"
            alt="Delete warning"
            width={140}
            height={140}
            priority
          />
        </div>

        {/* TITLE */}
        <h1 className="text-xl font-bold text-gray-900">
          Yakin ingin menghapus admin ini?
        </h1>

        {/* DESC */}
        <p className="mt-1 text-sm text-gray-500">
          Admin <span className="font-medium text-gray-900">{admin.name}</span>{" "}
          akan dihapus secara permanen.
        </p>

        {/* ACTIONS */}
        <div className="mt-8 flex justify-center gap-4">
          <Button
            onClick={submitDelete}
            disabled={isDeleting}
            className={`
                bg-linear-to-r from-red-500 to-red-600
               hover:from-red-600 hover:to-red-700
                shadow-md hover:shadow-lg
                transition-all duration-200
                min-w-[120px]
                rounded-full
                ${isDeleting ? "opacity-80 cursor-not-allowed" : ""}
                        `}
          >
            {isDeleting ? (
              <Loader2 className="h-5 w-5 animate-spin text-white" />
            ) : (
              "Hapus"
            )}
          </Button>

          <Button
            variant="outline"
            onClick={onClose}
            disabled={isDeleting}
            className="min-w-[120px] rounded-full"
          >
            Batal
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

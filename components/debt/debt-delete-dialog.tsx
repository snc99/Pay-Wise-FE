"use client";

import { useState } from "react";
import Image from "next/image";
import { toast } from "sonner";
import type { Debt } from "@/lib/types/debt";
import { deleteDebt } from "@/lib/api/debt";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";
import { Loader2 } from "lucide-react";

type Props = {
  debt: Debt;
  onClose: () => void;
  onDeleted: () => void;
};

export default function DebtDeleteDialog({ debt, onClose, onDeleted }: Props) {
  const [isDeleting, setIsDeleting] = useState(false);

  const submitDelete = async () => {
    setIsDeleting(true);
    try {
      await deleteDebt(debt.id);
      toast.success(`Data utang ${debt.user?.name} berhasil dihapus`);
      onDeleted();
    } catch (err: any) {
      const msg =
        err?.response?.data?.message ||
        "Utang ini belum lunas dan tidak dapat dihapus";

      onClose();
      toast.error(msg);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <Dialog open onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="sm:max-w-[420px] rounded-2xl px-8 py-10 text-center">
        <VisuallyHidden>
          <DialogTitle>Konfirmasi Hapus Utang</DialogTitle>
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
          Yakin ingin menghapus data ini?
        </h1>

        {/* DESC */}
        <p className="text-sm text-gray-500">
          Data utang{" "}
          <span className="font-medium text-gray-900">
            {debt.user?.name ?? "User"}
          </span>{" "}
          akan dihapus selamanya.
        </p>

        {/* ACTIONS */}
        <div className="mt-8 flex justify-center gap-4">
          <Button
            onClick={submitDelete}
            disabled={isDeleting}
            className={`
              bg-linear-to-r from-blue-500 to-cyan-600
              hover:from-blue-600 hover:to-cyan-700
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
            className="min-w-[120px] rounded-full text-blue-500 border-blue-400 hover:bg-blue-50"
          >
            Batal
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

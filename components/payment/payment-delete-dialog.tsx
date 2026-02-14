"use client";

import { useState } from "react";
import Image from "next/image";
import { toast } from "sonner";

import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { deletePaymentCycle } from "@/lib/api";
import { getErrorMessage } from "@/lib/utils/get-error-message";

type DeleteTarget = {
  id: string;
  user: {
    id: string;
    name: string;
  };
};

type Props = {
  payment: DeleteTarget;
  onDeleted?: () => void;
  children: React.ReactNode;
};

export default function PaymentDeleteDialog({
  payment,
  onDeleted,
  children,
}: Props) {
  const [open, setOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const submitDelete = async () => {
    setIsDeleting(true);
    try {
      await deletePaymentCycle(payment.id);
      toast.success(`Tagihan ${payment.user.name} berhasil dihapus`);
      onDeleted?.();
      setOpen(false);
    } catch (err: unknown) {
      toast.error(getErrorMessage(err));
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>

      <DialogContent className="sm:max-w-[420px] rounded-2xl px-8 py-10 text-center">
        {/* ACCESSIBILITY */}
        <VisuallyHidden>
          <DialogTitle>Konfirmasi Hapus Tagihan</DialogTitle>
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
          Yakin ingin menghapus tagihan ini?
        </h1>

        {/* DESC */}
        <p className="mt-1 text-sm text-gray-500">
          Tagihan milik{" "}
          <span className="font-medium text-gray-900">{payment.user.name}</span>{" "}
          akan dihapus secara permanen.
        </p>

        {/* ACTIONS */}
        <div className="mt-8 flex justify-center gap-4">
          <Button
            onClick={submitDelete}
            disabled={isDeleting}
            className={cn(
              "bg-red-600 hover:bg-red-700 text-white",
              "shadow-sm hover:shadow",
              "min-w-[120px] rounded-lg",
              "transition-all duration-200",
              isDeleting && "opacity-80 cursor-not-allowed",
            )}
          >
            {isDeleting ? (
              <Loader2 className="h-5 w-5 animate-spin text-white" />
            ) : (
              "Hapus"
            )}
          </Button>

          <Button
            variant="outline"
            onClick={() => setOpen(false)}
            disabled={isDeleting}
            className="min-w-[120px] rounded-lg border-gray-300 hover:bg-gray-50"
          >
            Batal
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

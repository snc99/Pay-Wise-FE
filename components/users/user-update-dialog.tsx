"use client";

import { useState } from "react";
import { toast } from "sonner";
import type { User } from "@/lib/types/user";
import { updateUser } from "@/lib/api/user";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@radix-ui/react-label";
import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";

type Props = {
  user: User;
  onClose: () => void;
  onUpdated: () => void;
};

export default function UserUpdateDialog({ user, onClose, onUpdated }: Props) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [form, setForm] = useState({
    name: user.name ?? "",
    phone: user.phone ?? "",
    address: user.address ?? "",
  });

  const [formErrors, setFormErrors] = useState<{ [key: string]: string }>({});

  const handleInputChange =
    (field: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement>) => {
      setForm((prev) => ({ ...prev, [field]: e.target.value }));
      setFormErrors((prev) => {
        const next = { ...prev };
        delete next[field];
        return next;
      });
    };

  const validate = () => {
    const errors: Record<string, string> = {};
    if (!form.name.trim()) errors.name = "Nama wajib diisi";
    if (!form.phone.trim()) errors.phone = "Nomor telepon wajib diisi";
    if (form.phone && !/^[0-9+\-\s()]{3,}$/.test(form.phone)) {
      errors.phone = "Format nomor telepon tidak valid";
    }

    return errors;
  };

  const submitUpdate = async () => {
    const errors = validate();
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    setIsSubmitting(true);
    try {
      const payload = {
        name: form.name,
        phone: form.phone,
        address: form.address,
      };

      await updateUser(user.id, payload);

      toast.success(`${form.name} berhasil diperbarui`);
      onUpdated();
      setFormErrors({});
    } catch (err: any) {
      const apiErrors = err?.response?.data?.errors;

      if (apiErrors && typeof apiErrors === "object") {
        const fieldErrors: Record<string, string> = {};
        Object.entries(apiErrors || {}).forEach(
          ([field, messages]: [string, any]) => {
            if (Array.isArray(messages) && messages.length > 0) {
              fieldErrors[field] = messages[0];
            }
          },
        );
        setFormErrors(fieldErrors);
        return;
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="sm:max-w-[500px] rounded-lg">
        <DialogHeader className="space-y-1 border-b pb-4">
          <DialogTitle className="text-xl font-semibold text-gray-800">
            Ubah User
          </DialogTitle>
          <p className="text-sm text-muted-foreground">
            Ubah informasi user sesuai kebutuhan Anda.
          </p>
        </DialogHeader>

        <div className="grid gap-5 py-4">
          <div className="space-y-2">
            <Label>Nama Lengkap</Label>
            <Input
              value={form.name}
              onChange={handleInputChange("name")}
              className={cn(
                "focus-visible:ring-2 focus-visible:ring-offset-2",
                formErrors.name
                  ? "border-red-500 focus-visible:ring-red-500"
                  : "focus-visible:ring-blue-500",
              )}
              disabled={isSubmitting}
            />
            {formErrors.name && (
              <p className="text-sm text-red-500">{formErrors.name}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label>Nomor Telepon</Label>
            <Input
              value={form.phone}
              onChange={handleInputChange("phone")}
              className={cn(
                "focus-visible:ring-2 focus-visible:ring-offset-2",
                formErrors.phone
                  ? "border-red-500 focus-visible:ring-red-500"
                  : "focus-visible:ring-blue-500",
              )}
              disabled={isSubmitting}
            />
            {formErrors.phone && (
              <p className="text-sm text-red-500">{formErrors.phone}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label>Alamat</Label>
            <Input
              value={form.address}
              onChange={handleInputChange("address")}
              className={cn(
                "focus-visible:ring-2 focus-visible:ring-offset-2",
                formErrors.address
                  ? "border-red-500 focus-visible:ring-red-500"
                  : "focus-visible:ring-blue-500",
              )}
              disabled={isSubmitting}
            />
            {formErrors.address && (
              <p className="text-sm text-red-500">{formErrors.address}</p>
            )}
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <Button variant="outline" onClick={onClose} disabled={isSubmitting}>
              Batal
            </Button>
            <Button
              onClick={submitUpdate}
              disabled={isSubmitting}
              className={`
                bg-linear-to-r from-blue-500 to-cyan-600
               hover:from-blue-600 hover:to-cyan-700
                shadow-md hover:shadow-lg
                transition-all duration-200
                min-w-[120px]
                ${isSubmitting ? "opacity-80 cursor-not-allowed" : ""}
                        `}
            >
              {isSubmitting ? (
                <Loader2 className="h-5 w-5 animate-spin text-white" />
              ) : (
                "Simpan"
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

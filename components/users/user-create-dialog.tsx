"use client";

import React, { useCallback, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "../ui/input";
import { Label } from "@radix-ui/react-label";
import { Button } from "../ui/button";
import { FiUserPlus } from "react-icons/fi";
import type { User } from "@/lib/types/user";
import { createUser } from "@/lib/api/user";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";

type Props = {
  onCreated?: (user: User) => void;
};

export default function UserCreateDialog({ onCreated }: Props) {
  const [open, setOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [form, setForm] = useState<{
    name: string;
    phone: string;
    address: string;
  }>({
    name: "",
    phone: "",
    address: "",
  });

  const [formErrors, setFormErrors] = useState<{
    name?: string;
    phone?: string;
    address?: string;
  }>({});

  const resetForm = useCallback(() => {
    setForm({ name: "", phone: "", address: "" });
    setFormErrors({});
  }, []);

  const handleInputChange =
    (field: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement>) => {
      setForm((prev) => ({ ...prev, [field]: e.target.value }));
      setFormErrors((prev) => ({ ...prev, [field]: undefined }));
    };

  const validate = () => {
    const e: Record<string, string> = {};
    if (!form.name.trim()) e.name = "Nama wajib diisi";
    if (!form.phone.trim()) e.phone = "Nomor telepon wajib diisi";
    if (form.phone && !/^[0-9+\-\s()]{3,}$/.test(form.phone)) {
      e.phone = "Format nomor telepon tidak valid";
    }
    return e;
  };

  const submitCreate = async () => {
    const errors = validate();
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await createUser(form);
      const created = res?.data ?? res;

      toast.success(
        created?.name
          ? `${created.name} berhasil ditambahkan`
          : "User berhasil ditambahkan",
      );

      onCreated?.(created);
      resetForm();
      setOpen(false);
    } catch (err: any) {
      const apiErrors = err?.response?.data?.errors;

      if (apiErrors && typeof apiErrors === "object") {
        const fieldErrors: Record<string, string> = {};

        Object.entries(apiErrors).forEach(([field, messages]: any) => {
          if (Array.isArray(messages) && messages.length > 0) {
            fieldErrors[field] = messages[0];
          }
        });

        setFormErrors(fieldErrors);
        return;
      }
      toast.error("Terjadi kesalahan saat menambahkan user");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(v) => {
        setOpen(v);
        if (!v) resetForm();
      }}
    >
      <DialogTrigger asChild>
        <Button
          className="bg-linear-to-r from-blue-500 to-cyan-600 hover:from-blue-600 hover:to-cyan-700 shadow-md hover:shadow-lg transition-all"
          onClick={() => setOpen(true)}
        >
          <FiUserPlus className="mr-2 h-4 w-4" />
          Tambah User
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-[500px] rounded-lg">
        <DialogHeader className="space-y-1 border-b pb-4">
          <DialogTitle className="text-xl font-semibold text-gray-800">
            Tambah User Baru
          </DialogTitle>
          <p className="text-sm text-muted-foreground">
            Masukkan informasi user yang akan ditambahkan ke sistem
          </p>
        </DialogHeader>

        <form
          className="grid gap-5 py-4"
          onSubmit={(e) => {
            e.preventDefault();
            submitCreate();
          }}
        >
          <div className="space-y-2">
            <Label htmlFor="name" className="text-gray-700 font-medium">
              Nama Lengkap
              <p className="inline text-red-500 ml-1">*</p>
            </Label>
            <Input
              id="name"
              value={form.name}
              onChange={handleInputChange("name")}
              className={cn(
                "focus-visible:ring-2 focus-visible:ring-offset-2",
                formErrors.name
                  ? "border-red-500 focus-visible:ring-red-500"
                  : "focus-visible:ring-blue-500",
              )}
              placeholder="Contoh: Andi Pratama"
              disabled={isSubmitting}
              aria-invalid={!!formErrors.name}
            />
            {formErrors.name && (
              <p className="text-sm text-red-500 mt-1">{formErrors.name}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="phone" className="text-gray-700 font-medium">
              Nomor Telepon
              <p className="inline text-red-500 ml-1">*</p>
            </Label>
            <Input
              id="phone"
              value={form.phone}
              onChange={handleInputChange("phone")}
              className={cn(
                "focus-visible:ring-2 focus-visible:ring-offset-2",
                formErrors.phone
                  ? "border-red-500 focus-visible:ring-red-500"
                  : "focus-visible:ring-blue-500",
              )}
              placeholder="e.g., 081234567890"
              disabled={isSubmitting}
              aria-invalid={!!formErrors.phone}
            />
            {formErrors.phone && (
              <p className="text-sm text-red-500 mt-1">{formErrors.phone}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="address" className="text-gray-700 font-medium">
              Alamat
            </Label>
            <Input
              id="address"
              value={form.address}
              onChange={handleInputChange("address")}
              className={cn(
                "focus-visible:ring-2 focus-visible:ring-offset-2",
                formErrors.address
                  ? "border-red-500 focus-visible:ring-red-500"
                  : "focus-visible:ring-blue-500",
              )}
              placeholder="Contoh: Jl. Merdeka No. 123, Jakarta"
              disabled={isSubmitting}
            />
            {formErrors.address && (
              <p className="text-sm text-red-500 mt-1">{formErrors.address}</p>
            )}
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                resetForm();
                setOpen(false);
              }}
              className="border-gray-300 hover:bg-gray-50"
              disabled={isSubmitting}
            >
              Batal
            </Button>

            <Button
              type="submit"
              className="
                bg-linear-to-r from-blue-500 to-cyan-600
               hover:from-blue-600 hover:to-cyan-700
                shadow-md hover:shadow-lg
                transition-all 
                duration-200
                gap-3
                pt-2
                sm:col-span-2
                text-sm
                font-medium
                rounded-sm"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <Loader2 className="h-5 w-5 animate-spin text-white" />
              ) : (
                "Simpan"
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

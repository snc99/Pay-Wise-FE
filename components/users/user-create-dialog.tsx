"use client";

import { useCallback, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { FiUserPlus, FiUser, FiPhone, FiMapPin } from "react-icons/fi";
import type { User } from "@/lib/types/user";
import { createUser } from "@/lib/api/user";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { Download, Loader2 } from "lucide-react";

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

  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  const resetForm = useCallback(() => {
    setForm({ name: "", phone: "", address: "" });
    setFormErrors({});
  }, []);

  const handleInputChange =
    (field: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement>) => {
      setForm((prev) => ({ ...prev, [field]: e.target.value }));
      if (formErrors[field]) {
        setFormErrors((prev) => {
          const next = { ...prev };
          delete next[field];
          return next;
        });
      }
    };

  const validate = () => {
    const errors: Record<string, string> = {};

    if (!form.name.trim()) {
      errors.name = "Nama wajib diisi";
    } else if (form.name.length < 2) {
      errors.name = "Nama minimal 2 karakter";
    }

    if (!form.phone.trim()) {
      errors.phone = "Nomor telepon wajib diisi";
    } else if (!/^[0-9+\-\s()]{3,}$/.test(form.phone)) {
      errors.phone = "Format nomor telepon tidak valid";
    }

    return errors;
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

      toast.success(`${created?.name || "User"} berhasil ditambahkan`);

      onCreated?.(created);
      resetForm();
      setOpen(false);
    } catch (err: any) {
      const apiErrors = err?.response?.data?.errors;

      if (apiErrors && typeof apiErrors === "object") {
        const fieldErrors: Record<string, string> = {};
        Object.entries(apiErrors).forEach(([field, messages]: any) => {
          if (Array.isArray(messages) && messages.length > 0) {
            fieldErrors[field.toLowerCase()] = messages[0];
          }
        });
        setFormErrors(fieldErrors);
        return;
      }

      toast.error(err?.response?.data?.message || "Gagal menambahkan user");
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
          className="bg-blue-600 hover:bg-blue-700 text-white shadow-sm hover:shadow"
          onClick={() => setOpen(true)}
        >
          <FiUserPlus className="mr-2 h-4 w-4" />
          Tambah Pengguna
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-[520px] max-w-[95vw] rounded-xl p-0 overflow-hidden border shadow-lg">
        {/* Header dengan subtle gradient - Warna hijau untuk user */}
        <div className="bg-gradient-to-r from-blue-50 to-gray-50 px-6 pt-6 pb-4 border-b">
          <DialogHeader>
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-blue-100 rounded-lg">
                <FiUserPlus className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <DialogTitle className="text-lg font-semibold text-gray-800">
                  Tambah Pengguna Baru
                </DialogTitle>
                <p className="text-sm text-gray-600 mt-1">
                  Masukkan informasi pengguna yang akan ditambahkan ke sistem
                </p>
              </div>
            </div>
          </DialogHeader>
        </div>

        <form
          autoComplete="off"
          className="px-6 py-5 space-y-4"
          onSubmit={(e) => {
            e.preventDefault();
            submitCreate();
          }}
        >
          <div className="grid grid-cols-1 gap-5">
            {/* NAMA LENGKAP */}
            <div className="space-y-2">
              <Label
                htmlFor="name"
                className="text-sm font-medium text-gray-700"
              >
                Nama Lengkap <span className="text-red-500">*</span>
              </Label>
              <div className="relative">
                <input
                  id="name"
                  type="text"
                  value={form.name}
                  onChange={handleInputChange("name")}
                  className={cn(
                    "w-full h-10 pl-10 pr-3 rounded-lg border text-sm",
                    "bg-white focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100",
                    formErrors.name
                      ? "border-red-500 focus:border-red-500 focus:ring-red-100"
                      : "border-gray-300",
                    "transition-all duration-200",
                  )}
                  placeholder="Masukkan nama lengkap"
                  disabled={isSubmitting}
                />
                <FiUser className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              </div>
              {formErrors.name && (
                <p className="text-sm text-red-600">{formErrors.name}</p>
              )}
            </div>

            {/* NOMOR TELEPON */}
            <div className="space-y-2">
              <Label
                htmlFor="phone"
                className="text-sm font-medium text-gray-700"
              >
                Nomor Telepon <span className="text-red-500">*</span>
              </Label>
              <div className="relative">
                <input
                  id="phone"
                  type="tel"
                  value={form.phone}
                  onChange={handleInputChange("phone")}
                  className={cn(
                    "w-full h-10 pl-10 pr-3 rounded-lg border text-sm",
                    "bg-white focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100",
                    formErrors.phone
                      ? "border-red-500 focus:border-red-500 focus:ring-red-100"
                      : "border-gray-300",
                    "transition-all duration-200",
                  )}
                  placeholder="081234567890"
                  disabled={isSubmitting}
                />
                <FiPhone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              </div>
              {formErrors.phone && (
                <p className="text-sm text-red-600">{formErrors.phone}</p>
              )}
            </div>

            {/* ALAMAT */}
            <div className="space-y-2">
              <Label
                htmlFor="address"
                className="text-sm font-medium text-gray-700"
              >
                Alamat
              </Label>
              <div className="relative">
                <input
                  id="address"
                  type="text"
                  value={form.address}
                  onChange={handleInputChange("address")}
                  className={cn(
                    "w-full h-10 pl-10 pr-3 rounded-lg border text-sm",
                    "bg-white focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100",
                    formErrors.address
                      ? "border-red-500 focus:border-red-500 focus:ring-red-100"
                      : "border-gray-300",
                    "transition-all duration-200",
                  )}
                  placeholder="Jl. Merdeka No. 123, Jakarta"
                  disabled={isSubmitting}
                />
                <FiMapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              </div>
              {formErrors.address && (
                <p className="text-sm text-red-600">{formErrors.address}</p>
              )}
              <p className="text-xs text-gray-500">Alamat bersifat opsional</p>
            </div>
          </div>

          {/* ACTION BUTTONS */}
          <div className="flex justify-end gap-3 pt-5 border-t">
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
              className={cn(
                "h-10 px-4 rounded-lg font-medium transition-all duration-200",
                "border-gray-300 hover:bg-gray-50 hover:border-gray-400",
                "focus:outline-none focus:ring-4 focus:ring-gray-100",
              )}
              disabled={isSubmitting}
            >
              Batal
            </Button>

            <Button
              type="submit"
              disabled={isSubmitting}
              className={cn(
                "h-10 px-4 rounded-lg font-medium transition-all duration-200",
                "bg-blue-600 hover:bg-blue-700 text-white",
                "focus:outline-none focus:ring-4 focus:ring-blue-100",
                "disabled:opacity-50 disabled:cursor-not-allowed",
              )}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Menyimpan...
                </>
              ) : (
                <>
                  <Download className="mr-1 h-4 w-4" />
                  Simpan
                </>
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

"use client";

import { useCallback, useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { FiEdit2, FiUser, FiPhone, FiMapPin } from "react-icons/fi";
import { toast } from "sonner";
import type { User } from "@/lib/types/user";
import { updateUser } from "@/lib/api/user";
import { cn } from "@/lib/utils";
import { Download, Loader2 } from "lucide-react";
import { getFieldErrors } from "@/lib/utils/get-field-errors";
import { getErrorMessage } from "@/lib/utils/get-error-message";

type Props = {
  user: User;
  onUpdated?: (user: User) => void;
  children: React.ReactNode;
};

export default function UserUpdateDialog({ user, onUpdated, children }: Props) {
  const [open, setOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [form, setForm] = useState({
    name: "",
    phone: "",
    address: "",
  });

  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  // Initialize form with user data when modal opens or user changes
  useEffect(() => {
    if (open && user) {
      setForm({
        name: user.name || "",
        phone: user.phone || "",
        address: user.address || "",
      });
      setFormErrors({});
    }
  }, [open, user]);

  const resetForm = useCallback(() => {
    if (user) {
      setForm({
        name: user.name || "",
        phone: user.phone || "",
        address: user.address || "",
      });
    }
    setFormErrors({});
  }, [user]);

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

      const res = await updateUser(user.id, payload);
      const updated = res?.data ?? res;

      toast.success(`${updated?.name || "User"} berhasil diperbarui`);

      onUpdated?.(updated);
      setOpen(false);
    } catch (err: unknown) {
      const fieldErrors = getFieldErrors(err);

      if (fieldErrors) {
        setFormErrors(fieldErrors);
        return;
      }

      toast.error(getErrorMessage(err));
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
      <DialogTrigger asChild>{children}</DialogTrigger>

      <DialogContent className="sm:max-w-[520px] max-w-[95vw] rounded-xl p-0 overflow-hidden border shadow-lg">
        {/* Header dengan subtle gradient - Warna biru untuk consistency */}
        <div className="bg-linear-to-r from-blue-50 to-gray-50 px-6 pt-6 pb-4 border-b">
          <DialogHeader>
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-blue-100 rounded-lg">
                <FiEdit2 className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <DialogTitle className="text-lg font-semibold text-gray-800">
                  Edit User
                </DialogTitle>
                <p className="text-sm text-gray-600 mt-1">
                  Perbarui informasi user {user.name}
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
            submitUpdate();
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
                  <Download className="mr-2 h-4 w-4" />
                  Perbarui
                </>
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@radix-ui/react-label";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { updateAdmin } from "@/lib/api/admin";
import type { Admin, Role } from "@/lib/types/admin";
import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";

type Props = {
  admin: Admin;
  onClose: () => void;
  onUpdated: () => void;
};

export default function AdminUpdateDialog({
  admin,
  onClose,
  onUpdated,
}: Props) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [form, setForm] = useState({
    name: admin.name,
    username: admin.username,
    email: admin.email,
    password: "",
    role: admin.role as Role,
  });

  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  const handleInputChange =
    (field: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement>) => {
      setForm((prev) => ({ ...prev, [field]: e.target.value }));
      setFormErrors((prev) => {
        const next = { ...prev };
        delete next[field];
        return next;
      });
    };

  const handleSelectChange =
    (field: keyof typeof form) => (e: React.ChangeEvent<HTMLSelectElement>) => {
      setForm((prev) => ({ ...prev, [field]: e.target.value }));
    };

  const validate = () => {
    const errors: Record<string, string> = {};
    if (!form.name.trim()) errors.name = "Nama wajib diisi";
    if (!form.email.trim()) errors.email = "Email wajib diisi";

    if (form.password && form.password.length < 6) {
      errors.password = "Password minimal 6 karakter";
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
      const payload: any = {
        name: form.name,
        email: form.email,
        role: form.role,
      };

      if (form.password.trim()) {
        payload.password = form.password;
      }

      await updateAdmin(admin.id, payload);

      toast.success(`Admin ${form.name} berhasil diperbarui`);
      onUpdated();
      setFormErrors({});
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
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="sm:max-w-[520px]">
        <DialogHeader className="space-y-1 border-b pb-4">
          <DialogTitle className="text-xl font-bold text-gray-800">
            Edit Admin
          </DialogTitle>
          <p className="text-sm text-muted-foreground">
            Perbarui informasi admin
          </p>
        </DialogHeader>

        <form
          autoComplete="off"
          className="grid grid-cols-1 sm:grid-cols-2 gap-5 py-4"
          onSubmit={(e) => {
            e.preventDefault();
            submitUpdate();
          }}
        >
          {/* NAME */}
          <div className="space-y-1">
            <Label>Nama Lengkap </Label>
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
              disabled={isSubmitting}
            />

            {formErrors.name && (
              <p className="text-sm text-red-500">{formErrors.name}</p>
            )}
          </div>

          {/* USERNAME (READONLY) */}
          <div className="space-y-1">
            <Label>Username</Label>
            <Input
              value={form.username}
              disabled
              className="bg-gray-50 text-gray-500 cursor-not-allowed"
            />
            <p className="text-xs text-blue-600">Username tidak bisa diubah</p>
          </div>

          {/* ROLE */}
          <div className="space-y-1">
            <Label>Role</Label>
            <select
              value={form.role}
              onChange={handleSelectChange("role")}
              className="w-full rounded-md border px-3 py-2 text-sm"
            >
              <option value="ADMIN">Admin</option>
              <option value="SUPERADMIN">Super Admin</option>
            </select>
          </div>

          {/* EMAIL */}
          <div className="space-y-1">
            <Label>Email</Label>
            <Input
              type="email"
              value={form.email}
              onChange={handleInputChange("email")}
              className={cn(
                "focus-visible:ring-2 focus-visible:ring-offset-2",
                formErrors.email
                  ? "border-red-500 focus-visible:ring-red-500"
                  : "focus-visible:ring-blue-500",
              )}
              disabled={isSubmitting}
            />
            {formErrors.email && (
              <p className="text-sm text-red-500">{formErrors.email}</p>
            )}
          </div>

          {/* PASSWORD (OPTIONAL) */}
          <div className="space-y-2 sm:col-span-2">
            <Label>Password (opsional)</Label>
            <Input
              type="password"
              autoComplete="new-password"
              placeholder="Kosongkan jika tidak diubah"
              value={form.password}
              onChange={handleInputChange("password")}
              className={cn(
                "focus-visible:ring-2 focus-visible:ring-offset-2",
                formErrors.phone
                  ? "border-red-500 focus-visible:ring-red-500"
                  : "focus-visible:ring-blue-500",
              )}
              disabled={isSubmitting}
            />
            {formErrors.password && (
              <p className="text-sm text-red-500">{formErrors.password}</p>
            )}
          </div>

          <div className="flex justify-end gap-3 pt-2 sm:col-span-2">
            <Button variant="outline" type="button" onClick={onClose}>
              Batal
            </Button>

            <Button
              type="submit"
              className="
              bg-linear-to-r from-blue-500 to-cyan-600
            hover:from-blue-600 hover:to-cyan-700
              shadow-sm hover:shadow-md
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
              )}{" "}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

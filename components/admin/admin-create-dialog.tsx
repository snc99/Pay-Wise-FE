"use client";

import { useCallback, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@radix-ui/react-label";
import { Button } from "@/components/ui/button";
import { FiUserPlus } from "react-icons/fi";
import { toast } from "sonner";
import { createAdmin } from "@/lib/api/admin";
import type { Admin, Role } from "@/lib/types/admin";
import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";

type Props = {
  onCreated?: (admin: Admin) => void;
};

export default function AdminCreateDialog({ onCreated }: Props) {
  const [open, setOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [form, setForm] = useState({
    name: "",
    username: "",
    email: "",
    password: "",
    role: "ADMIN" as Role,
  });

  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  const resetForm = useCallback(() => {
    setForm({
      name: "",
      username: "",
      email: "",
      password: "",
      role: "ADMIN",
    });
    setFormErrors({});
  }, []);

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
    const e: Record<string, string> = {};
    if (!form.name.trim()) e.name = "Nama wajib diisi";
    if (!form.username.trim()) e.username = "Username wajib diisi";
    if (!form.email.trim()) e.email = "Email wajib diisi";
    if (!form.password.trim()) {
      e.password = "Password wajib diisi";
    } else if (form.password.length < 6) {
      e.password = "Password minimal 6 karakter";
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
      const res = await createAdmin(form);
      const created = res?.data ?? res;

      toast.success(
        created?.name
          ? `${created.name} berhasil ditambahkan`
          : "Admin berhasil ditambahkan",
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

      toast.error("Terjadi kesalahan saat menambahkan admin");
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
          Tambah Admin
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-[500px] rounded-lg">
        <DialogHeader className="space-y-1 border-b pb-4">
          <DialogTitle className="text-xl font-bold text-gray-800">
            Tambah Admin Baru
          </DialogTitle>
          <p className="text-sm text-muted-foreground">
            Masukkan informasi admin yang akan ditambahkan ke sistem
          </p>
        </DialogHeader>

        <form
          autoComplete="off"
          className="grid grid-cols-1 sm:grid-cols-2 gap-5 py-4"
          onSubmit={(e) => {
            e.preventDefault();
            submitCreate();
          }}
        >
          {/* NAME */}
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
              <p className="text-sm text-red-500">{formErrors.name}</p>
            )}
          </div>

          {/* USERNAME */}
          <div className="space-y-1">
            <Label>
              Username
              <p className="inline text-red-500 ml-1">*</p>
            </Label>
            <Input
              id="username"
              autoComplete="off"
              value={form.username}
              onChange={handleInputChange("username")}
              className={cn(
                "focus-visible:ring-2 focus-visible:ring-offset-2",
                formErrors.username
                  ? "border-red-500 focus-visible:ring-red-500"
                  : "focus-visible:ring-blue-500",
              )}
              disabled={isSubmitting}
              placeholder="Contoh : snc23"
              aria-label={
                !!formErrors.username ? undefined : "Username sudah digunakan"
              }
            />
            {formErrors.username && (
              <p className="text-sm text-red-500">{formErrors.username}</p>
            )}
          </div>

          {/* ROLE */}
          <div className="space-y-2">
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
          <div className="space-y-2">
            <Label>
              Email
              <p className="inline text-red-500 ml-1">*</p>
            </Label>
            <Input
              autoComplete="off"
              type="email"
              value={form.email}
              onChange={handleInputChange("email")}
              className={cn(
                "focus-visible:ring-2 focus-visible:ring-offset-2",
                formErrors.email
                  ? "border-red-500 focus-visible:ring-red-500"
                  : "focus-visible:ring-blue-500",
              )}
              placeholder="example123@gmail.com"
              disabled={isSubmitting}
              aria-invalid={!!formErrors.email}
            />
            {formErrors.email && (
              <p className="text-sm text-red-500">{formErrors.email}</p>
            )}
          </div>

          {/* PASSWORD */}
          <div className="space-y-2 sm:col-span-2">
            <Label>Password</Label>
            <Input
              type="password"
              autoComplete="new-password"
              value={form.password}
              onChange={handleInputChange("password")}
              className={cn(
                "focus-visible:ring-2 focus-visible:ring-offset-2",
                formErrors.phone
                  ? "border-red-500 focus-visible:ring-red-500"
                  : "focus-visible:ring-blue-500",
              )}
              disabled={isSubmitting}
              aria-invalid={!!formErrors.password}
            />
            {formErrors.password && (
              <p className="text-sm text-red-500">{formErrors.password}</p>
            )}
          </div>

          <div className="flex justify-end gap-3 pt-2 sm:col-span-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                resetForm();
                setOpen(false);
              }}
            >
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
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

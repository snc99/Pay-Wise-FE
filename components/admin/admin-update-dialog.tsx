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
import {
  FiEdit2,
  FiEye,
  FiEyeOff,
  FiUser,
  FiMail,
  FiShield,
  FiKey,
} from "react-icons/fi";
import { toast } from "sonner";
import { updateAdmin } from "@/lib/api/admin"; // Pastikan ada fungsi updateAdmin
import type { Admin, Role } from "@/lib/types/admin";
import { cn } from "@/lib/utils";
import { Download, Loader2 } from "lucide-react";
import { getErrorMessage } from "@/lib/utils/get-error-message";
import { getFieldErrors } from "@/lib/utils/get-field-errors";

type Props = {
  admin: Admin;
  onUpdated?: (admin: Admin) => void;
  children: React.ReactNode;
};

export default function AdminUpdateDialog({
  admin,
  onUpdated,
  children,
}: Props) {
  const [open, setOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const [form, setForm] = useState({
    name: "",
    username: "",
    email: "",
    password: "", // Password kosong untuk edit (opsional)
    role: "ADMIN" as Role,
  });

  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  // Initialize form with admin data when modal opens or admin changes
  useEffect(() => {
    if (open && admin) {
      setForm({
        name: admin.name || "",
        username: admin.username || "",
        email: admin.email || "",
        password: "", // Biarkan kosong untuk edit
        role: admin.role || "ADMIN",
      });
      setFormErrors({});
      setShowPassword(false);
    }
  }, [open, admin]);

  const resetForm = useCallback(() => {
    if (admin) {
      setForm({
        name: admin.name || "",
        username: admin.username || "",
        email: admin.email || "",
        password: "",
        role: admin.role || "ADMIN",
      });
    }
    setFormErrors({});
    setShowPassword(false);
  }, [admin]);

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

    if (!form.name.trim()) errors.name = "Nama wajib diisi";
    if (!form.username.trim()) errors.username = "Username wajib diisi";

    if (!form.email.trim()) {
      errors.email = "Email wajib diisi";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      errors.email = "Format email tidak valid";
    }

    // Password optional saat update, tapi kalau diisi harus minimal 6 karakter
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
      // Buat payload update, jika password kosong jangan kirim
      const updateData: Record<string, unknown> = {
        name: form.name,
        username: form.username,
        email: form.email,
        role: form.role,
      };

      // Hanya kirim password jika diisi
      if (form.password.trim()) {
        updateData.password = form.password;
      }

      const res = await updateAdmin(admin.id, updateData);
      const updated = res?.data ?? res;

      toast.success(`${updated?.name || "Admin"} berhasil diperbarui`);

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
        {/* Header dengan subtle gradient */}
        <div className="bg-linear-to-r from-blue-50 to-gray-50 px-6 pt-6 pb-4 border-b">
          <DialogHeader>
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-blue-100 rounded-lg">
                <FiEdit2 className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <DialogTitle className="text-lg font-semibold text-gray-800">
                  Edit Admin
                </DialogTitle>
                <p className="text-sm text-gray-600 mt-1">
                  Perbarui informasi admin {admin.name}
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
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
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

            {/* USERNAME */}
            <div className="space-y-2">
              <Label
                htmlFor="username"
                className="text-sm font-medium text-gray-700"
              >
                Username <span className="text-red-500">*</span>
              </Label>
              <div className="relative">
                <input
                  id="username"
                  type="text"
                  autoComplete="off"
                  value={form.username}
                  onChange={handleInputChange("username")}
                  className={cn(
                    "w-full h-10 pl-10 pr-3 rounded-lg border text-sm",
                    "bg-white focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100",
                    formErrors.username
                      ? "border-red-500 focus:border-red-500 focus:ring-red-100"
                      : "border-gray-300",
                    "transition-all duration-200",
                  )}
                  placeholder="snc23"
                  disabled={isSubmitting}
                />
                <FiUser className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              </div>
              {formErrors.username && (
                <p className="text-sm text-red-600">{formErrors.username}</p>
              )}
            </div>

            {/* EMAIL */}
            <div className="space-y-2 sm:col-span-2">
              <Label
                htmlFor="email"
                className="text-sm font-medium text-gray-700"
              >
                Email <span className="text-red-500">*</span>
              </Label>
              <div className="relative">
                <input
                  id="email"
                  type="email"
                  autoComplete="off"
                  value={form.email}
                  onChange={handleInputChange("email")}
                  className={cn(
                    "w-full h-10 pl-10 pr-3 rounded-lg border text-sm",
                    "bg-white focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100",
                    formErrors.email
                      ? "border-red-500 focus:border-red-500 focus:ring-red-100"
                      : "border-gray-300",
                    "transition-all duration-200",
                  )}
                  placeholder="admin@example.com"
                  disabled={isSubmitting}
                />
                <FiMail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              </div>
              {formErrors.email && (
                <p className="text-sm text-red-600">{formErrors.email}</p>
              )}
            </div>

            {/* ROLE */}
            <div className="space-y-2">
              <Label
                htmlFor="role"
                className="text-sm font-medium text-gray-700"
              >
                Role
              </Label>
              <div className="relative">
                <select
                  id="role"
                  value={form.role}
                  onChange={(e) =>
                    setForm((prev) => ({
                      ...prev,
                      role: e.target.value as Role,
                    }))
                  }
                  className={cn(
                    "w-full h-10 pl-10 pr-10 rounded-lg border text-sm",
                    "bg-white focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100",
                    "border-gray-300 transition-all duration-200",
                    "appearance-none cursor-pointer",
                  )}
                  disabled={isSubmitting}
                >
                  <option value="ADMIN">Admin</option>
                  <option value="SUPERADMIN">Super Admin</option>
                </select>
                <FiShield className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
                  <svg
                    className="w-4 h-4 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </div>
              </div>
            </div>

            {/* PASSWORD */}
            <div className="space-y-2">
              <Label
                htmlFor="password"
                className="text-sm font-medium text-gray-700"
              >
                Password
              </Label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="new-password"
                  value={form.password}
                  onChange={handleInputChange("password")}
                  className={cn(
                    "w-full h-10 pl-10 pr-10 rounded-lg border text-sm",
                    "bg-white focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100",
                    formErrors.password
                      ? "border-red-500 focus:border-red-500 focus:ring-red-100"
                      : "border-gray-300",
                    "transition-all duration-200",
                  )}
                  disabled={isSubmitting}
                  placeholder="Kosongkan jika tidak ingin mengubah"
                />
                <FiKey className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 p-1"
                  aria-label={
                    showPassword ? "Sembunyikan password" : "Tampilkan password"
                  }
                >
                  {showPassword ? (
                    <FiEyeOff className="h-4 w-4" />
                  ) : (
                    <FiEye className="h-4 w-4" />
                  )}
                </button>
              </div>
              {formErrors.password ? (
                <p className="text-sm text-red-600">{formErrors.password}</p>
              ) : (
                <p className="text-xs text-gray-500">
                  Biarkan kosong jika tidak ingin mengubah password
                </p>
              )}
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

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
import {
  FiUserPlus,
  FiEye,
  FiEyeOff,
  FiUser,
  FiMail,
  FiShield,
  FiKey,
} from "react-icons/fi";
import { toast } from "sonner";
import { createAdmin } from "@/lib/api/admin";
import type { Admin, Role } from "@/lib/types/admin";
import { cn } from "@/lib/utils";
import { Download, Loader2 } from "lucide-react";

type Props = {
  onCreated?: (admin: Admin) => void;
};

export default function AdminCreateDialog({ onCreated }: Props) {
  const [open, setOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

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
    setShowPassword(false);
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

    if (!form.name.trim()) errors.name = "Nama wajib diisi";
    if (!form.username.trim()) errors.username = "Username wajib diisi";

    if (!form.email.trim()) {
      errors.email = "Email wajib diisi";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      errors.email = "Format email tidak valid";
    }

    if (!form.password.trim()) {
      errors.password = "Password wajib diisi";
    } else if (form.password.length < 6) {
      errors.password = "Password minimal 6 karakter";
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
      const res = await createAdmin(form);
      const created = res?.data ?? res;

      toast.success(`${created?.name || "Admin"} berhasil ditambahkan`);

      onCreated?.(created);
      resetForm();
      setOpen(false);
    } catch (err: unknown) {
      let apiErrors: unknown;

      if (typeof err === "object" && err !== null && "response" in err) {
        apiErrors = (err as { response?: { data?: { errors?: unknown } } })
          .response?.data?.errors;
      }

      if (apiErrors && typeof apiErrors === "object") {
        const fieldErrors: Record<string, string> = {};

        Object.entries(apiErrors).forEach(
          ([field, messages]: [string, unknown]) => {
            if (Array.isArray(messages) && messages.length > 0) {
              fieldErrors[field.toLowerCase()] = String(messages[0]);
            }
          },
        );

        setFormErrors(fieldErrors);
        return;
      }

      if (err instanceof Error) {
        toast.error(err.message);
      } else {
        toast.error("Gagal menambahkan admin");
      }
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
          Tambah Admin
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-[520px] max-w-[95vw] rounded-xl p-0 overflow-hidden border shadow-lg">
        {/* Header dengan subtle gradient */}
        <div className="bg-linear-to-r from-blue-50 to-gray-50 px-6 pt-6 pb-4 border-b">
          <DialogHeader>
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-blue-100 rounded-lg">
                <FiUserPlus className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <DialogTitle className="text-lg font-semibold text-gray-800">
                  Tambah Admin Baru
                </DialogTitle>
                <p className="text-sm text-gray-600 mt-1">
                  Masukkan informasi admin yang akan ditambahkan
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
                Password <span className="text-red-500">*</span>
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
                  placeholder="Masukkan password"
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
                  Password minimal 6 karakter
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

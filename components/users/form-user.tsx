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
import { createUser as createUserApi } from "@/lib/api/user";
import { toast } from "sonner";

type Props = {
  /**
   * Callback dipanggil setelah user berhasil dibuat.
   * Diberi objek user yang dikembalikan BE (normalized).
   */
  onCreated?: (user: User) => void;
};

export default function UserForm({ onCreated }: Props) {
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

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
    const errors: typeof formErrors = {};
    if (!form.name.trim()) errors.name = "Nama harus diisi";
    if (!form.phone.trim()) errors.phone = "Nomor telepon harus diisi";
    // simple phone validation (opsional)
    if (form.phone && !/^[0-9+\-\s()]{3,}$/.test(form.phone)) {
      errors.phone = "Format nomor telepon tidak valid";
    }
    // address optional
    return errors;
  };

  const handleSubmit = async () => {
    const errors = validate();
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    setIsLoading(true);
    try {
      // call API
      const res = await createUserApi({
        name: form.name.trim(),
        phone: form.phone.trim(),
        address: form.address.trim() || null,
      });

      // Normalisasi respons: banyak kemungkinan bentuk
      // Controller kita return { success, status, message, data: { id, name, ... } }
      const created = res?.data ?? res;

      toast.success(
        created?.name
          ? `${created.name} berhasil ditambahkan`
          : "User berhasil ditambahkan"
      );

      // reset & close
      resetForm();
      setOpen(false);

      // callback ke parent jika ada (FE bisa refresh list)
      if (onCreated) {
        // try to pass created user shape; if BE returns wrapper, try to unwrap further
        const payload = created?.data ?? created;
        onCreated(payload);
      }
    } catch (err: any) {
      console.error("create user error:", err);
      // coba ambil pesan dari response
      const msg = err?.message ?? err?.toString?.() ?? "Gagal menambahkan user";
      toast.error(msg);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={(v) => setOpen(v)}>
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
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-gray-800">
            Tambah User Baru
          </DialogTitle>
        </DialogHeader>

        <form
          className="grid gap-5 py-4"
          onSubmit={(e) => {
            e.preventDefault();
            handleSubmit();
          }}
        >
          <div className="space-y-2">
            <Label htmlFor="name" className="text-gray-700 font-medium">
              Nama Lengkap
            </Label>
            <Input
              id="name"
              value={form.name}
              onChange={handleInputChange("name")}
              className={`${formErrors.name ? "border-red-500" : ""}`}
              placeholder="Masukkan nama lengkap"
              disabled={isLoading}
              aria-invalid={!!formErrors.name}
            />
            {formErrors.name && (
              <p className="text-sm text-red-500 mt-1">{formErrors.name}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="phone" className="text-gray-700 font-medium">
              Nomor Telepon
            </Label>
            <Input
              id="phone"
              value={form.phone}
              onChange={handleInputChange("phone")}
              className={`${formErrors.phone ? "border-red-500" : ""}`}
              placeholder="Masukkan nomor telepon"
              disabled={isLoading}
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
              className={`${formErrors.address ? "border-red-500" : ""}`}
              placeholder="Masukkan alamat"
              disabled={isLoading}
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
              disabled={isLoading}
            >
              Batal
            </Button>

            <Button
              type="submit"
              className="bg-linear-to-r from-blue-500 to-cyan-600 hover:from-blue-600 hover:to-cyan-700 shadow-md hover:shadow-lg transition-all"
              disabled={isLoading}
            >
              {isLoading ? "Menyimpan..." : "Simpan"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

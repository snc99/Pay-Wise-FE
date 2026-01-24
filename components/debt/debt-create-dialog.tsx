"use client";

import React, { useCallback, useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@radix-ui/react-label";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { getUsers } from "@/lib/api/user";
import { createDebt } from "@/lib/api/debt";
import type { User } from "@/lib/types/user";
import type { Debt } from "@/lib/types/debt";
import AsyncSelect from "react-select/async";
import { searchUsers } from "@/lib/api/user";
import { FiDollarSign } from "react-icons/fi";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

type Props = {
  onCreated?: (debt: Debt) => void;
};

type UserOption = {
  value: string;
  label: string;
};

const selectStyles = (hasError: boolean) => ({
  control: (base: any, state: any) => ({
    ...base,
    borderColor: hasError
      ? "#ef4444" // red-500
      : state.isFocused
        ? "#3b82f6" // blue-500
        : base.borderColor,
    boxShadow: state.isFocused
      ? hasError
        ? "0 0 0 2px rgba(239,68,68,.4)"
        : "0 0 0 2px rgba(59,130,246,.4)"
      : "none",
    "&:hover": {
      borderColor: hasError ? "#ef4444" : "#3b82f6",
    },
  }),
});

export default function DebtCreateDialog({ onCreated }: Props) {
  const [open, setOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loadingUsers, setLoadingUsers] = useState(false);
  const [selectKey, setSelectKey] = useState(0);
  const [users, setUsers] = useState<UserOption[]>([]);
  const [selectedUser, setSelectedUser] = useState<UserOption | null>(null);
  const [date, setDate] = useState<Date | undefined>();

  const [rawAmount, setRawAmount] = useState("");

  const [formErrors, setFormErrors] = useState<{
    userId?: string;
    amount?: string;
    date?: string;
  }>({});

  const resetForm = useCallback(() => {
    setSelectedUser(null);
    setRawAmount("");
    setDate(undefined);
    setFormErrors({});
  }, []);

  useEffect(() => {
    if (!open) {
      resetForm();
      setSelectKey((k) => k + 1);
    }
  }, [open, resetForm]);

  const loadUserOptions = async (inputValue: string) => {
    if (!inputValue || inputValue.length < 2) return [];

    const res = await searchUsers(inputValue, 10);
    return res?.data?.items ?? [];
  };

  useEffect(() => {
    if (!open) return;

    setLoadingUsers(true);
    getUsers({ limit: 1000 })
      .then((res) => {
        const list = res?.data?.items ?? [];
        setUsers(
          list.map((u: User) => ({
            value: u.id,
            label: u.name,
          })),
        );
      })
      .finally(() => setLoadingUsers(false));
  }, [open]);

  const validate = () => {
    const e: Record<string, string> = {};

    if (!selectedUser) e.userId = "User wajib dipilih";
    if (!rawAmount) e.amount = "Jumlah utang wajib diisi";
    const normalizedAmount = rawAmount.replace(/\./g, "").replace(/,/g, ".");
    if (Number(normalizedAmount) <= 0) e.amount = "Jumlah harus lebih dari 0";
    if (!date) e.date = "Tanggal utang wajib diisi";
    else if (date > new Date()) e.date = "Tanggal tidak boleh di masa depan";

    return e;
  };

  const normalizedAmount = rawAmount.replace(/\./g, "").replace(/,/g, ".");
  const amount = Number(normalizedAmount);

  const formatRupiahInput = (value: string) => {
    const clean = value.replace(/[^\d]/g, ""); // buang semua kecuali angka
    return new Intl.NumberFormat("id-ID").format(Number(clean || 0));
  };

  const submitCreate = async () => {
    const errors = validate();
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await createDebt({
        userId: selectedUser!.value,
        amount: amount,
        date: date!.toISOString(),
      });

      const created = res?.data ?? res;

      toast.success(`Utang ${selectedUser?.label} berhasil ditambahkan`);

      onCreated?.(created);
      resetForm();
      setOpen(false);
    } catch (err: any) {
      const apiErrors = err?.response?.data?.errors;
      if (apiErrors) {
        setFormErrors(apiErrors);
        return;
      }
      toast.error("Gagal menambahkan utang");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          className="bg-linear-to-r from-blue-500 to-cyan-600 hover:from-blue-600 hover:to-cyan-700 shadow-md hover:shadow-lg transition-all"
          onClick={() => setOpen(true)}
        >
          <FiDollarSign className="mr-2 h-4 w-4" />
          Tambah Utang
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-[500px] rounded-lg">
        <DialogHeader className="space-y-2 border-b pb-4">
          <DialogTitle className="text-xl font-semibold text-gray-800">
            Tambah Utang
          </DialogTitle>
          <p className="text-sm text-muted-foreground">
            Catat utang baru untuk user di sini.
          </p>
        </DialogHeader>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            submitCreate();
          }}
        >
          <div className="space-y-4 py-2">
            {/* USER SELECT */}
            <div>
              <Label>
                User
                <p className="inline text-red-500 ml-1">*</p>
              </Label>
              <AsyncSelect<UserOption>
                cacheOptions
                key={selectKey}
                loadOptions={loadUserOptions}
                value={selectedUser}
                onChange={(v) => {
                  setSelectedUser(v);
                  setFormErrors((p) => ({ ...p, userId: undefined }));
                }}
                className="mt-2"
                styles={selectStyles(!!formErrors.userId)}
                placeholder="Cari nama user..."
                noOptionsMessage={() => "User tidak ditemukan"}
                loadingMessage={() => "Mencari user..."}
              />

              {formErrors.userId && (
                <p className="text-sm text-red-500 mt-1">{formErrors.userId}</p>
              )}
            </div>

            {/* AMOUNT */}
            <div>
              <Label>
                Jumlah Utang
                <p className="inline text-red-500 ml-1">*</p>
              </Label>
              <Input
                type="text"
                inputMode="numeric"
                value={rawAmount ? formatRupiahInput(rawAmount) : ""}
                onChange={(e) => {
                  const clean = e.target.value.replace(/[^\d]/g, "");
                  setRawAmount(clean);
                  setFormErrors((p) => ({ ...p, amount: undefined }));
                }}
                placeholder="0"
                className={cn(
                  "text-right",
                  "mt-2",
                  "focus-visible:ring-2 focus-visible:ring-offset-2",
                  formErrors.amount
                    ? "border-red-500 focus-visible:ring-red-500"
                    : "focus-visible:ring-blue-500",
                )}
                disabled={isSubmitting}
              />

              {formErrors.amount && (
                <p className="text-sm text-red-500">{formErrors.amount}</p>
              )}
            </div>

            {/* DATE */}
            <div className="space-y-2">
              <Label>
                Tanggal Utang
                <span className="text-red-500 ml-1">*</span>
              </Label>

              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      "mt-2",
                      !date && "text-muted-foreground",
                      formErrors.date && "border-red-500",
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {date ? format(date, "dd MMM yyyy") : "Pilih tanggal"}
                  </Button>
                </PopoverTrigger>

                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={date}
                    onSelect={(d) => {
                      setDate(d);
                      setFormErrors((p) => ({ ...p, date: undefined }));
                    }}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>

              {formErrors.date && (
                <p className="text-sm text-red-500">{formErrors.date}</p>
              )}
            </div>

            <div className="flex justify-end gap-3">
              <Button variant="outline" onClick={() => setOpen(false)}>
                Batal
              </Button>
              <Button
                onClick={submitCreate}
                disabled={isSubmitting}
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
              >
                {isSubmitting ? (
                  <Loader2 className="h-4 w-4 animate-spin text-white" />
                ) : (
                  "Simpan"
                )}
              </Button>
            </div>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

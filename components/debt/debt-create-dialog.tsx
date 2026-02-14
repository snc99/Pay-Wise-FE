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
import { Loader2, CalendarIcon, Search, ArrowDownToLine } from "lucide-react";
import { cn } from "@/lib/utils";
import { createDebt } from "@/lib/api/debt";
import type { StylesConfig } from "react-select";
import AsyncSelect from "react-select/async";
import { searchUsers } from "@/lib/api/user";
import { FiDollarSign, FiFileText } from "react-icons/fi";
import { format } from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { getFieldErrors } from "@/lib/utils/get-field-errors";
import { getErrorMessage } from "@/lib/utils/get-error-message";

type Props = {
  onCreated?: () => void;
};

type UserOption = {
  value: string;
  label: string;
  phone?: string;
};

type RawUser =
  | { value?: string; label?: string; phone?: string }
  | { id?: string; name?: string; phone?: string };

const customStyles: StylesConfig<UserOption, false> = {
  control: (base, state) => ({
    ...base,
    minHeight: "44px",
    borderColor: state.isFocused ? "#3b82f6" : "#d1d5db",
    borderRadius: "0.5rem",
    boxShadow: state.isFocused ? "0 0 0 3px rgba(59, 130, 246, 0.1)" : "none",
    "&:hover": {
      borderColor: "#3b82f6",
    },
    transition: "all 0.2s",
    backgroundColor: "#fafafa",
  }),

  option: (base, state) => ({
    ...base,
    backgroundColor: state.isSelected
      ? "#3b82f6"
      : state.isFocused
        ? "#f8fafc"
        : "#fff",
    color: state.isSelected ? "#fff" : "#1f2937",
    "&:hover": {
      backgroundColor: state.isSelected ? "#2563eb" : "#f8fafc",
    },
    padding: "12px 16px",
    fontSize: "0.95rem",
    borderRadius: "0.5rem",
    cursor: "pointer",
    marginBottom: "4px",
    transition: "all 0.2s",
  }),
};

export default function DebtCreateDialog({ onCreated }: Props) {
  const [open, setOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectKey, setSelectKey] = useState(0);
  const [selectedUser, setSelectedUser] = useState<UserOption | null>(null);
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [note, setNote] = useState("");
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
    setNote("");
    setFormErrors({});
  }, []);

  useEffect(() => {
    if (!open) {
      resetForm();
      setSelectKey((k) => k + 1);
    }
  }, [open, resetForm]);

  const loadUserOptions = async (inputValue: string): Promise<UserOption[]> => {
    if (!inputValue || inputValue.length < 2) {
      return [];
    }

    try {
      const res = await searchUsers(inputValue, 10);

      // HANDLE API RESPONSE CORRECTLY
      let users: unknown[] = [];

      if (res?.success === true && res?.data?.items) {
        users = res.data.items;
      } else if (Array.isArray(res)) {
        users = res;
      } else if (res?.items) {
        users = res.items;
      } else if (res?.data && Array.isArray(res.data)) {
        users = res.data;
      }

      // FORMAT FOR REACT-SELECT
      return users
        .map((user) => {
          const u = user as {
            value?: string;
            label?: string;
            id?: string;
            name?: string;
            phone?: string;
          };

          const userValue = u.value ?? u.id ?? "";
          const userLabel = u.label ?? u.name ?? "";

          if (!userValue || !userLabel) {
            return null;
          }

          return {
            value: userValue,
            label: userLabel,
            phone: u.phone ?? "",
          };
        })
        .filter(
          (item): item is { value: string; label: string; phone: string } =>
            item !== null,
        );
    } catch (error) {
      console.error("❌ Error loading user options:", error);
      toast.error("Gagal memuat data user");
      return [];
    }
  };

  const validate = () => {
    const errors: Record<string, string> = {};

    if (!selectedUser) errors.userId = "User wajib dipilih";

    if (!rawAmount) {
      errors.amount = "Jumlah utang wajib diisi";
    } else {
      const normalizedAmount = rawAmount.replace(/\./g, "").replace(/,/g, ".");
      if (Number(normalizedAmount) <= 0) {
        errors.amount = "Jumlah harus lebih dari 0";
      }
    }

    if (!date) {
      errors.date = "Tanggal utang wajib diisi";
    } else if (date > new Date()) {
      errors.date = "Tanggal tidak boleh di masa depan";
    }

    return errors;
  };

  const formatRupiahInput = (value: string) => {
    const clean = value.replace(/[^\d]/g, "");
    return new Intl.NumberFormat("id-ID").format(Number(clean || 0));
  };

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const clean = e.target.value.replace(/[^\d]/g, "");
    setRawAmount(clean);
    if (formErrors.amount) {
      setFormErrors((prev) => ({ ...prev, amount: undefined }));
    }
  };

  const submitCreate = async () => {
    const errors = validate();
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    setIsSubmitting(true);
    try {
      const normalizedAmount = rawAmount.replace(/\./g, "").replace(/,/g, ".");
      const amount = Number(normalizedAmount);

      await createDebt({
        userId: selectedUser!.value,
        amount: amount,
        date: date!.toISOString(),
        note,
      });

      toast.success(`Utang berhasil ditambahkan untuk ${selectedUser?.label}`);
      onCreated?.();
      setOpen(false);
    } catch (err: unknown) {
      console.error("Create debt error:", err);

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

  // Custom component untuk option dengan informasi lebih
  const formatOptionLabel = ({ label, phone }: UserOption) => (
    <div className="flex flex-col py-1">
      <span className="font-medium text-gray-800">{label}</span>
      {phone && <span className="text-xs text-gray-500 mt-1">📱 {phone}</span>}
    </div>
  );

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          className="bg-blue-600 hover:bg-blue-700 text-white shadow-sm hover:shadow"
          onClick={() => setOpen(true)}
        >
          <FiDollarSign className="mr-2.5 h-4.5 w-4.5" />
          Tambah Utang
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-[550px] max-w-[95vw] rounded-xl p-0 overflow-hidden border shadow-2xl">
        <div className="bg-linear-to-r from-blue-50 to-gray-50 px-6 pt-6 pb-4 border-b">
          <DialogHeader>
            <div className="flex items-center gap-3.5 mb-3">
              <div className="p-2.5 bg-blue-100 rounded-xl shadow-sm">
                <FiDollarSign className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <DialogTitle className="text-xl font-bold text-gray-900">
                  Tambah Utang Baru
                </DialogTitle>
                <p className="text-sm text-gray-600 mt-1.5">
                  Catat utang baru untuk user dengan detail lengkap
                </p>
              </div>
            </div>
          </DialogHeader>
        </div>

        <form
          autoComplete="off"
          className="px-7 py-6 space-y-5"
          onSubmit={(e) => {
            e.preventDefault();
            submitCreate();
          }}
        >
          {/* USER SELECT - IMPROVED */}
          <div className="space-y-2.5">
            <Label
              htmlFor="user-select"
              className="text-sm font-semibold text-gray-800 flex items-center gap-2"
            >
              Pilih User <span className="text-red-500">*</span>
            </Label>
            <div className="relative">
              <AsyncSelect<UserOption>
                cacheOptions
                key={selectKey}
                loadOptions={loadUserOptions}
                value={selectedUser}
                onChange={(v) => {
                  setSelectedUser(v);
                  if (formErrors.userId) {
                    setFormErrors((prev) => ({ ...prev, userId: undefined }));
                  }
                }}
                styles={customStyles}
                formatOptionLabel={formatOptionLabel}
                placeholder="Ketik nama user..."
                noOptionsMessage={({ inputValue }) =>
                  inputValue.length < 2
                    ? "Ketik minimal 2 karakter untuk mencari"
                    : "User tidak ditemukan"
                }
                loadingMessage={() => (
                  <div className="flex items-center gap-2 py-2">
                    <Loader2 className="h-4 w-4 animate-spin text-blue-600" />
                    <span className="text-gray-600">Mencari user...</span>
                  </div>
                )}
                className="react-select-container"
                classNamePrefix="react-select"
                isClearable
                components={{
                  DropdownIndicator: () => (
                    <div className="pr-3">
                      <Search className="h-4.5 w-4.5 text-gray-400" />
                    </div>
                  ),
                }}
              />
              {formErrors.userId && (
                <p className="text-sm text-red-600 mt-2 font-medium flex items-center gap-1.5">
                  {formErrors.userId}
                </p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* AMOUNT */}
            <div className="space-y-2.5">
              <Label
                htmlFor="amount"
                className="text-sm font-semibold text-gray-800 flex items-center gap-2"
              >
                Jumlah Utang <span className="text-red-500">*</span>
              </Label>
              <div className="relative">
                <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500 font-medium">
                  Rp
                </div>
                <Input
                  id="amount"
                  type="text"
                  inputMode="numeric"
                  value={rawAmount ? formatRupiahInput(rawAmount) : ""}
                  onChange={handleAmountChange}
                  className={cn(
                    "w-full h-11 pl-12 pr-4 rounded-lg border text-base font-medium",
                    "bg-white focus:outline-none focus:border-blue-500 focus:ring-3 focus:ring-blue-100",
                    formErrors.amount
                      ? "border-red-500 focus:border-red-500 focus:ring-red-100"
                      : "border-gray-300 hover:border-gray-400",
                    "transition-all duration-200 text-right",
                  )}
                  placeholder="0"
                  disabled={isSubmitting}
                />
              </div>
              {formErrors.amount && (
                <p className="text-sm text-red-600 font-medium flex items-center gap-1.5 mt-2">
                  {formErrors.amount}
                </p>
              )}
            </div>

            {/* DATE */}
            <div className="space-y-2.5">
              <Label className="text-sm font-semibold text-gray-800 flex items-center gap-2">
                Tanggal Utang <span className="text-red-500">*</span>
              </Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full h-11 justify-start text-left font-medium",
                      "rounded-lg border px-4",
                      "bg-white focus:outline-none focus:border-blue-500 focus:ring-3 focus:ring-blue-100",
                      formErrors.date
                        ? "border-red-500 focus:border-red-500 focus:ring-red-100"
                        : "border-gray-300 hover:border-gray-400",
                      "transition-all duration-200",
                    )}
                  >
                    <CalendarIcon className="mr-3 h-4.5 w-4.5 text-gray-500" />
                    {date ? (
                      <span className="font-medium">
                        {format(date, "dd MMM yyyy")}
                      </span>
                    ) : (
                      <span className="text-gray-400">Pilih tanggal</span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent
                  className="w-auto p-0 rounded-xl shadow-xl"
                  align="start"
                >
                  <Calendar
                    mode="single"
                    selected={date}
                    onSelect={(d) => {
                      setDate(d);
                      if (formErrors.date) {
                        setFormErrors((prev) => ({ ...prev, date: undefined }));
                      }
                    }}
                    initialFocus
                    disabled={(date) => date > new Date()}
                    className="rounded-lg border-0"
                  />
                </PopoverContent>
              </Popover>
              {formErrors.date && (
                <p className="text-sm text-red-600 font-medium flex items-center gap-1.5 mt-2">
                  {formErrors.date}
                </p>
              )}
            </div>
          </div>

          {/* NOTE */}
          <div className="space-y-2.5">
            <Label
              htmlFor="note"
              className="text-sm font-semibold text-gray-800 flex items-center gap-2"
            >
              Catatan (Opsional)
            </Label>
            <div className="relative">
              <FiFileText className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-4.5 w-4.5" />
              <Input
                id="note"
                type="text"
                value={note}
                onChange={(e) => setNote(e.target.value)}
                className={cn(
                  "w-full h-11 pl-12 pr-4 rounded-lg border text-base",
                  "bg-white focus:outline-none focus:border-blue-500 focus:ring-3 focus:ring-blue-100",
                  "border-gray-300 hover:border-gray-400 transition-all duration-200",
                )}
                placeholder="Contoh: makan, bensin, beras, dll..."
                disabled={isSubmitting}
              />
            </div>
            <p className="text-xs text-gray-500 italic">
              Tambahkan catatan untuk keterangan lebih detail
            </p>
          </div>

          {/* ACTION BUTTONS */}
          <div className="flex justify-end gap-3.5 pt-6 border-t">
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
              className={cn(
                "h-11 px-6 rounded-lg font-medium transition-all duration-200",
                "border-gray-300 hover:bg-gray-50 hover:border-gray-400 hover:shadow-sm",
                "focus:outline-none focus:ring-3 focus:ring-gray-100",
              )}
              disabled={isSubmitting}
            >
              Batal
            </Button>

            <Button
              type="submit"
              disabled={isSubmitting}
              className={cn(
                "h-11 px-8 rounded-lg font-semibold transition-all duration-200",
                "bg-linear-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white",
                "focus:outline-none focus:ring-3 focus:ring-blue-200",
                "disabled:opacity-70 disabled:cursor-not-allowed",
                "shadow-lg hover:shadow-xl",
              )}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2.5 h-4.5 w-4.5 animate-spin" />
                  Menyimpan...
                </>
              ) : (
                <>
                  <ArrowDownToLine className="mr-2.5 h-4.5 w-4.5" />
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

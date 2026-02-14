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
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import {
  Loader2,
  CalendarIcon,
  Search,
  CheckCircle,
  ArrowDownToLine,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { createPayment } from "@/lib/api/payment";
import { getOpenDebtCycles } from "@/lib/api/debt";
import AsyncSelect from "react-select/async";
import { format } from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { getErrorMessage } from "@/lib/utils/get-error-message";
import { getFieldErrors } from "@/lib/utils/get-field-errors";
import type { StylesConfig } from "react-select";

type Props = {
  onCreated?: () => void;
};

type DebtCycleOption = {
  value: string;
  label: string;
  cycleId: string;
  total: number;
  userId: string;
};

const customStyles = (hasError: boolean): StylesConfig<DebtCycleOption> => ({
  control: (base, state) => ({
    ...base,
    minHeight: "44px",
    borderColor: hasError ? "#ef4444" : state.isFocused ? "#3b82f6" : "#d1d5db",
    borderRadius: "0.5rem",
    boxShadow: state.isFocused
      ? hasError
        ? "0 0 0 3px rgba(239, 68, 68, 0.1)"
        : "0 0 0 3px rgba(59, 130, 246, 0.1)"
      : "none",
    "&:hover": {
      borderColor: hasError ? "#ef4444" : "#3b82f6",
    },
    transition: "all 0.2s",
    backgroundColor: "#fafafa",
  }),
  menu: (base) => ({
    ...base,
    borderRadius: "0.75rem",
    boxShadow:
      "0 10px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)",
    marginTop: "8px",
    border: "1px solid #e5e7eb",
    zIndex: 9999,
  }),
  menuList: (base) => ({
    ...base,
    padding: "8px",
    maxHeight: "220px",
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
  placeholder: (base) => ({
    ...base,
    color: "#94a3b8",
    fontSize: "0.95rem",
    fontWeight: 400,
  }),
  singleValue: (base) => ({
    ...base,
    color: "#1f2937",
    fontSize: "0.95rem",
    fontWeight: 500,
  }),
  input: (base) => ({
    ...base,
    color: "#1f2937",
    fontSize: "0.95rem",
    margin: 0,
    padding: 0,
  }),
  dropdownIndicator: (base) => ({
    ...base,
    color: "#94a3b8",
    padding: "0 12px",
    "&:hover": {
      color: "#64748b",
    },
  }),
  clearIndicator: (base) => ({
    ...base,
    color: "#94a3b8",
    "&:hover": {
      color: "#64748b",
    },
  }),
  indicatorSeparator: (base) => ({
    ...base,
    backgroundColor: "#e2e8f0",
  }),
  loadingIndicator: (base) => ({
    ...base,
    color: "#3b82f6",
  }),
});

export default function PaymentCreateDialog({ onCreated }: Props) {
  const [open, setOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectKey, setSelectKey] = useState(0);
  const [selectedDebt, setSelectedDebt] = useState<DebtCycleOption | null>(
    null,
  );
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [rawAmount, setRawAmount] = useState("");
  const [remainingBalance, setRemainingBalance] = useState<number | null>(null);

  const [formErrors, setFormErrors] = useState<{
    userId?: string;
    amount?: string;
    date?: string;
  }>({});

  const resetForm = useCallback(() => {
    setSelectedDebt(null);
    setRawAmount("");
    setDate(undefined);
    setRemainingBalance(null);
    setFormErrors({});
    setSelectKey((k) => k + 1);
  }, []);

  useEffect(() => {
    if (!open) {
      resetForm();
    }
  }, [open, resetForm]);

  const loadDebtOptions = async (
    inputValue: string,
  ): Promise<DebtCycleOption[]> => {
    if (!inputValue || inputValue.length < 2) {
      return [];
    }

    try {
      const res = await getOpenDebtCycles(inputValue, 10);

      return res.map((c) => ({
        value: c.userId,
        label: c.userName,
        cycleId: c.cycleId,
        total: c.total,
        userId: c.userId,
      }));
    } catch (error) {
      console.error("Error loading debt options:", error);
      toast.error("Gagal memuat data hutang");
      return [];
    }
  };

  const validate = () => {
    const errors: Record<string, string> = {};

    if (!selectedDebt) {
      errors.userId = "Pilih user dengan hutang aktif";
    }

    if (!rawAmount) {
      errors.amount = "Jumlah pembayaran wajib diisi";
    } else {
      const normalizedAmount = rawAmount.replace(/\./g, "").replace(/,/g, ".");
      const amount = Number(normalizedAmount);

      if (amount <= 0) {
        errors.amount = "Jumlah harus lebih dari 0";
      } else if (selectedDebt && amount > selectedDebt.total) {
        errors.amount = `Jumlah melebihi total hutang (Rp ${formatRupiahNumber(selectedDebt.total)})`;
      }
    }

    if (!date) {
      errors.date = "Tanggal pembayaran wajib diisi";
    } else if (date > new Date()) {
      errors.date = "Tanggal tidak boleh di masa depan";
    }

    return errors;
  };

  const formatRupiahInput = (value: string) => {
    const clean = value.replace(/[^\d]/g, "");
    return new Intl.NumberFormat("id-ID").format(Number(clean || 0));
  };

  const formatRupiahNumber = (value: number) => {
    return new Intl.NumberFormat("id-ID").format(value);
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
    }).format(value);
  };

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const clean = e.target.value.replace(/[^\d]/g, "");
    setRawAmount(clean);

    if (selectedDebt && clean) {
      const amount = Number(clean);
      const remaining = selectedDebt.total - amount;
      setRemainingBalance(remaining > 0 ? remaining : 0);
    } else {
      setRemainingBalance(null);
    }

    if (formErrors.amount) {
      setFormErrors((prev) => ({ ...prev, amount: undefined }));
    }
  };

  const handleDebtSelect = (option: DebtCycleOption | null) => {
    setSelectedDebt(option);
    if (option) {
      setRawAmount(option.total.toString());
      setRemainingBalance(0); // Reset dulu, akan dihitung saat input amount
    } else {
      setRawAmount("");
      setRemainingBalance(null);
    }

    if (formErrors.userId) {
      setFormErrors((prev) => ({ ...prev, userId: undefined }));
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

      const payload = {
        userId: selectedDebt!.userId,
        amount: amount,
        paidAt: date!.toISOString(),
      };

      await createPayment(payload);

      const userName = selectedDebt?.label || "User";
      toast.success(`Pembayaran ${userName} berhasil dilakukan`);

      onCreated?.();
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

  // Custom component untuk option dengan informasi hutang
  const formatOptionLabel = ({ label, total }: DebtCycleOption) => (
    <div className="flex flex-col py-1">
      <div className="flex justify-between items-center">
        <span className="font-medium text-gray-800">{label}</span>
        <span className="text-sm font-semibold text-red-600">
          {formatCurrency(total)}
        </span>
      </div>
      <span className="text-xs text-gray-500 mt-1">🔴 Hutang aktif</span>
    </div>
  );

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          className="bg-blue-600 hover:bg-blue-700 text-white shadow-sm hover:shadow"
          onClick={() => setOpen(true)}
        >
          <CheckCircle className="mr-2.5 h-4.5 w-4.5" />
          Bayar Hutang
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-[550px] max-w-[95vw] rounded-xl p-0 overflow-hidden border shadow-2xl">
        <div className="bg-linear-to-r from-blue-50 to-gray-50 px-6 pt-6 pb-4 border-b">
          <DialogHeader>
            <div className="flex items-center gap-3.5 mb-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <CheckCircle className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <DialogTitle className="text-xl font-bold text-gray-900">
                  Catat Pembayaran
                </DialogTitle>
                <p className="text-sm text-gray-600 mt-1.5">
                  Catat pembayaran hutang user dengan detail lengkap
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
          {/* USER DEBT SELECT */}
          <div className="space-y-2.5">
            <Label
              htmlFor="debt-select"
              className="text-sm font-semibold text-gray-800 flex items-center gap-2"
            >
              Pilih User dengan Hutang <span className="text-red-500">*</span>
            </Label>
            <div className="relative">
              <AsyncSelect<DebtCycleOption>
                cacheOptions
                key={selectKey}
                loadOptions={loadDebtOptions}
                value={selectedDebt}
                onChange={handleDebtSelect}
                styles={customStyles(!!formErrors.userId)}
                formatOptionLabel={formatOptionLabel}
                placeholder="Cari nama user dengan hutang aktif..."
                noOptionsMessage={({ inputValue }) =>
                  inputValue.length < 2
                    ? "Ketik minimal 2 karakter untuk mencari"
                    : "Tidak ada hutang aktif"
                }
                loadingMessage={() => (
                  <div className="flex items-center gap-2 py-2">
                    <Loader2 className="h-4 w-4 animate-spin text-emerald-600" />
                    <span className="text-gray-600">Mencari hutang...</span>
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
            {/* TOTAL HUTANG */}
            <div className="space-y-2.5">
              <Label className="text-sm font-semibold text-gray-800">
                Total Hutang Aktif
              </Label>
              <div className="relative">
                <Input
                  value={
                    selectedDebt ? formatCurrency(selectedDebt.total) : "Rp 0"
                  }
                  disabled
                  className="w-full h-11 px-4 rounded-lg border text-base font-semibold text-red-600 bg-red-50 border-red-100"
                />
              </div>
            </div>

            {/* AMOUNT TO PAY */}
            <div className="space-y-2.5">
              <Label
                htmlFor="amount"
                className="text-sm font-semibold text-gray-800 flex items-center gap-2"
              >
                Jumlah Bayar <span className="text-red-500">*</span>
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
                    "bg-white focus:outline-none focus:border-emerald-500 focus:ring-3 focus:ring-emerald-100",
                    formErrors.amount
                      ? "border-red-500 focus:border-red-500 focus:ring-red-100"
                      : "border-gray-300 hover:border-gray-400",
                    "transition-all duration-200 text-right",
                  )}
                  placeholder="0"
                  disabled={isSubmitting || !selectedDebt}
                />
              </div>
              {formErrors.amount && (
                <p className="text-sm text-red-600 font-medium flex items-center gap-1.5 mt-2">
                  {formErrors.amount}
                </p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* DATE */}
            <div className="space-y-2.5">
              <Label className="text-sm font-semibold text-gray-800 flex items-center gap-2">
                Tanggal Bayar <span className="text-red-500">*</span>
              </Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full h-11 justify-start text-left font-medium",
                      "rounded-lg border px-4",
                      "bg-white focus:outline-none focus:border-emerald-500 focus:ring-3 focus:ring-emerald-100",
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

            {/* SISA HUTANG */}
            <div className="space-y-2.5">
              <Label className="text-sm font-semibold text-gray-800">
                Sisa Hutang
              </Label>
              <div className="relative">
                <Input
                  value={
                    remainingBalance !== null
                      ? formatCurrency(remainingBalance)
                      : selectedDebt
                        ? formatCurrency(selectedDebt.total)
                        : "Rp 0"
                  }
                  disabled
                  className={cn(
                    "w-full h-11 px-4 rounded-lg border text-base font-semibold",
                    remainingBalance === 0
                      ? "text-emerald-600 bg-emerald-50 border-emerald-100"
                      : remainingBalance && remainingBalance > 0
                        ? "text-amber-600 bg-amber-50 border-amber-100"
                        : "text-gray-600 bg-gray-50 border-gray-100",
                  )}
                />
                {remainingBalance === 0 && (
                  <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                    <CheckCircle className="h-5 w-5 text-emerald-500" />
                  </div>
                )}
              </div>
              <p className="text-xs text-gray-500 italic">
                {remainingBalance === 0
                  ? "Hutang akan lunas"
                  : remainingBalance && remainingBalance > 0
                    ? "Masih ada sisa hutang"
                    : selectedDebt
                      ? "Masukkan jumlah pembayaran"
                      : "Pilih user terlebih dahulu"}
              </p>
            </div>
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
              disabled={isSubmitting || !selectedDebt}
              className={cn(
                "h-10 px-4 rounded-lg font-medium transition-all duration-200",
                "bg-blue-600 hover:bg-blue-700 text-white",
                "focus:outline-none focus:ring-4 focus:ring-blue-100",
                "disabled:opacity-50 disabled:cursor-not-allowed",
              )}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2.5 h-4.5 w-4.5 animate-spin" />
                  Memproses...
                </>
              ) : (
                <>
                  <ArrowDownToLine className="mr-2.5 h-4.5 w-4.5" />
                  Simpan Pembayaran
                </>
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

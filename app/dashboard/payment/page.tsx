"use client";

import { useEffect, useState } from "react";
import { Card, CardHeader } from "@/components/ui/card";
import { SearchInput } from "@/components/shared/search-input";
import { Pagination } from "@/components/shared/pagination";
import PaymentTabel from "@/components/payment/payment-tabel";
import { getPayments } from "@/lib/api/payment";
import PaymentCreateDialog from "@/components/payment/payment-create-dialog";
import { PaymentListItem } from "@/lib/types/payment";
import { TableSkeleton } from "@/components/shared/table-skeleton";

export default function PaymentsPage() {
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [payments, setPayments] = useState<PaymentListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearching, setIsSearching] = useState(false);

  // FETCH
  const fetchPayments = async (opts?: { search?: string; page?: number }) => {
    try {
      setLoading(true);
      const res = await getPayments({
        search: opts?.search ?? searchQuery,
        page: opts?.page ?? currentPage,
        limit: 7,
      });

      setPayments(res.items);
      setCurrentPage(res.pagination?.currentPage ?? 1);
      setTotalPages(res.pagination?.totalPages ?? 1);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPayments();
  }, []);

  useEffect(() => {
    const isActiveSearch = searchQuery.trim().length > 0;
    setIsSearching(isActiveSearch);

    setLoading(true);

    const t = setTimeout(() => {
      setCurrentPage(1);
      fetchPayments({ search: searchQuery, page: 1 });
    }, 300);

    return () => clearTimeout(t);
  }, [searchQuery]);

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      <Card className="border border-muted shadow-md rounded-2xl">
        <CardHeader>
          <div className="space-y-1">
            <h2 className="text-2xl font-bold tracking-tight">
              Riwayat Pembayaran
            </h2>
            <p className="text-muted-foreground text-sm">
              Semua transaksi pembayaran user.
            </p>

            <div className="mt-4 flex flex-col-reverse sm:flex-row sm:items-center sm:justify-between gap-4">
              <SearchInput
                placeholder="Cari nama user..."
                onSearch={setSearchQuery}
                className="w-full sm:w-64"
              />

              <PaymentCreateDialog onCreated={() => fetchPayments()} />
            </div>

            {searchQuery && payments.length === 0 && (
              <p className="mt-2 text-sm text-gray-500">
                Menampilkan 0 hasil untuk "{searchQuery}"
              </p>
            )}
          </div>
        </CardHeader>

        {loading ? (
          <div className="overflow-x-auto p-6">
            <TableSkeleton />
          </div>
        ) : (
          <>
            <div className="overflow-x-auto p-2">
              <PaymentTabel
                data={payments}
                emptyState={isSearching ? "search" : "initial"}
                onRefresh={() => fetchPayments()}
              />
            </div>

            <div className="p-4">
              {payments.length > 0 && (
                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={(page) => {
                    setCurrentPage(page);
                    fetchPayments({ search: searchQuery, page });
                  }}
                />
              )}
            </div>
          </>
        )}
      </Card>
    </div>
  );
}

"use client";

import { useEffect, useState } from "react";
import type { Debt } from "@/lib/types/debt";
import { getDebts } from "@/lib/api/debt";
import { Card, CardHeader } from "@/components/ui/card";
import { SearchInput } from "@/components/search-input";
import { Pagination } from "@/components/pagination";
import DebtTable from "@/components/debt/debt-tabel";
import DebtCreateDialog from "@/components/debt/debt-create-dialog";
import DebtDeleteDialog from "@/components/debt/debt-delete-dialog";

export default function DebtsPage() {
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [debts, setDebts] = useState<Debt[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [deletingDebt, setDeletingDebt] = useState<Debt | null>(null);

  // FETCH
  const fetchDebts = async (opts?: { search?: string; page?: number }) => {
    try {
      setLoading(true);
      const res = await getDebts({
        search: opts?.search ?? searchQuery,
        page: opts?.page ?? currentPage,
        limit: 7,
      });

      setDebts(res?.data?.items ?? []);
      setCurrentPage(res.pagination?.currentPage ?? 1);
      setTotalPages(res.pagination?.totalPages ?? 1);
    } finally {
      setLoading(false);
    }
  };

  // Initial load
  useEffect(() => {
    fetchDebts();
  }, []);

  // Search
  useEffect(() => {
    const active = searchQuery.trim().length > 0;
    setIsSearching(active);

    setLoading(true);

    const t = setTimeout(() => {
      setCurrentPage(1);
      fetchDebts({ search: searchQuery, page: 1 });
    }, 300);

    return () => clearTimeout(t);
  }, [searchQuery]);

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      <Card className="border border-muted shadow-md rounded-2xl">
        <CardHeader>
          <div className="space-y-1">
            <h2 className="text-2xl font-bold tracking-tight">
              Manajemen Utang
            </h2>
            <p className="text-muted-foreground text-sm">
              Kelola data utang user di sini.
            </p>

            <div className="mt-4 flex flex-col-reverse sm:flex-row sm:items-center sm:justify-between gap-4">
              <SearchInput
                placeholder="Cari nama user..."
                onSearch={setSearchQuery}
                className="w-full sm:w-64"
              />

              {/* Ganti userId ini sesuai konteks */}
              <DebtCreateDialog onCreated={() => fetchDebts()} />
            </div>

            {searchQuery && debts.length === 0 && !loading && (
              <p className="mt-2 text-sm text-gray-500">
                Menampilkan 0 hasil untuk "{searchQuery}"
              </p>
            )}
          </div>
        </CardHeader>

        {loading ? (
          <div className="p-8 text-center">Memuat data...</div>
        ) : (
          <>
            <div className="overflow-x-auto p-2">
              <DebtTable
                data={debts}
                emptyState={isSearching ? "search" : "initial"}
                onDelete={(debt) => setDeletingDebt(debt)}
              />
            </div>

            <div className="p-4">
              {debts.length > 0 && (
                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={(page) => {
                    setCurrentPage(page);
                    fetchDebts({ search: searchQuery, page });
                  }}
                />
              )}
            </div>
          </>
        )}
      </Card>

      {deletingDebt && (
        <DebtDeleteDialog
          debt={deletingDebt}
          onClose={() => setDeletingDebt(null)}
          onDeleted={() => {
            fetchDebts();
            setDeletingDebt(null);
          }}
        />
      )}
    </div>
  );
}

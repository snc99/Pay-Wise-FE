"use client";

import { useEffect, useState } from "react";
import type { User } from "@/lib/types/user";
import UserTable from "@/components/users/user-tabel";
import { getUsers } from "@/lib/api/user";
import UserCreateDialog from "@/components/users/user-create-dialog";
import { Card, CardHeader } from "@/components/ui/card";
import { SearchInput } from "@/components/shared/search-input";
import { Pagination } from "@/components/shared/pagination";
import { TableSkeleton } from "@/components/shared/table-skeleton";

export default function UsersPage() {
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearching, setIsSearching] = useState(false);

  // FETCH
  const fetchUsers = async (opts?: { search?: string; page?: number }) => {
    try {
      setLoading(true);
      const res = await getUsers({
        search: opts?.search ?? searchQuery,
        page: opts?.page ?? currentPage,
        limit: 7,
      });

      setUsers(res?.data?.items ?? []);
      setCurrentPage(res.pagination?.currentPage ?? 1);
      setTotalPages(res.pagination?.totalPages ?? 1);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  useEffect(() => {
    const isActiveSearch = searchQuery.trim().length > 0;
    setIsSearching(isActiveSearch);

    setLoading(true);

    const t = setTimeout(() => {
      setCurrentPage(1);
      fetchUsers({ search: searchQuery, page: 1 });
    }, 300);

    return () => clearTimeout(t);
  }, [searchQuery]);

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      <Card className="border border-muted shadow-md rounded-2xl">
        <CardHeader>
          <div className="space-y-1">
            <h2 className="text-2xl font-bold tracking-tight">
              Manajemen User
            </h2>
            <p className="text-muted-foreground text-sm">
              Kelola user di sini.
            </p>

            <div className="mt-4 flex flex-col-reverse sm:flex-row sm:items-center sm:justify-between gap-4">
              <SearchInput
                placeholder="Cari user..."
                onSearch={setSearchQuery}
                className="w-full sm:w-64"
              />

              <UserCreateDialog onCreated={() => fetchUsers()} />
            </div>
            {searchQuery && users.length === 0 && (
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
              <UserTable
                data={users}
                emptyState={isSearching ? "search" : "initial"}
                onRefresh={fetchUsers}
              />
            </div>

            <div className="p-4">
              {users.length > 0 && (
                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={(page) => {
                    setCurrentPage(page);
                    fetchUsers({ search: searchQuery, page });
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

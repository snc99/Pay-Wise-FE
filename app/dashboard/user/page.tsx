// app/users/page.tsx
"use client";

import { useEffect, useState } from "react";
import type { User } from "@/lib/types/user";
import { toast } from "sonner";
import UserTable from "@/components/users/tabel";
import { getUsers, deleteUser as deleteUserApi } from "@/lib/api/user";
import UserForm from "@/components/users/form-user";
import { Card, CardHeader } from "@/components/ui/card";
import { SearchInput } from "@/components/search-input";
import { Pagination } from "@/components/pagination";

export default function UsersPage() {
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [deleteUser, setDeleteUser] = useState<User | null>(null);
  const [deleting, setDeleting] = useState(false);

  // MAIN FETCH
  const fetchUsers = async (opts?: { search?: string; page?: number }) => {
    try {
      setLoading(true);

      const res = await getUsers({
        search: opts?.search ?? searchQuery,
        page: opts?.page ?? currentPage,
        limit: 7,
      });

      console.log("API RAW:", res);

      const items = res?.data?.items ?? [];
      setUsers(items);

      setCurrentPage(res.pagination?.currentPage ?? 1);
      setTotalPages(res.pagination?.totalPages ?? 1);
    } finally {
      setLoading(false);
    }
  };

  // INITIAL LOAD
  useEffect(() => {
    fetchUsers();
  }, []);

  // SEARCH DEBOUNCE
  useEffect(() => {
    const t = setTimeout(() => {
      setCurrentPage(1);
      fetchUsers({ search: searchQuery, page: 1 });
    }, 300);
    return () => clearTimeout(t);
  }, [searchQuery]);

  // SEARCH HANDLER (SearchInput)
  function handleSearch(term: string) {
    setSearchQuery(term);
  }

  // EDIT
  const handleEdit = (user: User) => {
    toast.info(`Edit user: ${user.name}`);
  };

  // DELETE (open dialog)
  const handleDeleteClick = (user: User) => {
    setDeleteUser(user);
  };

  // DELETE CONFIRMED
  const handleDeleteConfirmed = async () => {
    if (!deleteUser) return;
    setDeleting(true);

    try {
      const res = await deleteUserApi(deleteUser.id);
      const ok = res?.success ?? true;

      if (ok) {
        toast.success(`User ${deleteUser.name} berhasil dihapus`);
        await fetchUsers({ search: searchQuery, page: currentPage });
        setDeleteUser(null);
      } else {
        toast.error(res?.message ?? "Gagal menghapus user");
      }
    } catch (error) {
      toast.error("Gagal menghapus user");
    } finally {
      setDeleting(false);
    }
  };

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

            {/* SEARCH + ADD */}
            <div className="mt-4 flex flex-col-reverse sm:flex-row sm:items-center sm:justify-between gap-4">
              <SearchInput
                placeholder="Cari user..."
                onSearch={handleSearch}
                className="w-full sm:w-64"
              />
              <UserForm />
            </div>
          </div>
        </CardHeader>

        {/* TABLE */}
        {loading ? (
          <div className="rounded-xl bg-white p-8">
            <div className="flex items-center justify-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
              <span className="ml-3 text-muted-foreground">Memuat data...</span>
            </div>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto p-2">
              <UserTable
                data={users}
                onEdit={handleEdit}
                onDelete={handleDeleteClick}
              />
            </div>
            <div className="overflow-x-auto p-4">
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={(page) => {
                  setCurrentPage(page);
                  fetchUsers({ search: searchQuery, page });
                }}
              />
            </div>
          </>
        )}
      </Card>
    </div>
  );
}

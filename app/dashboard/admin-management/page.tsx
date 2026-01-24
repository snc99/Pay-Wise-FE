"use client";

import { useEffect, useState } from "react";
import type { Admin } from "@/lib/types/admin";
import { getAdmins } from "@/lib/api/admin";
import { Card, CardHeader } from "@/components/ui/card";
import { SearchInput } from "@/components/search-input";
import { Pagination } from "@/components/pagination";
import AdminTable from "@/components/admin/admin-tabel";
import AdminCreateDialog from "@/components/admin/admin-create-dialog";
import AdminUpdateDialog from "@/components/admin/admin-update-dialog";
import AdminDeleteDialog from "@/components/admin/admin-delete-dialog";
import { useAuth } from "@/lib/auth/auth-context";
import { useRouter } from "next/navigation";

export default function AdminManagementPage() {
  const { user, isLoading } = useAuth();
  const router = useRouter();

  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [admins, setAdmins] = useState<Admin[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [editingAdmin, setEditingAdmin] = useState<Admin | null>(null);
  const [deletingAdmin, setDeletingAdmin] = useState<Admin | null>(null);

  // 🔐 ROLE GUARD
  useEffect(() => {
    if (isLoading) return;

    if (!user) {
      router.replace("/auth/login");
      return;
    }

    if (user.role !== "SUPERADMIN") {
      router.replace("/dashboard");
    }
  }, [user, isLoading, router]);

  // FETCH (HANYA JIKA ROLE BENAR)
  const fetchAdmins = async (opts?: { search?: string; page?: number }) => {
    if (user?.role !== "SUPERADMIN") return;

    try {
      setLoading(true);

      const res = await getAdmins({
        search: opts?.search ?? searchQuery,
        page: opts?.page ?? currentPage,
        limit: 7,
      });

      setAdmins(res?.data?.items ?? []);
      setCurrentPage(res.pagination?.currentPage ?? 1);
      setTotalPages(res.pagination?.totalPages ?? 1);
    } finally {
      setLoading(false);
    }
  };

  // INITIAL FETCH (SETELAH AUTH SIAP)
  useEffect(() => {
    if (!isLoading && user?.role === "SUPERADMIN") {
      fetchAdmins();
    }
  }, [user, isLoading]);

  // SEARCH DEBOUNCE
  useEffect(() => {
    if (user?.role !== "SUPERADMIN") return;

    const isActiveSearch = searchQuery.trim().length > 0;
    setIsSearching(isActiveSearch);

    setLoading(true);

    const t = setTimeout(() => {
      setCurrentPage(1);
      fetchAdmins({ search: searchQuery, page: 1 });
    }, 300);

    return () => clearTimeout(t);
  }, [searchQuery]);

  // 🚫 BLOCK RENDER
  if (isLoading || !user || user.role !== "SUPERADMIN") {
    return null; // atau loading skeleton
  }

  const handleEdit = (admin: Admin) => setEditingAdmin(admin);
  const handleDelete = (admin: Admin) => setDeletingAdmin(admin);

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      <Card className="border border-muted shadow-md rounded-2xl">
        <CardHeader>
          <div className="space-y-1">
            <h2 className="text-2xl font-bold tracking-tight">
              Manajemen Akun
            </h2>
            <p className="text-muted-foreground text-sm">
              Kelola akun admin di sini.
            </p>

            <div className="mt-4 flex flex-col-reverse sm:flex-row sm:items-center sm:justify-between gap-4">
              <SearchInput
                placeholder="Cari akun..."
                onSearch={setSearchQuery}
                className="w-full sm:w-64"
              />

              <AdminCreateDialog onCreated={() => fetchAdmins()} />
            </div>
            {searchQuery && admins.length === 0 && (
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
              <AdminTable
                data={admins}
                emptyState={isSearching ? "search" : "initial"}
                onEdit={handleEdit}
                onDelete={handleDelete}
              />
            </div>

            {totalPages > 1 && (
              <div className="p-4">
                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={(page) => {
                    setCurrentPage(page);
                    fetchAdmins({ page });
                  }}
                />
              </div>
            )}
          </>
        )}
      </Card>

      {editingAdmin && (
        <AdminUpdateDialog
          admin={editingAdmin}
          onClose={() => setEditingAdmin(null)}
          onUpdated={() => {
            fetchAdmins();
            setEditingAdmin(null);
          }}
        />
      )}

      {deletingAdmin && (
        <AdminDeleteDialog
          admin={deletingAdmin}
          onClose={() => setDeletingAdmin(null)}
          onDeleted={() => {
            fetchAdmins();
            setDeletingAdmin(null);
          }}
        />
      )}
    </div>
  );
}

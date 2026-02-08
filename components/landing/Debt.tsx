"use client";

import { useEffect, useState, useCallback } from "react";
import { motion } from "framer-motion";

import { getPublicDebts } from "@/lib/api/debt";
import PublicTable from "./PublicTable";
import { SearchInput } from "../shared/search-input";
import { Pagination } from "../shared/pagination";
import { PublicDebt } from "@/lib/types/debt-cycle";

export default function DebtPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearching, setIsSearching] = useState(false);

  const [data, setData] = useState<PublicDebt[]>([]);
  const [loading, setLoading] = useState(true);

  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  /**
   * FETCH
   * selalu pakai parameter,
   * jangan tergantung state luar
   */
  const fetchDebts = useCallback(
    async ({ search = "", page = 1 }: { search?: string; page?: number }) => {
      try {
        setLoading(true);

        const items = await getPublicDebts(search);
        setData(items);

        // nanti kalau backend kirim meta
        setTotalPages(1);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    },
    [],
  );

  /**
   * INITIAL LOAD
   */
  useEffect(() => {
    fetchDebts({ search: "", page: 1 });
  }, [fetchDebts]);

  /**
   * SEARCH
   * pattern sama kayak admin
   */
  useEffect(() => {
    const active = searchQuery.trim().length > 0;
    setIsSearching(active);

    setLoading(true); // cegah flicker

    const t = setTimeout(() => {
      setCurrentPage(1);
      fetchDebts({ search: searchQuery, page: 1 });
    }, 300);

    return () => clearTimeout(t);
  }, [searchQuery, fetchDebts]);

  return (
    <main className="bg-linear-to-br from-white via-gray-50 to-blue-50 overflow-hidden px-4 py-10">
      <motion.section
        id="debt"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="min-h-screen px-4 md:px-8 lg:px-16 flex flex-col items-center justify-center scroll-mt-32 relative"
      >
        <h1 className="text-4xl font-bold lg:text-5xl bg-linear-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          Cek Tagihan
        </h1>
        <motion.span
          className="mt-4 h-1 w-20 bg-linear-to-r from-blue-500 to-purple-500 rounded-full"
          initial={{ width: 0 }}
          whileInView={{ width: 80 }}
          transition={{ duration: 0.8 }}
        ></motion.span>

        {/* search */}
        <div className="mt-8 mb-6 flex justify-center sm:justify-end w-full max-w-5xl">
          <SearchInput
            placeholder="Cari nama user..."
            onSearch={setSearchQuery}
            className="w-full sm:w-64"
          />
        </div>

        {/* table */}
        <div className="w-full max-w-5xl">
          <PublicTable
            items={data}
            loading={loading}
            emptyState={isSearching ? "search" : "initial"}
          />
        </div>

        {/* pagination */}
        {data.length > 0 && (
          <div className="mt-6 w-full max-w-5xl">
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={(page) => {
                setCurrentPage(page);
                fetchDebts({ search: searchQuery, page });
              }}
            />
          </div>
        )}
      </motion.section>
    </main>
  );
}

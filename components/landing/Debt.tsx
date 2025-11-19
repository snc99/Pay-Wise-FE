"use client";

import { useState, useMemo } from "react";
import { ArrowUp, ArrowDown } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import Image from "next/image";
import { motion, useScroll, useTransform } from "framer-motion";

type DebtRecord = {
  id: number;
  name: string;
  total: number;
  bayar: number;
  tagihan: number;
};

export default function DebtTable() {
  // Sample data
  const allData = useMemo<DebtRecord[]>(
    () => [
      { id: 1, name: "Andre", total: 10000, bayar: 3000, tagihan: 7000 },
      { id: 2, name: "Ilda", total: 12000, bayar: 10000, tagihan: 2000 },
      { id: 3, name: "Rehan", total: 20000, bayar: 15000, tagihan: 5000 },
      { id: 4, name: "Sufi", total: 13000, bayar: 10000, tagihan: 3000 },
      { id: 5, name: "Denis", total: 10000, bayar: 9000, tagihan: 1000 },
    ],
    []
  );

  const [search, setSearch] = useState("");
  const [perPage, setPerPage] = useState(5);
  const [page, setPage] = useState(1);

  const [sortConfig, setSortConfig] = useState<{
    key: keyof DebtRecord;
    direction: "asc" | "desc";
  } | null>(null);

  // Scroll animation setup
  const { scrollYProgress } = useScroll();
  const fadeOut = useTransform(scrollYProgress, [0.45, 0.65], [1, 0]);
  const parallax = useTransform(scrollYProgress, [0, 1], [0, -150]);
  const floatAnim = { y: [0, -10, 0] };

  const filteredData = useMemo(() => {
    return allData.filter((item) =>
      item.name.toLowerCase().includes(search.toLowerCase())
    );
  }, [allData, search]);

  const sortedData = useMemo(() => {
    const sortable = [...filteredData];
    if (sortConfig) {
      sortable.sort((a, b) => {
        const aKey = a[sortConfig.key];
        const bKey = b[sortConfig.key];

        if (typeof aKey === "string") {
          return sortConfig.direction === "asc"
            ? aKey.localeCompare(bKey as string)
            : (bKey as string).localeCompare(aKey);
        }
        if (typeof aKey === "number") {
          return sortConfig.direction === "asc"
            ? aKey - (bKey as number)
            : (bKey as number) - aKey;
        }
        return 0;
      });
    }
    return sortable;
  }, [filteredData, sortConfig]);

  const totalPages = Math.ceil(sortedData.length / perPage);
  const paginated = sortedData.slice((page - 1) * perPage, page * perPage);

  const requestSort = (key: keyof DebtRecord) => {
    let direction: "asc" | "desc" = "asc";
    if (sortConfig?.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }
    setSortConfig({ key, direction });
  };

  return (
    <main className="relative w-full min-h-screen bg-linear-to-br from-[#67C3F3] to-[#5A98F2] overflow-hidden">
      {/* Overlay agar warna biru tidak menenggelamkan text */}
      <div className="absolute inset-0 bg-white/10 pointer-events-none z-0"></div>

      <motion.section
        id="debt"
        className="min-h-screen w-full px-4 sm:px-6 lg:px-8 pt-28 scroll-mt-32 relative z-10"
      >
        {/* Floating Background Icon */}
        <motion.div
          animate={floatAnim}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute top-14 right-4 opacity-30 z-0 pointer-events-none"
        >
          <Image src="/bullet.svg" width={160} height={160} alt="bg" />
        </motion.div>

        <motion.h2
          className="mb-30 -mt-4 text-3xl font-bold text-white text-center relative z-20"
          initial={{ opacity: 0, y: -30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          Tabel Pencatatan
        </motion.h2>

        {/* PARALLAX WRAPPER */}
        <motion.div style={{ y: parallax }} className="relative z-10">
          {/* Header bar */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="flex flex-col md:flex-row md:justify-between items-center gap-4 mb-4"
          >
            <div className="flex items-center gap-2 text-white">
              <span className="text-sm">Show</span>
              <Select
                value={perPage.toString()}
                onValueChange={(val: any) => {
                  setPerPage(Number(val));
                  setPage(1);
                }}
              >
                <SelectTrigger className="w-[70px] bg-white text-black">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {[5, 10, 20].map((n) => (
                    <SelectItem key={n} value={n.toString()}>
                      {n}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <span className="text-sm">entries</span>
            </div>

            <Input
              placeholder="Search by name..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
              className="max-w-sm bg-white"
            />
          </motion.div>

          {/* TABLE */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <Table className="w-full bg-white shadow-xl rounded-xl">
              {/* ✅ Bagian Header BENAR */}
              <TableHeader>
                <TableRow>
                  {/* NO */}
                  <TableHead
                    className="text-center cursor-pointer select-none"
                    onClick={() => requestSort("id")}
                  >
                    <div className="flex items-center justify-center gap-1">
                      No
                      {sortConfig?.key === "id" ? (
                        sortConfig.direction === "asc" ? (
                          <ArrowUp size={18} className="text-gray-700" />
                        ) : (
                          <ArrowDown size={18} className="text-gray-700" />
                        )
                      ) : (
                        <ArrowUp
                          size={18}
                          className="opacity-30 text-gray-500"
                        />
                      )}
                    </div>
                  </TableHead>

                  {/* NAMA */}
                  <TableHead
                    className="text-center cursor-pointer select-none"
                    onClick={() => requestSort("name")}
                  >
                    <div className="flex items-center justify-center gap-1">
                      Nama
                      {sortConfig?.key === "name" ? (
                        sortConfig.direction === "asc" ? (
                          <ArrowUp size={18} className="text-gray-700" />
                        ) : (
                          <ArrowDown size={18} className="text-gray-700" />
                        )
                      ) : (
                        <ArrowUp
                          size={18}
                          className="opacity-30 text-gray-500"
                        />
                      )}
                    </div>
                  </TableHead>

                  {/* TOTAL */}
                  <TableHead
                    className="text-center cursor-pointer select-none"
                    onClick={() => requestSort("total")}
                  >
                    <div className="flex items-center justify-center gap-1">
                      Total
                      {sortConfig?.key === "total" ? (
                        sortConfig.direction === "asc" ? (
                          <ArrowUp size={18} className="text-gray-700" />
                        ) : (
                          <ArrowDown size={18} className="text-gray-700" />
                        )
                      ) : (
                        <ArrowUp
                          size={18}
                          className="opacity-30 text-gray-500"
                        />
                      )}
                    </div>
                  </TableHead>

                  {/* BAYAR */}
                  <TableHead
                    className="text-center cursor-pointer select-none"
                    onClick={() => requestSort("bayar")}
                  >
                    <div className="flex items-center justify-center gap-1">
                      Bayar
                      {sortConfig?.key === "bayar" ? (
                        sortConfig.direction === "asc" ? (
                          <ArrowUp size={18} className="text-gray-700" />
                        ) : (
                          <ArrowDown size={18} className="text-gray-700" />
                        )
                      ) : (
                        <ArrowUp
                          size={18}
                          className="opacity-30 text-gray-500"
                        />
                      )}
                    </div>
                  </TableHead>

                  {/* TAGIHAN */}
                  <TableHead
                    className="text-center cursor-pointer select-none"
                    onClick={() => requestSort("tagihan")}
                  >
                    <div className="flex items-center justify-center gap-1">
                      Tagihan
                      {sortConfig?.key === "tagihan" ? (
                        sortConfig.direction === "asc" ? (
                          <ArrowUp size={18} className="text-gray-700" />
                        ) : (
                          <ArrowDown size={18} className="text-gray-700" />
                        )
                      ) : (
                        <ArrowUp
                          size={18}
                          className="opacity-30 text-gray-500"
                        />
                      )}
                    </div>
                  </TableHead>
                </TableRow>
              </TableHeader>

              {/* ✅ Bagian Body BENAR */}
              <TableBody>
                {paginated.map((record, i) => (
                  <TableRow key={record.id}>
                    <TableCell className="text-center">
                      {(page - 1) * perPage + i + 1}
                    </TableCell>
                    <TableCell className="text-center">{record.name}</TableCell>
                    <TableCell className="text-center">
                      {record.total}
                    </TableCell>
                    <TableCell className="text-center">
                      {record.bayar}
                    </TableCell>
                    <TableCell className="text-center">
                      {record.tagihan}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </motion.div>
        </motion.div>
      </motion.section>
    </main>
  );
}

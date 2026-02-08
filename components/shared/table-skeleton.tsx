"use client";

import { Skeleton } from "@/components/ui/skeleton";
import { motion } from "framer-motion";

export function TableSkeleton() {
  // Animation variants untuk staggered effect
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05,
      },
    },
  };

  const rowVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.3,
      },
    },
  };

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="w-full"
    >
      {/* Table Container */}
      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
        {/* Header dengan gradient */}
        <div className="border-b border-gray-100 bg-linear-to-r from-gray-50 to-gray-100/50 px-6 py-4">
          <div className="grid grid-cols-12 gap-">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="col-span-2">
                <div className="flex items-center gap-2">
                  <motion.div
                    initial={{ opacity: 0, x: -5 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.1, duration: 0.3 }}
                    className="flex-1"
                  >
                    <Skeleton className="h-4 w-20 rounded-full bg-linear-to-r from-gray-200 to-gray-300" />
                  </motion.div>
                  <div className="opacity-50">
                    <Skeleton className="h-3 w-3 rounded-sm bg-gray-300" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Table Body */}
        <div className="divide-y divide-gray-100/50">
          {[...Array(7)].map((_, rowIndex) => (
            <motion.div
              key={rowIndex}
              variants={rowVariants}
              className={`px-6 py-4 transition-colors hover:bg-gray-50/50 ${
                rowIndex % 2 === 0 ? "bg-white" : "bg-gray-50/30"
              }`}
            >
              <div className="grid grid-cols-12 gap-4 items-center">
                {[...Array(6)].map((_, colIndex) => (
                  <div key={colIndex} className="col-span-2">
                    <div className="flex items-center gap-2">
                      {/* Indikator untuk kolom pertama */}
                      {colIndex === 0 && (
                        <motion.div
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ delay: rowIndex * 0.1 }}
                        >
                          <Skeleton className="h-3 w-3 rounded-full bg-linear-to-r from-gray-300 to-gray-400" />
                        </motion.div>
                      )}

                      {/* Skeleton dengan panjang berbeda-beda untuk natural look */}
                      <motion.div
                        initial={{ width: "40%" }}
                        animate={{ width: ["40%", "80%", "60%"] }}
                        transition={{
                          duration: 1.5,
                          repeat: Infinity,
                          repeatType: "reverse",
                          delay: rowIndex * 0.2 + colIndex * 0.1,
                        }}
                        className="overflow-hidden"
                      >
                        <Skeleton
                          className={`h-4 rounded-lg bg-linear-to-r ${
                            colIndex % 3 === 0
                              ? "from-gray-200 to-gray-300"
                              : colIndex % 3 === 1
                                ? "from-gray-200/80 to-gray-300/80"
                                : "from-gray-200/60 to-gray-300/60"
                          }`}
                        />
                      </motion.div>

                      {/* Icon/Action untuk kolom terakhir */}
                      {colIndex === 5 && (
                        <div className="flex gap-1 ml-2">
                          <Skeleton className="h-6 w-6 rounded-md bg-gray-200/50" />
                          <Skeleton className="h-6 w-6 rounded-md bg-gray-200/50" />
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {/* Progress bar untuk beberapa row */}
              {rowIndex === 2 && (
                <motion.div
                  initial={{ opacity: 0, width: 0 }}
                  animate={{ opacity: 1, width: "100%" }}
                  transition={{ delay: 0.8, duration: 0.5 }}
                  className="mt-3"
                >
                  <div className="flex items-center justify-between text-xs text-gray-400 mb-1">
                    <Skeleton className="h-3 w-16 rounded-full bg-gray-200" />
                    <Skeleton className="h-3 w-10 rounded-full bg-gray-200" />
                  </div>
                  <Skeleton className="h-2 w-full rounded-full bg-linear-to-r from-gray-200 via-gray-300 to-gray-200" />
                </motion.div>
              )}
            </motion.div>
          ))}
        </div>

        {/* Table Footer */}
        <div className="border-t border-gray-100 bg-gray-50/50 px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Skeleton className="h-8 w-24 rounded-lg bg-linear-to-r from-gray-200 to-gray-300" />
              <Skeleton className="h-4 w-32 rounded-full bg-gray-200/50" />
            </div>

            <div className="flex items-center gap-2">
              {[...Array(4)].map((_, i) => (
                <Skeleton
                  key={i}
                  className={`h-9 w-9 rounded-lg ${
                    i === 1
                      ? "bg-linear-to-r from-gray-300 to-gray-400"
                      : "bg-gray-200/50"
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Additional info skeleton */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="mt-4 flex items-center justify-between"
      >
        <div className="flex items-center gap-3">
          <Skeleton className="h-4 w-48 rounded-full bg-gray-200/30" />
          <Skeleton className="h-2 w-2 rounded-full bg-gray-300" />
          <Skeleton className="h-4 w-36 rounded-full bg-gray-200/30" />
        </div>

        <div className="flex items-center gap-2">
          <Skeleton className="h-4 w-4 rounded-sm bg-gray-300" />
          <Skeleton className="h-4 w-20 rounded-full bg-gray-200/50" />
        </div>
      </motion.div>
    </motion.div>
  );
}

// Skeleton untuk card view (alternatif)
export function CardSkeleton() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {[...Array(6)].map((_, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: i * 0.1 }}
          className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm"
        >
          <div className="flex items-start justify-between">
            <div className="space-y-3">
              <Skeleton className="h-5 w-32 rounded-lg bg-linear-to-r from-gray-200 to-gray-300" />
              <Skeleton className="h-4 w-24 rounded-full bg-gray-200/50" />
            </div>
            <Skeleton className="h-10 w-10 rounded-xl bg-gray-200/30" />
          </div>

          <div className="mt-6 space-y-3">
            <div className="flex items-center justify-between">
              <Skeleton className="h-3 w-20 rounded-full bg-gray-200/50" />
              <Skeleton className="h-4 w-16 rounded-lg bg-gray-300" />
            </div>
            <div className="flex items-center justify-between">
              <Skeleton className="h-3 w-24 rounded-full bg-gray-200/50" />
              <Skeleton className="h-4 w-20 rounded-lg bg-gray-300" />
            </div>
          </div>

          <div className="mt-6 flex gap-2">
            <Skeleton className="h-9 flex-1 rounded-lg bg-gray-200/30" />
            <Skeleton className="h-9 w-9 rounded-lg bg-gray-200/30" />
          </div>
        </motion.div>
      ))}
    </div>
  );
}

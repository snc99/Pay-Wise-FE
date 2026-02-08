"use client";

import Image from "next/image";
import React from "react";
import { motion, useScroll, useTransform } from "framer-motion";

export default function About() {
  const { scrollYProgress } = useScroll();

  const fade1 = useTransform(scrollYProgress, [0.15, 0.3], [1, 0]);
  const fade2 = useTransform(scrollYProgress, [0.35, 0.55], [1, 0]);

  const floatUp = useTransform(scrollYProgress, [0, 1], [0, -80]);
  const floatDown = useTransform(scrollYProgress, [0, 1], [0, 80]);

  const gradientBg = "bg-gradient-to-br from-white via-gray-50 to-blue-50";

  return (
    <main className={`${gradientBg} overflow-hidden`}>
      {/* Section 1 */}
      <motion.section
        id="about"
        style={{ opacity: fade1 }}
        className="min-h-screen px-4 md:px-8 lg:px-16 flex flex-col items-center justify-center scroll-mt-32 overflow-hidden relative"
      >
        <div className="absolute top-10 left-10 w-72 h-72 bg-blue-100 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse"></div>
        <div className="absolute bottom-10 right-10 w-72 h-72 bg-purple-100 rounded-full mix-blend-multiply filter blur-3xl opacity-20"></div>

        {/* Title */}
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.6, type: "spring" }}
          className="relative z-10 flex flex-col items-center justify-center"
        >
          <h1 className="mt-6 text-center text-4xl font-bold lg:text-5xl bg-linear-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Cerita Kami
          </h1>
          <motion.span
            className="mt-5 h-1 w-20 bg-linear-to-r from-blue-500 to-purple-500 rounded-full"
            initial={{ width: 0 }}
            whileInView={{ width: 80 }}
            transition={{ duration: 0.8 }}
          ></motion.span>
        </motion.div>

        {/* Content */}
        <div className="mt-12 flex flex-col items-center justify-center md:flex-row md:gap-12 relative z-10">
          {/* Image */}
          <motion.div
            className="w-full md:w-1/2 relative"
            style={{ y: floatDown }}
            initial={{ opacity: 0, x: -40, scale: 0.9 }}
            whileInView={{ opacity: 1, x: 0, scale: 1 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.7 }}
            whileHover={{ scale: 1.02 }}
          >
            <div className="relative overflow-hidden rounded-2xl shadow-2xl shadow-blue-200/50">
              <Image
                src="/background/about1.png"
                alt="Perubahan dari catatan manual ke sistem digital"
                width={900}
                height={600}
                className="h-auto w-full object-cover transform transition-transform duration-300 hover:scale-105"
              />
              <div className="absolute inset-0 bg-linear-to-t from-blue-500/10 to-transparent"></div>
            </div>
          </motion.div>

          {/* Text */}
          <motion.div
            className="mt-8 max-w-lg md:mt-0 md:w-1/2"
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.7, delay: 0.2 }}
          >
            <motion.h2
              className="text-3xl font-bold lg:text-4xl leading-tight"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              Dari Catatan Manual ke{" "}
              <span className="text-blue-600">Sistem yang Lebih Rapi</span>
            </motion.h2>

            <motion.p
              className="mt-6 text-gray-700 lg:text-lg leading-relaxed"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              Dulu pencatatan utang pelanggan dilakukan di buku dan sering
              menyulitkan saat mencari data. Sekarang semua tersimpan digital,
              mudah dicari, dan lebih aman sehingga tidak ada catatan yang
              terlewat.
            </motion.p>
          </motion.div>
        </div>
      </motion.section>

      {/* Section 2 */}
      <motion.section
        id="about-2"
        style={{ opacity: fade2 }}
        className="min-h-screen px-4 md:px-8 lg:px-16 flex flex-col items-center justify-center scroll-mt-32 overflow-hidden relative"
      >
        <div className="absolute top-20 right-20 w-64 h-64 bg-green-100 rounded-full mix-blend-multiply filter blur-3xl opacity-30"></div>
        <div className="absolute bottom-20 left-20 w-64 h-64 bg-yellow-100 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse"></div>

        <div className="flex flex-col items-center justify-center relative z-10">
          <div className="flex flex-col items-center justify-center md:flex-row md:gap-12">
            {/* Text */}
            <motion.div
              className="max-w-lg md:w-1/2"
              initial={{ opacity: 0, x: -40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.7 }}
            >
              <motion.h2
                className="text-3xl font-bold lg:text-4xl leading-tight"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                Pantau Piutang{" "}
                <span className="text-green-600">Secara Real-Time</span>
              </motion.h2>

              <motion.p
                className="mt-6 text-gray-700 lg:text-lg leading-relaxed"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
              >
                Setiap transaksi langsung tercatat otomatis. Anda bisa melihat
                siapa yang belum bayar, total tagihan, hingga riwayat belanja
                hanya dalam hitungan detik.
              </motion.p>

              {/* Feature highlights */}
              <motion.div
                className="mt-8 grid grid-cols-2 gap-4"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                transition={{ staggerChildren: 0.1 }}
              >
                {[
                  "Pemantauan Langsung",
                  "Pengingat Pembayaran",
                  "Data Aman Tersimpan",
                  "Laporan Siap Dilihat",
                ].map((item, idx) => (
                  <motion.div
                    key={idx}
                    className="flex items-center gap-2"
                    initial={{ opacity: 0, x: -10 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: idx * 0.1 }}
                    whileHover={{ scale: 1.05 }}
                  >
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span className="text-sm font-medium text-gray-600">
                      {item}
                    </span>
                  </motion.div>
                ))}
              </motion.div>
            </motion.div>

            {/* Image */}
            <motion.div
              className="mt-8 md:w-1/2 relative"
              style={{ y: floatUp }}
              initial={{ opacity: 0, x: 40, scale: 0.9 }}
              whileInView={{ opacity: 1, x: 0, scale: 1 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.7 }}
              whileHover={{ scale: 1.02 }}
            >
              <div className="relative overflow-hidden rounded-2xl shadow-2xl shadow-green-200/50">
                <Image
                  src="/background/about2.png"
                  alt="Pemantauan piutang secara real-time"
                  width={900}
                  height={600}
                  className="h-auto w-full object-cover transform transition-transform duration-300 hover:scale-105"
                />
                <div className="absolute inset-0 bg-linear-to-t from-green-500/10 to-transparent"></div>
              </div>
            </motion.div>
          </div>
        </div>
      </motion.section>
    </main>
  );
}

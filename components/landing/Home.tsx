"use client";

import React from "react";
import Image from "next/image";
import { motion, Variants } from "framer-motion";

export default function Home() {
  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.3,
      },
    },
  };

  const textVariants: Variants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.7,
        ease: [0.16, 1, 0.3, 1],
      },
    },
  };

  const imageVariants: Variants = {
    hidden: { opacity: 0, scale: 0.8, x: 50 },
    visible: {
      opacity: 1,
      scale: 1,
      x: 0,
      transition: {
        duration: 0.8,
        ease: [0.16, 1, 0.3, 1],
        delay: 0.2,
      },
    },
    hover: {
      y: -10,
      transition: { duration: 0.3 },
    },
  };

  const featureVariants: Variants = {
    hidden: { opacity: 0, scale: 0.9 },
    visible: (i: number) => ({
      opacity: 1,
      scale: 1,
      transition: {
        delay: i * 0.1,
        duration: 0.5,
        ease: [0.16, 1, 0.3, 1],
      },
    }),
  };

  const floatCardVariants: Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: (delay: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: delay,
        duration: 0.6,
        ease: [0.16, 1, 0.3, 1],
      },
    }),
  };

  const underlineVariants: Variants = {
    hidden: { width: 0 },
    visible: {
      width: "100%",
      transition: {
        delay: 1,
        duration: 0.8,
        ease: "easeOut",
      },
    },
  };

  return (
    <main className="relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute top-0 left-0 w-72 h-72 bg-blue-100 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse"></div>
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-purple-100 rounded-full mix-blend-multiply filter blur-3xl opacity-20"></div>
      <div className="absolute top-1/4 right-1/4 w-64 h-64 bg-pink-100 rounded-full mix-blend-multiply filter blur-3xl opacity-10"></div>

      <section
        className="relative container mx-auto flex min-h-screen flex-col items-center justify-center px-4 md:flex-row md:px-8 lg:px-16 mt-10"
        id="home"
      >
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center w-full max-w-7xl">
          {/* Konten Teks */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="text-center lg:text-left"
          >
            <motion.div
              variants={textVariants}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-50 text-blue-600 text-sm font-medium mb-6"
            >
              <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
              Sistem Modern untuk Warung
            </motion.div>

            <motion.h1
              variants={textVariants}
              className="text-4xl sm:text-3xl lg:text-4xl xl:text-5xl font-bold leading-tight mt-5"
            >
              <span className="block">Dari Catatan Manual</span>
              <span className="block mt-2">
                Menjadi{" "}
                <span className="relative">
                  <span className="text-transparent bg-clip-text bg-linear-to-r from-blue-600 to-purple-600">
                    Sistem Digital
                  </span>
                  <motion.div
                    className="absolute -bottom-2 left-0 h-1 bg-linear-to-r from-blue-500 to-purple-500 rounded-full"
                    variants={underlineVariants}
                    initial="hidden"
                    animate="visible"
                  />
                </span>
              </span>
            </motion.h1>

            <motion.p
              variants={textVariants}
              className="mt-6 text-lg sm:text-xl text-gray-600 leading-relaxed max-w-2xl"
            >
              Warung kami dulunya pakai catatan kertas yang berantakan. Sekarang
              dengan{" "}
              <span className="font-semibold text-blue-600">PayWise</span>,
              semua piutang pelanggan tercatat rapi, tidak ada yang terlewat,
              dan pelunasan lebih mudah dikelola.
            </motion.p>
          </motion.div>

          {/* Gambar Hero */}
          <motion.div
            variants={imageVariants}
            initial="hidden"
            animate="visible"
            whileHover="hover"
            className="relative"
          >
            <div className="relative">
              {/* Main Image Container */}
              <div className="relative overflow-hidden rounded-3xl shadow-2xl shadow-blue-200/50">
                {/* Fallback jika gambar tidak ada */}
                <Image
                  src="/background/home.png"
                  alt="Dashboard PayWise Warung"
                  width={900}
                  height={600}
                  className="h-auto w-full object-cover transform transition-transform duration-500 hover:scale-105"
                  priority
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.style.display = "none";

                    const fallback = target.parentElement?.querySelector(
                      "div",
                    ) as HTMLElement | null;
                    if (fallback) fallback.style.display = "flex";
                  }}
                />
                {/* Gradient Overlay */}
                <div className="absolute inset-0 bg-linear-to-t from-blue-500/10 to-transparent"></div>
              </div>
            </div>

            {/* Decorative Element */}
            <div className="absolute -z-10 top-10 -left-10 w-64 h-64 bg-linear-to-r from-blue-200 to-purple-200 rounded-full blur-3xl opacity-30"></div>
          </motion.div>
        </div>
      </section>
    </main>
  );
}

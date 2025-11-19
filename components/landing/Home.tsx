"use client";

import React from "react";
import Image from "next/image";
import { motion, useScroll, useTransform } from "framer-motion";

export default function Home() {
  // Scroll progress
  const { scrollYProgress } = useScroll();

  // Parallax untuk text (bergerak lebih lambat)
  const textY = useTransform(scrollYProgress, [0, 1], [0, -150]);

  // Fade out ketika scroll
  const opacity = useTransform(scrollYProgress, [0, 0.2], [1, 0]);

  return (
    <main>
      <section
        id="home"
        className="container mx-auto flex h-screen flex-col items-center justify-center px-4 md:flex-row md:px-8 lg:px-16 overflow-hidden"
      >
        {/* TEXT */}
         <motion.div
          className="max-w-lg text-center md:w-1/2 md:text-left"
          initial={{ opacity: 0, x: -40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          <h1 className="text-[32px] font-bold sm:text-[40px] lg:text-[48px]">
            <span className="text-blue-new">Pay Wise </span>- Manajemen Hutang
            Anda Jadi Mudah!
          </h1>

          <p className="mt-6 text-sm text-gray-600 sm:text-base lg:text-lg">
            Kelola catatan hutang dan piutang dengan praktis dan teratur. Dengan
            Pay Wise, Anda bisa mencatat transaksi dan memantau status keuangan
            secara efisien.
          </p>
        </motion.div>

        {/* IMAGE FLOATING + FADE OUT + PARALLAX */}
        <motion.div
          style={{ opacity }}
          animate={{
            y: [0, -15, 0], // floating
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="mt-8 flex items-center justify-center md:mt-0 md:h-1/2 lg:w-1/2"
        >
          <Image
            src="/background/home.png"
            alt="Header Image"
            width={900}
            height={600}
            className="h-auto w-full object-cover"
          />
        </motion.div>
      </section>
    </main>
  );
}

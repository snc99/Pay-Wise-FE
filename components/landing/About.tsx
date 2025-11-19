"use client";

import Image from "next/image";
import React from "react";
import { motion, useScroll, useTransform } from "framer-motion";

export default function About() {
  const { scrollYProgress } = useScroll();

  // Fade & parallax for both screens
  const fade1 = useTransform(scrollYProgress, [0.15, 0.30], [1, 0]);
  const fade2 = useTransform(scrollYProgress, [0.35, 0.55], [1, 0]);

  const parallaxUp = useTransform(scrollYProgress, [0, 1], [0, -120]);
  const parallaxDown = useTransform(scrollYProgress, [0, 1], [0, 120]);

  return (
    <main>
      <motion.section
        id="about"
        style={{ opacity: fade1 }}
        className="
          min-h-screen 
          px-4 
          md:px-8 
          lg:px-16 
          flex 
          flex-col 
          items-center 
          justify-center 
          scroll-mt-32
          overflow-hidden
        "
      >
        {/* Title */}
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="flex flex-col items-center justify-center"
        >
          <h1 className="text-center text-3xl font-bold lg:text-4xl">
            About Us
          </h1>
          <span className="mt-5 h-0.5 w-14 bg-black"></span>
        </motion.div>

        {/* Content row */}
        <div className="mt-10 flex flex-col items-center justify-center md:flex-row md:gap-8">

          {/* Gambar kiri */}
          <motion.div
            className="w-full md:w-1/2"
            style={{ y: parallaxDown }}
            animate={{ y: [0, -10, 0] }}
            transition={{
              duration: 4,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <Image
              src="/background/about1.png"
              alt="About Image 1"
              width={900}
              height={600}
              className="h-auto w-full object-cover"
            />
          </motion.div>

          {/* Text kanan */}
          <motion.div
            className="mt-6 max-w-lg text-center md:mt-0 md:w-1/2 md:text-left"
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-[28px] font-bold lg:text-[36px]">
              Kelola semua hutang Anda dengan mudah menggunakan fitur di Pay Wise.
            </h2>

            <p className="mt-6 text-sm text-gray-600 sm:text-base lg:text-lg">
              Pay Wise kami dirancang untuk memberikan Anda kendali penuh atas
              keuangan Anda dengan cara yang sederhana dan terstruktur.
            </p>
          </motion.div>

        </div>
      </motion.section>

      <motion.section
        id="about-2"
        style={{ opacity: fade2 }}
        className="
          min-h-screen 
          px-4 
          md:px-8 
          lg:px-16 
          flex 
          flex-col 
          items-center 
          justify-center 
          scroll-mt-32
          overflow-hidden
        "
      >
        <div className="flex flex-col items-center justify-center">

          <div className="mt-10 flex flex-col items-center justify-center md:flex-row md:gap-8">

            {/* Text kiri */}
            <motion.div
              className="max-w-lg text-center md:w-1/2 md:text-left"
              initial={{ opacity: 0, x: -40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="text-[28px] font-bold lg:text-[36px]">
                Pantau dan Kelola Hutang Anda Secara Real-Time
              </h2>

              <p className="mt-6 text-sm text-gray-600 sm:text-base lg:text-lg">
                Kelola semua hutang Anda dengan mudah menggunakan fitur Pencatatan Hutang di Pay Wise.
              </p>
            </motion.div>

            {/* Gambar kanan */}
            <motion.div
              className="mt-6 md:w-1/2"
              style={{ y: parallaxUp }}
              animate={{ y: [0, -10, 0] }}
              transition={{
                duration: 4,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              initial={{ opacity: 0, x: 40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <Image
                src="/background/about2.png"
                alt="About Image 2"
                width={900}
                height={600}
                className="h-auto w-full object-cover"
              />
            </motion.div>

          </div>
        </div>
      </motion.section>

    </main>
  );
}

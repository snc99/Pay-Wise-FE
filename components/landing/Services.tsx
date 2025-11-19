"use client";

import IconCard1 from "@/public/card/iconCard1";
import IconCard2 from "@/public/card/iconCard2";
import IconCard3 from "@/public/card/iconCard3";
import { motion, useScroll, useTransform } from "framer-motion";

export default function Services() {
  const { scrollYProgress } = useScroll();
  const parallax = useTransform(scrollYProgress, [0, 1], [0, -40]);

  return (
    <main>
      <section
        id="services"
        className="container mx-auto px-4 md:px-8 lg:px-16 scroll-mt-20 mt-32 py-20"
      >
        {/* Heading */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4 }}
          className="flex flex-col items-center"
        >
          <h1 className="text-3xl md:text-4xl font-bold text-center mb-4">
            Layanan Kami
          </h1>
          <span className="h-0.5 w-14 bg-black mb-8"></span>
        </motion.div>

        {/* Content */}
        <motion.div
          style={{ y: parallax }}
          className="mx-auto mt-2 flex max-w-5xl flex-col items-center"
        >
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-center text-gray-600 sm:text-sm lg:text-base max-w-3xl"
          >
            Dengan Pay Wise, Anda dapat mengelola hutang dengan lebih mudah dan
            teratur, menjadikan proses pencatatan keuangan Anda lebih efisien
            dan bebas dari kekacauan.
          </motion.p>

          {/* GRID */}
          <div className="mt-10 grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-3">
            {[IconCard1, IconCard2, IconCard3].map((Icon, idx) => (
              <motion.div
                key={idx}
                animate={{ y: [0, -8, 0] }}
                transition={{
                  duration: 5,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: idx * 0.6,
                }}
                className="h-64 w-[280px] sm:w-[300px] rounded-lg border bg-[#bae6fd] p-4 shadow-md hover:scale-105 transition duration-200"
              >
                <div className="flex flex-col items-center justify-center h-full">
                  <Icon />
                  <h3 className="mt-4 text-xl font-bold text-center">
                    {idx === 0 && "Pencatatan Hutang"}
                    {idx === 1 && "Ringkasan Total Hutang"}
                    {idx === 2 && "Laporan Keuangan"}
                  </h3>
                  <p className="mt-2 text-gray-500 text-center">
                    {idx === 0 &&
                      "Mencatat transaksi hutang dengan cepat dan akurat."}
                    {idx === 1 && "Pantau total hutang yang belum dilunasi."}
                    {idx === 2 &&
                      "Laporan lengkap tentang hutang dan pembayaran."}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </section>
    </main>
  );
}

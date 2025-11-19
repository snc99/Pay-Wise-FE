"use client";

import IconCard4 from "@/public/card/iconCard4";
import IconCard5 from "@/public/card/iconCard5";
import IconCard6 from "@/public/card/iconCard6";
import { motion, useScroll, useTransform } from "framer-motion";

export default function Contact() {
  const { scrollYProgress } = useScroll();
  const parallax = useTransform(scrollYProgress, [0, 1], [0, -60]);
  const floatAnim = { y: [0, -6, 0] };

  return (
    <main>
      <section
        id="contact"
        className="container mx-auto min-h-screen px-4 md:px-8 lg:px-16 scroll-mt-24"
      >
        {/* Heading */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="flex flex-col items-center pt-16 md:pt-20"
        >
          <h1 className="text-3xl md:text-4xl font-bold text-center">
            Kontak Kami
          </h1>

          <span className="h-0.5 w-16 bg-black mt-3"></span>

          <p className="text-center text-gray-600 max-w-2xl mt-6 mb-14 text-sm md:text-base">
            Jika Anda memiliki pertanyaan atau membutuhkan bantuan lebih lanjut,
            jangan ragu untuk menghubungi kami melalui informasi di bawah ini.
          </p>
        </motion.div>

        {/* Cards */}
        <motion.div
          style={{ y: parallax }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10 place-items-center"
        >
          {[
            {
              icon: <IconCard4 />,
              title: "Alamat",
              desc: "Jl. Sagong RT 02 RW 06",
              delay: 0,
            },
            {
              icon: <IconCard5 />,
              title: "Telepon",
              desc: "08764523445",
              delay: 0.3,
            },
            {
              icon: <IconCard6 />,
              title: "Email",
              desc: "Paywise@gmail.co.id",
              delay: 0.6,
            },
          ].map((card, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: card.delay }}
              whileHover={{
                scale: 1.05,
                boxShadow: "0 8px 25px rgba(0,0,0,0.15)",
              }}
              className="w-[280px] sm:w-[300px] h-44 rounded-xl border border-gray-200 bg-[#e0f2fe] shadow-sm p-5
              transition-all cursor-default hover:bg-[#dbeeff]"
            >
              <motion.div
                animate={floatAnim}
                transition={{
                  duration: 4 + index,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
                className="flex items-start gap-4"
              >
                <div className="w-12 h-12 rounded-full bg-white/80 shadow flex items-center justify-center">
                  {card.icon}
                </div>

                <div>
                  <h3 className="text-lg font-semibold">{card.title}</h3>
                  <p className="mt-1 text-gray-700 text-sm">{card.desc}</p>
                </div>
              </motion.div>
            </motion.div>
          ))}
        </motion.div>
      </section>
    </main>
  );
}

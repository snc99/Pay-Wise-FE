"use client";

import { motion } from "framer-motion";
import {
  FiCheckCircle,
  FiTrendingUp,
  FiFileText,
  FiBarChart2,
  FiDollarSign,
  FiUsers,
} from "react-icons/fi";

export default function Services() {
  const services = [
    {
      icon: <FiFileText className="text-4xl" />,
      title: "Pencatatan Piutang Digital",
      description:
        "Setiap transaksi pelanggan langsung tercatat rapi di sistem. Tidak perlu lagi menulis di buku atau takut ada yang lupa.",
      features: ["Input cepat", "Tersimpan otomatis", "Mudah dicari"],
      gradient: "from-blue-500 to-cyan-500",
    },
    {
      icon: <FiBarChart2 className="text-4xl" />,
      title: "Ringkasan Total Tagihan",
      description:
        "Lihat jumlah piutang, pelanggan yang belum bayar, dan kondisi keuangan warung Anda dalam satu tampilan.",
      features: ["Dashboard langsung", "Data selalu update", "Mudah dipahami"],
      gradient: "from-purple-500 to-pink-500",
    },
    {
      icon: <FiDollarSign className="text-4xl" />,
      title: "Laporan Otomatis",
      description:
        "Riwayat transaksi dan pembayaran tersusun otomatis sehingga Anda bisa mengetahui pemasukan dengan lebih jelas.",
      features: ["Rekap cepat", "Siap dilihat kapan saja", "Data akurat"],
      gradient: "from-orange-500 to-yellow-500",
    },
    {
      icon: <FiUsers className="text-4xl" />,
      title: "Data Pelanggan Terkelola",
      description:
        "Simpan informasi pelanggan langganan dengan rapi. Anda dapat melihat catatan belanja masing-masing dengan mudah.",
      features: ["Daftar pelanggan", "Riwayat belanja", "Catatan tersimpan"],
      gradient: "from-green-500 to-emerald-500",
    },
    {
      icon: <FiCheckCircle className="text-4xl" />,
      title: "Pengingat Pembayaran",
      description:
        "Bantu mengingatkan tagihan yang mendekati jatuh tempo sehingga tidak ada piutang yang terlewat.",
      features: ["Pengingat otomatis", "Tepat waktu", "Lebih tertib"],
      gradient: "from-indigo-500 to-blue-500",
    },
    {
      icon: <FiTrendingUp className="text-4xl" />,
      title: "Pantau Perkembangan Warung",
      description:
        "Dengan data yang tersusun rapi, Anda bisa melihat perkembangan transaksi dan membuat keputusan lebih baik.",
      features: [
        "Statistik sederhana",
        "Mudah dipahami",
        "Bantu ambil keputusan",
      ],
      gradient: "from-red-500 to-orange-500",
    },
  ];

  return (
    <section id="services" className="relative py-20 overflow-hidden">
      <div className="absolute top-20 right-10 w-80 h-80 bg-blue-50 rounded-full mix-blend-multiply filter blur-3xl opacity-20"></div>
      <div className="absolute bottom-20 left-10 w-64 h-64 bg-purple-50 rounded-full mix-blend-multiply filter blur-3xl opacity-10"></div>

      <div className="container mx-auto px-4">
        {/* Title */}
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.6, type: "spring" }}
          className="relative z-10 flex flex-col items-center justify-center"
        >
          <h1 className="mt-2 text-center text-4xl font-bold lg:text-5xl bg-linear-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Apa yang Bisa Dilakukan Sistem Kami
          </h1>
          <motion.span
            className="mt-4 h-1 w-20 bg-linear-to-r from-blue-500 to-purple-500 rounded-full"
            initial={{ width: 0 }}
            whileInView={{ width: 80 }}
            transition={{ duration: 0.8 }}
          ></motion.span>
        </motion.div>

        {/* Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mt-10 max-w-6xl mx-auto">
          {services.map((service, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ y: -8 }}
              className="group"
            >
              <div className="h-full bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden border border-gray-100">
                <div className={`h-2 bg-linear-to-r ${service.gradient}`} />

                <div className="p-6">
                  <div
                    className={`inline-flex p-4 rounded-xl bg-linear-to-r ${service.gradient} mb-4 group-hover:scale-110 transition-transform duration-300`}
                  >
                    <div className="text-white">{service.icon}</div>
                  </div>

                  <h3 className="text-xl font-bold mb-3">{service.title}</h3>
                  <p className="text-gray-600 mb-4">{service.description}</p>

                  <div className="space-y-2 mb-6">
                    {service.features.map((feature, idx) => (
                      <div key={idx} className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                        <span className="text-sm text-gray-700">{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

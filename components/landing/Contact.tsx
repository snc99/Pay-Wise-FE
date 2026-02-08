"use client";

import { motion } from "framer-motion";
import { FiMapPin, FiPhone, FiMail, FiSend } from "react-icons/fi";
import { useState } from "react";

export default function Contact() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log(formData);
  };

  const contactInfo = [
    {
      icon: <FiPhone className="text-3xl" />,
      title: "WhatsApp / Telepon",
      details: "0876 4523 445",
      color: "from-green-500 to-emerald-500",
    },
    {
      icon: <FiMail className="text-3xl" />,
      title: "Email",
      details: "support@paywise.co.id",
      color: "from-blue-500 to-cyan-500",
    },
    {
      icon: <FiMapPin className="text-3xl" />,
      title: "Lokasi",
      details: "Jakarta Selatan",
      color: "from-purple-500 to-pink-500",
    },
  ];

  return (
    <section id="contact" className="relative py-20 overflow-hidden">
      <div className="absolute top-20 left-10 w-64 h-64 bg-blue-100 rounded-full blur-3xl opacity-20"></div>
      <div className="absolute bottom-20 right-10 w-80 h-80 bg-purple-100 rounded-full blur-3xl opacity-10"></div>

      <div className="container mx-auto px-4">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-14"
        >
          <h1 className="text-4xl lg:text-5xl font-bold bg-linear-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Hubungi Kami
          </h1>
          <p className="mt-5 text-gray-600 max-w-xl mx-auto text-lg">
            Punya pertanyaan atau ingin mulai menggunakan sistem kami? Silakan
            hubungi kami, kami siap membantu.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-12 max-w-5xl mx-auto">
          {/* Info */}
          <div className="grid sm:grid-cols-2 gap-6">
            {contactInfo.map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <div className="bg-white p-6 rounded-2xl shadow-md border border-gray-100">
                  <div
                    className={`inline-flex p-3 rounded-xl bg-linear-to-r ${item.color} mb-4`}
                  >
                    <div className="text-white">{item.icon}</div>
                  </div>
                  <h3 className="text-lg font-semibold">{item.title}</h3>
                  <p className="text-gray-700 mt-1">{item.details}</p>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Form */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="bg-white p-8 rounded-3xl shadow-lg border border-gray-100"
          >
            <h2 className="text-2xl font-bold mb-2">Kirim Pesan</h2>
            <p className="text-gray-600 mb-6">
              Tinggalkan pesan Anda, kami akan menghubungi secepatnya.
            </p>

            <form onSubmit={handleSubmit} className="space-y-5">
              <input
                type="text"
                required
                placeholder="Nama"
                className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:border-blue-500 outline-none"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
              />

              <input
                type="email"
                required
                placeholder="Email"
                className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:border-blue-500 outline-none"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
              />

              <textarea
                required
                rows={4}
                placeholder="Pesan"
                className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:border-blue-500 outline-none resize-none"
                value={formData.message}
                onChange={(e) =>
                  setFormData({ ...formData, message: e.target.value })
                }
              />

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full py-3 bg-linear-to-r from-blue-500 to-purple-500 text-white font-semibold rounded-xl flex items-center justify-center gap-2"
              >
                <FiSend />
                Kirim Pesan
              </motion.button>
            </form>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

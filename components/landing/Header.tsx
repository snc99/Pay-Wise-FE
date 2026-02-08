"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  MdOutlineLogin,
  MdOutlineNotifications,
  MdPersonOutline,
} from "react-icons/md";
import { FiMenu, FiX, FiChevronDown } from "react-icons/fi";
import {
  motion,
  AnimatePresence,
  useScroll,
  useTransform,
} from "framer-motion";

export default function Header() {
  const router = useRouter();
  const { scrollY } = useScroll();
  const [activeSection, setActiveSection] = useState("");
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  // Parallax effect untuk header
  const headerY = useTransform(scrollY, [0, 100], [0, -20]);
  const headerOpacity = useTransform(scrollY, [0, 100], [1, 0.95]);
  const headerBlur = useTransform(
    scrollY,
    [0, 100],
    ["blur(0px)", "blur(10px)"],
  );

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };

    const sections = document.querySelectorAll("[id]");
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        });
      },
      { threshold: 0.3 },
    );

    sections.forEach((section) => observer.observe(section));
    window.addEventListener("scroll", handleScroll);

    return () => {
      sections.forEach((section) => observer.unobserve(section));
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const menus = [
    { name: "Beranda", path: "#home" },
    { name: "Cerita", path: "#about" },
    { name: "Fitur", path: "#services" },
    { name: "Cek Tagihan", path: "#debt" },
    { name: "Kontak", path: "#contact" },
  ];

  const navVariants = {
    hidden: { opacity: 0, y: -20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: -10 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <motion.header
      style={{
        y: headerY,
        opacity: headerOpacity,
        backdropFilter: headerBlur,
      }}
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-white/90 shadow-lg shadow-black/5 backdrop-blur-md"
          : "bg-white/80 backdrop-blur-sm"
      }`}
    >
      {/* Decorative top gradient line */}
      <div className="h-1 bg-linear-to-r from-blue-500 via-purple-500 to-pink-500"></div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* LOGO dengan animasi */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="flex items-center"
          >
            <Link href="/" className="group flex items-center gap-2">
              <div className="relative">
                <div className="absolute -inset-1 rounded-lg bg-linear-to-r from-blue-500 to-purple-500 opacity-20 blur group-hover:opacity-30 transition-opacity"></div>
                <div className="relative rounded-lg bg-linear-to-r from-blue-600 to-purple-600 p-2">
                  <span className="text-xl font-bold text-white">PW</span>
                </div>
              </div>
              <span className="text-2xl font-bold bg-linear-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                PayWise
              </span>
            </Link>
          </motion.div>

          {/* DESKTOP NAVIGATION */}
          <motion.nav
            variants={navVariants}
            initial="hidden"
            animate="visible"
            className="hidden lg:flex items-center space-x-1"
          >
            {menus.map((item) => (
              <motion.div
                key={item.name}
                variants={itemVariants}
                whileHover={{ y: -2 }}
                className="relative"
              >
                <Link
                  href={item.path}
                  className={`relative px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200 ${
                    activeSection === item.path.replace("#", "")
                      ? "text-blue-600"
                      : "text-gray-700 hover:text-blue-500"
                  }`}
                >
                  {item.name}
                  {activeSection === item.path.replace("#", "") && (
                    <motion.div
                      layoutId="activeIndicator"
                      className="absolute bottom-0 left-0 right-0 h-0.5 bg-linear-to-r from-blue-500 to-purple-500"
                    />
                  )}
                </Link>
              </motion.div>
            ))}
          </motion.nav>

          {/* CTA BUTTONS */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="hidden lg:flex items-center gap-3"
          >
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => router.push("/auth/login")}
              className="px-6 py-2.5 bg-linear-to-r from-blue-500 to-purple-500 text-white font-medium rounded-full shadow-lg hover:shadow-xl transition-all duration-300 relative overflow-hidden group"
            >
              <span className="relative z-10 flex items-center gap-2">
                <MdOutlineLogin className="text-lg" />
                Login
              </span>
              <div className="absolute inset-0 bg-linear-to-r from-blue-600 to-purple-600 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
            </motion.button>
          </motion.div>

          {/* MOBILE MENU BUTTON */}
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="lg:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
          >
            {isMenuOpen ? (
              <FiX className="text-2xl text-gray-700" />
            ) : (
              <FiMenu className="text-2xl text-gray-700" />
            )}
          </motion.button>
        </div>
      </div>

      {/* MOBILE MENU OVERLAY */}
      <AnimatePresence>
        {isMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMenuOpen(false)}
              className="fixed inset-0 bg-black/20 backdrop-blur-sm lg:hidden z-40"
            />

            <motion.div
              initial={{ opacity: 0, x: "100%" }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: "100%" }}
              transition={{ type: "spring", damping: 25 }}
              className="fixed right-0 top-16 h-[calc(100vh-4rem)] w-80 bg-white shadow-2xl lg:hidden z-50 overflow-y-auto"
            >
              <div className="p-6">
                {/* User info jika login */}
                <div className="mb-8 p-4 rounded-xl bg-linear-to-r from-blue-50 to-purple-50">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-linear-to-r from-blue-500 to-purple-500 flex items-center justify-center">
                      <MdPersonOutline className="text-2xl text-white" />
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">Welcome!</p>
                      <p className="text-sm text-gray-600">
                        Sign in to continue
                      </p>
                    </div>
                  </div>
                </div>

                {/* Menu Items */}
                <nav className="space-y-2">
                  {menus.map((item, index) => (
                    <motion.div
                      key={item.name}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <Link
                        href={item.path}
                        onClick={() => setIsMenuOpen(false)}
                        className={`flex items-center justify-between p-3 rounded-lg transition-all ${
                          activeSection === item.path.replace("#", "")
                            ? "bg-linear-to-r from-blue-50 to-purple-50 text-blue-600 font-medium"
                            : "hover:bg-gray-50 text-gray-700"
                        }`}
                      >
                        <span>{item.name}</span>
                        {activeSection === item.path.replace("#", "") && (
                          <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                        )}
                      </Link>
                    </motion.div>
                  ))}
                </nav>

                {/* Mobile CTA Buttons */}
                <div className="mt-8 space-y-4">
                  <motion.button
                    whileTap={{ scale: 0.98 }}
                    onClick={() => {
                      setIsMenuOpen(false);
                      router.push("/auth/login");
                    }}
                    className="w-full py-3 px-4 bg-linear-to-r from-blue-500 to-purple-500 text-white rounded-lg shadow-lg hover:shadow-xl transition-all"
                  >
                    Login
                  </motion.button>
                </div>

                {/* Additional Info */}
                <div className="mt-8 pt-6 border-t">
                  <p className="text-xs text-gray-500 text-center">
                    © 2024 PayWise. All rights reserved.
                  </p>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </motion.header>
  );
}

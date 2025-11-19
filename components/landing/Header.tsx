"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { MdOutlineLogin } from "react-icons/md";
import { motion, AnimatePresence } from "framer-motion";

export default function Header() {
  const router = useRouter();
  const [activeSection, setActiveSection] = useState("");
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    // ✅ FIX: ambil semua element yang punya ID, termasuk motion.section
    const sections = document.querySelectorAll("[id]");

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        });
      },
      {
        threshold: 0.25, // ✅ lebih sensitif
      }
    );

    sections.forEach((section) => observer.observe(section));
    return () => sections.forEach((section) => observer.unobserve(section));
  }, []);

  const menus = ["home", "about", "debt", "services", "contact"];

  return (
    <header className="fixed inset-x-0 top-0 z-20 bg-white shadow-md">
      <div className="mx-auto max-w-6xl px-4 py-3">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
          {/* LOGO + HAMBURGER */}
          <div className="flex items-center justify-between">
            <div className="text-xl font-bold">Pay Wise</div>

            <button
              className="text-2xl lg:hidden"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              &#9776;
            </button>
          </div>

          {/* DESKTOP MENU */}
          <nav className="hidden lg:block">
            <ul className="flex flex-row items-center gap-8 py-0">
              {menus.map((section) => (
                <li key={section}>
                  <Link
                    href={`#${section}`}
                    className={
                      activeSection === section
                        ? "font-bold text-gray-700"
                        : "text-[#7dd3fc]"
                    }
                  >
                    {section.charAt(0).toUpperCase() + section.slice(1)}
                  </Link>
                </li>
              ))}

              <li>
                <button
                  className="button-login flex items-center gap-2 rounded px-4 py-2 text-blue-500"
                  onClick={() => router.push("/auth/login")}
                >
                  Login <MdOutlineLogin size={20} />
                </button>
              </li>
            </ul>
          </nav>

          {/* MOBILE MENU */}
          <AnimatePresence>
            {isMenuOpen && (
              <motion.nav
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.25 }}
                className="border-t bg-white lg:hidden"
              >
                <ul className="flex flex-col items-center gap-4 py-4">
                  {menus.map((section) => (
                    <motion.li
                      key={section}
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                    >
                      <Link
                        href={`#${section}`}
                        className={
                          activeSection === section
                            ? "font-bold text-gray-700"
                            : "text-[#7dd3fc]"
                        }
                        onClick={() => setIsMenuOpen(false)}
                      >
                        {section.charAt(0).toUpperCase() + section.slice(1)}
                      </Link>
                    </motion.li>
                  ))}

                  <motion.li
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                  >
                    <button
                      className="button-login flex items-center gap-2 rounded px-4 py-2 text-blue-500"
                      onClick={() => {
                        setIsMenuOpen(false);
                        router.push("/auth/login");
                      }}
                    >
                      Login <MdOutlineLogin size={20} />
                    </button>
                  </motion.li>
                </ul>
              </motion.nav>
            )}
          </AnimatePresence>
        </div>
      </div>
    </header>
  );
}

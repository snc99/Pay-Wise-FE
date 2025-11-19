"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { Eye, EyeOff, Loader2, User } from "lucide-react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth-context";

export default function LoginPage() {
  const router = useRouter();
  const { login, user, isLoading: authLoading } = useAuth();

  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [currentShape, setCurrentShape] = useState(0);

  const togglePasswordVisibility = () => setShowPassword((s) => !s);

  const shapes = [
    "rounded-tl-full rounded-br-full",
    "rounded-tr-full rounded-bl-full",
    "rounded-full",
    "rounded-lg",
  ];

  // Redirect ke dashboard kalau sudah login
  useEffect(() => {
    if (!authLoading && user) {
      router.push("/dashboard");
    }
  }, [user, authLoading, router]);

  // Animation shapes
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentShape((prev) => (prev + 1) % shapes.length);
    }, 3001);
    return () => clearInterval(interval);
  }, [shapes.length]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    const trimmedUsername = username.trim();
    const trimmedPassword = password.trim();

    if (!trimmedUsername || !trimmedPassword) {
      setError("Masukkan username dan password");
      return;
    }

    setIsLoading(true);

    try {
      // ✅ Pakai login dari auth context
      await login(trimmedUsername, trimmedPassword);
      // Auto redirect handled by auth context
    } catch (err: any) {
      // ✅ Error handling yang lebih simple
      if (err.message.includes("401") || err.message.includes("salah")) {
        setError("Username atau password salah");
      } else if (
        err.message.includes("400") ||
        err.message.includes("Validasi")
      ) {
        setError("Data tidak valid. Periksa input Anda.");
      } else if (
        err.message.includes("network") ||
        err.message.includes("fetch")
      ) {
        setError("Tidak dapat terhubung ke server");
      } else {
        setError(err?.message || "Terjadi kesalahan. Silakan coba lagi.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Show loading while checking auth
  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <Loader2 className="animate-spin h-12 w-12 text-blue-600 mx-auto mb-4" />
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex bg-gray-50">
      {/* Left animated panel */}
      <motion.div
        className="hidden lg:flex w-1/2 bg-linear-to-br from-blue-600 to-blue-400 relative overflow-hidden"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
      >
        <motion.div
          className={`absolute top-1/4 left-1/4 w-64 h-64 bg-white opacity-10 ${shapes[currentShape]}`}
          animate={{ x: [0, 20, 0, -20, 0], y: [0, -20, 0, 20, 0] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        />

        <motion.div
          className={`absolute bottom-1/4 right-1/4 w-80 h-80 bg-white opacity-5 ${
            shapes[(currentShape + 1) % shapes.length]
          }`}
          animate={{ scale: [1, 1.1, 1], rotate: [0, 5, 0, -5, 0] }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
        />

        <div className="relative z-10 flex flex-col justify-center items-start h-full px-16 text-white">
          <motion.h1
            className="text-5xl font-bold mb-4"
            initial={{ y: -50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.5 }}
          >
            Pay Wise
          </motion.h1>
          <motion.p
            className="text-xl opacity-90"
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.5 }}
          >
            Manajemen hutang anda jadi mudah
          </motion.p>
        </div>
      </motion.div>

      {/* Right - form */}
      <div className="w-full lg:w-1/2 flex flex-col justify-center items-center p-8">
        <motion.div
          className="w-full max-w-md"
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
          >
            <h2 className="text-3xl font-bold mb-2 text-gray-800">
              Hello Again!
            </h2>
            <p className="text-gray-600 mb-8">Welcome Back</p>

            <form className="space-y-6" onSubmit={handleSubmit}>
              {/* Username */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Username
                </label>
                <div className="relative">
                  <motion.input
                    autoFocus
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    onBlur={(e) => setUsername(e.target.value.trim())}
                    className="w-full px-4 py-3 pl-10 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition bg-white"
                    placeholder="Masukkan username anda"
                    required
                    disabled={isLoading}
                    whileFocus={{
                      borderColor: "#3b82f6",
                      boxShadow: "0 0 0 3px rgba(59,130,246,0.1)",
                    }}
                  />
                  <div className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">
                    <User size={18} />
                  </div>
                </div>
              </div>

              {/* Password */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Password
                </label>
                <div className="relative">
                  <motion.input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition bg-white pr-10"
                    placeholder="Masukkan password anda"
                    required
                    disabled={isLoading}
                    whileFocus={{
                      borderColor: "#3b82f6",
                      boxShadow: "0 0 0 3px rgba(59,130,246,0.1)",
                    }}
                  />
                  <button
                    type="button"
                    onClick={togglePasswordVisibility}
                    className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-600 transition-colors"
                    aria-label={
                      showPassword
                        ? "Sembunyikan password"
                        : "Tampilkan password"
                    }
                    disabled={isLoading}
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              {/* Error Message */}
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-3 bg-red-50 border border-red-200 text-red-600 text-sm rounded-lg"
                >
                  {error}
                </motion.div>
              )}

              {/* Submit */}
              <motion.button
                type="submit"
                className="w-full bg-linear-to-r from-blue-500 to-blue-600 text-white py-3 px-4 rounded-xl font-medium hover:from-blue-600 hover:to-blue-700 transition duration-300 relative overflow-hidden disabled:opacity-60 disabled:cursor-not-allowed"
                whileHover={{ scale: isLoading ? 1 : 1.02 }}
                whileTap={{ scale: isLoading ? 1 : 0.98 }}
                disabled={isLoading || !username.trim() || !password}
              >
                {isLoading ? (
                  <>
                    <span className="absolute inset-0 flex items-center justify-center">
                      <Loader2 className="animate-spin h-5 w-5" />
                    </span>
                    <span className="opacity-0">Login</span>
                  </>
                ) : (
                  <motion.span
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                  >
                    Login
                  </motion.span>
                )}
              </motion.button>

              <motion.div
                className="text-center pt-4"
                whileHover={{ scale: 1.05 }}
              >
                <Link
                  href="/"
                  className="text-blue-600 hover:text-blue-800 text-sm font-medium inline-flex items-center gap-1 transition-colors"
                >
                  <span>Kembali ke beranda</span>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="m9 18 6-6-6-6" />
                  </svg>
                </Link>
              </motion.div>
            </form>
          </motion.div>
        </motion.div>

        <motion.p
          className="mt-8 text-xs text-gray-400"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
        >
          © {new Date().getFullYear()} Pay Wise. All rights reserved.
        </motion.p>
      </div>
    </div>
  );
}

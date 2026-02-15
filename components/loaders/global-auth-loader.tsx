// components/global-auth-loader.tsx

"use client";

import { Loader2 } from "lucide-react";
import { useAuth } from "@/lib/auth/auth-context";
import { motion, AnimatePresence } from "framer-motion";

export default function GlobalAuthLoader() {
  const { isLoggingIn } = useAuth();

  return (
    <AnimatePresence>
      {isLoggingIn && (
        <motion.div
          className="fixed inset-0 z-9999 flex items-center justify-center bg-white/70 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
        >
          <div className="flex flex-col items-center gap-3">
            <Loader2 className="h-10 w-10 animate-spin text-blue-600" />
            <p className="text-sm text-gray-600">Memuat dashboard...</p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

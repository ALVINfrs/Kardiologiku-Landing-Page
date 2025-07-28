"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Heart } from "lucide-react";

const LoadingScreen = () => {
  const [themeReady, setThemeReady] = useState(false);

  useEffect(() => {
    // Logika untuk menerapkan tema yang tersimpan (light/dark)
    const savedTheme = localStorage.getItem("theme") || "light";
    if (savedTheme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
    setThemeReady(true);
  }, []);

  // Mencegah flash of unstyled content
  if (!themeReady) return null;

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-50 to-rose-100 dark:from-slate-900 dark:to-slate-800 px-4">
      <motion.div
        className="relative flex flex-col items-center justify-center w-full max-w-md"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
      >
        {/* Centerpiece: Jantung & EKG */}
        <div className="relative w-72 h-72 flex items-center justify-center">
          {/* Cincin cahaya (Glow ring) */}
          <motion.div
            className="absolute w-72 h-72 bg-red-200 dark:bg-red-900/50 rounded-full blur-2xl"
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
          />

          {/* Cincin garis (Outline ring) */}
          <div className="absolute w-80 h-80 border-4 border-white/50 dark:border-slate-500/50 rounded-full" />

          {/* Jantung yang berdetak */}
          <motion.div
            animate={{ scale: [1, 1.05, 1] }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          >
            <Heart className="h-32 w-32 text-red-500 dark:text-red-600 fill-current" />
          </motion.div>

          {/* Garis EKG */}
          <svg
            className="absolute w-full h-auto text-red-400 dark:text-red-500"
            viewBox="0 0 200 100"
          >
            <motion.path
              d="M 0 50 L 40 50 L 45 40 L 55 60 L 60 50 L 70 55 L 75 50 L 115 50 L 120 40 L 130 60 L 135 50 L 145 55 L 150 50 L 200 50"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "linear",
              }}
            />
          </svg>
        </div>

        {/* --- Teks yang Disederhanakan --- */}
        <motion.div
          className="mt-12 text-center"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <p className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">
            Memuat Kardiologiku
          </p>
          <p className="text-base text-gray-600 dark:text-gray-400 mt-3">
            Mohon tunggu sebentar...
          </p>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default LoadingScreen;

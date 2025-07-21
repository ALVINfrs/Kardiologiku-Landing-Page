"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Heart } from "lucide-react";

const LoadingScreen = () => {
  const [themeReady, setThemeReady] = useState(false);

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme") || "light";
    if (savedTheme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
    setThemeReady(true);
  }, []);

  if (!themeReady) return null;

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-50 to-rose-100 dark:from-slate-900 dark:to-slate-800 px-4">
      <motion.div
        className="relative flex flex-col items-center justify-center w-full max-w-md"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6 }}
      >
        {/* Complex Heart & EKG Centerpiece */}
        <div className="relative w-72 h-72 flex items-center justify-center">
          {/* Glow ring */}
          <motion.div
            className="absolute w-72 h-72 bg-red-200 dark:bg-red-900/50 rounded-full blur-2xl"
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ duration: 3, repeat: Infinity }}
          />

          {/* Outline ring */}
          <div className="absolute w-80 h-80 border-4 border-white/50 dark:border-slate-500/50 rounded-full" />

          {/* Beating Heart */}
          <motion.div
            animate={{ scale: [1, 1.05, 1] }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          >
            <Heart className="h-32 w-32 text-red-500 dark:text-red-600 fill-red-500/30 dark:fill-red-500/20" />
          </motion.div>

          {/* EKG Path */}
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
              initial={{ strokeDasharray: 500, strokeDashoffset: 500 }}
              animate={{ strokeDashoffset: [500, 0] }}
              transition={{
                duration: 2.5,
                repeat: Infinity,
                ease: "linear",
              }}
            />
          </svg>
        </div>

        {/* Text - Fade In Staggered */}
        <motion.div
          className="mt-10 text-center"
          initial="hidden"
          animate="visible"
          variants={{
            hidden: {},
            visible: {
              transition: {
                staggerChildren: 0.4,
              },
            },
          }}
        >
          <motion.p
            className="text-xl md:text-2xl font-bold text-gray-900 dark:text-white"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            Menganalisis Kondisi Kardiovaskular...
          </motion.p>

          <motion.p
            className="text-sm text-gray-600 dark:text-gray-400 mt-3"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.6 }}
          >
            Inisialisasi protokol diagnostik tingkat lanjut. Harap bersabar.
          </motion.p>

          <motion.p
            className="text-sm text-gray-500 dark:text-gray-400 mt-4 italic"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 0.6 }}
          >
            Mohon tunggu, kami sedang memuat pengalaman terbaik untuk Anda.
          </motion.p>
          <motion.p
            className="text-base font-medium text-gray-700 dark:text-gray-300 mt-6"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.5, duration: 0.6 }}
          >
            Memuat sistem pemantauan kardiovaskular tingkat lanjut...
          </motion.p>

          <motion.p
            className="text-sm text-gray-600 dark:text-gray-400 mt-2"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 2, duration: 0.6 }}
          >
            Sinkronisasi modul klinis dan analisis irama jantung.
          </motion.p>

          <motion.p
            className="text-sm text-gray-500 dark:text-gray-400 mt-2"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 2.5, duration: 0.6 }}
          >
            Menyiapkan antarmuka interaktif dan animasi EKG real-time...
          </motion.p>

          <motion.p
            className="text-sm text-gray-500 dark:text-gray-400 mt-4 italic"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 3, duration: 0.6 }}
          >
            Terima kasih atas kesabaran Anda. Kami sedang menyiapkan pengalaman
            terbaik untuk Anda.
          </motion.p>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default LoadingScreen;

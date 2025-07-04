import type { ReactNode } from "react";
import { Heart, Activity, Thermometer, Droplets } from "lucide-react";
import { motion } from "framer-motion";

// KOMPONEN LOKAL: StatPill versi mini, khusus untuk MobileHeroVisual
// Didesain lebih kecil dan ringkas untuk layar sempit.
interface StatPillProps {
  icon: ReactNode;
  label: string;
  value: string;
  position: string; // Tailwind class untuk posisi absolut
  delay?: number;
}

const StatPill = ({
  icon,
  label,
  value,
  position,
  delay = 0,
}: StatPillProps) => (
  <motion.div
    className={`absolute flex items-center gap-1.5 p-1 px-2 rounded-full bg-white/80 backdrop-blur-sm shadow-md ${position}`}
    initial={{ opacity: 0, scale: 0.5 }}
    animate={{ opacity: 1, scale: 1 }}
    transition={{
      type: "spring",
      damping: 15,
      stiffness: 300,
      delay: 0.5 + delay, // Delay disesuaikan untuk mobile
    }}
  >
    {icon}
    <div>
      <p className="text-[8px] font-medium text-red-900 leading-tight">
        {label}
      </p>
      <p className="text-[10px] font-bold text-red-600 leading-tight">
        {value}
      </p>
    </div>
  </motion.div>
);

// KOMPONEN UTAMA: MobileHeroVisual yang sudah di-upgrade
const MobileHeroVisual = () => {
  return (
    <div className="relative w-full h-full bg-gradient-to-br from-red-50 to-rose-100 p-3 flex flex-col justify-between overflow-hidden">
      {/* === Bagian Atas: Judul === */}
      <motion.div
        className="flex justify-between items-center"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="font-bold text-base text-gray-800">Live Monitor</h1>
        <div className="flex items-center gap-1.5">
          <p className="text-xs font-semibold text-green-600">Active</p>
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
        </div>
      </motion.div>

      {/* === Bagian Tengah: Visual Jantung & Data === */}
      <motion.div
        className="relative flex-grow flex items-center justify-center my-2"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ type: "spring", delay: 0.2, duration: 0.8 }}
      >
        {/* Background Shape */}
        <div className="absolute w-28 h-28 bg-red-200 rounded-full blur-xl animate-pulse"></div>

        {/* Jantung Utama */}
        <motion.div
          animate={{ scale: [1, 1.05, 1] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
        >
          <Heart className="h-20 w-20 text-red-500 fill-red-500/30" />
        </motion.div>

        {/* Animasi Garis EKG */}
        <svg
          className="absolute w-[110%] h-auto text-red-400"
          viewBox="0 0 200 100"
        >
          <motion.path
            d="M 0 50 L 40 50 L 45 40 L 55 60 L 60 50 L 70 55 L 75 50 L 115 50 L 120 40 L 130 60 L 135 50 L 145 55 L 150 50 L 200 50"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            initial={{ strokeDasharray: 500, strokeDashoffset: 500 }}
            animate={{ strokeDashoffset: [500, 0] }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "linear",
              delay: 1,
            }}
          />
        </svg>

        {/* Pills Data Statistik (posisi disesuaikan untuk mobile) */}
        <StatPill
          icon={<Activity className="w-3.5 h-3.5 text-red-500" />}
          label="BPM"
          value="82"
          position="top-[15%] left-[10%]"
          delay={0.2}
        />
        <StatPill
          icon={<Droplets className="w-3.5 h-3.5 text-green-500" />}
          label="SpO2"
          value="98%"
          position="top-[45%] -right-[5%]"
          delay={0.4}
        />
        <StatPill
          icon={<Thermometer className="w-3.5 h-3.5 text-blue-500" />}
          label="Suhu"
          value="36.5°C"
          position="bottom-[20%] -left-[5%]"
          delay={0.6}
        />
        <StatPill
          icon={<Heart className="w-3.5 h-3.5 text-purple-500" />}
          label="Status"
          value="Stabil"
          position="bottom-[5%] right-[10%]"
          delay={0.8}
        />
      </motion.div>

      {/* === Bagian Bawah: Tombol Aksi (Disederhanakan) === */}
      <motion.div
        className="w-full text-center text-xs font-bold text-red-600 bg-white/50 py-1.5 rounded-md"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 1 }}
      >
        View Full Report
      </motion.div>
    </div>
  );
};

export default MobileHeroVisual;

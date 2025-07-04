import { Heart, Activity, Thermometer, Droplets } from "lucide-react";
import type { ReactNode } from "react";
import { motion } from "framer-motion";

// Interface untuk mendefinisikan tipe props StatPill
interface StatPillProps {
  icon: ReactNode;
  label: string;
  value: string;
  position: string;
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
    className={`absolute flex items-center gap-2 p-2 px-3 rounded-full bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm shadow-lg ${position}`}
    initial={{ opacity: 0, scale: 0.5 }}
    animate={{ opacity: 1, scale: 1 }}
    transition={{
      type: "spring",
      damping: 15,
      stiffness: 300,
      delay: 0.5 + delay,
    }}
  >
    {icon}
    <div>
      <p className="text-xs text-red-900 dark:text-rose-200">{label}</p>
      <p className="text-sm font-bold text-red-600 dark:text-rose-400">
        {value}
      </p>
    </div>
  </motion.div>
);

const HeroVisual = () => {
  return (
    <div className="relative flex items-center justify-center w-full h-full bg-gradient-to-br from-red-50 to-rose-100 dark:from-red-950/20 dark:to-rose-950/20">
      {/* Background Shape */}
      <div className="absolute w-3/4 h-3/4 bg-red-200 dark:bg-red-900/50 rounded-full blur-2xl animate-pulse"></div>
      <div className="absolute w-[85%] h-[85%] border-2 sm:border-4 border-white/50 dark:border-white/20 rounded-full"></div>

      {/* Jantung Utama */}
      <motion.div
        animate={{ scale: [1, 1.05, 1] }}
        transition={{
          duration: 1.5,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      >
        <Heart className="h-2/5 w-2/5 text-red-500 fill-red-500/30" />
      </motion.div>

      {/* Animasi Garis EKG */}
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
            duration: 2,
            repeat: Infinity,
            ease: "linear",
            delay: 0.5,
          }}
        />
      </svg>

      {/* Pills Data Statistik - Disesuaikan untuk skala kecil */}
      <div className="transform scale-[0.6] sm:scale-75 md:scale-100">
        <StatPill
          icon={<Activity className="w-5 h-5 text-red-500" />}
          label="BPM"
          value="82"
          position="-top-4 left-8"
          delay={0.2}
        />
        <StatPill
          icon={<Thermometer className="w-5 h-5 text-blue-500" />}
          label="Suhu"
          value="36.5°C"
          position="top-24 -left-12"
          delay={0.4}
        />
        <StatPill
          icon={<Droplets className="w-5 h-5 text-green-500" />}
          label="SpO2"
          value="98%"
          position="top-12 -right-10"
          delay={0.6}
        />
        <StatPill
          icon={<Heart className="w-5 h-5 text-purple-500" />}
          label="Status"
          value="Stabil"
          position="-bottom-2 right-8"
          delay={0.8}
        />
      </div>
    </div>
  );
};

export default HeroVisual;

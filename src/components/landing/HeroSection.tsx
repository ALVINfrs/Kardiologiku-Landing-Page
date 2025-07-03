import { Button } from "@/components/ui/button";
import { Heart, Activity, Thermometer, Droplets } from "lucide-react";
// FIX: Tambahkan keyword 'type' untuk impor tipe data
import { motion, type Variants } from "framer-motion";
import type { ReactNode } from "react";

// Varian animasi untuk elemen yang muncul satu per satu
const sectionVariants: Variants = {
  hidden: { opacity: 0, y: 50 },
  visible: (i: number = 1) => ({
    opacity: 1,
    y: 0,
    transition: {
      type: "spring",
      damping: 15,
      stiffness: 100,
      delay: i * 0.2,
    },
  }),
};

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
    className={`absolute flex items-center gap-2 p-2 px-3 rounded-full bg-white/70 backdrop-blur-sm shadow-lg ${position}`}
    initial={{ opacity: 0, scale: 0.5 }}
    animate={{ opacity: 1, scale: 1 }}
    transition={{
      type: "spring",
      damping: 15,
      stiffness: 300,
      delay: 1 + delay,
    }}
  >
    {icon}
    <div>
      <p className="text-xs text-red-900">{label}</p>
      <p className="text-sm font-bold text-red-600">{value}</p>
    </div>
  </motion.div>
);

const HeroSection = () => {
  return (
    <section
      id="beranda"
      className="relative bg-gradient-to-br from-red-50 to-rose-100 py-24 md:py-32 overflow-hidden"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* === Kolom Kiri: Teks & Tombol === */}
          <div className="z-10">
            <motion.h1
              className="text-4xl md:text-6xl font-extrabold text-gray-900 mb-6 !leading-tight"
              custom={1}
              variants={sectionVariants}
              initial="hidden"
              animate="visible"
            >
              Kenali & Atasi <span className="text-red-600">Aritmia</span> Sejak
              Dini
            </motion.h1>
            <motion.p
              className="text-lg text-gray-600 mb-8 leading-relaxed"
              custom={2}
              variants={sectionVariants}
              initial="hidden"
              animate="visible"
            >
              Platform edukasi dan konsultasi terpercaya untuk memahami gangguan
              irama jantung. Dapatkan informasi lengkap, konsultasi dengan
              dokter spesialis, dan panduan perawatan yang tepat.
            </motion.p>
            <motion.div
              className="flex flex-col sm:flex-row gap-4"
              custom={3}
              variants={sectionVariants}
              initial="hidden"
              animate="visible"
            >
              <Button
                size="lg"
                className="bg-red-600 hover:bg-red-700 shadow-lg shadow-red-500/30 transform hover:scale-105 transition-transform duration-300"
              >
                <Heart className="mr-2 h-5 w-5" />
                Mulai Konsultasi
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border-red-600 text-red-600 hover:bg-red-50 hover:text-red-700 border-2"
              >
                Pelajari Lebih Lanjut
              </Button>
            </motion.div>
          </div>

          {/* === Kolom Kanan: Visual Animasi Monitoring Jantung === */}
          <motion.div
            className="relative flex items-center justify-center h-full min-h-[400px]"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ type: "spring", delay: 0.5, duration: 1 }}
          >
            {/* Background Shape */}
            <div className="absolute w-72 h-72 bg-red-200 rounded-full blur-2xl animate-pulse"></div>
            <div className="absolute w-80 h-80 border-4 border-white/50 rounded-full"></div>

            {/* Jantung Utama */}
            <motion.div
              animate={{ scale: [1, 1.05, 1] }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            >
              <Heart className="h-40 w-40 text-red-500 fill-red-500/30" />
            </motion.div>

            {/* Animasi Garis EKG */}
            <svg
              className="absolute w-full h-auto text-red-400"
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
                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
              />
            </svg>

            {/* Pills Data Statistik */}
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
              position="top-24 -left-8"
              delay={0.4}
            />
            <StatPill
              icon={<Droplets className="w-5 h-5 text-green-500" />}
              label="SpO2"
              value="98%"
              position="top-12 -right-6"
              delay={0.6}
            />
            <StatPill
              icon={<Heart className="w-5 h-5 text-purple-500" />}
              label="Status"
              value="Stabil"
              position="-bottom-2 right-8"
              delay={0.8}
            />
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;

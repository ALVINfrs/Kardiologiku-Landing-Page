import React, { useState, useEffect, type ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { Heart, Activity, Thermometer, Droplets, Zap } from "lucide-react";
import { motion, AnimatePresence, type Variants } from "framer-motion";

// --- Tipe Data yang Lebih Kompleks ---
type HeartStatus = "Stabil" | "Takikardia Ringan" | "Bradikardia Ringan";

interface VitalSigns {
  bpm: number;
  spo2: number;
  temp: number;
  status: HeartStatus;
}

// --- Komponen Vitals (StatPill) yang Disempurnakan ---
interface StatPillProps {
  icon: ReactNode;
  label: string;
  value: string | number;
  unit?: string;
  colorClass: string;
  position: string;
  delay: number;
}

const StatPill: React.FC<StatPillProps> = ({
  icon,
  label,
  value,
  unit,
  colorClass,
  position,
  delay,
}) => (
  <motion.div
    className={`absolute flex items-center gap-3 p-3 px-4 rounded-full bg-white/80 dark:bg-slate-800/50 backdrop-blur-md shadow-xl ${position}`}
    initial={{ opacity: 0, scale: 0.5 }}
    animate={{ opacity: 1, scale: 1 }}
    transition={{
      type: "spring",
      damping: 15,
      stiffness: 200,
      delay: 1 + delay,
    }}
  >
    <div className={`p-2 rounded-full ${colorClass}`}>{icon}</div>
    <div>
      <p className="text-xs text-gray-600 dark:text-gray-400 font-semibold">
        {label}
      </p>
      <p className="text-lg font-bold text-gray-900 dark:text-white">
        {value}{" "}
        <span className="text-sm font-medium text-gray-500">{unit}</span>
      </p>
    </div>
  </motion.div>
);

// --- Komponen Utama HeroSection ---
const HeroSection = () => {
  const [vitals, setVitals] = useState<VitalSigns>({
    bpm: 82,
    spo2: 98,
    temp: 36.5,
    status: "Stabil",
  });

  // Simulasi Vitals Real-time
  useEffect(() => {
    const interval = setInterval(() => {
      setVitals((prevVitals) => {
        const bpmFluctuation = Math.floor(Math.random() * 5) - 2; // -2 to +2
        const newBpm = prevVitals.bpm + bpmFluctuation;
        let newStatus: HeartStatus = "Stabil";

        if (newBpm > 100) newStatus = "Takikardia Ringan";
        else if (newBpm < 60) newStatus = "Bradikardia Ringan";

        return {
          ...prevVitals,
          bpm: newBpm,
          spo2: 97 + Math.random(),
          status: newStatus,
        };
      });
    }, 2000); // Update setiap 2 detik

    return () => clearInterval(interval);
  }, []);

  const simulateStress = () => {
    setVitals((prev) => ({ ...prev, bpm: 115, status: "Takikardia Ringan" }));
    setTimeout(
      () => setVitals((prev) => ({ ...prev, bpm: 85, status: "Stabil" })),
      5000
    );
  };

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

  return (
    <section
      id="beranda"
      className="relative bg-gradient-to-br from-red-50 to-rose-100 dark:from-slate-900 dark:to-slate-800 py-24 md:py-32 overflow-hidden"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Kolom Kiri: Teks & Tombol */}
          <div className="z-10">
            <motion.h1
              className="text-4xl md:text-6xl font-extrabold text-gray-900 dark:text-white mb-6 !leading-tight"
              custom={1}
              variants={sectionVariants}
              initial="hidden"
              animate="visible"
            >
              Kenali & Atasi <span className="text-red-600">Aritmia</span> Sejak
              Dini
            </motion.h1>
            <motion.p
              className="text-lg text-gray-600 dark:text-gray-300 mb-8 leading-relaxed"
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
                <Heart className="mr-2 h-5 w-5" /> Mulai Konsultasi
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border-red-600 text-red-600 hover:bg-red-50 dark:text-red-400 dark:border-red-400 dark:hover:bg-red-900/20 dark:hover:text-red-300 border-2"
              >
                Pelajari Lebih Lanjut
              </Button>
            </motion.div>
          </div>

          {/* Kolom Kanan: Visual Animasi Monitoring Jantung */}
          <motion.div
            className="relative flex items-center justify-center h-full min-h-[450px]"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ type: "spring", delay: 0.5, duration: 1 }}
          >
            {/* Background Shape & Pulse */}
            <motion.div
              className="absolute w-72 h-72 bg-red-200 dark:bg-red-900/50 rounded-full blur-2xl"
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ duration: 60 / vitals.bpm, repeat: Infinity }}
            />
            <div className="absolute w-80 h-80 border-4 border-white/50 dark:border-slate-500/50 rounded-full"></div>

            {/* Jantung Utama */}
            <motion.div
              animate={{ scale: [1, 1.05, 1] }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            >
              <Heart className="h-40 w-40 text-red-500 dark:text-red-600 fill-red-500/30 dark:fill-red-500/20" />
            </motion.div>

            {/* Animasi Garis EKG yang Responsif */}
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
                  duration: 40 / vitals.bpm,
                  repeat: Infinity,
                  ease: "linear",
                }}
              />
            </svg>

            {/* Pills Data Statistik Dinamis */}
            <AnimatePresence>
              <StatPill
                icon={<Activity className="w-5 h-5 text-red-800" />}
                label="Denyut Nadi"
                value={Math.round(vitals.bpm)}
                unit="BPM"
                colorClass="bg-red-200 dark:bg-red-900"
                position="-top-5 left-10"
                delay={0.2}
              />
              <StatPill
                icon={<Droplets className="w-5 h-5 text-green-800" />}
                label="Saturasi O2"
                value={vitals.spo2.toFixed(1)}
                unit="%"
                colorClass="bg-green-200 dark:bg-green-900"
                position="top-16 -right-8"
                delay={0.4}
              />
              <StatPill
                icon={<Thermometer className="w-5 h-5 text-blue-800" />}
                label="Suhu Tubuh"
                value={vitals.temp}
                unit="°C"
                colorClass="bg-blue-200 dark:bg-blue-900"
                position="top-32 -left-12"
                delay={0.6}
              />
              <StatPill
                icon={<Heart className="w-5 h-5 text-purple-800" />}
                label="Status Jantung"
                value={vitals.status}
                colorClass={
                  vitals.status !== "Stabil"
                    ? "bg-orange-300 dark:bg-orange-700"
                    : "bg-purple-200 dark:bg-purple-900"
                }
                position="-bottom-5 right-10"
                delay={0.8}
              />
            </AnimatePresence>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1, transition: { delay: 2 } }}
              className="absolute bottom-0 -translate-y-1/2"
            >
              <Button size="sm" variant="secondary" onClick={simulateStress}>
                <Zap className="h-4 w-4 mr-2" />
                Simulasikan Stres
              </Button>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;

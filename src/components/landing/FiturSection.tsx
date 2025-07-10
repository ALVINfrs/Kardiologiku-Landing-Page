import { motion } from "framer-motion";
import {
  BookOpen,
  Stethoscope,
  Calendar,
  Bell,
  User,
  Activity,
} from "lucide-react";
import { BentoCard, BentoGrid } from "@/components/magicui/bento-grid";

// --- Komponen Detail Animasi (Tidak ada perubahan) ---
const EdukasiDetail = () => (
  <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
    <motion.div
      className="bg-blue-500 h-2.5 rounded-full"
      initial={{ width: "0%" }}
      whileInView={{ width: "65%" }}
      viewport={{ once: true }}
      transition={{ duration: 1, delay: 0.5, ease: "easeInOut" }}
    />
  </div>
);
const RiwayatDetail = () => (
  <div className="flex items-end h-12 space-x-1 w-full justify-center">
    <motion.div
      className="w-1/3 bg-purple-300"
      initial={{ height: "0%" }}
      whileInView={{ height: "40%" }}
      viewport={{ once: true }}
      transition={{ duration: 0.7, delay: 0.5, type: "spring" }}
    />
    <motion.div
      className="w-1/3 bg-purple-400"
      initial={{ height: "0%" }}
      whileInView={{ height: "70%" }}
      viewport={{ once: true }}
      transition={{ duration: 0.7, delay: 0.7, type: "spring" }}
    />
    <motion.div
      className="w-1/3 bg-purple-500"
      initial={{ height: "0%" }}
      whileInView={{ height: "55%" }}
      viewport={{ once: true }}
      transition={{ duration: 0.7, delay: 0.9, type: "spring" }}
    />
  </div>
);
const MonitorDetail = () => (
  <svg className="w-full h-12" viewBox="0 0 100 20" preserveAspectRatio="none">
    <motion.path
      d="M 0 10 L 20 10 L 25 5 L 35 15 L 40 10 L 50 10 L 55 12 L 65 8 L 70 10 L 100 10"
      fill="none"
      stroke="#ef4444"
      strokeWidth="2"
      initial={{ pathLength: 0 }}
      animate={{ pathLength: 1 }}
      transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
    />
  </svg>
);
const KonsultasiDetail = () => (
  <div className="flex items-center space-x-1">
    <motion.span
      className="w-2 h-2 bg-green-400 rounded-full"
      animate={{ scale: [1, 1.2, 1] }}
      transition={{ duration: 1, repeat: Infinity }}
    />
    <span className="text-sm text-gray-500 dark:text-gray-400">
      Dokter online...
    </span>
  </div>
);
const JadwalDetail = () => (
  <div className="p-2 bg-gray-100 dark:bg-gray-800 rounded-md text-center">
    <p className="text-xs text-gray-500">Pemeriksaan Berikutnya</p>
    <p className="font-bold text-gray-800 dark:text-gray-200">Jumat, 12 Juli</p>
  </div>
);
const PengingatDetail = () => (
  <motion.div
    whileHover={{ rotate: [0, 15, -15, 0] }}
    transition={{ duration: 0.5 }}
  >
    <Bell className="text-yellow-500 h-8 w-8" />
  </motion.div>
);

// --- Struktur Data Fitur untuk Bento Grid ---
const features = [
  {
    Icon: BookOpen,
    name: "Edukasi Interaktif",
    description: "Modul pembelajaran dengan visualisasi, kuis, dan gamifikasi.",
    href: "#",
    cta: "Mulai Belajar",
    background: (
      <motion.div className="absolute -bottom-20 -right-10 w-40 h-40 bg-blue-500/20 rounded-full blur-2xl" />
    ),
    className: "lg:col-start-1 lg:col-end-2 lg:row-start-1 lg:row-end-3",
    detailComponent: <EdukasiDetail />,
  },
  {
    Icon: Stethoscope,
    name: "Konsultasi Online",
    description: "Konsultasi langsung dengan dokter spesialis jantung.",
    href: "#",
    cta: "Jadwalkan Konsultasi",
    background: (
      <motion.div className="absolute -bottom-20 -right-10 w-40 h-40 bg-green-500/20 rounded-full blur-2xl" />
    ),
    className: "lg:col-start-2 lg:col-end-3 lg:row-start-1 lg:row-end-2",
    detailComponent: <KonsultasiDetail />,
  },
  {
    Icon: Calendar,
    name: "Jadwal Pemeriksaan",
    description: "Booking online untuk jadwal kontrol rutin Anda.",
    href: "#",
    cta: "Buat Janji Temu",
    background: (
      <motion.div className="absolute -bottom-20 -right-10 w-40 h-40 bg-indigo-500/20 rounded-full blur-2xl" />
    ),
    className: "lg:col-start-2 lg:col-end-3 lg:row-start-2 lg:row-end-3",
    detailComponent: <JadwalDetail />,
  },
  {
    Icon: User,
    name: "Riwayat Pasien",
    description: "Akses lengkap riwayat medis dan hasil lab Anda.",
    href: "#",
    cta: "Lihat Riwayat Medis",
    background: (
      <motion.div className="absolute -bottom-20 -right-10 w-40 h-40 bg-purple-500/20 rounded-full blur-2xl" />
    ),
    className: "lg:col-start-3 lg:col-end-4 lg:row-start-1 lg:row-end-2",
    detailComponent: <RiwayatDetail />,
  },
  {
    Icon: Activity,
    name: "Monitor Real-time",
    description: "Pantau detak jantung via perangkat wearable.",
    href: "#",
    cta: "Hubungkan Perangkat",
    background: (
      <motion.div className="absolute -bottom-20 -right-10 w-40 h-40 bg-red-500/20 rounded-full blur-2xl" />
    ),
    className: "lg:col-start-3 lg:col-end-4 lg:row-start-2 lg:row-end-3",
    detailComponent: <MonitorDetail />,
  },
  {
    Icon: Bell,
    name: "Pengingat Obat Cerdas",
    description: "Notifikasi otomatis agar Anda tidak lupa minum obat.",
    href: "#",
    cta: "Atur Jadwal Obat",
    background: (
      <motion.div className="absolute -bottom-20 -right-10 w-40 h-40 bg-yellow-500/20 rounded-full blur-2xl" />
    ),
    className: "lg:col-start-1 lg:col-end-4 lg:row-start-3 lg:row-end-4",
    detailComponent: <PengingatDetail />,
  },
];

// --- Komponen Utama dengan Bento Grid ---
const FiturSection = () => {
  return (
    <section id="fitur" className="py-24 sm:py-32 bg-gray-50 dark:bg-black">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4 sm:text-5xl">
            Satu Platform, Semua Kebutuhan Jantung Anda
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
            Dari edukasi mendalam hingga pemantauan real-time, kami menyediakan
            semua yang Anda butuhkan dalam satu genggaman.
          </p>
        </div>

        <BentoGrid className="lg:grid-rows-3">
          {features.map((feature) => (
            <BentoCard key={feature.name} {...feature}>
              <div className="flex flex-col justify-between h-full p-6">
                <div className="mb-4">
                  <motion.div
                    whileHover={{ scale: 1.2, rotate: -15 }}
                    className="w-16 h-16 rounded-2xl flex items-center justify-center mb-4 bg-white dark:bg-gray-800 shadow-md"
                  >
                    <feature.Icon className="h-8 w-8 text-gray-600 dark:text-gray-300" />
                  </motion.div>
                  <h3 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">
                    {feature.name}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    {feature.description}
                  </p>
                </div>
                <div className="h-12 flex items-center justify-center mt-auto">
                  {feature.detailComponent}
                </div>
              </div>
            </BentoCard>
          ))}
        </BentoGrid>
      </div>
    </section>
  );
};

export default FiturSection;

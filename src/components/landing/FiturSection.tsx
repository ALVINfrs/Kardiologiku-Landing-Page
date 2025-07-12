import { useState, useEffect, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import {
  BookOpen,
  Stethoscope,
  Calendar,
  Bell,
  User,
  Activity,
  ChevronRight,
  TrendingUp,
  Users,
  Video,
} from "lucide-react";

// --- Komponen Detail (Tidak ada perubahan di sini) ---
const EdukasiDetail = () => (
  <div className="w-full bg-gray-200 rounded-full h-2.5">
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
      animate={{ scale: [1, 1.2, 1], opacity: [0.7, 1, 0.7] }}
      transition={{ duration: 1, repeat: Infinity }}
    />
    <span className="text-sm text-gray-500">Dokter sedang online...</span>
  </div>
);
const JadwalDetail = () => (
  <div className="p-2 bg-gray-100 rounded-md text-center">
    <p className="text-xs text-gray-500">Pemeriksaan Berikutnya</p>
    <p className="font-bold text-gray-800">Jumat, 12 Juli</p>
  </div>
);
const PengingatDetail = () => (
  <div className="inline-block">
    <motion.div
      whileHover={{ rotate: [0, 15, -15, 15, 0] }}
      transition={{ duration: 0.5 }}
    >
      <Bell className="text-yellow-500" />
    </motion.div>
  </div>
);

// Interface dan data (Tidak ada perubahan)
interface Feature {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  description: string;
  color: "blue" | "green" | "indigo" | "yellow" | "purple" | "red";
  detailComponent: React.ReactNode;
  details: {
    stats: {
      icon: React.ComponentType<{ className?: string }>;
      value: string;
      label: string;
    }[];
    cta: string;
  };
}

const FiturSection = () => {
  const [flippedIndex, setFlippedIndex] = useState<number | null>(null);
  const cardsRef = useRef<(HTMLDivElement | null)[]>([]);

  const features: Feature[] = [
    {
      icon: BookOpen,
      title: "Edukasi Interaktif",
      description:
        "Modul pembelajaran lengkap dengan visualisasi yang mudah dipahami.",
      color: "blue",
      detailComponent: <EdukasiDetail />,
      details: {
        stats: [
          { icon: Video, value: "50+", label: "Video & Animasi" },
          { icon: Users, value: "10k+", label: "Pengguna Aktif" },
        ],
        cta: "Mulai Belajar",
      },
    },
    {
      icon: Stethoscope,
      title: "Konsultasi Online",
      description:
        "Konsultasi langsung dengan dokter spesialis jantung melalui video call.",
      color: "green",
      detailComponent: <KonsultasiDetail />,
      details: {
        stats: [
          { icon: Users, value: "25+", label: "Dokter Spesialis" },
          { icon: TrendingUp, value: "95%", label: "Kepuasan Pasien" },
        ],
        cta: "Jadwalkan Konsultasi",
      },
    },
    {
      icon: Calendar,
      title: "Jadwal Pemeriksaan",
      description:
        "Sistem booking online untuk jadwal pemeriksaan dan kontrol rutin.",
      color: "indigo",
      detailComponent: <JadwalDetail />,
      details: {
        stats: [
          { icon: Calendar, value: "24/7", label: "Booking Online" },
          { icon: Bell, value: "H-1", label: "Notifikasi Cerdas" },
        ],
        cta: "Buat Janji Temu",
      },
    },
    {
      icon: User,
      title: "Riwayat Pasien",
      description:
        "Akses lengkap riwayat medis, hasil lab, dan perkembangan kesehatan.",
      color: "purple",
      detailComponent: <RiwayatDetail />,
      details: {
        stats: [
          { icon: TrendingUp, value: "Real-time", label: "Update Data" },
          { icon: Users, value: "Aman", label: "Enkripsi Data" },
        ],
        cta: "Lihat Riwayat Medis",
      },
    },
    {
      icon: Activity,
      title: "Monitor Real-time",
      description:
        "Pantau detak jantung dan aktivitas dengan integrasi perangkat wearable.",
      color: "red",
      detailComponent: <MonitorDetail />,
      details: {
        stats: [
          { icon: Activity, value: "24 jam", label: "Pemantauan" },
          { icon: Bell, value: "Cerdas", label: "Peringatan Dini" },
        ],
        cta: "Hubungkan Perangkat",
      },
    },
    {
      icon: Bell,
      title: "Pengingat Obat",
      description:
        "Notifikasi otomatis untuk membantu Anda tidak lupa minum obat.",
      color: "yellow",
      detailComponent: <PengingatDetail />,
      details: {
        stats: [
          { icon: Bell, value: "Cerdas", label: "Notifikasi" },
          { icon: TrendingUp, value: "99%", label: "Tingkat Kepatuhan" },
        ],
        cta: "Atur Jadwal Obat",
      },
    },
  ];

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        flippedIndex !== null &&
        cardsRef.current[flippedIndex] &&
        !cardsRef.current[flippedIndex]?.contains(event.target as Node)
      ) {
        setFlippedIndex(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [flippedIndex]);

  const colorMap: Record<
    Feature["color"],
    { base: string; text: string; button: string }
  > = {
    blue: {
      base: "bg-blue-100",
      text: "text-blue-600",
      button: "bg-blue-500 hover:bg-blue-600",
    },
    green: {
      base: "bg-green-100",
      text: "text-green-600",
      button: "bg-green-500 hover:bg-green-600",
    },
    indigo: {
      base: "bg-indigo-100",
      text: "text-indigo-600",
      button: "bg-indigo-500 hover:bg-indigo-600",
    },
    yellow: {
      base: "bg-yellow-100",
      text: "text-yellow-600",
      button: "bg-yellow-500 hover:bg-yellow-600",
    },
    purple: {
      base: "bg-purple-100",
      text: "text-purple-600",
      button: "bg-purple-500 hover:bg-purple-600",
    },
    red: {
      base: "bg-red-100",
      text: "text-red-600",
      button: "bg-red-500 hover:bg-red-600",
    },
  };

  return (
    <section
      id="fitur"
      className="py-20 bg-background text-foreground transition-colors"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-light-900 mb-4 sm:text-5xl">
            Fitur Unggulan
          </h2>
          <p className="text-xl text-light-600 max-w-3xl mx-auto">
            Platform interaktif untuk edukasi, konsultasi, dan pengelolaan
            kesehatan jantung Anda.
          </p>
        </div>

        <div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          style={{ perspective: "1200px" }}
        >
          {features.map((feature, index) => (
            // ✅ FIX: Bungkus dengan kurung kurawal {} agar return type menjadi void
            <div
              key={index}
              ref={(el) => {
                cardsRef.current[index] = el;
              }}
              onClick={() =>
                setFlippedIndex(flippedIndex === index ? null : index)
              }
              className="cursor-pointer"
            >
              <motion.div
                className="relative w-full h-[400px]"
                style={{ transformStyle: "preserve-3d" }}
                animate={{ rotateY: flippedIndex === index ? 180 : 0 }}
                transition={{ duration: 0.7, ease: "easeInOut" }}
              >
                <div
                  className="absolute w-full h-full"
                  style={{
                    backfaceVisibility: "hidden",
                    WebkitBackfaceVisibility: "hidden",
                  }}
                >
                  <Card className="h-full flex flex-col rounded-xl shadow-lg hover:shadow-2xl transition-shadow duration-300">
                    <CardHeader>
                      <div
                        className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-4 ${
                          colorMap[feature.color].base
                        }`}
                      >
                        <feature.icon
                          className={`h-8 w-8 ${colorMap[feature.color].text}`}
                        />
                      </div>
                      <CardTitle className="text-2xl text-foreground">
                        {feature.title}
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="flex-grow flex flex-col justify-between">
                      <p className="text-foreground mb-4">
                        {feature.description}
                      </p>
                      <div className="h-12 flex items-center justify-center">
                        {feature.detailComponent}
                      </div>
                    </CardContent>
                    <div className="p-6 pt-2 text-sm font-semibold flex items-center text-gray-500">
                      <span>Klik untuk detail</span>
                      <ChevronRight className="ml-1 h-4 w-4" />
                    </div>
                  </Card>
                </div>

                <div
                  className="absolute w-full h-full"
                  style={{
                    backfaceVisibility: "hidden",
                    WebkitBackfaceVisibility: "hidden",
                    transform: "rotateY(180deg)",
                  }}
                >
                  <Card
                    className={`h-full flex flex-col rounded-xl shadow-2xl ${
                      colorMap[feature.color].base
                    } p-6 justify-between`}
                  >
                    <div>
                      <CardTitle
                        className={`text-2xl ${
                          colorMap[feature.color].text
                        } mb-4`}
                      >
                        {feature.title}
                      </CardTitle>
                      <div className="space-y-4">
                        {feature.details.stats.map((stat) => (
                          <div key={stat.label} className="flex items-center">
                            <stat.icon
                              className={`h-6 w-6 mr-3 ${
                                colorMap[feature.color].text
                              }`}
                            />
                            <div>
                              <p
                                className={`font-bold text-lg ${
                                  colorMap[feature.color].text
                                }`}
                              >
                                {stat.value}
                              </p>
                              <p
                                className={`text-sm opacity-80 ${
                                  colorMap[feature.color].text
                                }`}
                              >
                                {stat.label}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                    <Button
                      className={`w-full text-white font-bold text-base mt-4 ${
                        colorMap[feature.color].button
                      }`}
                    >
                      {feature.details.cta}
                    </Button>
                  </Card>
                </div>
              </motion.div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FiturSection;

import React from "react"; // <-- PERBAIKAN 1: Menambahkan import React
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Zap,
  ZapOff,
  ShieldAlert,
  Heart,
  Activity,
  Stethoscope,
  AlertTriangle,
  RadioTower,
} from "lucide-react";

// DATA ARITMIA SUPER LENGKAP
const arrhythmiaData = [
  // Kategori: Takikardia
  {
    category: "Takikardia (Detak Cepat)",
    title: "Fibrilasi Atrium (AF)",
    subtitle: "Irama Kacau & Cepat",
    description:
      "Serambi jantung bergetar tidak teratur. Merupakan penyebab umum stroke jika tidak ditangani.",
    risk: "Sedang hingga Tinggi",
    icon: Stethoscope,
    color: "purple",
  },
  {
    category: "Takikardia (Detak Cepat)",
    title: "Takikardia Ventrikel (VT)",
    subtitle: "Sinyal Cepat dari Bilik",
    description:
      "Berasal dari bilik jantung. Dapat berkembang menjadi VF dan menyebabkan henti jantung mendadak.",
    risk: "Berbahaya",
    icon: AlertTriangle,
    color: "orange",
  },
  {
    category: "Takikardia (Detak Cepat)",
    title: "Fibrilasi Ventrikel (VF)",
    subtitle: "Getaran Mematikan",
    description:
      "Bilik jantung hanya bergetar tanpa memompa darah. Ini adalah darurat medis yang memerlukan CPR dan defibrilasi segera.",
    risk: "Sangat Berbahaya",
    icon: ShieldAlert,
    color: "red",
  },
  {
    category: "Takikardia (Detak Cepat)",
    title: "Inappropriate Sinus Tachycardia (IST)",
    subtitle: "Pacu Jantung Terlalu Aktif",
    description:
      "Detak jantung sinus (normal) yang terus-menerus lebih cepat dari 100 bpm tanpa pemicu yang jelas.",
    risk: "Rendah hingga Sedang",
    icon: Activity,
    color: "pink",
  },
  // Kategori: Bradikardia
  {
    category: "Bradikardia (Detak Lambat)",
    title: "Sick Sinus Syndrome",
    subtitle: "Pacu Jantung 'Lelah'",
    description:
      "Gangguan pada nodus sinus, menyebabkan irama bisa sangat lambat (bradycardia) atau bergantian cepat dan lambat.",
    risk: "Sedang",
    icon: ZapOff,
    color: "gray",
  },
  {
    category: "Bradikardia (Detak Lambat)",
    title: "Blok Jantung (AV Block)",
    subtitle: "Sinyal Terhambat",
    description:
      "Hambatan pada jalur listrik dari serambi ke bilik. Derajat lanjut memerlukan alat pacu jantung.",
    risk: "Sedang hingga Tinggi",
    icon: RadioTower,
    color: "teal",
  },
  // Kategori: Irama Ektopik
  {
    category: "Irama Ektopik (Denyut Tambahan)",
    title: "Premature Contractions (PVC/PAC)",
    subtitle: "Sensasi Jantung 'Melompat'",
    description:
      "Denyut ekstra dari serambi (PAC) atau bilik (PVC). Sangat umum dan seringkali tidak berbahaya pada jantung sehat.",
    risk: "Rendah",
    icon: Heart,
    color: "blue",
  },
  {
    category: "Irama Ektopik (Denyut Tambahan)",
    title: "Long QT Syndrome (LQTS)",
    subtitle: "Kelistrikan Berisiko",
    description:
      "Kelainan genetik di mana jantung butuh waktu lebih lama untuk 'mengisi ulang' setelah setiap detak, meningkatkan risiko VT/VF.",
    risk: "Tinggi",
    icon: Zap,
    color: "yellow",
  },
];

const categories = [...new Set(arrhythmiaData.map((item) => item.category))];

const RiskBadge = ({ risk }: { risk: string }) => {
  // <-- PERBAIKAN 2: Menghapus prop 'color' yang tidak terpakai
  const riskColorClass =
    risk === "Berbahaya" || risk === "Sangat Berbahaya"
      ? "bg-red-500"
      : risk === "Tinggi"
      ? "bg-orange-500"
      : risk === "Sedang"
      ? "bg-yellow-500"
      : "bg-green-500";
  return (
    <div
      className={`absolute top-3 right-3 text-xs font-bold text-white px-2 py-0.5 rounded-full ${riskColorClass}`}
    >
      {risk}
    </div>
  );
};

// PERBAIKAN 3: Menggunakan object mapping untuk kelas Tailwind agar aman saat proses build
const colorSchemes: {
  [key: string]: { bg: string; text: string; border: string; icon: string };
} = {
  purple: {
    bg: "bg-purple-100 dark:bg-purple-900/30",
    text: "text-purple-600 dark:text-purple-400",
    border: "hover:border-purple-500",
    icon: "text-purple-600",
  },
  orange: {
    bg: "bg-orange-100 dark:bg-orange-900/30",
    text: "text-orange-600 dark:text-orange-400",
    border: "hover:border-orange-500",
    icon: "text-orange-600",
  },
  red: {
    bg: "bg-red-100 dark:bg-red-900/30",
    text: "text-red-600 dark:text-red-400",
    border: "hover:border-red-500",
    icon: "text-red-600",
  },
  pink: {
    bg: "bg-pink-100 dark:bg-pink-900/30",
    text: "text-pink-600 dark:text-pink-400",
    border: "hover:border-pink-500",
    icon: "text-pink-600",
  },
  gray: {
    bg: "bg-gray-100 dark:bg-gray-700/30",
    text: "text-gray-600 dark:text-gray-400",
    border: "hover:border-gray-500",
    icon: "text-gray-600",
  },
  teal: {
    bg: "bg-teal-100 dark:bg-teal-900/30",
    text: "text-teal-600 dark:text-teal-400",
    border: "hover:border-teal-500",
    icon: "text-teal-600",
  },
  blue: {
    bg: "bg-blue-100 dark:bg-blue-900/30",
    text: "text-blue-600 dark:text-blue-400",
    border: "hover:border-blue-500",
    icon: "text-blue-600",
  },
  yellow: {
    bg: "bg-yellow-100 dark:bg-yellow-900/30",
    text: "text-yellow-600 dark:text-yellow-400",
    border: "hover:border-yellow-500",
    icon: "text-yellow-600",
  },
};

const TentangAritmiaSection = () => (
  <section id="tentang-aritmia" className="py-20 bg-gray-50 dark:bg-gray-900">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="text-center mb-16">
        <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
          Pusat Edukasi Aritmia
        </h2>
        <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
          Aritmia lebih dari sekadar detak cepat atau lambat. Kenali berbagai
          jenisnya untuk memahami kesehatan jantung Anda lebih dalam.
        </p>
      </div>

      {categories.map((category) => (
        <div key={category} className="mb-20">
          <div className="flex items-center mb-8 border-b-2 border-gray-200 dark:border-gray-700 pb-4">
            <h3 className="text-3xl font-bold text-gray-800 dark:text-gray-200">
              {category}
            </h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {arrhythmiaData
              .filter((item) => item.category === category)
              .map((aritmia) => {
                const scheme = colorSchemes[aritmia.color] || colorSchemes.gray;
                const IconComponent = aritmia.icon;
                return (
                  <Card
                    key={aritmia.title}
                    className={`relative overflow-hidden border-2 border-transparent ${scheme.border} dark:bg-gray-800 hover:shadow-2xl hover:-translate-y-2 transition-all duration-300`}
                  >
                    <RiskBadge risk={aritmia.risk} />
                    <CardHeader className="pt-8">
                      <div
                        className={`w-14 h-14 ${scheme.bg} rounded-lg flex items-center justify-center mb-4`}
                      >
                        <IconComponent className={`h-7 w-7 ${scheme.icon}`} />
                      </div>
                      <CardTitle className={`text-gray-900 dark:text-white`}>
                        {aritmia.title}
                      </CardTitle>
                      <p className={`text-sm font-semibold ${scheme.text}`}>
                        {aritmia.subtitle}
                      </p>
                    </CardHeader>
                    <CardContent>
                      <p className="text-gray-600 dark:text-gray-400 text-sm">
                        {aritmia.description}
                      </p>
                    </CardContent>
                  </Card>
                );
              })}
          </div>
        </div>
      ))}

      <div className="bg-red-50 dark:bg-red-900/20 rounded-2xl p-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
          <div>
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
              Gejala Umum yang Harus Diwaspadai
            </h3>
            <div className="space-y-4">
              {[
                "Palpitasi (sensasi jantung berdebar, melompat, atau berhenti sejenak)",
                "Sesak napas saat aktivitas ringan atau bahkan istirahat",
                "Nyeri atau rasa tidak nyaman di dada seperti ditekan",
                "Pusing, kepala terasa ringan, atau sensasi seperti akan pingsan",
                "Kelelahan ekstrem yang tidak dapat dijelaskan",
              ].map((gejala, idx) => (
                <div key={idx} className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-red-600 rounded-full mt-2 flex-shrink-0"></div>
                  <p className="text-gray-700 dark:text-gray-300">{gejala}</p>
                </div>
              ))}
            </div>
          </div>
          <div className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-lg text-center">
            <ShieldAlert className="h-16 w-16 text-red-600 mx-auto mb-4" />
            <h4 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              Deteksi Dini Adalah Kunci
            </h4>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Penanganan aritmia yang tepat waktu dapat mencegah komplikasi
              serius seperti stroke dan gagal jantung. Jangan abaikan gejalanya.
            </p>
            <Button
              size="lg"
              className="bg-red-600 hover:bg-red-700 dark:bg-red-500 dark:hover:bg-red-600"
            >
              Jadwalkan Konsultasi Sekarang
            </Button>
          </div>
        </div>
      </div>
    </div>
  </section>
);

export default TentangAritmiaSection;

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  BookOpen,
  Stethoscope,
  Calendar,
  Bell,
  User,
  Activity,
  ChevronRight,
} from "lucide-react";

const FiturSection = () => {
  const features = [
    {
      icon: BookOpen,
      title: "Edukasi Interaktif",
      description:
        "Modul pembelajaran lengkap tentang aritmia dengan animasi dan visualisasi yang mudah dipahami",
    },
    {
      icon: Stethoscope,
      title: "Konsultasi Online",
      description:
        "Konsultasi langsung dengan dokter spesialis jantung melalui video call atau chat",
    },
    {
      icon: Calendar,
      title: "Jadwal Pemeriksaan",
      description:
        "Sistem booking online untuk jadwal pemeriksaan dan kontrol rutin",
    },
    {
      icon: Bell,
      title: "Pengingat Obat",
      description:
        "Notifikasi otomatis untuk membantu Anda tidak lupa minum obat sesuai jadwal",
    },
    {
      icon: User,
      title: "Riwayat Pasien",
      description:
        "Akses lengkap ke riwayat medis, hasil pemeriksaan, dan perkembangan kesehatan",
    },
    {
      icon: Activity,
      title: "Monitor Real-time",
      description:
        "Pantau detak jantung dan aktivitas dengan integrasi perangkat wearable",
    },
  ];

  return (
    <section id="fitur" className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Fitur Unggulan
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Platform lengkap untuk edukasi, konsultasi, dan pengelolaan
            kesehatan jantung Anda
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <Card
              key={index}
              className="hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
            >
              <CardHeader>
                <div className="w-16 h-16 bg-red-100 rounded-2xl flex items-center justify-center mb-4">
                  <feature.icon className="h-8 w-8 text-red-600" />
                </div>
                <CardTitle className="text-xl">{feature.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">{feature.description}</p>
                <Button
                  variant="ghost"
                  className="mt-4 p-0 h-auto text-red-600 hover:text-red-700"
                >
                  Pelajari lebih lanjut{" "}
                  <ChevronRight className="ml-1 h-4 w-4" />
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FiturSection;

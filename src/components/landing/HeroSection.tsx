import { Button } from "@/components/ui/button";
import { Heart, Activity } from "lucide-react";

const HeroSection = () => (
  <section
    id="beranda"
    className="bg-gradient-to-br from-red-50 to-red-100 py-20"
  >
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        <div>
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
            Kenali & Atasi <span className="text-red-600">Aritmia</span> Lebih
            Awal
          </h1>
          <p className="text-xl text-gray-600 mb-8 leading-relaxed">
            Platform edukasi dan konsultasi terpercaya untuk memahami gangguan
            irama jantung. Dapatkan informasi lengkap, konsultasi dengan dokter
            spesialis, dan panduan perawatan yang tepat.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <Button size="lg" className="bg-red-600 hover:bg-red-700">
              <Heart className="mr-2 h-5 w-5" />
              Mulai Konsultasi
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="border-red-600 text-red-600 hover:bg-red-50"
            >
              Pelajari Lebih Lanjut
            </Button>
          </div>
        </div>

        <div className="relative">
          <div className="bg-white p-8 rounded-3xl shadow-2xl">
            <div className="flex justify-center mb-6">
              <div className="relative">
                <Heart className="h-32 w-32 text-red-600" />
                <div className="absolute -top-2 -right-2">
                  <Activity className="h-12 w-12 text-red-400 animate-pulse" />
                </div>
              </div>
            </div>
            <div className="text-center">
              <h3 className="text-2xl font-semibold text-gray-900 mb-2">
                Monitoring Real-time
              </h3>
              <p className="text-gray-600">
                Pantau irama jantung Anda dengan teknologi terdepan
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
);

export default HeroSection;

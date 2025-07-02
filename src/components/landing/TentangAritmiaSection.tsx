import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Activity, Heart, Stethoscope, Shield } from "lucide-react";

const TentangAritmiaSection = () => (
  <section id="tentang-aritmia" className="py-20 bg-white">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="text-center mb-16">
        <h2 className="text-4xl font-bold text-gray-900 mb-4">
          Apa itu Aritmia?
        </h2>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          Aritmia adalah gangguan irama jantung yang terjadi ketika jantung
          berdetak terlalu cepat, terlalu lambat, atau tidak teratur.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader>
            <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center mb-4">
              <Activity className="h-6 w-6 text-red-600" />
            </div>
            <CardTitle className="text-red-600">Takikardia</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600">
              Jantung berdetak lebih cepat dari normal (&gt;100 bpm saat
              istirahat). Dapat menyebabkan palpitasi, pusing, dan sesak napas.
            </p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader>
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
              <Heart className="h-6 w-6 text-blue-600" />
            </div>
            <CardTitle className="text-blue-600">Bradikardia</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600">
              Jantung berdetak lebih lambat dari normal (&lt;60 bpm). Dapat
              menyebabkan kelelahan, pusing, dan pingsan.
            </p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader>
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
              <Stethoscope className="h-6 w-6 text-purple-600" />
            </div>
            <CardTitle className="text-purple-600">Fibrilasi Atrium</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600">
              Irama jantung tidak teratur dan seringkali cepat. Merupakan jenis
              aritmia yang paling umum terjadi.
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="bg-red-50 rounded-2xl p-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
          <div>
            <h3 className="text-2xl font-bold text-gray-900 mb-6">
              Gejala Umum Aritmia
            </h3>
            <div className="space-y-4">
              {[
                "Palpitasi (jantung berdebar-debar)",
                "Sesak napas atau sulit bernapas",
                "Nyeri atau ketidaknyamanan di dada",
                "Pusing atau hampir pingsan",
                "Kelelahan yang tidak biasa",
              ].map((gejala, idx) => (
                <div key={idx} className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-red-600 rounded-full mt-2"></div>
                  <p className="text-gray-700">{gejala}</p>
                </div>
              ))}
            </div>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-lg">
            <div className="text-center">
              <Shield className="h-16 w-16 text-red-600 mx-auto mb-4" />
              <h4 className="text-xl font-semibold text-gray-900 mb-2">
                Deteksi Dini Sangat Penting
              </h4>
              <p className="text-gray-600 mb-4">
                Penanganan aritmia yang tepat waktu dapat mencegah komplikasi
                serius seperti stroke dan gagal jantung.
              </p>
              <Button className="bg-red-600 hover:bg-red-700">
                Konsultasi Sekarang
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
);

export default TentangAritmiaSection;

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Phone, Mail, Clock, MapPin, Heart } from "lucide-react";

const KontakFooterSection = () => (
  <>
    <section id="kontak" className="py-20 bg-red-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Hubungi Kami
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Siap membantu Anda 24/7 untuk pertanyaan dan konsultasi kesehatan
            jantung
          </p>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <div className="space-y-8">
            {/* Info Kontak */}
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
                    <Phone className="h-6 w-6 text-red-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">
                      Telepon
                    </h3>
                    <p className="text-gray-600">+62 21 1234 5678</p>
                    <p className="text-sm text-gray-500">
                      Layanan 24 jam untuk emergency
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
                    <Mail className="h-6 w-6 text-red-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">
                      Email
                    </h3>
                    <p className="text-gray-600">info@kardiologiku.com</p>
                    <p className="text-sm text-gray-500">
                      Respon dalam 1-2 jam kerja
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
                    <Clock className="h-6 w-6 text-red-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">
                      Jam Operasional
                    </h3>
                    <p className="text-gray-600">
                      Senin - Jumat: 08:00 - 20:00
                    </p>
                    <p className="text-gray-600">
                      Sabtu - Minggu: 09:00 - 17:00
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
                    <MapPin className="h-6 w-6 text-red-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">
                      Alamat
                    </h3>
                    <p className="text-gray-600">Jl. Jantung Sehat No. 123</p>
                    <p className="text-gray-600">
                      Jakarta Pusat, DKI Jakarta 10350
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
          <div>
            {/* Form Kontak */}
            <Card>
              <CardHeader>
                <CardTitle className="text-2xl">Mulai Konsultasi</CardTitle>
                <CardDescription>
                  Isi form di bawah untuk memulai konsultasi dengan dokter
                  spesialis kami
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Nama Lengkap
                    </label>
                    <input
                      type="text"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                      placeholder="Masukkan nama lengkap"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Nomor Telepon
                    </label>
                    <input
                      type="tel"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                      placeholder="Masukkan nomor telepon"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                    placeholder="Masukkan email"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Jenis Keluhan
                  </label>
                  <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500">
                    <option>Pilih jenis keluhan</option>
                    <option>Jantung berdebar-debar</option>
                    <option>Nyeri dada</option>
                    <option>Sesak napas</option>
                    <option>Pusing/hampir pingsan</option>
                    <option>Kelelahan berlebihan</option>
                    <option>Lainnya</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Deskripsi Keluhan
                  </label>
                  <textarea
                    rows={4}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                    placeholder="Jelaskan keluhan Anda secara detail..."
                  ></textarea>
                </div>
                <Button className="w-full bg-red-600 hover:bg-red-700 text-lg py-3">
                  <Heart className="mr-2 h-5 w-5" />
                  Kirim Konsultasi
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </section>

    <footer className="bg-gray-900 text-white py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* ... Konten Footer ... */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <Heart className="h-8 w-8 text-red-600" />
              <span className="text-2xl font-bold">Kardiologiku</span>
            </div>
            <p className="text-gray-400 mb-4">
              Platform terpercaya untuk edukasi dan konsultasi kesehatan jantung
              di Indonesia.
            </p>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4">Layanan</h3>
            <ul className="space-y-2 text-gray-400">
              <li>
                <a href="#" className="hover:text-white">
                  Konsultasi Online
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white">
                  Edukasi Aritmia
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white">
                  Monitoring Jantung
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white">
                  Pengingat Obat
                </a>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4">Informasi</h3>
            <ul className="space-y-2 text-gray-400">
              <li>
                <a href="#" className="hover:text-white">
                  Tentang Kami
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white">
                  Tim Dokter
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white">
                  Artikel Kesehatan
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white">
                  FAQ
                </a>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4">Kontak</h3>
            <ul className="space-y-2 text-gray-400">
              <li className="flex items-center space-x-2">
                <Phone className="h-4 w-4" />
                <span>+62 21 1234 5678</span>
              </li>
              <li className="flex items-center space-x-2">
                <Mail className="h-4 w-4" />
                <span>info@kardiologiku.com</span>
              </li>
              <li className="flex items-start space-x-2">
                <MapPin className="h-4 w-4 mt-1" />
                <span>
                  Jl. Jantung Sehat No. 123
                  <br />
                  Jakarta Pusat, DKI Jakarta
                </span>
              </li>
            </ul>
          </div>
        </div>
        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
          <p>&copy; 2025 Kardiologiku. Semua hak cipta dilindungi.</p>
          <p className="mt-2">
            <a href="#" className="hover:text-white">
              Kebijakan Privasi
            </a>{" "}
            •{" "}
            <a href="#" className="hover:text-white ml-2">
              Syarat & Ketentuan
            </a>
          </p>
        </div>
      </div>
    </footer>
  </>
);

export default KontakFooterSection;

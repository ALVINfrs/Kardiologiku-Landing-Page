import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Heart, Activity, Bell, Shield, Pill } from "lucide-react";

const ObatTerapiSection = () => (
  <section id="obat-terapi" className="py-20 bg-white">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="text-center mb-16">
        <h2 className="text-4xl font-bold text-gray-900 mb-4">
          Obat & Terapi Aritmia
        </h2>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          Berbagai pilihan pengobatan dan terapi untuk mengatasi gangguan irama
          jantung
        </p>
      </div>

      <Tabs defaultValue="obat" className="w-full">
        <TabsList className="grid w-full grid-cols-2 mb-8">
          <TabsTrigger value="obat" className="text-lg">
            Obat-obatan
          </TabsTrigger>
          <TabsTrigger value="terapi" className="text-lg">
            Terapi & Prosedur
          </TabsTrigger>
        </TabsList>

        {/* === Tab Obat-obatan === */}
        <TabsContent value="obat" className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Card Antiaritmia */}
            <Card>
              <CardHeader>
                <div className="flex items-center space-x-3">
                  <Pill className="h-8 w-8 text-blue-600" />
                  <div>
                    <CardTitle>Antiaritmia</CardTitle>
                    <CardDescription>
                      Obat pengatur irama jantung
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-4">
                  Obat yang membantu menormalkan irama jantung dengan mengatur
                  aktivitas listrik jantung.
                </p>
                <div className="space-x-2">
                  <Badge variant="secondary">Amiodarone</Badge>
                  <Badge variant="secondary">Flecainide</Badge>
                  <Badge variant="secondary">Propafenone</Badge>
                </div>
              </CardContent>
            </Card>

            {/* Card Beta Blocker */}
            <Card>
              <CardHeader>
                <div className="flex items-center space-x-3">
                  <Heart className="h-8 w-8 text-red-600" />
                  <div>
                    <CardTitle>Beta Blocker</CardTitle>
                    <CardDescription>Perlambat detak jantung</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-4">
                  Membantu mengurangi detak jantung dan tekanan darah dengan
                  memblokir efek adrenalin.
                </p>
                <div className="space-x-2">
                  <Badge variant="secondary">Metoprolol</Badge>
                  <Badge variant="secondary">Bisoprolol</Badge>
                  <Badge variant="secondary">Carvedilol</Badge>
                </div>
              </CardContent>
            </Card>

            {/* Card Antikoagulan */}
            <Card>
              <CardHeader>
                <div className="flex items-center space-x-3">
                  <Shield className="h-8 w-8 text-green-600" />
                  <div>
                    <CardTitle>Antikoagulan</CardTitle>
                    <CardDescription>
                      Pencegah penggumpalan darah
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-4">
                  Mengurangi risiko stroke dengan mencegah pembentukan gumpalan
                  darah.
                </p>
                <div className="space-x-2">
                  <Badge variant="secondary">Warfarin</Badge>
                  <Badge variant="secondary">Dabigatran</Badge>
                  <Badge variant="secondary">Rivaroxaban</Badge>
                </div>
              </CardContent>
            </Card>

            {/* Card Calcium Blocker */}
            <Card>
              <CardHeader>
                <div className="flex items-center space-x-3">
                  <Activity className="h-8 w-8 text-purple-600" />
                  <div>
                    <CardTitle>Calcium Channel Blocker</CardTitle>
                    <CardDescription>Relaksasi pembuluh darah</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-4">
                  Membantu mengendurkan otot jantung dan pembuluh darah.
                </p>
                <div className="space-x-2">
                  <Badge variant="secondary">Verapamil</Badge>
                  <Badge variant="secondary">Diltiazem</Badge>
                  <Badge variant="secondary">Amlodipine</Badge>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Warning Note */}
          <div className="bg-yellow-50 border-l-4 border-yellow-400 p-6 rounded-lg">
            <div className="flex">
              <div className="flex-shrink-0">
                <Bell className="h-5 w-5 text-yellow-400" />
              </div>
              <div className="ml-3">
                <p className="text-sm text-yellow-700">
                  <strong>Penting:</strong> Semua obat harus dikonsumsi sesuai
                  dengan resep dan pengawasan dokter. Jangan mengubah dosis atau
                  menghentikan obat tanpa berkonsultasi dengan dokter.
                </p>
              </div>
            </div>
          </div>
        </TabsContent>

        {/* === Tab Terapi & Prosedur === */}
        <TabsContent value="terapi" className="space-y-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle className="text-2xl text-center">
                  Prosedur Medis untuk Aritmia
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div className="border-l-4 border-red-500 pl-4">
                      <h4 className="text-lg font-semibold text-gray-900">
                        Ablasi Kateter
                      </h4>
                      <p className="text-gray-600">
                        Prosedur minimal invasif untuk menghancurkan jaringan
                        jantung yang menyebabkan aritmia.
                      </p>
                    </div>
                    <div className="border-l-4 border-blue-500 pl-4">
                      <h4 className="text-lg font-semibold text-gray-900">
                        Alat Pacu Jantung
                      </h4>
                      <p className="text-gray-600">
                        Perangkat kecil yang ditanamkan untuk membantu mengatur
                        irama jantung.
                      </p>
                    </div>
                    <div className="border-l-4 border-green-500 pl-4">
                      <h4 className="text-lg font-semibold text-gray-900">
                        ICD (Implantable Cardioverter Defibrillator)
                      </h4>
                      <p className="text-gray-600">
                        Alat yang dapat mendeteksi dan mengatasi aritmia
                        berbahaya secara otomatis.
                      </p>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div className="border-l-4 border-purple-500 pl-4">
                      <h4 className="text-lg font-semibold text-gray-900">
                        Kardioversi
                      </h4>
                      <p className="text-gray-600">
                        Prosedur untuk mengembalikan irama jantung normal
                        menggunakan kejutan listrik.
                      </p>
                    </div>
                    <div className="border-l-4 border-orange-500 pl-4">
                      <h4 className="text-lg font-semibold text-gray-900">
                        Operasi Maze
                      </h4>
                      <p className="text-gray-600">
                        Operasi terbuka untuk menciptakan jalur baru bagi sinyal
                        listrik jantung.
                      </p>
                    </div>
                    <div className="border-l-4 border-pink-500 pl-4">
                      <h4 className="text-lg font-semibold text-gray-900">
                        Modifikasi Gaya Hidup
                      </h4>
                      <p className="text-gray-600">
                        Pola makan sehat, olahraga teratur, dan manajemen stres.
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  </section>
);

export default ObatTerapiSection;

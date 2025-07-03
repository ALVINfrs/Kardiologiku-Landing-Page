import { useState, useMemo } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Users,
  GraduationCap,
  Hospital,
  Sparkles,
  Star,
  CalendarDays,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

// --- Tipe Data untuk Ulasan dan Dokter ---
interface Review {
  id: number;
  patientName: string;
  date: string;
  rating: number;
  comment: string;
}

interface Dokter {
  name: string;
  specialty: string;
  subSpecialty:
    | "Elektrofisiologi"
    | "Intervensi"
    | "Pediatrik"
    | "Pencegahan & Rehabilitasi";
  experience: string;
  education: string;
  avatar: string;
  bio: string;
  expertise: string[];
  hospitals: string[];
  rating: number;
  reviewsCount: number;
  schedule: { [key: string]: string };
  patientReviews: Review[];
}

// --- Data Dokter Super Lengkap (6 Dokter) ---
const dokters: Dokter[] = [
  {
    name: "Dr. Sarah Wijaya, Sp.JP(K)",
    specialty: "Kardiologi Elektrofisiologi",
    subSpecialty: "Elektrofisiologi",
    experience: "15+ tahun",
    education: "Universitas Indonesia",
    avatar: "/api/placeholder/150/150?text=SW",
    bio: "Dr. Sarah adalah seorang ahli elektrofisiologi terkemuka yang berfokus pada diagnosis dan pengobatan aritmia kompleks. Beliau memiliki keahlian khusus dalam prosedur ablasi kateter dan implantasi perangkat jantung.",
    expertise: [
      "Ablasi Fibrilasi Atrium",
      "Implantasi Pacu Jantung & ICD",
      "Studi Elektrofisiologi (EPS)",
      "Manajemen Sinkop",
    ],
    hospitals: ["RS Jantung Harapan Bangsa", "Klinik Kardiologi Sentra Medika"],
    rating: 4.9,
    reviewsCount: 182,
    schedule: {
      Senin: "09:00 - 13:00 (RS Jantung Harapan Bangsa)",
      Rabu: "14:00 - 17:00 (Klinik Kardiologi Sentra Medika)",
      Jumat: "09:00 - 12:00 (RS Jantung Harapan Bangsa)",
    },
    patientReviews: [
      {
        id: 1,
        patientName: "Budi S.",
        date: "20 Jul 2025",
        rating: 5,
        comment:
          "Penjelasan Dr. Sarah sangat detail dan menenangkan. Prosedur ablasi saya berjalan lancar. Terima kasih, Dok!",
      },
      {
        id: 2,
        patientName: "Retno W.",
        date: "15 Jun 2025",
        rating: 5,
        comment:
          "Sangat profesional dan sabar menjawab semua pertanyaan saya. Sangat direkomendasikan.",
      },
    ],
  },
  {
    name: "Dr. Budi Hartono, Sp.JP(K)",
    specialty: "Kardiologi Intervensi",
    subSpecialty: "Intervensi",
    experience: "18+ tahun",
    education: "Universitas Gadjah Mada",
    avatar: "/api/placeholder/150/150?text=BH",
    bio: "Dengan pengalaman luas dalam prosedur intervensi koroner, Dr. Budi telah berhasil menangani ribuan kasus penyakit jantung koroner, dari yang sederhana hingga yang paling kompleks.",
    expertise: [
      "Angioplasti Koroner (PCI/Stent)",
      "Kateterisasi Jantung Diagnostik",
      "Intervensi Struktural (TAVI, MitraClip)",
      "Manajemen Serangan Jantung Akut",
    ],
    hospitals: ["RS Utama Medika", "Pusat Jantung Nasional"],
    rating: 4.8,
    reviewsCount: 235,
    schedule: {
      Selasa: "10:00 - 14:00 (RS Utama Medika)",
      Kamis: "09:00 - 13:00 (Pusat Jantung Nasional)",
      Sabtu: "08:00 - 11:00 (RS Utama Medika)",
    },
    patientReviews: [
      {
        id: 1,
        patientName: "Ahmad R.",
        date: "18 Jul 2025",
        rating: 5,
        comment:
          "Tangan dingin dan sangat berpengalaman. Pemasangan stent ayah saya berhasil tanpa kendala. Dokter terbaik!",
      },
      {
        id: 2,
        patientName: "Siti A.",
        date: "02 Jul 2025",
        rating: 4,
        comment:
          "Komunikasinya baik, meskipun kadang harus menunggu cukup lama saat jadwal praktek.",
      },
    ],
  },
  {
    name: "Dr. Maya Sari, Sp.A, Sp.JP",
    specialty: "Kardiologi Pediatrik",
    subSpecialty: "Pediatrik",
    experience: "10+ tahun",
    education: "Universitas Padjadjaran",
    avatar: "/api/placeholder/150/150?text=MS",
    bio: "Dr. Maya mendedikasikan karirnya untuk kesehatan jantung anak-anak, dari bayi baru lahir hingga remaja. Beliau ahli dalam mendiagnosis dan mengelola penyakit jantung bawaan.",
    expertise: [
      "Penyakit Jantung Bawaan",
      "Ekokardiografi Pediatrik",
      "Aritmia pada Anak",
      "Manajemen Gagal Jantung Anak",
    ],
    hospitals: ["RSIA Bunda Kasih", "RS Jantung Harapan Bangsa"],
    rating: 4.9,
    reviewsCount: 98,
    schedule: {
      Senin: "14:00 - 18:00 (RSIA Bunda Kasih)",
      Rabu: "09:00 - 12:00 (RS Jantung Harapan Bangsa)",
      Jumat: "13:00 - 16:00 (RSIA Bunda Kasih)",
    },
    patientReviews: [
      {
        id: 1,
        patientName: "Ibu Wati",
        date: "25 Jun 2025",
        rating: 5,
        comment:
          "Dr. Maya sangat telaten dan baik dengan anak saya. Penjelasannya mudah dipahami orang tua. Kami merasa sangat terbantu.",
      },
      {
        id: 2,
        patientName: "Bapak Eko",
        date: "11 Mei 2025",
        rating: 5,
        comment:
          "Luar biasa sabar dan teliti. Sangat ahli di bidang jantung anak.",
      },
    ],
  },
  {
    name: "Dr. Rian Sutanto, Sp.JP",
    specialty: "Pencegahan & Rehabilitasi Jantung",
    subSpecialty: "Pencegahan & Rehabilitasi",
    experience: "11+ tahun",
    education: "Universitas Airlangga",
    avatar: "/api/placeholder/150/150?text=RS",
    bio: "Dr. Rian berfokus pada aspek pencegahan penyakit kardiovaskular dan membantu pasien pulih setelah kejadian jantung melalui program rehabilitasi yang komprehensif.",
    expertise: [
      "Manajemen Faktor Risiko (Kolesterol, Hipertensi)",
      "Program Latihan Jantung",
      "Nutrisi Kardiovaskular",
      "Manajemen Stres & Psikokardiologi",
    ],
    hospitals: ["Klinik Kardiologi Sehat", "Pusat Rehabilitasi Jantung Fit"],
    rating: 4.8,
    reviewsCount: 112,
    schedule: {
      Selasa: "08:00 - 12:00 (Klinik Kardiologi Sehat)",
      Kamis: "13:00 - 17:00 (Pusat Rehabilitasi Jantung Fit)",
    },
    patientReviews: [
      {
        id: 1,
        patientName: "Dian P.",
        date: "12 Jul 2025",
        rating: 5,
        comment:
          "Program rehabilitasi dari Dr. Rian sangat membantu saya kembali percaya diri setelah serangan jantung. Pendekatannya sangat holistik.",
      },
      {
        id: 2,
        patientName: "Agus H.",
        date: "28 Jun 2025",
        rating: 5,
        comment:
          "Sangat informatif dalam menjelaskan pencegahan. Saya jadi lebih paham cara menjaga kesehatan jantung.",
      },
    ],
  },
  {
    name: "Dr. Linda Halim, Sp.JP(K)",
    specialty: "Kardiologi Elektrofisiologi",
    subSpecialty: "Elektrofisiologi",
    experience: "10+ tahun",
    education: "Universitas Hasanuddin",
    avatar: "/api/placeholder/150/150?text=LH",
    bio: "Sebagai generasi baru ahli aritmia, Dr. Linda menguasai teknologi pemetaan 3D terbaru untuk prosedur ablasi, memberikan hasil yang presisi dan aman bagi pasien.",
    expertise: [
      "Ablasi Supraventricular Tachycardia (SVT)",
      "Manajemen Aritmia Genetik (Brugada, LQTS)",
      "Pemrograman Perangkat Jantung",
      "Cryoablation untuk AF",
    ],
    hospitals: ["RS Jantung Harapan Bangsa", "Klinik Aritmia Jakarta"],
    rating: 4.9,
    reviewsCount: 85,
    schedule: {
      Selasa: "14:00 - 18:00 (RS Jantung Harapan Bangsa)",
      Kamis: "10:00 - 14:00 (Klinik Aritmia Jakarta)",
    },
    patientReviews: [
      {
        id: 1,
        patientName: "Kevin T.",
        date: "05 Jul 2025",
        rating: 5,
        comment:
          "Dr. Linda berhasil menyembuhkan SVT saya dengan ablasi. Prosesnya cepat dan pemulihannya juga. Sangat berterima kasih.",
      },
      {
        id: 2,
        patientName: "Maria F.",
        date: "20 Mei 2025",
        rating: 5,
        comment:
          "Dokter yang sangat up-to-date dengan teknologi terbaru. Merasa aman ditangani oleh beliau.",
      },
    ],
  },
  {
    name: "Dr. Agus Setiawan, Sp.JP(K)",
    specialty: "Kardiologi Intervensi",
    subSpecialty: "Intervensi",
    experience: "20+ tahun",
    education: "Universitas Diponegoro",
    avatar: "/api/placeholder/150/150?text=AS",
    bio: "Dr. Agus adalah seorang veteran di bidang kardiologi intervensi, sering menjadi rujukan untuk kasus-kasus penyumbatan total kronis (CTO) yang dianggap sulit.",
    expertise: [
      "Intervensi CTO (Chronic Total Occlusion)",
      "Rotablation Atherectomy",
      "Pencitraan Intravaskular (IVUS/OCT)",
      "Manajemen Komplikasi PCI",
    ],
    hospitals: ["RS Utama Medika", "Pusat Jantung Nasional"],
    rating: 5.0,
    reviewsCount: 310,
    schedule: {
      Senin: "08:00 - 12:00 (Pusat Jantung Nasional)",
      Rabu: "13:00 - 17:00 (RS Utama Medika)",
      Jumat: "08:00 - 11:00 (Pusat Jantung Nasional)",
    },
    patientReviews: [
      {
        id: 1,
        patientName: "Hendra K.",
        date: "19 Jul 2025",
        rating: 5,
        comment:
          "Hanya Dr. Agus yang berani dan berhasil membuka sumbatan jantung saya yang sudah divonis tidak bisa diapa-apakan. Beliau adalah pahlawan.",
      },
      {
        id: 2,
        patientName: "Keluarga Tan",
        date: "22 Jun 2025",
        rating: 5,
        comment:
          "Sangat senior, tenang, dan meyakinkan. Hasil kerjanya tidak perlu diragukan lagi. Sangat direkomendasikan untuk kasus sulit.",
      },
    ],
  },
];

const specialties = [
  "Semua",
  "Elektrofisiologi",
  "Intervensi",
  "Pediatrik",
  "Pencegahan & Rehabilitasi",
];

// --- Komponen Pembantu ---
const StarRating: React.FC<{ rating: number; className?: string }> = ({
  rating,
  className,
}) => (
  <div className={cn("flex items-center gap-0.5", className)}>
    {[...Array(5)].map((_, i) => (
      <Star
        key={i}
        className={cn(
          "h-4 w-4",
          i < Math.floor(rating)
            ? "text-yellow-400 fill-yellow-400"
            : "text-gray-300 dark:text-gray-600"
        )}
      />
    ))}
  </div>
);

const DokterCard: React.FC<{
  dokter: Dokter;
  onProfilClick: (d: Dokter) => void;
}> = ({ dokter, onProfilClick }) => (
  <motion.div
    layout
    initial={{ opacity: 0, y: 50 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -30 }}
    transition={{ type: "spring", stiffness: 200, damping: 25 }}
    className="flex"
  >
    <Card className="flex flex-col w-full hover:shadow-xl transition-shadow duration-300 dark:bg-gray-800">
      <CardHeader className="text-center pb-4">
        <Avatar className="w-24 h-24 mx-auto mb-4 ring-4 ring-red-100 dark:ring-red-900/50">
          <AvatarImage src={dokter.avatar} alt={dokter.name} />
          <AvatarFallback className="bg-red-100 text-red-600 text-xl">
            {dokter.name
              .split(" ")
              .map((n) => n[0])
              .join("")}
          </AvatarFallback>
        </Avatar>
        <CardTitle className="text-xl text-gray-900 dark:text-white">
          {dokter.name}
        </CardTitle>
        <CardDescription className="text-red-600 font-medium">
          {dokter.specialty}
        </CardDescription>
        <div className="flex justify-center items-center gap-2 mt-2">
          <StarRating rating={dokter.rating} />
          <span className="text-xs text-gray-500 dark:text-gray-400">
            ({dokter.reviewsCount} ulasan)
          </span>
        </div>
      </CardHeader>
      <CardContent className="text-center space-y-3 flex flex-col flex-grow justify-end">
        <div className="flex items-center justify-center space-x-2 text-gray-600 dark:text-gray-400">
          <Users className="h-4 w-4" />
          <span className="text-sm">{dokter.experience}</span>
        </div>
        <div className="flex items-center justify-center space-x-2 text-gray-600 dark:text-gray-400">
          <GraduationCap className="h-4 w-4" />
          <span className="text-sm">{dokter.education}</span>
        </div>
        <div className="pt-4 space-y-2">
          <Button
            onClick={() => onProfilClick(dokter)}
            className="w-full bg-red-600 hover:bg-red-700"
          >
            Lihat Profil & Ulasan
          </Button>
          <Button variant="outline" className="w-full">
            Buat Janji Temu
          </Button>
        </div>
      </CardContent>
    </Card>
  </motion.div>
);

// --- Komponen Utama ---
const DokterKamiSection = () => {
  const [activeSpecialty, setActiveSpecialty] = useState("Semua");
  const [selectedDokter, setSelectedDokter] = useState<Dokter | null>(null);
  const [activeModalTab, setActiveModalTab] = useState<"profil" | "ulasan">(
    "profil"
  );

  const filteredDokters = useMemo(() => {
    if (activeSpecialty === "Semua") return dokters;
    return dokters.filter((d) => d.subSpecialty === activeSpecialty);
  }, [activeSpecialty]);

  const handleOpenModal = (dokter: Dokter) => {
    setSelectedDokter(dokter);
    setActiveModalTab("profil");
  };

  return (
    <section id="dokter-kami" className="py-20 bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Tim Dokter Spesialis Kami
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
            Konsultasi dengan para ahli jantung berpengalaman yang siap membantu
            Anda.
          </p>
        </div>

        <div className="flex flex-wrap justify-center gap-2 mb-12">
          {specialties.map((spec) => (
            <Button
              key={spec}
              variant={activeSpecialty === spec ? "default" : "outline"}
              onClick={() => setActiveSpecialty(spec)}
            >
              {spec}
            </Button>
          ))}
        </div>

        <motion.div
          layout
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          <AnimatePresence>
            {filteredDokters.map((dokter) => (
              <DokterCard
                key={dokter.name}
                dokter={dokter}
                onProfilClick={handleOpenModal}
              />
            ))}
          </AnimatePresence>
        </motion.div>
      </div>

      <Dialog
        open={!!selectedDokter}
        onOpenChange={(isOpen) => !isOpen && setSelectedDokter(null)}
      >
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto p-0">
          {selectedDokter && (
            <>
              <DialogHeader className="text-center space-y-4 p-6 bg-slate-50 dark:bg-slate-900">
                <Avatar className="w-28 h-28 mx-auto ring-4 ring-offset-4 dark:ring-offset-gray-900 ring-red-500">
                  <AvatarImage
                    src={selectedDokter.avatar}
                    alt={selectedDokter.name}
                  />
                  <AvatarFallback className="text-3xl">
                    {selectedDokter.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <DialogTitle className="text-3xl font-bold text-gray-900 dark:text-white">
                    {selectedDokter.name}
                  </DialogTitle>
                  <CardDescription className="text-red-600 font-semibold text-lg mt-1">
                    {selectedDokter.specialty}
                  </CardDescription>
                </div>
              </DialogHeader>
              <div className="p-6 dark:bg-gray-800">
                <p className="text-center text-gray-600 dark:text-gray-400 italic mb-6">
                  "{selectedDokter.bio}"
                </p>

                <div className="border-b dark:border-gray-700 mb-4 flex">
                  <button
                    onClick={() => setActiveModalTab("profil")}
                    className={cn(
                      "px-4 py-2 font-medium transition-colors",
                      activeModalTab === "profil"
                        ? "border-b-2 border-red-500 text-red-600"
                        : "text-gray-500 hover:text-gray-300"
                    )}
                  >
                    Profil & Jadwal
                  </button>
                  <button
                    onClick={() => setActiveModalTab("ulasan")}
                    className={cn(
                      "px-4 py-2 font-medium transition-colors",
                      activeModalTab === "ulasan"
                        ? "border-b-2 border-red-500 text-red-600"
                        : "text-gray-500 hover:text-gray-300"
                    )}
                  >
                    Ulasan Pasien ({selectedDokter.reviewsCount})
                  </button>
                </div>

                <AnimatePresence mode="wait">
                  <motion.div
                    key={activeModalTab}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                  >
                    {activeModalTab === "profil" ? (
                      <div className="space-y-6 text-gray-700 dark:text-gray-300">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
                          <div className="space-y-2">
                            <h4 className="font-bold flex items-center gap-2 text-gray-800 dark:text-gray-200">
                              <Sparkles className="text-yellow-500" /> Keahlian
                              Utama
                            </h4>
                            <ul className="list-disc list-inside">
                              {" "}
                              {selectedDokter.expertise.map((e) => (
                                <li key={e}>{e}</li>
                              ))}
                            </ul>
                          </div>
                          <div className="space-y-2">
                            <h4 className="font-bold flex items-center gap-2 text-gray-800 dark:text-gray-200">
                              <Hospital className="text-blue-500" /> Afiliasi RS
                            </h4>
                            <ul className="list-disc list-inside">
                              {" "}
                              {selectedDokter.hospitals.map((h) => (
                                <li key={h}>{h}</li>
                              ))}
                            </ul>
                          </div>
                        </div>
                        <div>
                          <h4 className="font-bold flex items-center gap-2 mb-2 text-gray-800 dark:text-gray-200">
                            <CalendarDays className="text-green-500" /> Jadwal
                            Praktik
                          </h4>
                          <div className="space-y-2 text-sm border dark:border-gray-700 rounded-lg p-4 bg-slate-50 dark:bg-slate-900/50">
                            {Object.entries(selectedDokter.schedule).map(
                              ([day, time]) => (
                                <div key={day} className="flex justify-between">
                                  <span>{day}</span>
                                  <span className="font-semibold text-gray-900 dark:text-white">
                                    {time}
                                  </span>
                                </div>
                              )
                            )}
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-6">
                        {selectedDokter.patientReviews.map((review) => (
                          <div
                            key={review.id}
                            className="border-b dark:border-gray-700 pb-4"
                          >
                            <div className="flex justify-between items-center mb-2">
                              <div>
                                <p className="font-semibold text-gray-900 dark:text-white">
                                  {review.patientName}
                                </p>
                                <p className="text-xs text-gray-500 dark:text-gray-400">
                                  {review.date}
                                </p>
                              </div>
                              <StarRating rating={review.rating} />
                            </div>
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                              "{review.comment}"
                            </p>
                          </div>
                        ))}
                      </div>
                    )}
                  </motion.div>
                </AnimatePresence>
              </div>
              <div className="border-t dark:border-gray-700 p-6 text-center bg-slate-50 dark:bg-slate-900">
                <Button size="lg" className="bg-red-600 hover:bg-red-700">
                  Buat Janji Temu dengan {selectedDokter.name.split(",")[0]}
                </Button>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </section>
  );
};

export default DokterKamiSection;

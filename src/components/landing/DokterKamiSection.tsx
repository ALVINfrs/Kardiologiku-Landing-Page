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
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Users,
  GraduationCap,
  Hospital,
  Sparkles,
  Star,
  CalendarDays,
  Search,
  Clock,
  MapPin,
  Award,
  TrendingUp,
  Heart,
  Stethoscope,
  Activity,
  Plus,
  Minus,
  MessageCircle,
  Phone,
  Calendar,
  BookOpen,
  Globe,
  CheckCircle,
  Eye,
  ThumbsUp,
  Share2,
  Bookmark,
} from "lucide-react";

// Enhanced Types
interface Review {
  id: number;
  patientName: string;
  date: string;
  rating: number;
  comment: string;
  verified: boolean;
  helpful: number;
  condition?: string;
}

interface Achievement {
  title: string;
  year: string;
  organization: string;
  icon: string;
}

interface Publication {
  title: string;
  journal: string;
  year: string;
  citations?: number;
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
  languages: string[];
  certifications: string[];
  achievements: Achievement[];
  publications: Publication[];
  consultationFee: string;
  responseTime: string;
  availableToday: boolean;
  onlineConsultation: boolean;
  emergencyAvailable: boolean;
  totalPatients: number;
  successRate: number;
  yearsActive: number;
  socialMedia: {
    linkedin?: string;
    website?: string;
  };
}

// Mock Data
const dokters: Dokter[] = [
  {
    name: "Dr. Sarah Wijaya, Sp.JP(K)",
    specialty: "Kardiologi Elektrofisiologi",
    subSpecialty: "Elektrofisiologi",
    experience: "15+ tahun",
    education: "Universitas Indonesia",
    avatar: "/api/placeholder/150/150?text=SW",
    bio: "Ahli elektrofisiologi terkemuka dengan fokus pada diagnosis dan pengobatan aritmia kompleks.",
    expertise: [
      "Ablasi Fibrilasi Atrium",
      "Implantasi Pacu Jantung & ICD",
      "Studi Elektrofisiologi",
      "Manajemen Sinkop",
    ],
    hospitals: ["RS Jantung Harapan Bangsa", "Klinik Kardiologi Sentra Medika"],
    rating: 4.9,
    reviewsCount: 182,
    schedule: {
      Senin: "09:00 - 13:00",
      Rabu: "14:00 - 17:00",
      Jumat: "09:00 - 12:00",
    },
    patientReviews: [
      {
        id: 1,
        patientName: "Budi S.",
        date: "20 Jul 2025",
        rating: 5,
        comment:
          "Penjelasan Dr. Sarah sangat detail dan menenangkan. Prosedur ablasi saya berjalan lancar.",
        verified: true,
        helpful: 24,
        condition: "Fibrilasi Atrium",
      },
    ],
    languages: ["Indonesia", "English", "Mandarin"],
    certifications: [
      "Board Certified Cardiologist",
      "Fellowship Electrophysiology",
      "ACLS Certified",
    ],
    achievements: [
      {
        title: "Best Cardiologist Award",
        year: "2024",
        organization: "Indonesian Heart Association",
        icon: "🏆",
      },
    ],
    publications: [
      {
        title: "Advanced Electrophysiology Techniques",
        journal: "Cardiology Today",
        year: "2024",
        citations: 45,
      },
    ],
    consultationFee: "Rp 500.000",
    responseTime: "< 2 jam",
    availableToday: true,
    onlineConsultation: true,
    emergencyAvailable: false,
    totalPatients: 2850,
    successRate: 96,
    yearsActive: 15,
    socialMedia: {
      linkedin: "linkedin.com/in/sarahwijaya",
      website: "drsarahwijaya.com",
    },
  },
  {
    name: "Dr. Budi Hartono, Sp.JP(K)",
    specialty: "Kardiologi Intervensi",
    subSpecialty: "Intervensi",
    experience: "18+ tahun",
    education: "Universitas Gadjah Mada",
    avatar: "/api/placeholder/150/150?text=BH",
    bio: "Pengalaman luas dalam prosedur intervensi koroner, menangani ribuan kasus penyakit jantung koroner.",
    expertise: [
      "Angioplasti Koroner (PCI/Stent)",
      "Kateterisasi Jantung Diagnostik",
      "Intervensi Struktural",
      "Manajemen Serangan Jantung Akut",
    ],
    hospitals: ["RS Utama Medika", "Pusat Jantung Nasional"],
    rating: 4.8,
    reviewsCount: 235,
    schedule: {
      Selasa: "10:00 - 14:00",
      Kamis: "09:00 - 13:00",
      Sabtu: "08:00 - 11:00",
    },
    patientReviews: [
      {
        id: 1,
        patientName: "Ahmad R.",
        date: "18 Jul 2025",
        rating: 5,
        comment:
          "Tangan dingin dan sangat berpengalaman. Pemasangan stent ayah saya berhasil tanpa kendala.",
        verified: true,
        helpful: 31,
        condition: "Stenosis Koroner",
      },
    ],
    languages: ["Indonesia", "English"],
    certifications: [
      "Interventional Cardiology",
      "SCAI Certified",
      "Emergency Medicine",
    ],
    achievements: [
      {
        title: "Outstanding Physician",
        year: "2024",
        organization: "Medical Board",
        icon: "🎖️",
      },
    ],
    publications: [
      {
        title: "Complex PCI Procedures",
        journal: "Interventional Cardiology",
        year: "2024",
        citations: 52,
      },
    ],
    consultationFee: "Rp 650.000",
    responseTime: "< 3 jam",
    availableToday: false,
    onlineConsultation: true,
    emergencyAvailable: true,
    totalPatients: 3200,
    successRate: 94,
    yearsActive: 18,
    socialMedia: {
      website: "budihartono-cardio.com",
    },
  },
  {
    name: "Dr. Maya Sari, Sp.A, Sp.JP",
    specialty: "Kardiologi Pediatrik",
    subSpecialty: "Pediatrik",
    experience: "10+ tahun",
    education: "Universitas Padjadjaran",
    avatar: "/api/placeholder/150/150?text=MS",
    bio: "Dedikasi untuk kesehatan jantung anak-anak, ahli dalam penyakit jantung bawaan.",
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
      Senin: "14:00 - 18:00",
      Rabu: "09:00 - 12:00",
      Jumat: "13:00 - 16:00",
    },
    patientReviews: [
      {
        id: 1,
        patientName: "Ibu Wati",
        date: "25 Jun 2025",
        rating: 5,
        comment:
          "Dr. Maya sangat telaten dan baik dengan anak saya. Penjelasannya mudah dipahami.",
        verified: true,
        helpful: 27,
        condition: "VSD",
      },
    ],
    languages: ["Indonesia", "English", "Jawa"],
    certifications: [
      "Pediatric Cardiology",
      "Congenital Heart Disease",
      "Echo Certified",
    ],
    achievements: [
      {
        title: "Pediatric Excellence Award",
        year: "2024",
        organization: "Children's Heart Foundation",
        icon: "👶",
      },
    ],
    publications: [
      {
        title: "Congenital Heart Disease in Indonesia",
        journal: "Pediatric Cardiology",
        year: "2024",
        citations: 28,
      },
    ],
    consultationFee: "Rp 450.000",
    responseTime: "< 1 jam",
    availableToday: true,
    onlineConsultation: true,
    emergencyAvailable: false,
    totalPatients: 1850,
    successRate: 98,
    yearsActive: 10,
    socialMedia: {
      website: "mayasari-pediatriccardio.com",
    },
  },
];

const specialties = [
  "Semua",
  "Elektrofisiologi",
  "Intervensi",
  "Pediatrik",
  "Pencegahan & Rehabilitasi",
];
const sortOptions = [
  { value: "rating", label: "Rating Tertinggi" },
  { value: "experience", label: "Pengalaman" },
  { value: "reviews", label: "Jumlah Ulasan" },
  { value: "availability", label: "Tersedia Hari Ini" },
];

// Utility Components
const StarRating = ({
  rating,
  showNumber = false,
}: {
  rating: number;
  showNumber?: boolean;
}) => (
  <div className="flex items-center gap-1">
    {[...Array(5)].map((_, i) => (
      <Star
        key={i}
        className={`h-4 w-4 ${
          i < Math.floor(rating)
            ? "text-yellow-400 fill-yellow-400"
            : "text-gray-300 dark:text-gray-600"
        }`}
      />
    ))}
    {showNumber && <span className="text-sm font-medium ml-1">{rating}</span>}
  </div>
);

const StatCard = ({
  icon,
  value,
  label,
  className = "",
}: {
  icon: React.ReactNode;
  value: string | number;
  label: string;
  className?: string;
}) => (
  <div
    className={`bg-white dark:bg-gray-800 rounded-lg p-3 border shadow-sm hover:scale-105 transition-transform ${className}`}
  >
    <div className="flex items-center justify-between mb-1">
      <div className="p-2 rounded-lg bg-red-50 dark:bg-red-900/20 text-red-600">
        {icon}
      </div>
    </div>
    <div className="text-2xl font-bold text-gray-900 dark:text-white">
      {value}
    </div>
    <div className="text-xs text-gray-500 dark:text-gray-400">{label}</div>
  </div>
);

const StatusBadges = ({ dokter }: { dokter: Dokter }) => (
  <div className="absolute top-4 right-4 flex flex-col gap-1">
    {dokter.availableToday && (
      <Badge className="bg-green-100 text-green-700 text-xs">
        <div className="w-2 h-2 rounded-full bg-green-500 mr-1 animate-pulse" />
        Tersedia Hari Ini
      </Badge>
    )}
    {dokter.onlineConsultation && (
      <Badge variant="outline" className="text-xs">
        <Globe className="w-3 h-3 mr-1" />
        Online
      </Badge>
    )}
    {dokter.emergencyAvailable && (
      <Badge className="bg-red-100 text-red-700 text-xs">
        <Activity className="w-3 h-3 mr-1" />
        Darurat
      </Badge>
    )}
  </div>
);

const DokterCard = ({
  dokter,
  onProfilClick,
  isExpanded,
  onToggleExpand,
}: {
  dokter: Dokter;
  onProfilClick: (d: Dokter) => void;
  isExpanded?: boolean;
  onToggleExpand?: () => void;
}) => {
  const [isBookmarked, setIsBookmarked] = useState(false);

  return (
    <Card className="flex flex-col w-full transition-all duration-300 hover:shadow-lg border-2 hover:border-red-200 dark:hover:border-red-800 dark:bg-gray-800">
      <CardHeader className="text-center pb-4 relative">
        <StatusBadges dokter={dokter} />

        <button
          onClick={() => setIsBookmarked(!isBookmarked)}
          className="absolute top-4 left-4 p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
        >
          <Bookmark
            className={`h-4 w-4 ${
              isBookmarked ? "fill-red-500 text-red-500" : "text-gray-400"
            }`}
          />
        </button>

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
          <StarRating rating={dokter.rating} showNumber />
          <span className="text-xs text-gray-500 dark:text-gray-400">
            ({dokter.reviewsCount} ulasan)
          </span>
        </div>
      </CardHeader>

      <CardContent className="space-y-4 flex flex-col flex-grow">
        {/* Quick Stats */}
        <div className="grid grid-cols-3 gap-2">
          <StatCard
            icon={<Users className="h-4 w-4" />}
            value={dokter.totalPatients.toLocaleString()}
            label="Pasien"
          />
          <StatCard
            icon={<TrendingUp className="h-4 w-4" />}
            value={`${dokter.successRate}%`}
            label="Sukses"
          />
          <StatCard
            icon={<Clock className="h-4 w-4" />}
            value={dokter.responseTime}
            label="Respon"
          />
        </div>

        {/* Basic Info */}
        <div className="space-y-2 text-center">
          <div className="flex items-center justify-center space-x-2 text-gray-600 dark:text-gray-400">
            <Users className="h-4 w-4" />
            <span className="text-sm">{dokter.experience}</span>
          </div>
          <div className="flex items-center justify-center space-x-2 text-gray-600 dark:text-gray-400">
            <GraduationCap className="h-4 w-4" />
            <span className="text-sm">{dokter.education}</span>
          </div>
          <div className="flex items-center justify-center space-x-2 text-gray-600 dark:text-gray-400">
            <Heart className="h-4 w-4" />
            <span className="text-sm font-medium text-green-600">
              {dokter.consultationFee}
            </span>
          </div>
        </div>

        {/* Languages */}
        <div className="flex flex-wrap justify-center gap-1">
          {dokter.languages.map((lang) => (
            <Badge key={lang} variant="secondary" className="text-xs">
              {lang}
            </Badge>
          ))}
        </div>

        {/* Expandable Content */}
        {isExpanded && (
          <div className="space-y-3 animate-in slide-in-from-top duration-300">
            <div>
              <h4 className="font-semibold text-sm text-gray-800 dark:text-gray-200 mb-2 flex items-center">
                <Sparkles className="h-4 w-4 mr-1 text-yellow-500" />
                Keahlian Utama
              </h4>
              <div className="flex flex-wrap gap-1">
                {dokter.expertise.slice(0, 2).map((skill) => (
                  <Badge
                    key={skill}
                    className="text-xs bg-red-50 text-red-700 hover:bg-red-100"
                  >
                    {skill}
                  </Badge>
                ))}
                {dokter.expertise.length > 2 && (
                  <Badge variant="outline" className="text-xs">
                    +{dokter.expertise.length - 2} lainnya
                  </Badge>
                )}
              </div>
            </div>

            {dokter.achievements.length > 0 && (
              <div>
                <h4 className="font-semibold text-sm text-gray-800 dark:text-gray-200 mb-2 flex items-center">
                  <Award className="h-4 w-4 mr-1 text-blue-500" />
                  Pencapaian Terbaru
                </h4>
                <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-2">
                  <div className="flex items-center gap-2">
                    <span className="text-lg">
                      {dokter.achievements[0].icon}
                    </span>
                    <div>
                      <p className="text-xs font-medium text-gray-800 dark:text-gray-200">
                        {dokter.achievements[0].title}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        {dokter.achievements[0].organization} •{" "}
                        {dokter.achievements[0].year}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            <div>
              <h4 className="font-semibold text-sm text-gray-800 dark:text-gray-200 mb-2 flex items-center">
                <CalendarDays className="h-4 w-4 mr-1 text-green-500" />
                Jadwal Terdekat
              </h4>
              <div className="text-xs text-gray-600 dark:text-gray-400">
                {Object.entries(dokter.schedule)[0] && (
                  <div className="flex justify-between">
                    <span>{Object.entries(dokter.schedule)[0][0]}</span>
                    <span className="font-medium">
                      {Object.entries(dokter.schedule)[0][1]}
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="pt-4 space-y-2 mt-auto">
          <div className="flex gap-2">
            <Button
              onClick={() => onProfilClick(dokter)}
              className="flex-1 bg-red-600 hover:bg-red-700"
              size="sm"
            >
              <Eye className="h-4 w-4 mr-1" />
              Lihat Profil
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={onToggleExpand}
              className="px-3"
            >
              {isExpanded ? (
                <Minus className="h-4 w-4" />
              ) : (
                <Plus className="h-4 w-4" />
              )}
            </Button>
          </div>

          <div className="flex gap-1">
            <Button variant="outline" size="sm" className="flex-1 text-xs">
              <Calendar className="h-3 w-3 mr-1" />
              Janji Temu
            </Button>
            {dokter.onlineConsultation && (
              <Button variant="outline" size="sm" className="flex-1 text-xs">
                <MessageCircle className="h-3 w-3 mr-1" />
                Konsultasi
              </Button>
            )}
          </div>

          <div className="flex justify-center gap-2 pt-2">
            <button className="p-2 rounded-full bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors">
              <Phone className="h-4 w-4 text-gray-600 dark:text-gray-400" />
            </button>
            <button className="p-2 rounded-full bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors">
              <Share2 className="h-4 w-4 text-gray-600 dark:text-gray-400" />
            </button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

const ReviewCard = ({ review }: { review: Review }) => {
  const [isHelpful, setIsHelpful] = useState(false);

  return (
    <div className="border-b dark:border-gray-700 pb-4 last:border-b-0">
      <div className="flex justify-between items-start mb-2">
        <div className="flex items-center gap-2">
          <div>
            <div className="flex items-center gap-2">
              <p className="font-semibold text-gray-900 dark:text-white text-sm">
                {review.patientName}
              </p>
              {review.verified && (
                <CheckCircle className="h-4 w-4 text-green-500" />
              )}
            </div>
            <div className="flex items-center gap-2">
              <p className="text-xs text-gray-500 dark:text-gray-400">
                {review.date}
              </p>
              {review.condition && (
                <Badge variant="secondary" className="text-xs">
                  {review.condition}
                </Badge>
              )}
            </div>
          </div>
        </div>
        <div className="flex flex-col items-end gap-1">
          <StarRating rating={review.rating} />
          <div className="flex items-center gap-1 text-xs text-gray-500">
            <ThumbsUp className="h-3 w-3" />
            <span>{review.helpful}</span>
          </div>
        </div>
      </div>
      <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
        "{review.comment}"
      </p>
      <div className="flex items-center gap-2">
        <button
          onClick={() => setIsHelpful(!isHelpful)}
          className={`flex items-center gap-1 px-2 py-1 rounded-md text-xs transition-colors ${
            isHelpful
              ? "bg-blue-100 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400"
              : "bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-400 dark:hover:bg-gray-600"
          }`}
        >
          <ThumbsUp className={`h-3 w-3 ${isHelpful ? "fill-current" : ""}`} />
          Membantu
        </button>
      </div>
    </div>
  );
};

const ModalContent = ({
  selectedDokter,
  activeTab,
  setActiveTab,
}: {
  selectedDokter: Dokter;
  activeTab: string;
  setActiveTab: (tab: string) => void;
}) => {
  const tabs = [
    {
      id: "profil",
      label: "Profil & Jadwal",
      icon: <Users className="h-4 w-4" />,
    },
    {
      id: "ulasan",
      label: `Ulasan (${selectedDokter.reviewsCount})`,
      icon: <Star className="h-4 w-4" />,
    },
    {
      id: "publikasi",
      label: "Publikasi & Pencapaian",
      icon: <BookOpen className="h-4 w-4" />,
    },
  ];

  return (
    <>
      {/* Tab Navigation */}
      <div className="border-b dark:border-gray-700 mb-6 flex justify-center">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-6 py-3 font-medium transition-colors relative ${
              activeTab === tab.id
                ? "text-red-600 border-b-2 border-red-500"
                : "text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
            }`}
          >
            {tab.icon}
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="min-h-[400px]">
        {activeTab === "profil" && (
          <div className="space-y-8 text-gray-700 dark:text-gray-300">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Expertise */}
              <div className="space-y-4">
                <h4 className="font-bold flex items-center gap-2 text-gray-800 dark:text-gray-200 text-lg">
                  <Sparkles className="text-yellow-500 h-5 w-5" />
                  Keahlian Utama
                </h4>
                <div className="space-y-2">
                  {selectedDokter.expertise.map((skill) => (
                    <div
                      key={skill}
                      className="flex items-center gap-2 p-2 bg-red-50 dark:bg-red-900/20 rounded-lg"
                    >
                      <CheckCircle className="h-4 w-4 text-red-600" />
                      <span className="text-sm">{skill}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Hospitals */}
              <div className="space-y-4">
                <h4 className="font-bold flex items-center gap-2 text-gray-800 dark:text-gray-200 text-lg">
                  <Hospital className="text-blue-500 h-5 w-5" />
                  Afiliasi Rumah Sakit
                </h4>
                <div className="space-y-2">
                  {selectedDokter.hospitals.map((hospital) => (
                    <div
                      key={hospital}
                      className="flex items-center gap-2 p-2 bg-blue-50 dark:bg-blue-900/20 rounded-lg"
                    >
                      <MapPin className="h-4 w-4 text-blue-600" />
                      <span className="text-sm">{hospital}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Schedule */}
            <div>
              <h4 className="font-bold flex items-center gap-2 mb-4 text-gray-800 dark:text-gray-200 text-lg">
                <CalendarDays className="text-green-500 h-5 w-5" />
                Jadwal Praktik
              </h4>
              <div className="grid gap-3 border dark:border-gray-700 rounded-lg p-4 bg-slate-50 dark:bg-slate-900/50">
                {Object.entries(selectedDokter.schedule).map(([day, time]) => (
                  <div
                    key={day}
                    className="flex justify-between items-center p-2 rounded bg-white dark:bg-gray-800 shadow-sm"
                  >
                    <span className="font-medium text-gray-800 dark:text-gray-200">
                      {day}
                    </span>
                    <span className="font-semibold text-gray-900 dark:text-white text-sm">
                      {time}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === "ulasan" && (
          <div className="space-y-6">
            {/* Review Summary */}
            <div className="bg-gradient-to-r from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20 rounded-lg p-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
                <div>
                  <div className="text-3xl font-bold text-gray-900 dark:text-white">
                    {selectedDokter.rating.toFixed(1)}
                  </div>
                  <StarRating rating={selectedDokter.rating} />
                  <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                    Dari {selectedDokter.reviewsCount} ulasan
                  </div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-green-600">
                    {Math.round(
                      (selectedDokter.patientReviews.filter(
                        (r) => r.rating >= 4
                      ).length /
                        selectedDokter.patientReviews.length) *
                        100
                    )}
                    %
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    Merekomendasikan
                  </div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-blue-600">
                    {
                      selectedDokter.patientReviews.filter((r) => r.verified)
                        .length
                    }
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    Ulasan Terverifikasi
                  </div>
                </div>
              </div>
            </div>

            {/* Individual Reviews */}
            <div className="space-y-6">
              <h5 className="font-semibold text-gray-800 dark:text-gray-200 text-lg">
                Ulasan Pasien
              </h5>
              {selectedDokter.patientReviews.map((review) => (
                <ReviewCard key={review.id} review={review} />
              ))}
            </div>
          </div>
        )}

        {activeTab === "publikasi" && (
          <div className="space-y-8">
            {/* Achievements */}
            <div>
              <h4 className="font-bold flex items-center gap-2 mb-6 text-gray-800 dark:text-gray-200 text-lg">
                <Award className="text-yellow-500 h-5 w-5" />
                Pencapaian & Penghargaan
              </h4>
              <div className="grid gap-4">
                {selectedDokter.achievements.map((achievement, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-4 p-4 bg-gradient-to-r from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20 rounded-lg border-l-4 border-yellow-400"
                  >
                    <div className="text-3xl">{achievement.icon}</div>
                    <div className="flex-1">
                      <h6 className="font-semibold text-gray-900 dark:text-white">
                        {achievement.title}
                      </h6>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {achievement.organization} • {achievement.year}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Publications */}
            <div>
              <h4 className="font-bold flex items-center gap-2 mb-6 text-gray-800 dark:text-gray-200 text-lg">
                <BookOpen className="text-blue-500 h-5 w-5" />
                Publikasi Ilmiah
              </h4>
              <div className="space-y-4">
                {selectedDokter.publications.map((publication, index) => (
                  <div
                    key={index}
                    className="p-4 border dark:border-gray-700 rounded-lg hover:shadow-md transition-shadow"
                  >
                    <h6 className="font-semibold text-gray-900 dark:text-white mb-2">
                      {publication.title}
                    </h6>
                    <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
                      <span className="flex items-center gap-1">
                        <BookOpen className="h-3 w-3" />
                        {publication.journal}
                      </span>
                      <span>{publication.year}</span>
                      {publication.citations && (
                        <span className="flex items-center gap-1 bg-blue-100 text-blue-700 px-2 py-1 rounded">
                          <TrendingUp className="h-3 w-3" />
                          {publication.citations} sitasi
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

// Main Component
const DokterKamiSection = () => {
  const [activeSpecialty, setActiveSpecialty] = useState("Semua");
  const [selectedDokter, setSelectedDokter] = useState<Dokter | null>(null);
  const [activeModalTab, setActiveModalTab] = useState("profil");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("rating");
  const [expandedCards, setExpandedCards] = useState<string[]>([]);

  const filteredAndSortedDokters = useMemo(() => {
    let filtered = dokters;

    // Filter by specialty
    if (activeSpecialty !== "Semua") {
      filtered = filtered.filter((d) => d.subSpecialty === activeSpecialty);
    }

    // Filter by search query
    if (searchQuery) {
      filtered = filtered.filter(
        (d) =>
          d.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          d.specialty.toLowerCase().includes(searchQuery.toLowerCase()) ||
          d.expertise.some((e) =>
            e.toLowerCase().includes(searchQuery.toLowerCase())
          )
      );
    }

    // Sort
    filtered = [...filtered].sort((a, b) => {
      switch (sortBy) {
        case "rating":
          return b.rating - a.rating;
        case "experience":
          return b.yearsActive - a.yearsActive;
        case "reviews":
          return b.reviewsCount - a.reviewsCount;
        case "availability":
          return (b.availableToday ? 1 : 0) - (a.availableToday ? 1 : 0);
        default:
          return 0;
      }
    });

    return filtered;
  }, [activeSpecialty, searchQuery, sortBy]);

  const handleOpenModal = (dokter: Dokter) => {
    setSelectedDokter(dokter);
    setActiveModalTab("profil");
  };

  const toggleCardExpansion = (dokterName: string) => {
    setExpandedCards((prev) =>
      prev.includes(dokterName)
        ? prev.filter((name) => name !== dokterName)
        : [...prev, dokterName]
    );
  };

  return (
    <section id="dokter-kami" className="py-20 bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Tim Dokter Spesialis Kami
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto mb-6">
            Konsultasi dengan para ahli jantung berpengalaman yang siap membantu
            Anda.
          </p>

          {/* Stats Overview */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-3xl mx-auto mb-8">
            <StatCard
              icon={<Stethoscope className="h-5 w-5" />}
              value={dokters.length}
              label="Dokter Spesialis"
            />
            <StatCard
              icon={<Users className="h-5 w-5" />}
              value={dokters
                .reduce((sum, d) => sum + d.totalPatients, 0)
                .toLocaleString()}
              label="Total Pasien"
            />
            <StatCard
              icon={<Star className="h-5 w-5" />}
              value={dokters.reduce((sum, d) => sum + d.reviewsCount, 0)}
              label="Total Ulasan"
            />
            <StatCard
              icon={<Activity className="h-5 w-5" />}
              value={dokters.filter((d) => d.availableToday).length}
              label="Tersedia Hari Ini"
            />
          </div>
        </div>

        {/* Search and Filters */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Cari dokter, spesialisasi, atau keahlian..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>

            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
            >
              {sortOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          {/* Specialty Filter Pills */}
          <div className="flex flex-wrap justify-center gap-2 mb-4">
            {specialties.map((spec) => (
              <Button
                key={spec}
                variant={activeSpecialty === spec ? "default" : "outline"}
                onClick={() => setActiveSpecialty(spec)}
                className={`relative ${
                  activeSpecialty === spec ? "bg-red-600 hover:bg-red-700" : ""
                }`}
              >
                {spec}
                {spec !== "Semua" && (
                  <Badge
                    variant="secondary"
                    className="ml-2 bg-white/20 text-xs"
                  >
                    {dokters.filter((d) => d.subSpecialty === spec).length}
                  </Badge>
                )}
              </Button>
            ))}
          </div>

          <div className="text-center text-sm text-gray-600 dark:text-gray-400">
            Menampilkan {filteredAndSortedDokters.length} dari {dokters.length}{" "}
            dokter
            {searchQuery && ` untuk "${searchQuery}"`}
          </div>
        </div>

        {/* Doctor Cards Grid */}
        <div className="grid gap-8 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
          {filteredAndSortedDokters.map((dokter) => (
            <DokterCard
              key={dokter.name}
              dokter={dokter}
              onProfilClick={handleOpenModal}
              isExpanded={expandedCards.includes(dokter.name)}
              onToggleExpand={() => toggleCardExpansion(dokter.name)}
            />
          ))}
        </div>

        {/* No Results */}
        {filteredAndSortedDokters.length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-400 mb-4">
              <Search className="h-16 w-16 mx-auto mb-4" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              Tidak ada dokter ditemukan
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              Coba ubah kriteria pencarian atau filter Anda
            </p>
            <Button
              onClick={() => {
                setSearchQuery("");
                setActiveSpecialty("Semua");
              }}
              variant="outline"
            >
              Reset Filter
            </Button>
          </div>
        )}
      </div>

      {/* Modal */}
      <Dialog
        open={!!selectedDokter}
        onOpenChange={(isOpen) => !isOpen && setSelectedDokter(null)}
      >
        <DialogContent className="w-[95vw] max-w-4xl max-h-[90vh] overflow-y-auto p-0 gap-0 rounded-xl bg-white dark:bg-gray-900">
          {selectedDokter && (
            <div className="flex flex-col w-full">
              {/* Modal Header */}
              <DialogHeader className="sticky top-0 z-50 bg-gradient-to-r from-red-50 to-pink-50 dark:from-red-900/20 dark:to-pink-900/20 p-6">
                <Avatar className="w-32 h-32 mx-auto ring-4 ring-offset-4 dark:ring-offset-gray-900 ring-red-500 shadow-lg">
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
                  <div className="flex justify-center items-center gap-4 mt-3">
                    <StarRating rating={selectedDokter.rating} showNumber />
                    <span className="text-sm text-gray-500 dark:text-gray-400">
                      ({selectedDokter.reviewsCount} ulasan)
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
                  <StatCard
                    icon={<Users className="h-4 w-4" />}
                    value={selectedDokter.totalPatients.toLocaleString()}
                    label="Pasien"
                    className="bg-white/60 dark:bg-gray-800/60"
                  />
                  <StatCard
                    icon={<TrendingUp className="h-4 w-4" />}
                    value={`${selectedDokter.successRate}%`}
                    label="Tingkat Sukses"
                    className="bg-white/60 dark:bg-gray-800/60"
                  />
                  <StatCard
                    icon={<Clock className="h-4 w-4" />}
                    value={selectedDokter.responseTime}
                    label="Waktu Respon"
                    className="bg-white/60 dark:bg-gray-800/60"
                  />
                  <StatCard
                    icon={<Heart className="h-4 w-4" />}
                    value={selectedDokter.consultationFee}
                    label="Konsultasi"
                    className="bg-white/60 dark:bg-gray-800/60"
                  />
                </div>
              </DialogHeader>

              {/* Modal Content */}
              <div className="flex-1 p-6 overflow-y-auto">
                <p className="text-gray-600 dark:text-gray-400 italic mb-6 text-lg">
                  "{selectedDokter.bio}"
                </p>

                <ModalContent
                  selectedDokter={selectedDokter}
                  activeTab={activeModalTab}
                  setActiveTab={setActiveModalTab}
                />
              </div>

              {/* Modal Footer */}
              <div className="sticky bottom-0 z-50 border-t dark:border-gray-700 p-6 bg-gradient-to-r from-red-50 to-pink-50 dark:from-red-900/20 dark:to-pink-900/20">
                <div className="flex flex-col md:flex-row gap-4 justify-center">
                  <Button
                    size="lg"
                    className="bg-red-600 hover:bg-red-700 flex items-center gap-2"
                  >
                    <Calendar className="h-5 w-5" />
                    Buat Janji Temu
                  </Button>

                  {selectedDokter.onlineConsultation && (
                    <Button
                      size="lg"
                      variant="outline"
                      className="flex items-center gap-2"
                    >
                      <MessageCircle className="h-5 w-5" />
                      Konsultasi Online
                    </Button>
                  )}

                  <Button
                    size="lg"
                    variant="outline"
                    className="flex items-center gap-2"
                  >
                    <Phone className="h-5 w-5" />
                    Hubungi Langsung
                  </Button>
                </div>

                {selectedDokter.emergencyAvailable && (
                  <div className="text-center mt-4 p-3 bg-red-100 dark:bg-red-900/20 rounded-lg">
                    <p className="text-sm text-red-700 dark:text-red-400 font-medium">
                      🚨 Tersedia untuk konsultasi darurat 24/7
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </section>
  );
};

export default DokterKamiSection;

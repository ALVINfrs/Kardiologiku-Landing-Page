import { useState, useMemo, useEffect } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
  ArrowLeft,
  Filter,
  ChevronDown,
  BarChart,
  PieChart,
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import {
  BarChart as RechartsBarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts"; // Assume we import recharts for charts
import { PieChart as RechartsPieChart, Pie, Cell, Legend } from "recharts";

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
  replies?: { author: string; comment: string }[];
}

interface Achievement {
  title: string;
  year: string;
  organization: string;
  icon: string;
  description: string;
}

interface Publication {
  title: string;
  journal: string;
  year: string;
  citations?: number;
  abstract?: string;
}

interface CaseStudy {
  title: string;
  description: string;
  outcome: string;
  year: string;
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
    twitter?: string;
  };
  caseStudies: CaseStudy[];
  ratingDistribution: { [key: number]: number }; // e.g., {5: 100, 4: 50, ...}
  monthlyPatients: { month: string; patients: number }[]; // For chart
}

// Expanded Mock Data (Made more complex with more doctors and data)
const dokters: Dokter[] = [
  {
    name: "Dr. Sarah Wijaya, Sp.JP(K)",
    specialty: "Kardiologi Elektrofisiologi",
    subSpecialty: "Elektrofisiologi",
    experience: "15+ tahun",
    education: "Universitas Indonesia",
    avatar: "/api/placeholder/150/150?text=SW",
    bio: "Ahli elektrofisiologi terkemuka dengan fokus pada diagnosis dan pengobatan aritmia kompleks. Telah menangani kasus-kasus langka di Asia Tenggara.",
    expertise: [
      "Ablasi Fibrilasi Atrium",
      "Implantasi Pacu Jantung & ICD",
      "Studi Elektrofisiologi",
      "Manajemen Sinkop",
      "Terapi Gen untuk Aritmia",
    ],
    hospitals: [
      "RS Jantung Harapan Bangsa",
      "Klinik Kardiologi Sentra Medika",
      "RS Internasional Jakarta",
    ],
    rating: 4.9,
    reviewsCount: 182,
    schedule: {
      Senin: "09:00 - 13:00",
      Rabu: "14:00 - 17:00",
      Jumat: "09:00 - 12:00",
      Sabtu: "10:00 - 14:00",
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
        replies: [
          { author: "Dr. Sarah", comment: "Terima kasih atas kepercayaannya!" },
        ],
      },
      {
        id: 2,
        patientName: "Anna L.",
        date: "15 Jun 2025",
        rating: 4.5,
        comment: "Pengalaman yang baik, tapi jadwal agak padat.",
        verified: true,
        helpful: 15,
        condition: "Aritmia",
      },
    ],
    languages: ["Indonesia", "English", "Mandarin", "Japanese"],
    certifications: [
      "Board Certified Cardiologist",
      "Fellowship Electrophysiology",
      "ACLS Certified",
      "International EP Society Member",
    ],
    achievements: [
      {
        title: "Best Cardiologist Award",
        year: "2024",
        organization: "Indonesian Heart Association",
        icon: "🏆",
        description:
          "Diberikan atas kontribusi inovatif dalam elektrofisiologi.",
      },
      {
        title: "Research Excellence",
        year: "2023",
        organization: "Asia Pacific Cardiology",
        icon: "🔬",
        description: "Untuk penelitian tentang aritmia genetik.",
      },
    ],
    publications: [
      {
        title: "Advanced Electrophysiology Techniques",
        journal: "Cardiology Today",
        year: "2024",
        citations: 45,
        abstract:
          "Studi tentang teknik ablasi baru untuk fibrilasi atrium refraktori.",
      },
      {
        title: "Genetic Factors in Arrhythmia",
        journal: "Journal of Heart Rhythm",
        year: "2023",
        citations: 67,
        abstract: "Analisis genetik pada pasien Asia dengan aritmia.",
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
      twitter: "twitter.com/sarahwijaya_md",
    },
    caseStudies: [
      {
        title: "Kasus Aritmia Langka pada Atlet Muda",
        description: "Pasien 25 tahun dengan SVT refraktori.",
        outcome: "Sukses ablasi, kembali ke aktivitas olahraga.",
        year: "2024",
      },
    ],
    ratingDistribution: { 5: 150, 4: 25, 3: 5, 2: 1, 1: 1 },
    monthlyPatients: [
      { month: "Jan", patients: 120 },
      { month: "Feb", patients: 130 },
      { month: "Mar", patients: 140 },
      { month: "Apr", patients: 110 },
      { month: "Mei", patients: 150 },
      { month: "Jun", patients: 160 },
    ],
  },
  {
    name: "Dr. Budi Hartono, Sp.JP(K)",
    specialty: "Kardiologi Intervensi",
    subSpecialty: "Intervensi",
    experience: "18+ tahun",
    education: "Universitas Gadjah Mada",
    avatar: "/api/placeholder/150/150?text=BH",
    bio: "Pengalaman luas dalam prosedur intervensi koroner, menangani ribuan kasus penyakit jantung koroner. Pelopor teknik minimally invasive di Indonesia.",
    expertise: [
      "Angioplasti Koroner (PCI/Stent)",
      "Kateterisasi Jantung Diagnostik",
      "Intervensi Struktural",
      "Manajemen Serangan Jantung Akut",
      "TAVR (Transcatheter Aortic Valve Replacement)",
    ],
    hospitals: [
      "RS Utama Medika",
      "Pusat Jantung Nasional",
      "RS Premier Surabaya",
    ],
    rating: 4.8,
    reviewsCount: 235,
    schedule: {
      Selasa: "10:00 - 14:00",
      Kamis: "09:00 - 13:00",
      Sabtu: "08:00 - 11:00",
      Minggu: "Emergensi Only",
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
        replies: [],
      },
      {
        id: 2,
        patientName: "Siti K.",
        date: "10 Mei 2025",
        rating: 4.8,
        comment: "Prosedur cepat dan pemulihan lancar.",
        verified: true,
        helpful: 20,
        condition: "Infark Miokard",
      },
    ],
    languages: ["Indonesia", "English", "Jerman"],
    certifications: [
      "Interventional Cardiology",
      "SCAI Certified",
      "Emergency Medicine",
      "TAVR Specialist",
    ],
    achievements: [
      {
        title: "Outstanding Physician",
        year: "2024",
        organization: "Medical Board",
        icon: "🎖️",
        description: "Atas keberhasilan dalam prosedur kompleks.",
      },
    ],
    publications: [
      {
        title: "Complex PCI Procedures",
        journal: "Interventional Cardiology",
        year: "2024",
        citations: 52,
        abstract: "Pendekatan baru untuk PCI pada pasien berisiko tinggi.",
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
      twitter: "twitter.com/budihartono_md",
    },
    caseStudies: [
      {
        title: "Intervensi pada Pasien Lansia dengan Komorbiditas",
        description: "Pasien 78 tahun dengan diabetes dan hipertensi.",
        outcome: "Stent sukses, komplikasi minimal.",
        year: "2023",
      },
    ],
    ratingDistribution: { 5: 180, 4: 40, 3: 10, 2: 3, 1: 2 },
    monthlyPatients: [
      { month: "Jan", patients: 200 },
      { month: "Feb", patients: 210 },
      { month: "Mar", patients: 190 },
      { month: "Apr", patients: 220 },
      { month: "Mei", patients: 230 },
      { month: "Jun", patients: 240 },
    ],
  },
  {
    name: "Dr. Maya Sari, Sp.A, Sp.JP",
    specialty: "Kardiologi Pediatrik",
    subSpecialty: "Pediatrik",
    experience: "10+ tahun",
    education: "Universitas Padjadjaran",
    avatar: "/api/placeholder/150/150?text=MS",
    bio: "Dedikasi untuk kesehatan jantung anak-anak, ahli dalam penyakit jantung bawaan. Kolaborasi dengan organisasi internasional untuk kasus-kasus kompleks.",
    expertise: [
      "Penyakit Jantung Bawaan",
      "Ekokardiografi Pediatrik",
      "Aritmia pada Anak",
      "Manajemen Gagal Jantung Anak",
      "Intervensi Kateter pada Bayi",
    ],
    hospitals: [
      "RSIA Bunda Kasih",
      "RS Jantung Harapan Bangsa",
      "RS Anak Bandung",
    ],
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
    languages: ["Indonesia", "English", "Jawa", "Sunda"],
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
        description: "Untuk kontribusi dalam pengobatan jantung bawaan.",
      },
    ],
    publications: [
      {
        title: "Congenital Heart Disease in Indonesia",
        journal: "Pediatric Cardiology",
        year: "2024",
        citations: 28,
        abstract: "Epidemiologi dan manajemen di negara berkembang.",
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
    caseStudies: [],
    ratingDistribution: { 5: 80, 4: 15, 3: 2, 2: 1, 1: 0 },
    monthlyPatients: [
      { month: "Jan", patients: 80 },
      { month: "Feb", patients: 90 },
      { month: "Mar", patients: 100 },
      { month: "Apr", patients: 70 },
      { month: "Mei", patients: 110 },
      { month: "Jun", patients: 120 },
    ],
  },
  {
    name: "Dr. Ahmad Rahman, Sp.JP",
    specialty: "Kardiologi Pencegahan & Rehabilitasi",
    subSpecialty: "Pencegahan & Rehabilitasi",
    experience: "12+ tahun",
    education: "Universitas Airlangga",
    avatar: "/api/placeholder/150/150?text=AR",
    bio: "Spesialis dalam pencegahan penyakit jantung dan program rehabilitasi pasca-operasi.",
    expertise: [
      "Program Rehabilitasi Kardio",
      "Pencegahan Penyakit Jantung",
      "Manajemen Risiko Kardiovaskular",
      "Nutrisi & Latihan untuk Pasien Jantung",
    ],
    hospitals: ["RS Rehabilitasi Jantung", "Klinik Pencegahan Medika"],
    rating: 4.7,
    reviewsCount: 145,
    schedule: {
      Senin: "08:00 - 12:00",
      Selasa: "13:00 - 17:00",
      Kamis: "09:00 - 13:00",
    },
    patientReviews: [
      {
        id: 1,
        patientName: "Dewi P.",
        date: "10 Aug 2025",
        rating: 5,
        comment: "Program rehabilitasi sangat membantu pemulihan saya.",
        verified: true,
        helpful: 18,
        condition: "Pasca Bypass",
      },
    ],
    languages: ["Indonesia", "English"],
    certifications: [
      "Cardiac Rehabilitation Specialist",
      "Preventive Cardiology",
    ],
    achievements: [
      {
        title: "Prevention Innovator Award",
        year: "2024",
        organization: "Heart Health Indonesia",
        icon: "🛡️",
        description: "Untuk program pencegahan massal.",
      },
    ],
    publications: [
      {
        title: "Rehabilitation Strategies Post-MI",
        journal: "Preventive Medicine",
        year: "2024",
        citations: 35,
        abstract: "Strategi rehabilitasi pasca infark miokard.",
      },
    ],
    consultationFee: "Rp 400.000",
    responseTime: "< 4 jam",
    availableToday: true,
    onlineConsultation: true,
    emergencyAvailable: false,
    totalPatients: 2200,
    successRate: 95,
    yearsActive: 12,
    socialMedia: {
      linkedin: "linkedin.com/in/ahmadrahman",
    },
    caseStudies: [
      {
        title: "Program Pencegahan untuk Komunitas",
        description: "Intervensi pada 500 pasien berisiko.",
        outcome: "Penurunan insiden 20%.",
        year: "2024",
      },
    ],
    ratingDistribution: { 5: 100, 4: 30, 3: 10, 2: 4, 1: 1 },
    monthlyPatients: [
      { month: "Jan", patients: 150 },
      { month: "Feb", patients: 160 },
      { month: "Mar", patients: 170 },
      { month: "Apr", patients: 140 },
      { month: "Mei", patients: 180 },
      { month: "Jun", patients: 190 },
    ],
  },
  // Add more doctors if needed for pagination demo
  {
    name: "Dr. Lina Kusuma, Sp.JP(K)",
    specialty: "Kardiologi Elektrofisiologi",
    subSpecialty: "Elektrofisiologi",
    experience: "8+ tahun",
    education: "Universitas Brawijaya",
    avatar: "/api/placeholder/150/150?text=LK",
    bio: "Ahli muda dengan fokus pada teknologi baru dalam elektrofisiologi.",
    expertise: [
      "Mapping 3D Aritmia",
      "Implantasi Device Nirkabel",
      "Studi EP Lanjutan",
      "Manajemen Aritmia Genetik",
    ],
    hospitals: ["RS Modern Heart", "Klinik EP Nusantara"],
    rating: 4.6,
    reviewsCount: 120,
    schedule: {
      Senin: "10:00 - 14:00",
      Rabu: "15:00 - 19:00",
    },
    patientReviews: [
      {
        id: 1,
        patientName: "Rudi T.",
        date: "5 Sep 2025",
        rating: 4.5,
        comment: "Teknologi canggih yang digunakan sangat membantu.",
        verified: true,
        helpful: 12,
        condition: "Tachycardia",
      },
    ],
    languages: ["Indonesia", "English", "French"],
    certifications: ["EP Fellowship", "Device Implantation Certified"],
    achievements: [
      {
        title: "Young Investigator Award",
        year: "2024",
        organization: "EP Society",
        icon: "🌟",
        description: "Untuk riset mapping 3D.",
      },
    ],
    publications: [
      {
        title: "3D Mapping in EP",
        journal: "EP Journal",
        year: "2024",
        citations: 20,
        abstract: "Aplikasi mapping 3D dalam ablasi.",
      },
    ],
    consultationFee: "Rp 450.000",
    responseTime: "< 2 jam",
    availableToday: false,
    onlineConsultation: true,
    emergencyAvailable: true,
    totalPatients: 1500,
    successRate: 93,
    yearsActive: 8,
    socialMedia: {
      website: "linakusuma-ep.com",
    },
    caseStudies: [],
    ratingDistribution: { 5: 80, 4: 30, 3: 8, 2: 1, 1: 1 },
    monthlyPatients: [
      { month: "Jan", patients: 100 },
      { month: "Feb", patients: 110 },
      { month: "Mar", patients: 120 },
      { month: "Apr", patients: 90 },
      { month: "Mei", patients: 130 },
      { month: "Jun", patients: 140 },
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
const sortOptions = [
  { value: "rating", label: "Rating Tertinggi" },
  { value: "experience", label: "Pengalaman" },
  { value: "reviews", label: "Jumlah Ulasan" },
  { value: "availability", label: "Tersedia Hari Ini" },
  { value: "successRate", label: "Tingkat Sukses" },
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
  onSelect,
  isExpanded,
  onToggleExpand,
}: {
  dokter: Dokter;
  onSelect: (d: Dokter) => void;
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
                {dokter.expertise.map((skill) => (
                  <Badge
                    key={skill}
                    className="text-xs bg-red-50 text-red-700 hover:bg-red-100"
                  >
                    {skill}
                  </Badge>
                ))}
              </div>
            </div>

            {dokter.achievements.length > 0 && (
              <div>
                <h4 className="font-semibold text-sm text-gray-800 dark:text-gray-200 mb-2 flex items-center">
                  <Award className="h-4 w-4 mr-1 text-blue-500" />
                  Pencapaian Terbaru
                </h4>
                <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-2 space-y-2">
                  {dokter.achievements.map((ach, idx) => (
                    <div key={idx} className="flex items-center gap-2">
                      <span className="text-lg">{ach.icon}</span>
                      <div>
                        <p className="text-xs font-medium text-gray-800 dark:text-gray-200">
                          {ach.title}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          {ach.organization} • {ach.year}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div>
              <h4 className="font-semibold text-sm text-gray-800 dark:text-gray-200 mb-2 flex items-center">
                <CalendarDays className="h-4 w-4 mr-1 text-green-500" />
                Jadwal Terdekat
              </h4>
              <div className="text-xs text-gray-600 dark:text-gray-400 space-y-1">
                {Object.entries(dokter.schedule).map(([day, time]) => (
                  <div key={day} className="flex justify-between">
                    <span>{day}</span>
                    <span className="font-medium">{time}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="pt-4 space-y-2 mt-auto">
          <div className="flex gap-2">
            <Button
              onClick={() => onSelect(dokter)}
              className="flex-1 bg-red-600 hover:bg-red-700"
              size="sm"
            >
              <Eye className="h-4 w-4 mr-1" />
              Lihat Profil Lengkap
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
  const [showReplies, setShowReplies] = useState(false);

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
      {review.replies && review.replies.length > 0 && (
        <button
          onClick={() => setShowReplies(!showReplies)}
          className="text-xs text-blue-600 hover:underline mb-2"
        >
          {showReplies
            ? "Sembunyikan Balasan"
            : `Lihat ${review.replies.length} Balasan`}
        </button>
      )}
      {showReplies &&
        review.replies?.map((reply, idx) => (
          <div
            key={idx}
            className="ml-4 p-2 bg-gray-50 dark:bg-gray-800 rounded mb-2"
          >
            <p className="text-xs font-semibold">{reply.author}</p>
            <p className="text-xs text-gray-600 dark:text-gray-400">
              {reply.comment}
            </p>
          </div>
        ))}
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

const DokterDetailView = ({
  selectedDokter,
  onBack,
}: {
  selectedDokter: Dokter;
  onBack: () => void;
}) => {
  const [setActiveTab] = useState("profil");

  const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884d8"];

  const pieData = Object.entries(selectedDokter.ratingDistribution).map(
    ([rating, count]) => ({
      name: `${rating} Bintang`,
      value: count,
    })
  );

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div className="relative">
        <button
          onClick={onBack}
          className="absolute top-4 left-4 flex items-center gap-2 text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
        >
          <ArrowLeft className="h-5 w-5" />
          Kembali ke Daftar
        </button>
        <div className="text-center pt-12 pb-6 bg-gradient-to-r from-red-50 to-pink-50 dark:from-red-900/20 dark:to-pink-900/20 rounded-xl shadow-lg">
          <Avatar className="w-40 h-40 mx-auto ring-4 ring-offset-4 ring-red-500 shadow-xl mb-4">
            <AvatarImage
              src={selectedDokter.avatar}
              alt={selectedDokter.name}
            />
            <AvatarFallback className="text-4xl bg-red-100 text-red-600">
              {selectedDokter.name
                .split(" ")
                .map((n) => n[0])
                .join("")}
            </AvatarFallback>
          </Avatar>
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            {selectedDokter.name}
          </h2>
          <p className="text-red-600 font-semibold text-lg mb-4">
            {selectedDokter.specialty}
          </p>
          <div className="flex justify-center items-center gap-4 mb-6">
            <StarRating rating={selectedDokter.rating} showNumber />
            <span className="text-sm text-gray-500 dark:text-gray-400">
              ({selectedDokter.reviewsCount} ulasan)
            </span>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto px-4">
            <StatCard
              icon={<Users className="h-5 w-5" />}
              value={selectedDokter.totalPatients.toLocaleString()}
              label="Total Pasien"
            />
            <StatCard
              icon={<TrendingUp className="h-5 w-5" />}
              value={`${selectedDokter.successRate}%`}
              label="Tingkat Sukses"
            />
            <StatCard
              icon={<Clock className="h-5 w-5" />}
              value={selectedDokter.responseTime}
              label="Waktu Respon"
            />
            <StatCard
              icon={<Heart className="h-5 w-5" />}
              value={selectedDokter.consultationFee}
              label="Biaya Konsultasi"
            />
          </div>
        </div>
      </div>

      {/* Bio */}
      <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md">
        <h3 className="font-bold text-xl mb-4 flex items-center gap-2">
          <Stethoscope className="h-6 w-6 text-red-600" />
          Biografi
        </h3>
        <p className="text-gray-600 dark:text-gray-300 italic text-lg">
          "{selectedDokter.bio}"
        </p>
      </div>

      {/* Tabs */}
      <Tabs
        defaultValue="profil"
        className="space-y-6"
        onValueChange={setActiveTab}
      >
        <TabsList className="justify-center bg-transparent border-b dark:border-gray-700">
          <TabsTrigger
            value="profil"
            className="flex items-center gap-2 px-6 py-3"
          >
            <Users className="h-4 w-4" />
            Profil & Jadwal
          </TabsTrigger>
          <TabsTrigger
            value="ulasan"
            className="flex items-center gap-2 px-6 py-3"
          >
            <Star className="h-4 w-4" />
            Ulasan ({selectedDokter.reviewsCount})
          </TabsTrigger>
          <TabsTrigger
            value="publikasi"
            className="flex items-center gap-2 px-6 py-3"
          >
            <BookOpen className="h-4 w-4" />
            Publikasi & Pencapaian
          </TabsTrigger>
          <TabsTrigger
            value="kasus"
            className="flex items-center gap-2 px-6 py-3"
          >
            <Activity className="h-4 w-4" />
            Studi Kasus
          </TabsTrigger>
          <TabsTrigger
            value="statistik"
            className="flex items-center gap-2 px-6 py-3"
          >
            <BarChart className="h-4 w-4" />
            Statistik
          </TabsTrigger>
        </TabsList>

        <TabsContent value="profil" className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Expertise */}
            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md">
              <h4 className="font-bold flex items-center gap-2 text-gray-800 dark:text-gray-200 text-lg mb-4">
                <Sparkles className="text-yellow-500 h-5 w-5" />
                Keahlian Utama
              </h4>
              <div className="space-y-3">
                {selectedDokter.expertise.map((skill, idx) => (
                  <div
                    key={idx}
                    className="flex items-center gap-3 p-3 bg-red-50 dark:bg-red-900/20 rounded-lg hover:shadow-inner transition-shadow"
                  >
                    <CheckCircle className="h-5 w-5 text-red-600 flex-shrink-0" />
                    <span className="text-sm">{skill}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Hospitals */}
            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md">
              <h4 className="font-bold flex items-center gap-2 text-gray-800 dark:text-gray-200 text-lg mb-4">
                <Hospital className="text-blue-500 h-5 w-5" />
                Afiliasi Rumah Sakit
              </h4>
              <div className="space-y-3">
                {selectedDokter.hospitals.map((hospital, idx) => (
                  <div
                    key={idx}
                    className="flex items-center gap-3 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg hover:shadow-inner transition-shadow"
                  >
                    <MapPin className="h-5 w-5 text-blue-600 flex-shrink-0" />
                    <span className="text-sm">{hospital}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Certifications & Languages */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md">
              <h4 className="font-bold flex items-center gap-2 text-gray-800 dark:text-gray-200 text-lg mb-4">
                <Award className="text-purple-500 h-5 w-5" />
                Sertifikasi
              </h4>
              <div className="flex flex-wrap gap-2">
                {selectedDokter.certifications.map((cert) => (
                  <Badge
                    key={cert}
                    variant="outline"
                    className="text-sm py-1 px-3"
                  >
                    {cert}
                  </Badge>
                ))}
              </div>
            </div>
            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md">
              <h4 className="font-bold flex items-center gap-2 text-gray-800 dark:text-gray-200 text-lg mb-4">
                <Globe className="text-green-500 h-5 w-5" />
                Bahasa
              </h4>
              <div className="flex flex-wrap gap-2">
                {selectedDokter.languages.map((lang) => (
                  <Badge
                    key={lang}
                    className="bg-green-100 text-green-700 text-sm py-1 px-3"
                  >
                    {lang}
                  </Badge>
                ))}
              </div>
            </div>
          </div>

          {/* Schedule */}
          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md">
            <h4 className="font-bold flex items-center gap-2 mb-4 text-gray-800 dark:text-gray-200 text-lg">
              <CalendarDays className="text-green-500 h-5 w-5" />
              Jadwal Praktik
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {Object.entries(selectedDokter.schedule).map(([day, time]) => (
                <div
                  key={day}
                  className="flex justify-between items-center p-4 rounded-lg bg-gray-50 dark:bg-gray-700 shadow-sm hover:shadow-md transition-shadow"
                >
                  <span className="font-medium text-gray-800 dark:text-gray-200">
                    {day}
                  </span>
                  <span className="font-semibold text-gray-900 dark:text-white">
                    {time}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Social Media */}
          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md">
            <h4 className="font-bold flex items-center gap-2 mb-4 text-gray-800 dark:text-gray-200 text-lg">
              <Share2 className="text-indigo-500 h-5 w-5" />
              Media Sosial
            </h4>
            <div className="flex gap-4">
              {selectedDokter.socialMedia.linkedin && (
                <a
                  href={selectedDokter.socialMedia.linkedin}
                  className="text-blue-600 hover:underline"
                >
                  LinkedIn
                </a>
              )}
              {selectedDokter.socialMedia.website && (
                <a
                  href={selectedDokter.socialMedia.website}
                  className="text-green-600 hover:underline"
                >
                  Website
                </a>
              )}
              {selectedDokter.socialMedia.twitter && (
                <a
                  href={selectedDokter.socialMedia.twitter}
                  className="text-sky-600 hover:underline"
                >
                  Twitter
                </a>
              )}
            </div>
          </div>
        </TabsContent>

        <TabsContent value="ulasan" className="space-y-8">
          {/* Review Summary */}
          <div className="bg-gradient-to-r from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20 rounded-xl p-8 shadow-md">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
              <div className="space-y-2">
                <div className="text-4xl font-bold text-gray-900 dark:text-white">
                  {selectedDokter.rating.toFixed(1)}
                </div>
                <StarRating rating={selectedDokter.rating} />
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  Dari {selectedDokter.reviewsCount} ulasan
                </div>
              </div>
              <div className="space-y-2">
                <div className="text-4xl font-bold text-green-600">
                  {Math.round(
                    (selectedDokter.patientReviews.filter((r) => r.rating >= 4)
                      .length /
                      selectedDokter.patientReviews.length) *
                      100
                  )}
                  %
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  Merekomendasikan Dokter Ini
                </div>
              </div>
              <div className="space-y-2">
                <div className="text-4xl font-bold text-blue-600">
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
          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md space-y-6">
            <h5 className="font-semibold text-gray-800 dark:text-gray-200 text-xl">
              Ulasan Pasien Terbaru
            </h5>
            {selectedDokter.patientReviews.map((review) => (
              <ReviewCard key={review.id} review={review} />
            ))}
            {selectedDokter.patientReviews.length <
              selectedDokter.reviewsCount && (
              <Button variant="outline" className="mx-auto block">
                Muat Lebih Banyak Ulasan
              </Button>
            )}
          </div>
        </TabsContent>

        <TabsContent value="publikasi" className="space-y-8">
          {/* Achievements */}
          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md">
            <h4 className="font-bold flex items-center gap-2 mb-6 text-gray-800 dark:text-gray-200 text-xl">
              <Award className="text-yellow-500 h-6 w-6" />
              Pencapaian & Penghargaan
            </h4>
            <div className="grid gap-6 md:grid-cols-2">
              {selectedDokter.achievements.map((achievement, index) => (
                <div
                  key={index}
                  className="p-6 bg-gradient-to-r from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20 rounded-lg border-l-4 border-yellow-400 shadow hover:shadow-lg transition-shadow"
                >
                  <div className="flex items-center gap-4 mb-3">
                    <span className="text-4xl">{achievement.icon}</span>
                    <div>
                      <h6 className="font-semibold text-lg text-gray-900 dark:text-white">
                        {achievement.title}
                      </h6>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {achievement.organization} • {achievement.year}
                      </p>
                    </div>
                  </div>
                  <p className="text-sm text-gray-700 dark:text-gray-300">
                    {achievement.description}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Publications */}
          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md">
            <h4 className="font-bold flex items-center gap-2 mb-6 text-gray-800 dark:text-gray-200 text-xl">
              <BookOpen className="text-blue-500 h-6 w-6" />
              Publikasi Ilmiah
            </h4>
            <div className="space-y-6">
              {selectedDokter.publications.map((publication, index) => (
                <div
                  key={index}
                  className="p-6 border dark:border-gray-700 rounded-lg hover:shadow-lg transition-shadow"
                >
                  <h6 className="font-semibold text-lg text-gray-900 dark:text-white mb-3">
                    {publication.title}
                  </h6>
                  <div className="flex items-center gap-6 text-sm text-gray-600 dark:text-gray-400 mb-3">
                    <span className="flex items-center gap-2">
                      <BookOpen className="h-4 w-4" />
                      {publication.journal}
                    </span>
                    <span>{publication.year}</span>
                    {publication.citations && (
                      <span className="flex items-center gap-2 bg-blue-100 text-blue-700 px-3 py-1 rounded-full">
                        <TrendingUp className="h-4 w-4" />
                        {publication.citations} sitasi
                      </span>
                    )}
                  </div>
                  {publication.abstract && (
                    <p className="text-sm text-gray-700 dark:text-gray-300 italic">
                      Abstrak: {publication.abstract}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>
        </TabsContent>

        <TabsContent value="kasus" className="space-y-8">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md">
            <h4 className="font-bold flex items-center gap-2 mb-6 text-gray-800 dark:text-gray-200 text-xl">
              <Activity className="text-red-500 h-6 w-6" />
              Studi Kasus Pilihan
            </h4>
            {selectedDokter.caseStudies.length > 0 ? (
              <div className="grid gap-6 md:grid-cols-2">
                {selectedDokter.caseStudies.map((caseStudy, index) => (
                  <div
                    key={index}
                    className="p-6 bg-gradient-to-r from-red-50 to-pink-50 dark:from-red-900/20 dark:to-pink-900/20 rounded-lg shadow hover:shadow-lg transition-shadow"
                  >
                    <h6 className="font-semibold text-lg text-gray-900 dark:text-white mb-3">
                      {caseStudy.title}
                    </h6>
                    <p className="text-sm text-gray-700 dark:text-gray-300 mb-3">
                      {caseStudy.description}
                    </p>
                    <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400">
                      <span>Outcome: {caseStudy.outcome}</span>
                      <span>{caseStudy.year}</span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-center text-gray-500 dark:text-gray-400">
                Tidak ada studi kasus tersedia saat ini.
              </p>
            )}
          </div>
        </TabsContent>

        <TabsContent value="statistik" className="space-y-8">
          {/* Monthly Patients Chart */}
          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md">
            <h4 className="font-bold flex items-center gap-2 mb-6 text-gray-800 dark:text-gray-200 text-xl">
              <BarChart className="text-purple-500 h-6 w-6" />
              Pasien Bulanan (6 Bulan Terakhir)
            </h4>
            <ResponsiveContainer width="100%" height={300}>
              <RechartsBarChart data={selectedDokter.monthlyPatients}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="patients" fill="#8884d8" />
              </RechartsBarChart>
            </ResponsiveContainer>
          </div>

          {/* Rating Distribution Pie */}
          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md">
            <h4 className="font-bold flex items-center gap-2 mb-6 text-gray-800 dark:text-gray-200 text-xl">
              <PieChart className="text-orange-500 h-6 w-6" />
              Distribusi Rating
            </h4>
            <ResponsiveContainer width="100%" height={300}>
              <RechartsPieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, percent }) =>
                    `${name} ${(percent * 100).toFixed(0)}%`
                  }
                >
                  {pieData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </RechartsPieChart>
            </ResponsiveContainer>
          </div>
        </TabsContent>
      </Tabs>

      {/* Footer Actions */}
      <div className="fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-900 border-t dark:border-gray-700 p-6 shadow-lg z-50 md:static md:shadow-none md:border-0 md:p-0">
        <div className="flex flex-col md:flex-row gap-4 justify-center max-w-4xl mx-auto">
          <Button
            size="lg"
            className="bg-red-600 hover:bg-red-700 flex items-center gap-2 flex-1"
          >
            <Calendar className="h-5 w-5" />
            Buat Janji Temu
          </Button>

          {selectedDokter.onlineConsultation && (
            <Button
              size="lg"
              variant="outline"
              className="flex items-center gap-2 flex-1"
            >
              <MessageCircle className="h-5 w-5" />
              Konsultasi Online
            </Button>
          )}

          <Button
            size="lg"
            variant="outline"
            className="flex items-center gap-2 flex-1"
          >
            <Phone className="h-5 w-5" />
            Hubungi Langsung
          </Button>
        </div>

        {selectedDokter.emergencyAvailable && (
          <div className="text-center mt-4 p-3 bg-red-100 dark:bg-red-900/20 rounded-lg max-w-4xl mx-auto">
            <p className="text-sm text-red-700 dark:text-red-400 font-medium">
              🚨 Tersedia untuk konsultasi darurat 24/7
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

// Main Component
const DokterKamiSection = () => {
  const [activeSpecialty, setActiveSpecialty] = useState("Semua");
  const [selectedDokter, setSelectedDokter] = useState<Dokter | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("rating");
  const [expandedCards, setExpandedCards] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(3); // Pagination: 3 cards per page
  const [advancedFilters, setAdvancedFilters] = useState({
    languages: [] as string[],
    hospitals: [] as string[],
    minRating: 0,
  });

  // Extract unique filters from data
  const uniqueLanguages = useMemo(
    () => Array.from(new Set(dokters.flatMap((d) => d.languages))),
    []
  );
  const uniqueHospitals = useMemo(
    () => Array.from(new Set(dokters.flatMap((d) => d.hospitals))),
    []
  );

  const filteredAndSortedDokters = useMemo(() => {
    let filtered = dokters;

    // Specialty filter
    if (activeSpecialty !== "Semua") {
      filtered = filtered.filter((d) => d.subSpecialty === activeSpecialty);
    }

    // Search query
    if (searchQuery) {
      const lowerQuery = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (d) =>
          d.name.toLowerCase().includes(lowerQuery) ||
          d.specialty.toLowerCase().includes(lowerQuery) ||
          d.expertise.some((e) => e.toLowerCase().includes(lowerQuery)) ||
          d.bio.toLowerCase().includes(lowerQuery)
      );
    }

    // Advanced filters
    if (advancedFilters.languages.length > 0) {
      filtered = filtered.filter((d) =>
        advancedFilters.languages.every((lang) => d.languages.includes(lang))
      );
    }
    if (advancedFilters.hospitals.length > 0) {
      filtered = filtered.filter((d) =>
        advancedFilters.hospitals.some((hosp) => d.hospitals.includes(hosp))
      );
    }
    filtered = filtered.filter((d) => d.rating >= advancedFilters.minRating);

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
        case "successRate":
          return b.successRate - a.successRate;
        default:
          return 0;
      }
    });

    return filtered;
  }, [activeSpecialty, searchQuery, sortBy, advancedFilters]);

  // Pagination logic
  const totalPages = Math.ceil(filteredAndSortedDokters.length / itemsPerPage);
  const paginatedDokters = filteredAndSortedDokters.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const toggleCardExpansion = (dokterName: string) => {
    setExpandedCards((prev) =>
      prev.includes(dokterName)
        ? prev.filter((name) => name !== dokterName)
        : [...prev, dokterName]
    );
  };

  const handleSelectDokter = (dokter: Dokter) => {
    setSelectedDokter(dokter);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleBack = () => {
    setSelectedDokter(null);
  };

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      // Can add API call here if real data
    }, 300);
    return () => clearTimeout(timer);
  }, [searchQuery]);

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
            Anda. Jelajahi profil lengkap dengan data mendalam dan visualisasi.
          </p>

          {/* Stats Overview */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto mb-8">
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

        {selectedDokter ? (
          <DokterDetailView
            selectedDokter={selectedDokter}
            onBack={handleBack}
          />
        ) : (
          <>
            {/* Search and Filters */}
            <div className="mb-8 space-y-6">
              <div className="flex flex-col md:flex-row gap-4 items-center">
                <div className="relative flex-1 w-full">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    placeholder="Cari dokter, spesialisasi, keahlian, atau bio..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 h-10"
                  />
                </div>

                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="w-[200px] h-10">
                    <SelectValue placeholder="Urutkan Berdasarkan" />
                  </SelectTrigger>
                  <SelectContent>
                    {sortOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className="h-10 flex items-center gap-2"
                    >
                      <Filter className="h-4 w-4" />
                      Filter Lanjutan
                      <ChevronDown className="h-4 w-4" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-80 p-4 space-y-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">
                        Bahasa
                      </label>
                      <Select
                        onValueChange={(value) =>
                          setAdvancedFilters((prev) => ({
                            ...prev,
                            languages: [...prev.languages, value],
                          }))
                        }
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Pilih Bahasa" />
                        </SelectTrigger>
                        <SelectContent>
                          {uniqueLanguages.map((lang) => (
                            <SelectItem key={lang} value={lang}>
                              {lang}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <div className="flex flex-wrap gap-2 mt-2">
                        {advancedFilters.languages.map((lang) => (
                          <Badge
                            key={lang}
                            onClick={() =>
                              setAdvancedFilters((prev) => ({
                                ...prev,
                                languages: prev.languages.filter(
                                  (l) => l !== lang
                                ),
                              }))
                            }
                          >
                            {lang} <Minus className="h-3 w-3 ml-1" />
                          </Badge>
                        ))}
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">
                        Rumah Sakit
                      </label>
                      <Select
                        onValueChange={(value) =>
                          setAdvancedFilters((prev) => ({
                            ...prev,
                            hospitals: [...prev.hospitals, value],
                          }))
                        }
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Pilih RS" />
                        </SelectTrigger>
                        <SelectContent>
                          {uniqueHospitals.map((hosp) => (
                            <SelectItem key={hosp} value={hosp}>
                              {hosp}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <div className="flex flex-wrap gap-2 mt-2">
                        {advancedFilters.hospitals.map((hosp) => (
                          <Badge
                            key={hosp}
                            onClick={() =>
                              setAdvancedFilters((prev) => ({
                                ...prev,
                                hospitals: prev.hospitals.filter(
                                  (h) => h !== hosp
                                ),
                              }))
                            }
                          >
                            {hosp} <Minus className="h-3 w-3 ml-1" />
                          </Badge>
                        ))}
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">
                        Rating Minimum
                      </label>
                      <Select
                        onValueChange={(value) =>
                          setAdvancedFilters((prev) => ({
                            ...prev,
                            minRating: parseFloat(value),
                          }))
                        }
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Pilih Rating" />
                        </SelectTrigger>
                        <SelectContent>
                          {[0, 3, 3.5, 4, 4.5].map((r) => (
                            <SelectItem key={r} value={r.toString()}>
                              {r}+
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </PopoverContent>
                </Popover>
              </div>

              {/* Specialty Filter Pills */}
              <div className="flex flex-wrap justify-center gap-2 mb-4">
                {specialties.map((spec) => (
                  <Button
                    key={spec}
                    variant={activeSpecialty === spec ? "default" : "outline"}
                    onClick={() => setActiveSpecialty(spec)}
                    className={`relative ${
                      activeSpecialty === spec
                        ? "bg-red-600 hover:bg-red-700"
                        : ""
                    }`}
                  >
                    {spec}
                    {spec !== "Semua" && (
                      <Badge
                        variant="secondary"
                        className="ml-2 bg-white/20 text-xs absolute -top-2 -right-2"
                      >
                        {dokters.filter((d) => d.subSpecialty === spec).length}
                      </Badge>
                    )}
                  </Button>
                ))}
              </div>

              <div className="text-center text-sm text-gray-600 dark:text-gray-400">
                Menampilkan {filteredAndSortedDokters.length} dari{" "}
                {dokters.length} dokter
                {searchQuery && ` untuk "${searchQuery}"`}
              </div>
            </div>

            {/* Doctor Cards Grid */}
            <div className="grid gap-8 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
              {paginatedDokters.map((dokter) => (
                <DokterCard
                  key={dokter.name}
                  dokter={dokter}
                  onSelect={handleSelectDokter}
                  isExpanded={expandedCards.includes(dokter.name)}
                  onToggleExpand={() => toggleCardExpansion(dokter.name)}
                />
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <Pagination className="mt-8 justify-center">
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious
                      onClick={() =>
                        setCurrentPage((prev) => Math.max(prev - 1, 1))
                      }
                      className={
                        currentPage === 1
                          ? "pointer-events-none opacity-50"
                          : ""
                      }
                    />
                  </PaginationItem>
                  {[...Array(totalPages)].map((_, i) => (
                    <PaginationItem key={i}>
                      <PaginationLink
                        onClick={() => setCurrentPage(i + 1)}
                        isActive={currentPage === i + 1}
                      >
                        {i + 1}
                      </PaginationLink>
                    </PaginationItem>
                  ))}
                  <PaginationItem>
                    <PaginationNext
                      onClick={() =>
                        setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                      }
                      className={
                        currentPage === totalPages
                          ? "pointer-events-none opacity-50"
                          : ""
                      }
                    />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            )}

            {/* No Results */}
            {filteredAndSortedDokters.length === 0 && (
              <div className="text-center py-12">
                <Search className="h-16 w-16 mx-auto mb-4 text-gray-400" />
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
                    setAdvancedFilters({
                      languages: [],
                      hospitals: [],
                      minRating: 0,
                    });
                  }}
                  variant="outline"
                >
                  Reset Semua Filter
                </Button>
              </div>
            )}
          </>
        )}
      </div>
    </section>
  );
};

export default DokterKamiSection;

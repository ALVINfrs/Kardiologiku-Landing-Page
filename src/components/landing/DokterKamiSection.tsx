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
  Filter,
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
  Mail,
  Calendar,
  BookOpen,
  Globe,
  CheckCircle,
  ArrowUp,
  ArrowDown,
  Eye,
  ThumbsUp,
  Share2,
  Bookmark
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

// --- Enhanced Types ---
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

// --- Enhanced Doctor Data ---
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
        comment: "Penjelasan Dr. Sarah sangat detail dan menenangkan. Prosedur ablasi saya berjalan lancar. Terima kasih, Dok!",
        verified: true,
        helpful: 24,
        condition: "Fibrilasi Atrium"
      },
      {
        id: 2,
        patientName: "Retno W.",
        date: "15 Jun 2025",
        rating: 5,
        comment: "Sangat profesional dan sabar menjawab semua pertanyaan saya. Sangat direkomendasikan.",
        verified: true,
        helpful: 18,
        condition: "Aritmia"
      },
    ],
    languages: ["Indonesia", "English", "Mandarin"],
    certifications: ["Board Certified Cardiologist", "Fellowship Electrophysiology", "ACLS Certified"],
    achievements: [
      { title: "Best Cardiologist Award", year: "2024", organization: "Indonesian Heart Association", icon: "🏆" },
      { title: "Research Excellence", year: "2023", organization: "Medical Society", icon: "🔬" }
    ],
    publications: [
      { title: "Advanced Electrophysiology Techniques", journal: "Cardiology Today", year: "2024", citations: 45 },
      { title: "Atrial Fibrillation Management", journal: "Heart Journal", year: "2023", citations: 32 }
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
      website: "drsarahwijaya.com"
    }
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
        comment: "Tangan dingin dan sangat berpengalaman. Pemasangan stent ayah saya berhasil tanpa kendala. Dokter terbaik!",
        verified: true,
        helpful: 31,
        condition: "Stenosis Koroner"
      },
      {
        id: 2,
        patientName: "Siti A.",
        date: "02 Jul 2025",
        rating: 4,
        comment: "Komunikasinya baik, meskipun kadang harus menunggu cukup lama saat jadwal praktek.",
        verified: true,
        helpful: 12,
        condition: "PCI"
      },
    ],
    languages: ["Indonesia", "English"],
    certifications: ["Interventional Cardiology", "SCAI Certified", "Emergency Medicine"],
    achievements: [
      { title: "Outstanding Physician", year: "2024", organization: "Medical Board", icon: "🎖️" },
      { title: "Innovation in Cardiology", year: "2022", organization: "Heart Foundation", icon: "💡" }
    ],
    publications: [
      { title: "Complex PCI Procedures", journal: "Interventional Cardiology", year: "2024", citations: 52 },
      { title: "STEMI Management Guidelines", journal: "Emergency Cardiology", year: "2023", citations: 38 }
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
      website: "budihartono-cardio.com"
    }
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
        comment: "Dr. Maya sangat telaten dan baik dengan anak saya. Penjelasannya mudah dipahami orang tua. Kami merasa sangat terbantu.",
        verified: true,
        helpful: 27,
        condition: "VSD"
      },
      {
        id: 2,
        patientName: "Bapak Eko",
        date: "11 Mei 2025",
        rating: 5,
        comment: "Luar biasa sabar dan teliti. Sangat ahli di bidang jantung anak.",
        verified: true,
        helpful: 22,
        condition: "ASD"
      },
    ],
    languages: ["Indonesia", "English", "Jawa"],
    certifications: ["Pediatric Cardiology", "Congenital Heart Disease", "Echo Certified"],
    achievements: [
      { title: "Pediatric Excellence Award", year: "2024", organization: "Children's Heart Foundation", icon: "👶" },
      { title: "Community Service Award", year: "2023", organization: "Medical Association", icon: "🤝" }
    ],
    publications: [
      { title: "Congenital Heart Disease in Indonesia", journal: "Pediatric Cardiology", year: "2024", citations: 28 },
      { title: "Early Detection Guidelines", journal: "Child Health", year: "2023", citations: 19 }
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
      website: "mayasari-pediatriccardio.com"
    }
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
        comment: "Program rehabilitasi dari Dr. Rian sangat membantu saya kembali percaya diri setelah serangan jantung. Pendekatannya sangat holistik.",
        verified: true,
        helpful: 35,
        condition: "Post-MI Rehabilitation"
      },
      {
        id: 2,
        patientName: "Agus H.",
        date: "28 Jun 2025",
        rating: 5,
        comment: "Sangat informatif dalam menjelaskan pencegahan. Saya jadi lebih paham cara menjaga kesehatan jantung.",
        verified: true,
        helpful: 29,
        condition: "Preventive Care"
      },
    ],
    languages: ["Indonesia", "English"],
    certifications: ["Cardiac Rehabilitation", "Sports Medicine", "Preventive Cardiology"],
    achievements: [
      { title: "Prevention Excellence", year: "2024", organization: "Heart Health Society", icon: "🛡️" },
      { title: "Patient Care Award", year: "2023", organization: "Rehabilitation Center", icon: "❤️" }
    ],
    publications: [
      { title: "Cardiac Rehabilitation Protocols", journal: "Rehabilitation Medicine", year: "2024", citations: 22 },
      { title: "Prevention Strategies", journal: "Preventive Cardiology", year: "2023", citations: 18 }
    ],
    consultationFee: "Rp 400.000",
    responseTime: "< 1 jam",
    availableToday: true,
    onlineConsultation: true,
    emergencyAvailable: false,
    totalPatients: 2200,
    successRate: 92,
    yearsActive: 11,
    socialMedia: {
      linkedin: "linkedin.com/in/riansutanto"
    }
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
        comment: "Dr. Linda berhasil menyembuhkan SVT saya dengan ablasi. Prosesnya cepat dan pemulihannya juga. Sangat berterima kasih.",
        verified: true,
        helpful: 19,
        condition: "SVT Ablation"
      },
      {
        id: 2,
        patientName: "Maria F.",
        date: "20 Mei 2025",
        rating: 5,
        comment: "Dokter yang sangat up-to-date dengan teknologi terbaru. Merasa aman ditangani oleh beliau.",
        verified: true,
        helpful: 16,
        condition: "Arrhythmia"
      },
    ],
    languages: ["Indonesia", "English", "Makassar"],
    certifications: ["Advanced EP", "3D Mapping Systems", "Cryoablation Certified"],
    achievements: [
      { title: "Young Physician Award", year: "2024", organization: "EP Society", icon: "🌟" },
      { title: "Technology Innovation", year: "2023", organization: "Medical Tech", icon: "💻" }
    ],
    publications: [
      { title: "3D Mapping in EP", journal: "Electrophysiology Review", year: "2024", citations: 15 },
      { title: "SVT Management", journal: "Arrhythmia Today", year: "2023", citations: 12 }
    ],
    consultationFee: "Rp 550.000",
    responseTime: "< 2 jam",
    availableToday: false,
    onlineConsultation: true,
    emergencyAvailable: false,
    totalPatients: 1650,
    successRate: 97,
    yearsActive: 10,
    socialMedia: {
      website: "lindahalim-ep.com"
    }
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
        comment: "Hanya Dr. Agus yang berani dan berhasil membuka sumbatan jantung saya yang sudah divonis tidak bisa diapa-apakan. Beliau adalah pahlawan.",
        verified: true,
        helpful: 47,
        condition: "CTO PCI"
      },
      {
        id: 2,
        patientName: "Keluarga Tan",
        date: "22 Jun 2025",
        rating: 5,
        comment: "Sangat senior, tenang, dan meyakinkan. Hasil kerjanya tidak perlu diragukan lagi. Sangat direkomendasikan untuk kasus sulit.",
        verified: true,
        helpful: 41,
        condition: "Complex PCI"
      },
    ],
    languages: ["Indonesia", "English", "Jawa"],
    certifications: ["Master Interventionalist", "CTO Expert", "IVUS/OCT Certified"],
    achievements: [
      { title: "Lifetime Achievement", year: "2024", organization: "Cardiology Society", icon: "🏅" },
      { title: "Master Physician", year: "2020", organization: "Medical Board", icon: "👨‍⚕️" }
    ],
    publications: [
      { title: "CTO Intervention Mastery", journal: "Advanced Cardiology", year: "2024", citations: 68 },
      { title: "Complex Lesion Management", journal: "Interventional Review", year: "2023", citations: 54 }
    ],
    consultationFee: "Rp 750.000",
    responseTime: "< 4 jam",
    availableToday: false,
    onlineConsultation: false,
    emergencyAvailable: true,
    totalPatients: 4200,
    successRate: 95,
    yearsActive: 20,
    socialMedia: {
      website: "agussetiawan-cto.com",
      linkedin: "linkedin.com/in/agussetiawan"
    }
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

// --- Enhanced Components ---
const StarRating: React.FC<{ rating: number; className?: string; showNumber?: boolean }> = ({
  rating,
  className,
  showNumber = false,
}) => (
  <div className={cn("flex items-center gap-1", className)}>
    <div className="flex items-center gap-0.5">
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
    {showNumber && <span className="text-sm font-medium">{rating}</span>}
  </div>
);

const StatCard: React.FC<{ 
  icon: React.ReactNode; 
  value: string | number; 
  label: string; 
  trend?: 'up' | 'down' | 'stable';
  className?: string;
}> = ({ icon, value, label, trend, className }) => (
  <motion.div
    whileHover={{ scale: 1.05 }}
    className={cn("bg-white dark:bg-gray-800 rounded-lg p-3 border shadow-sm", className)}
  >
    <div className="flex items-center justify-between mb-1">
      <div className="p-2 rounded-lg bg-red-50 dark:bg-red-900/20 text-red-600">
        {icon}
      </div>
      {trend && (
        <div className={cn("flex items-center text-xs", 
          trend === 'up' ? 'text-green-600' : trend === 'down' ? 'text-red-600' : 'text-gray-600'
        )}>
          {trend === 'up' ? <ArrowUp className="h-3 w-3" /> : 
           trend === 'down' ? <ArrowDown className="h-3 w-3" /> : null}
        </div>
      )}
    </div>
    <div className="text-2xl font-bold text-gray-900 dark:text-white">{value}</div>
    <div className="text-xs text-gray-500 dark:text-gray-400">{label}</div>
  </motion.div>
);

const DokterCard: React.FC<{
  dokter: Dokter;
  onProfilClick: (d: Dokter) => void;
  isExpanded?: boolean;
  onToggleExpand?: () => void;
}> = ({ dokter, onProfilClick, isExpanded, onToggleExpand }) => {
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -30 }}
      transition={{ type: "spring", stiffness: 200, damping: 25 }}
      className="flex"
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
    >
      <Card className={cn(
        "flex flex-col w-full transition-all duration-300 border-2", 
        isHovered ? "shadow-xl border-red-200 dark:border-red-800" : "hover:shadow-lg border-gray-200 dark:border-gray-700",
        "dark:bg-gray-800"
      )}>
        <CardHeader className="text-center pb-4 relative">
          {/* Status Badges */}
          <div className="absolute top-4 right-4 flex flex-col gap-1">
            {dokter.availableToday && (
              <Badge className="bg-green-100 text-green-700 text-xs">
                <div className="w-2 h-2 rounded-full bg-green-500 mr-1 animate-pulse"></div>
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

          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={() => setIsBookmarked(!isBookmarked)}
            className="absolute top-4 left-4 p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            <Bookmark className={cn("h-4 w-4", isBookmarked ? "fill-red-500 text-red-500" : "text-gray-400")} />
          </motion.button>

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
              trend="up"
            />
            <StatCard
              icon={<TrendingUp className="h-4 w-4" />}
              value={`${dokter.successRate}%`}
              label="Sukses"
              trend="stable"
            />
            <StatCard
              icon={<Clock className="h-4 w-4" />}
              value={dokter.responseTime}
              label="Respon"
            />
          </div>

          {/* Basic Info */}
          <div className="space-y-2">
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
              <span className="text-sm font-medium text-green-600">{dokter.consultationFee}</span>
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
          <AnimatePresence>
            {isExpanded && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
                className="space-y-3"
              >
                {/* Expertise Preview */}
                <div>
                  <h4 className="font-semibold text-sm text-gray-800 dark:text-gray-200 mb-2">
                    <Sparkles className="inline h-4 w-4 mr-1 text-yellow-500" />
                    Keahlian Utama
                  </h4>
                  <div className="flex flex-wrap gap-1">
                    {dokter.expertise.slice(0, 2).map((skill) => (
                      <Badge key={skill} className="text-xs bg-red-50 text-red-700 hover:bg-red-100">
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

                {/* Recent Achievement */}
                {dokter.achievements.length > 0 && (
                  <div>
                    <h4 className="font-semibold text-sm text-gray-800 dark:text-gray-200 mb-2">
                      <Award className="inline h-4 w-4 mr-1 text-blue-500" />
                      Pencapaian Terbaru
                    </h4>
                    <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-2">
                      <div className="flex items-center gap-2">
                        <span className="text-lg">{dokter.achievements[0].icon}</span>
                        <div>
                          <p className="text-xs font-medium text-gray-800 dark:text-gray-200">
                            {dokter.achievements[0].title}
                          </p>
                          <p className="text-xs text-gray-500 dark:text-gray-400">
                            {dokter.achievements[0].organization} • {dokter.achievements[0].year}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Next Available Schedule */}
                <div>
                  <h4 className="font-semibold text-sm text-gray-800 dark:text-gray-200 mb-2">
                    <CalendarDays className="inline h-4 w-4 mr-1 text-green-500" />
                    Jadwal Terdekat
                  </h4>
                  <div className="text-xs text-gray-600 dark:text-gray-400">
                    {Object.entries(dokter.schedule)[0] && (
                      <div className="flex justify-between">
                        <span>{Object.entries(dokter.schedule)[0][0]}</span>
                        <span className="font-medium">
                          {Object.entries(dokter.schedule)[0][1].split(' (')[0]}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

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
                {isExpanded ? <Minus className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
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

            {/* Quick Contact */}
            <div className="flex justify-center gap-2 pt-2">
              <motion.button
                whileTap={{ scale: 0.95 }}
                className="p-2 rounded-full bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600"
              >
                <Phone className="h-4 w-4 text-gray-600 dark:text-gray-400" />
              </motion.button>
              <motion.button
                whileTap={{ scale: 0.95 }}
                className="p-2 rounded-full bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600"
              >
                <Mail className="h-4 w-4 text-gray-600 dark:text-gray-400" />
              </motion.button>
              <motion.button
                whileTap={{ scale: 0.95 }}
                className="p-2 rounded-full bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600"
              >
                <Share2 className="h-4 w-4 text-gray-600 dark:text-gray-400" />
              </motion.button>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

const ReviewCard: React.FC<{ 
  review: Review; 
  onHelpful?: (reviewId: number) => void;
  helpfulCount?: number;
}> = ({ review, onHelpful, helpfulCount }) => {
  const [isHelpful, setIsHelpful] = useState(false);
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="border-b dark:border-gray-700 pb-4 last:border-b-0"
    >
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
        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={() => {
            setIsHelpful(!isHelpful);
            onHelpful?.(review.id);
          }}
          className={cn(
            "flex items-center gap-1 px-2 py-1 rounded-md text-xs transition-colors",
            isHelpful 
              ? "bg-blue-100 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400" 
              : "bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-400 dark:hover:bg-gray-600"
          )}
        >
          <ThumbsUp className={cn("h-3 w-3", isHelpful && "fill-current")} />
          Membantu
        </motion.button>
        <motion.button
          whileTap={{ scale: 0.95 }}
          className="flex items-center gap-1 px-2 py-1 rounded-md text-xs bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-400 dark:hover:bg-gray-600"
        >
          <MessageCircle className="h-3 w-3" />
          Balas
        </motion.button>
      </div>
    </motion.div>
  );
};

// --- Enhanced Main Component ---
const DokterKamiSection = () => {
  const [activeSpecialty, setActiveSpecialty] = useState("Semua");
  const [selectedDokter, setSelectedDokter] = useState<Dokter | null>(null);
  const [activeModalTab, setActiveModalTab] = useState<"profil" | "ulasan" | "publikasi">("profil");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("rating");
  const [expandedCards, setExpandedCards] = useState<string[]>([]);
  const [showFilters, setShowFilters] = useState(false);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  const filteredAndSortedDokters = useMemo(() => {
    let filtered = dokters;
    
    // Filter by specialty
    if (activeSpecialty !== "Semua") {
      filtered = filtered.filter((d) => d.subSpecialty === activeSpecialty);
    }
    
    // Filter by search query
    if (searchQuery) {
      filtered = filtered.filter((d) => 
        d.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        d.specialty.toLowerCase().includes(searchQuery.toLowerCase()) ||
        d.expertise.some(e => e.toLowerCase().includes(searchQuery.toLowerCase()))
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
          return b.availableToday ? 1 : -1;
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
    setExpandedCards(prev => 
      prev.includes(dokterName) 
        ? prev.filter(name => name !== dokterName)
        : [...prev, dokterName]
    );
  };

  const handleReviewHelpful = (reviewId: number) => {
    // Handle helpful review logic
    console.log('Helpful review:', reviewId);
  };

  return (
    <section id="dokter-kami" className="py-20 bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Enhanced Header */}
        <div className="text-center mb-12">
          <motion.h2 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl font-bold text-gray-900 dark:text-white mb-4"
          >
            Tim Dokter Spesialis Kami
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto mb-6"
          >
            Konsultasi dengan para ahli jantung berpengalaman yang siap membantu Anda.
          </motion.p>
          
          {/* Stats Overview */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-3xl mx-auto mb-8"
          >
            <StatCard
              icon={<Stethoscope className="h-5 w-5" />}
              value={dokters.length}
              label="Dokter Spesialis"
            />
            <StatCard
              icon={<Users className="h-5 w-5" />}
              value={dokters.reduce((sum, d) => sum + d.totalPatients, 0).toLocaleString()}
              label="Total Pasien"
            />
            <StatCard
              icon={<Star className="h-5 w-5" />}
              value={dokters.reduce((sum, d) => sum + d.reviewsCount, 0)}
              label="Total Ulasan"
            />
            <StatCard
              icon={<Activity className="h-5 w-5" />}
              value={dokters.filter(d => d.availableToday).length}
              label="Tersedia Hari Ini"
            />
          </motion.div>
        </div>

        {/* Enhanced Search and Filters */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mb-8"
        >
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            {/* Search Bar */}
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Cari dokter, spesialisasi, atau keahlian..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            
            {/* Sort Dropdown */}
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
            
            {/* Filter Toggle */}
            <Button
              variant="outline"
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2"
            >
              <Filter className="h-4 w-4" />
              Filter
            </Button>
          </div>
          
          {/* Specialty Filter Pills */}
          <div className="flex flex-wrap justify-center gap-2 mb-4">
            {specialties.map((spec) => (
              <motion.div key={spec} whileTap={{ scale: 0.95 }}>
                <Button
                  variant={activeSpecialty === spec ? "default" : "outline"}
                  onClick={() => setActiveSpecialty(spec)}
                  className={cn(
                    "relative",
                    activeSpecialty === spec && "bg-red-600 hover:bg-red-700"
                  )}
                >
                  {spec}
                  {spec !== "Semua" && (
                    <Badge 
                      variant="secondary" 
                      className="ml-2 bg-white/20 text-xs"
                    >
                      {dokters.filter(d => d.subSpecialty === spec).length}
                    </Badge>
                  )}
                </Button>
              </motion.div>
            ))}
          </div>
          
          {/* Results Count */}
          <div className="text-center text-sm text-gray-600 dark:text-gray-400">
            Menampilkan {filteredAndSortedDokters.length} dari {dokters.length} dokter
            {searchQuery && ` untuk "${searchQuery}"`}
          </div>
        </motion.div>

        {/* Enhanced Doctor Cards Grid */}
        <motion.div
          layout
          className={cn(
            "grid gap-8",
            viewMode === "grid" 
              ? "grid-cols-1 md:grid-cols-2 lg:grid-cols-3" 
              : "grid-cols-1 max-w-4xl mx-auto"
          )}
        >
          <AnimatePresence>
            {filteredAndSortedDokters.map((dokter) => (
              <DokterCard
                key={dokter.name}
                dokter={dokter}
                onProfilClick={handleOpenModal}
                isExpanded={expandedCards.includes(dokter.name)}
                onToggleExpand={() => toggleCardExpansion(dokter.name)}
              />
            ))}
          </AnimatePresence>
        </motion.div>

        {/* No Results */}
        {filteredAndSortedDokters.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12"
          >
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
          </motion.div>
        )}
      </div>

      {/* Enhanced Modal */}
      <Dialog
        open={!!selectedDokter}
        onOpenChange={(isOpen) => !isOpen && setSelectedDokter(null)}
      >
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto p-0">
          {selectedDokter && (
            <>
              {/* Enhanced Modal Header */}
              <DialogHeader className="relative text-center space-y-4 p-6 bg-gradient-to-r from-red-50 to-pink-50 dark:from-red-900/20 dark:to-pink-900/20">
                <div className="absolute top-4 right-4 flex gap-2">
                  <motion.button
                    whileTap={{ scale: 0.95 }}
                    className="p-2 rounded-full bg-white/50 hover:bg-white/80 dark:bg-gray-800/50 dark:hover:bg-gray-800/80"
                  >
                    <Bookmark className="h-4 w-4" />
                  </motion.button>
                  <motion.button
                    whileTap={{ scale: 0.95 }}
                    className="p-2 rounded-full bg-white/50 hover:bg-white/80 dark:bg-gray-800/50 dark:hover:bg-gray-800/80"
                  >
                    <Share2 className="h-4 w-4" />
                  </motion.button>
                </div>
                
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

                {/* Quick Stats Row */}
                <div className="grid grid-cols-4 gap-4 mt-6">
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

              <div className="p-6 dark:bg-gray-800">
                <p className="text-center text-gray-600 dark:text-gray-400 italic mb-6 text-lg">
                  "{selectedDokter.bio}"
                </p>

                {/* Enhanced Tab Navigation */}
                <div className="border-b dark:border-gray-700 mb-6 flex justify-center">
                  {[
                    { id: "profil", label: "Profil & Jadwal", icon: <Users className="h-4 w-4" /> },
                    { id: "ulasan", label: `Ulasan (${selectedDokter.reviewsCount})`, icon: <Star className="h-4 w-4" /> },
                    { id: "publikasi", label: "Publikasi & Pencapaian", icon: <BookOpen className="h-4 w-4" /> }
                  ].map((tab) => (
                    <motion.button
                      key={tab.id}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setActiveModalTab(tab.id as any)}
                      className={cn(
                        "flex items-center gap-2 px-6 py-3 font-medium transition-colors relative",
                        activeModalTab === tab.id
                          ? "text-red-600 border-b-2 border-red-500"
                          : "text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
                      )}
                    >
                      {tab.icon}
                      {tab.label}
                      {activeModalTab === tab.id && (
                        <motion.div
                          layoutId="activeTab"
                          className="absolute bottom-0 left-0 right-0 h-0.5 bg-red-500"
                        />
                      )}
                    </motion.button>
                  ))}
                </div>

                {/* Enhanced Tab Content */}
                <AnimatePresence mode="wait">
                  <motion.div
                    key={activeModalTab}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.3 }}
                    className="min-h-[400px]"
                  >
                    {activeModalTab === "profil" && (
                      <div className="space-y-8 text-gray-700 dark:text-gray-300">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                          {/* Expertise Section */}
                          <div className="space-y-4">
                            <h4 className="font-bold flex items-center gap-2 text-gray-800 dark:text-gray-200 text-lg">
                              <Sparkles className="text-yellow-500 h-5 w-5" /> 
                              Keahlian Utama
                            </h4>
                            <div className="space-y-2">
                              {selectedDokter.expertise.map((skill) => (
                                <motion.div
                                  key={skill}
                                  initial={{ opacity: 0, x: -10 }}
                                  animate={{ opacity: 1, x: 0 }}
                                  className="flex items-center gap-2 p-2 bg-red-50 dark:bg-red-900/20 rounded-lg"
                                >
                                  <CheckCircle className="h-4 w-4 text-red-600" />
                                  <span className="text-sm">{skill}</span>
                                </motion.div>
                              ))}
                            </div>
                          </div>

                          {/* Hospital Affiliations */}
                          <div className="space-y-4">
                            <h4 className="font-bold flex items-center gap-2 text-gray-800 dark:text-gray-200 text-lg">
                              <Hospital className="text-blue-500 h-5 w-5" /> 
                              Afiliasi Rumah Sakit
                            </h4>
                            <div className="space-y-2">
                              {selectedDokter.hospitals.map((hospital) => (
                                <motion.div
                                  key={hospital}
                                  initial={{ opacity: 0, x: -10 }}
                                  animate={{ opacity: 1, x: 0 }}
                                  className="flex items-center gap-2 p-2 bg-blue-50 dark:bg-blue-900/20 rounded-lg"
                                >
                                  <MapPin className="h-4 w-4 text-blue-600" />
                                  <span className="text-sm">{hospital}</span>
                                </motion.div>
                              ))}
                            </div>
                          </div>
                        </div>

                        {/* Certifications */}
                        <div>
                          <h4 className="font-bold flex items-center gap-2 mb-4 text-gray-800 dark:text-gray-200 text-lg">
                            <Award className="text-purple-500 h-5 w-5" />
                            Sertifikasi & Lisensi
                          </h4>
                          <div className="flex flex-wrap gap-2">
                            {selectedDokter.certifications.map((cert) => (
                              <Badge key={cert} className="bg-purple-100 text-purple-700 hover:bg-purple-200">
                                {cert}
                              </Badge>
                            ))}
                          </div>
                        </div>

                        {/* Languages */}
                        <div>
                          <h4 className="font-bold flex items-center gap-2 mb-4 text-gray-800 dark:text-gray-200 text-lg">
                            <Globe className="text-green-500 h-5 w-5" />
                            Bahasa yang Dikuasai
                          </h4>
                          <div className="flex flex-wrap gap-2">
                            {selectedDokter.languages.map((lang) => (
                              <Badge key={lang} className="bg-green-100 text-green-700 hover:bg-green-200">
                                {lang}
                              </Badge>
                            ))}
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
                              <motion.div 
                                key={day} 
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                className="flex justify-between items-center p-2 rounded bg-white dark:bg-gray-800 shadow-sm"
                              >
                                <span className="font-medium text-gray-800 dark:text-gray-200">{day}</span>
                                <div className="text-right">
                                  <span className="font-semibold text-gray-900 dark:text-white text-sm">
                                    {time.split(' (')[0]}
                                  </span>
                                  <p className="text-xs text-gray-500 dark:text-gray-400">
                                    {time.includes('(') ? time.split('(')[1].replace(')', '') : ''}
                                  </p>
                                </div>
                              </motion.div>
                            ))}
                          </div>
                        </div>

                        {/* Contact & Social Media */}
                        <div>
                          <h4 className="font-bold flex items-center gap-2 mb-4 text-gray-800 dark:text-gray-200 text-lg">
                            <MessageCircle className="text-indigo-500 h-5 w-5" />
                            Kontak & Media Sosial
                          </h4>
                          <div className="flex gap-4">
                            {selectedDokter.socialMedia.website && (
                              <motion.a
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                href={`https://${selectedDokter.socialMedia.website}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-2 px-4 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors"
                              >
                                <Globe className="h-4 w-4" />
                                Website
                              </motion.a>
                            )}
                            {selectedDokter.socialMedia.linkedin && (
                              <motion.a
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                href={`https://${selectedDokter.socialMedia.linkedin}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-2 px-4 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors"
                              >
                                <Users className="h-4 w-4" />
                                LinkedIn
                              </motion.a>
                            )}
                          </div>
                        </div>
                      </div>
                    )}

                    {activeModalTab === "ulasan" && (
                      <div className="space-y-6">
                        {/* Review Summary */}
                        <div className="bg-gradient-to-r from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20 rounded-lg p-6">
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div className="text-center">
                              <div className="text-3xl font-bold text-gray-900 dark:text-white">
                                {selectedDokter.rating.toFixed(1)}
                              </div>
                              <StarRating rating={selectedDokter.rating} className="justify-center mb-2" />
                              <div className="text-sm text-gray-600 dark:text-gray-400">
                                Dari {selectedDokter.reviewsCount} ulasan
                              </div>
                            </div>
                            
                            <div className="text-center">
                              <div className="text-3xl font-bold text-green-600">
                                {Math.round((selectedDokter.patientReviews.filter(r => r.rating >= 4).length / selectedDokter.patientReviews.length) * 100)}%
                              </div>
                              <div className="text-sm text-gray-600 dark:text-gray-400">
                                Merekomendasikan
                              </div>
                            </div>
                            
                            <div className="text-center">
                              <div className="text-3xl font-bold text-blue-600">
                                {selectedDokter.patientReviews.filter(r => r.verified).length}
                              </div>
                              <div className="text-sm text-gray-600 dark:text-gray-400">
                                Ulasan Terverifikasi
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Rating Distribution */}
                        <div className="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-4">
                          <h5 className="font-semibold mb-4 text-gray-800 dark:text-gray-200">
                            Distribusi Rating
                          </h5>
                          {[5, 4, 3, 2, 1].map(rating => {
                            const count = selectedDokter.patientReviews.filter(r => r.rating === rating).length;
                            const percentage = (count / selectedDokter.patientReviews.length) * 100;
                            
                            return (
                              <div key={rating} className="flex items-center gap-3 mb-2">
                                <div className="flex items-center gap-1 w-12">
                                  <span className="text-sm">{rating}</span>
                                  <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                                </div>
                                <div className="flex-1 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                                  <motion.div
                                    initial={{ width: 0 }}
                                    animate={{ width: `${percentage}%` }}
                                    transition={{ delay: 0.3, duration: 0.8 }}
                                    className="bg-yellow-400 h-2 rounded-full"
                                  />
                                </div>
                                <span className="text-sm text-gray-600 dark:text-gray-400 w-8">
                                  {count}
                                </span>
                              </div>
                            );
                          })}
                        </div>

                        {/* Individual Reviews */}
                        <div className="space-y-6">
                          <h5 className="font-semibold text-gray-800 dark:text-gray-200 text-lg">
                            Ulasan Pasien
                          </h5>
                          {selectedDokter.patientReviews.map((review) => (
                            <ReviewCard
                              key={review.id}
                              review={review}
                              onHelpful={handleReviewHelpful}
                            />
                          ))}
                        </div>

                        {/* Write Review CTA */}
                        <div className="text-center pt-6 border-t dark:border-gray-700">
                          <Button className="bg-red-600 hover:bg-red-700">
                            <MessageCircle className="h-4 w-4 mr-2" />
                            Tulis Ulasan Anda
                          </Button>
                        </div>
                      </div>
                    )}

                    {activeModalTab === "publikasi" && (
                      <div className="space-y-8">
                        {/* Achievements */}
                        <div>
                          <h4 className="font-bold flex items-center gap-2 mb-6 text-gray-800 dark:text-gray-200 text-lg">
                            <Award className="text-gold-500 h-5 w-5" />
                            Pencapaian & Penghargaan
                          </h4>
                          <div className="grid gap-4">
                            {selectedDokter.achievements.map((achievement, index) => (
                              <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.1 }}
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
                              </motion.div>
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
                              <motion.div
                                key={index}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: index * 0.1 }}
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
                              </motion.div>
                            ))}
                          </div>
                        </div>

                        {/* Professional Stats */}
                        <div>
                          <h4 className="font-bold flex items-center gap-2 mb-6 text-gray-800 dark:text-gray-200 text-lg">
                            <TrendingUp className="text-green-500 h-5 w-5" />
                            Statistik Profesional
                          </h4>
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            <StatCard
                              icon={<Calendar className="h-5 w-5" />}
                              value={`${selectedDokter.yearsActive} tahun`}
                              label="Pengalaman Aktif"
                            />
                            <StatCard
                              icon={<Users className="h-5 w-5" />}
                              value={selectedDokter.totalPatients.toLocaleString()}
                              label="Total Pasien"
                            />
                            <StatCard
                              icon={<TrendingUp className="h-5 w-5" />}
                              value={`${selectedDokter.successRate}%`}
                              label="Tingkat Keberhasilan"
                            />
                            <StatCard
                              icon={<BookOpen className="h-5 w-5" />}
                              value={selectedDokter.publications.length}
                              label="Publikasi"
                            />
                          </div>
                        </div>
                      </div>
                    )}
                  </motion.div>
                </AnimatePresence>
              </div>

              {/* Enhanced Modal Footer */}
              <div className="border-t dark:border-gray-700 p-6 bg-gradient-to-r from-red-50 to-pink-50 dark:from-red-900/20 dark:to-pink-900/20">
                <div className="flex flex-col md:flex-row gap-4 justify-center">
                  <Button 
                    size="lg" 
                    className="bg-red-600 hover:bg-red-700 flex items-center gap-2"
                  >
                    <Calendar className="h-5 w-5" />
                    Buat Janji Temu dengan {selectedDokter.name.split(",")[0]}
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
                
                {/* Emergency Contact */}
                {selectedDokter.emergencyAvailable && (
                  <div className="text-center mt-4 p-3 bg-red-100 dark:bg-red-900/20 rounded-lg">
                    <p className="text-sm text-red-700 dark:text-red-400 font-medium">
                      🚨 Tersedia untuk konsultasi darurat 24/7
                    </p>
                  </div>
                )}
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </section>
  );
};

export default DokterKamiSection;
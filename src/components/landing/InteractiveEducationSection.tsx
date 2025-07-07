import React, { useState, useEffect, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { motion, AnimatePresence } from "framer-motion";
import {
  BookOpen,
  Brain,
  Heart,
  Play,
  Pause,
  RotateCcw,
  CheckCircle,
  XCircle,
  Star,
  Clock,
  Users,
  Award,
  Zap,
  Calendar,
  Activity,
} from "lucide-react";

// Types
interface QuizData {
  questions: QuizQuestion[];
}

interface SimulatorData {
  scenarios: {
    name: string;
    heartRate: number;
    rhythm: string;
    symptoms: string[];
    ekgPath: string;
    pWave: boolean;
    qrsWidth: string;
    prInterval: string;
  }[];
}

interface CalculatorData {
  type: "stroke-risk" | "heart-rate-zones";
  fields: {
    name: string;
    type: "number" | "select";
    options?: string[];
    label: string;
  }[];
}

interface ChecklistData {
  items: { text: string; category: string }[];
}

interface GamificationData {
  challenges: Challenge[];
  rewards: Reward[];
  leaderboard: { user: string; score: number }[];
}

interface Article {
  id: string;
  title: string;
  category: string;
  difficulty: "Pemula" | "Menengah" | "Lanjut";
  duration: number;
  readCount: number;
  rating: number;
  tags: string[];
  excerpt: string;
  content: string;
  interactiveElements: InteractiveElement[];
  author: string;
  publishDate: string;
  image: string;
}

interface InteractiveElement {
  id: string;
  type: "quiz" | "simulator" | "calculator" | "checklist" | "gamification";
  title: string;
  data:
    | QuizData
    | SimulatorData
    | CalculatorData
    | ChecklistData
    | GamificationData;
}

interface QuizQuestion {
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
}

interface Challenge {
  id: string;
  title: string;
  description: string;
  xp: number;
  relatedArticleId?: string;
  category: string;
}

interface Reward {
  id: string;
  name: string;
  icon: React.ComponentType<{ className?: string }>;
  description: string;
  requirement: string;
}

interface UserProfile {
  level: number;
  xp: number;
  xpToNextLevel: number;
  completedChallenges: string[];
  earnedBadges: string[];
  streak: number;
}

// Sample Data
const articlesData: Article[] = [
  {
    id: "1",
    title: "Memahami Dasar-Dasar Aritmia Jantung",
    category: "Dasar-Dasar",
    difficulty: "Pemula",
    duration: 8,
    readCount: 2847,
    rating: 4.8,
    tags: ["Dasar", "Aritmia", "Jantung Sehat"],
    excerpt:
      "Pelajari apa itu aritmia, mengapa terjadi, dan bagaimana mengenali gejalanya dengan panduan interaktif yang mudah dipahami.",
    content: `Aritmia adalah kondisi di mana jantung berdetak dengan ritme yang tidak normal. Ini terjadi ketika sistem kelistrikan jantung tidak berfungsi dengan baik. Jantung normal berdetak 60-100 kali per menit dalam ritme yang teratur.

**Jenis-Jenis Aritmia:**
1. **Bradikardia**: Detak jantung < 60 bpm, dapat menyebabkan kelelahan dan pusing.
2. **Takikardia**: Detak jantung > 100 bpm, dapat menyebabkan palpitasi dan sesak napas.
3. **Fibrilasi Atrium**: Irama tidak teratur di atrium, meningkatkan risiko stroke.
4. **Flutter Atrium**: Irama cepat dan teratur di atrium.
5. **Ventrikel Takikardia**: Detak cepat dari ventrikel, berpotensi fatal.
6. **Premature Beats**: Detak tambahan yang terjadi lebih awal.

**Faktor Risiko:**
- Usia tua
- Hipertensi
- Penyakit jantung
- Konsumsi alkohol berlebihan
- Gangguan tiroid

**Pengobatan Umum:**
- **Obat-obatan**: Beta-blocker, antikoagulan.
- **Prosedur**: Ablasi kateter, implantasi alat pacu jantung.
- **Gaya Hidup**: Diet rendah garam, olahraga ringan, manajemen stres.`,
    interactiveElements: [
      {
        id: "quiz-1",
        type: "quiz",
        title: "Kuis: Pengetahuan Dasar Aritmia",
        data: {
          questions: [
            {
              question: "Berapa detak jantung normal per menit saat istirahat?",
              options: ["40-60", "60-100", "100-120", "120-140"],
              correctAnswer: 1,
              explanation:
                "Detak jantung istirahat yang sehat untuk orang dewasa berkisar antara 60 hingga 100 kali per menit (bpm).",
            },
            {
              question:
                "Kondisi di mana jantung berdetak terlalu lambat disebut...",
              options: ["Takikardia", "Bradikardia", "Fibrilasi", "Flutter"],
              correctAnswer: 1,
              explanation:
                "Bradikardia adalah istilah medis untuk detak jantung yang lebih lambat dari 60 kali per menit.",
            },
            {
              question: "Gejala mana yang TIDAK umum terjadi pada aritmia?",
              options: [
                "Palpitasi",
                "Sesak napas",
                "Sakit kepala ringan",
                "Pusing atau pingsan",
              ],
              correctAnswer: 2,
              explanation:
                "Meskipun mungkin terjadi, sakit kepala ringan bukanlah gejala khas aritmia.",
            },
            {
              question: "Apa yang meningkatkan risiko aritmia?",
              options: [
                "Olahraga berat",
                "Konsumsi kafein berlebihan",
                "Tidur cukup",
                "Diet tinggi serat",
              ],
              correctAnswer: 1,
              explanation:
                "Konsumsi kafein berlebihan dapat memicu aritmia pada beberapa individu.",
            },
          ],
        },
      },
      {
        id: "simulator-1",
        type: "simulator",
        title: "Simulator EKG Interaktif",
        data: {
          scenarios: [
            {
              name: "Normal Sinus",
              heartRate: 75,
              rhythm: "Teratur",
              symptoms: ["Tidak ada gejala"],
              ekgPath:
                "M0 50 l10 0 l5 -10 l5 10 l5 -5 l5 5 l10 0 l5 -30 l5 30 l10 0 l5 -5 l5 5 l10 0 l5 -10 l5 10 l5 -5 l5 5 l10 0",
              pWave: true,
              qrsWidth: "Normal",
              prInterval: "Normal (120-200 ms)",
            },
            {
              name: "Bradikardia",
              heartRate: 48,
              rhythm: "Lambat",
              symptoms: ["Kelelahan", "Pusing", "Pingsan"],
              ekgPath:
                "M0 50 l20 0 l5 -10 l5 10 l5 -5 l5 5 l20 0 l5 -25 l5 25 l20 0 l5 -10 l5 10 l5 -5 l5 5 l20 0",

              pWave: true,
              qrsWidth: "Normal",
              prInterval: "Normal",
            },
            {
              name: "Takikardia Sinus",
              heartRate: 110,
              rhythm: "Cepat",
              symptoms: ["Palpitasi", "Cemas", "Sesak napas"],
              ekgPath:
                "M0 50 l8 0 l4 -12 l4 12 l4 -6 l4 6 l8 0 l4 -35 l4 35 l8 0 l4 -6 l4 6 l8 0",
              pWave: true,
              qrsWidth: "Normal",
              prInterval: "Normal",
            },
            {
              name: "Fibrilasi Atrium",
              heartRate: 120,
              rhythm: "Tidak Teratur",
              symptoms: ["Palpitasi", "Kelelahan", "Risiko Stroke"],
              ekgPath:
                "M0 50 q5 3 10 0 t10 -2 t10 3 t10 -4 l4 -30 l4 30 t10 1 t10 -1 t10 3 t10 -2",
              pWave: false,
              qrsWidth: "Normal",
              prInterval: "Tidak Terlihat",
            },
            {
              name: "Ventrikel Takikardia",
              heartRate: 150,
              rhythm: "Cepat",
              symptoms: ["Pingsan", "Nyeri dada", "Henti jantung"],
              ekgPath:
                "M0 50 l8 0 l6 -40 l6 40 l8 0 l6 -40 l6 40 l8 0 l6 -40 l6 40 l8 0",
              pWave: false,
              qrsWidth: "Lebar",
              prInterval: "Tidak Terlihat",
            },
            {
              name: "Flutter Atrium",
              heartRate: 100,
              rhythm: "Teratur",
              symptoms: ["Palpitasi", "Kelelahan"],
              ekgPath:
                "M0 50 q5 10 10 0 q5 10 10 0 q5 10 10 0 l5 -30 l5 30 q5 10 10 0 q5 10 10 0",
              pWave: true,
              qrsWidth: "Normal",
              prInterval: "Normal",
            },
          ],
        },
      },
    ],
    author: "Tim Kardilogiku",
    publishDate: "2024-01-15",
    image: "/images/dasar_aritmia.png",
  },
  {
    id: "2",
    title: "Fibrilasi Atrium: Panduan Lengkap",
    category: "Aritmia Spesifik",
    difficulty: "Menengah",
    duration: 12,
    readCount: 1923,
    rating: 4.9,
    tags: ["Fibrilasi Atrium", "Stroke", "Pengobatan"],
    excerpt:
      "Memahami fibrilasi atrium secara mendalam, termasuk risiko stroke dan strategi pengobatan modern.",
    content: `Fibrilasi Atrium (AFib) adalah jenis aritmia yang paling umum. Ini terjadi ketika serambi jantung (atrium) bergetar secara kacau, menyebabkan detak tidak teratur. Bahaya utamanya adalah peningkatan risiko stroke hingga 5 kali lipat karena darah dapat menggumpal di atrium.

**Gejala:**
- Palpitasi (detak jantung terasa)
- Kelelahan
- Sesak napas
- Pusing

**Pengobatan:**
1. **Obat-obatan**: Antikoagulan (warfarin, apixaban), beta-blocker, calcium channel blocker.
2. **Prosedur**: Ablasi kateter, kardioversi elektrik.
3. **Perubahan Gaya Hidup**: Mengurangi kafein, berhenti merokok, olahraga moderat.

**Pencegahan:**
- Pantau tekanan darah
- Kelola stres
- Hindari pemicu seperti alkohol berlebihan`,
    interactiveElements: [
      {
        id: "calculator-1",
        type: "calculator",
        title: "Kalkulator Risiko Stroke CHA₂DS₂-VASc",
        data: {
          type: "stroke-risk",
          fields: [
            { name: "age", type: "number", label: "Usia Anda" },
            {
              name: "gender",
              type: "select",
              options: ["Pria", "Wanita"],
              label: "Jenis Kelamin",
            },
            {
              name: "hypertension",
              type: "select",
              options: ["Ya", "Tidak"],
              label: "Riwayat Hipertensi",
            },
            {
              name: "diabetes",
              type: "select",
              options: ["Ya", "Tidak"],
              label: "Riwayat Diabetes",
            },
            {
              name: "stroke",
              type: "select",
              options: ["Ya", "Tidak"],
              label: "Riwayat Stroke/TIA",
            },
            {
              name: "vascular_disease",
              type: "select",
              options: ["Ya", "Tidak"],
              label: "Penyakit Vaskular (PJK, PAD)",
            },
            {
              name: "heart_failure",
              type: "select",
              options: ["Ya", "Tidak"],
              label: "Riwayat Gagal Jantung",
            },
          ],
        },
      },
      {
        id: "quiz-2",
        type: "quiz",
        title: "Kuis: Fibrilasi Atrium",
        data: {
          questions: [
            {
              question: "Apa risiko utama fibrilasi atrium?",
              options: ["Stroke", "Diabetes", "Hipertensi", "Kanker"],
              correctAnswer: 0,
              explanation:
                "Fibrilasi atrium meningkatkan risiko stroke hingga 5 kali lipat karena pembentukan gumpalan darah di atrium.",
            },
            {
              question:
                "Obat apa yang sering digunakan untuk mencegah stroke pada AFib?",
              options: ["Aspirin", "Antikoagulan", "Antibiotik", "Analgesik"],
              correctAnswer: 1,
              explanation:
                "Antikoagulan seperti warfarin atau apixaban digunakan untuk mencegah pembentukan gumpalan darah.",
            },
            {
              question: "Apa yang dimaksud dengan kardioversi?",
              options: [
                "Pembedahan jantung",
                "Pemberian kejutan listrik",
                "Pemasangan stent",
                "Transplantasi jantung",
              ],
              correctAnswer: 1,
              explanation:
                "Kardioversi adalah prosedur pemberian kejutan listrik untuk mengembalikan ritme jantung normal.",
            },
          ],
        },
      },
    ],
    author: "Tim Kardilogiku",
    publishDate: "2024-01-20",
    image: "/images/atrial.png",
  },
  {
    id: "3",
    title: "Hidup Sehat dengan Aritmia",
    category: "Gaya Hidup",
    difficulty: "Pemula",
    duration: 10,
    readCount: 3421,
    rating: 4.7,
    tags: ["Gaya Hidup", "Diet", "Olahraga", "Manajemen Stres"],
    excerpt:
      "Panduan praktis untuk menjalani hidup sehat dan aktif meski memiliki aritmia jantung.",
    content: `Memiliki aritmia tidak berarti Anda harus berhenti beraktivitas. Dengan manajemen yang tepat, Anda bisa hidup sehat.

**Tips Gaya Hidup:**
1. **Diet Sehat**:
   - Konsumsi makanan rendah garam untuk menjaga tekanan darah.
   - Pilih lemak sehat (alpukat, kacang-kacangan) dan hindari lemak jenuh.
   - Batasi kafein dan alkohol.
2. **Olahraga**:
   - Lakukan olahraga ringan seperti jalan kaki atau yoga (30 menit, 5x/minggu).
   - Hindari olahraga intens tanpa persetujuan dokter.
3. **Manajemen Stres**:
   - Praktikkan meditasi atau pernapasan dalam.
   - Tidur cukup (7-9 jam per malam).
4. **Pemantauan**:
   - Gunakan alat pemantau detak jantung.
   - Catat gejala untuk konsultasi dokter.

**Manfaat Gaya Hidup Sehat**:
- Mengurangi frekuensi episode aritmia.
- Meningkatkan kualitas hidup.
- Menurunkan risiko komplikasi seperti stroke.`,
    interactiveElements: [
      {
        id: "checklist-1",
        type: "checklist",
        title: "Checklist Gaya Hidup Sehat",
        data: {
          items: [
            { text: "Minum obat sesuai jadwal", category: "Pengobatan" },
            { text: "Cek tekanan darah rutin", category: "Pemantauan" },
            { text: "Olahraga ringan 30 menit/hari", category: "Olahraga" },
            { text: "Tidur cukup 7-9 jam", category: "Manajemen Stres" },
            { text: "Batasi konsumsi kafein", category: "Diet" },
            {
              text: "Kelola stres dengan meditasi",
              category: "Manajemen Stres",
            },
            { text: "Konsumsi makanan rendah garam", category: "Diet" },
            { text: "Hindari alkohol berlebihan", category: "Diet" },
          ],
        },
      },
      {
        id: "calculator-2",
        type: "calculator",
        title: "Kalkulator Zona Detak Jantung",
        data: {
          type: "heart-rate-zones",
          fields: [
            { name: "age", type: "number", label: "Usia Anda" },
            {
              name: "restingHeartRate",
              type: "number",
              label: "Detak Jantung Istirahat (bpm)",
            },
            {
              name: "activityLevel",
              type: "select",
              options: ["Ringan", "Sedang", "Berat"],
              label: "Tingkat Aktivitas",
            },
          ],
        },
      },
    ],
    author: "Tim Kardilogiku",
    publishDate: "2024-01-25",
    image: "/images/sehat.png",
  },
  {
    id: "4",
    title: "Tantangan Kardiologiku: Uji Pengetahuanmu!",
    category: "Gamifikasi",
    difficulty: "Menengah",
    duration: 15,
    readCount: 1500,
    rating: 4.9,
    tags: ["Tantangan", "Kuis", "Gamifikasi"],
    excerpt:
      "Selesaikan serangkaian tantangan interaktif untuk mendapatkan poin, naik level, dan memenangkan lencana eksklusif!",
    content: `Uji pemahaman Anda tentang kesehatan jantung dan aritmia melalui serangkaian tantangan yang dirancang khusus. Setiap tantangan yang diselesaikan akan memberi Anda Poin Pengalaman (XP) untuk meningkatkan level Anda dan membuka lencana penghargaan.

**Manfaat Gamifikasi:**
- Meningkatkan motivasi belajar.
- Memberikan umpan balik instan.
- Membuat edukasi kesehatan lebih menyenangkan.`,
    interactiveElements: [
      {
        id: "gamification-1",
        type: "gamification",
        title: "Arena Tantangan Jantung",
        data: {
          challenges: [
            {
              id: "challenge-1",
              title: "Kuis Cepat: Faktor Risiko",
              description:
                "Jawab 3 pertanyaan tentang faktor risiko Fibrilasi Atrium.",
              xp: 50,
              relatedArticleId: "2",
              category: "Pengetahuan",
            },
            {
              id: "challenge-2",
              title: "Identifikasi Gejala Aritmia",
              description: "Cocokkan gejala dengan jenis aritmia yang tepat.",
              xp: 75,
              category: "Pengetahuan",
            },
            {
              id: "challenge-3",
              title: "Selesaikan Checklist Hidup Sehat",
              description:
                'Lengkapi semua item pada checklist di artikel "Hidup Sehat".',
              xp: 100,
              relatedArticleId: "3",
              category: "Gaya Hidup",
            },
            {
              id: "challenge-4",
              title: "Simulasi EKG: Deteksi Aritmia",
              description: "Identifikasi 3 jenis aritmia dari simulasi EKG.",
              xp: 80,
              relatedArticleId: "1",
              category: "Simulasi",
            },
            {
              id: "challenge-5",
              title: "Pantau Detak Jantung 3 Hari",
              description:
                "Catat detak jantung Anda selama 3 hari berturut-turut.",
              xp: 120,
              category: "Pemantauan",
            },
          ],
          rewards: [
            {
              id: "badge-beginner",
              name: "Pemeduli Jantung",
              icon: Heart,
              description: "Menyelesaikan tantangan pertama.",
              requirement: "Selesaikan 1 tantangan",
            },
            {
              id: "badge-expert",
              name: "Ahli Aritmia",
              icon: Award,
              description: "Menyelesaikan semua tantangan.",
              requirement: "Selesaikan semua tantangan",
            },
            {
              id: "badge-lifestyle",
              name: "Gaya Hidup Sehat",
              icon: Activity,
              description: "Menyelesaikan semua tantangan gaya hidup.",
              requirement: "Selesaikan 2 tantangan gaya hidup",
            },
            {
              id: "badge-streak",
              name: "Streak Master",
              icon: Calendar,
              description: "Menjaga streak selama 7 hari.",
              requirement: "Login 7 hari berturut-turut",
            },
          ],
          leaderboard: [
            { user: "Jantungan123", score: 450 },
            { user: "HeartBeat99", score: 380 },
            { user: "CardioKing", score: 300 },
          ],
        },
      },
    ],
    author: "Tim Kardiologiku",
    publishDate: "2024-02-01",
    image: "/images/uji.png",
  },
  {
    id: "5",
    title: "Strategi Pengobatan Aritmia Modern",
    category: "Pengobatan",
    difficulty: "Lanjut",
    duration: 15,
    readCount: 1200,
    rating: 4.8,
    tags: ["Pengobatan", "Obat-obatan", "Prosedur Medis"],
    excerpt:
      "Jelajahi strategi pengobatan modern untuk aritmia, dari obat-obatan hingga prosedur invasif.",
    content: `Pengobatan aritmia bertujuan untuk mengontrol detak jantung, mencegah komplikasi, dan meningkatkan kualitas hidup.

**Pendekatan Pengobatan:**
1. **Farmakologis**:
   - **Beta-blocker**: Mengurangi detak jantung (misalnya, metoprolol).
   - **Antikoagulan**: Mencegah pembekuan darah (misalnya, apixaban).
   - **Anti-aritmia**: Mengatur ritme (misalnya, amiodarone).
2. **Non-Farmakologis**:
   - **Ablasi Kateter**: Menghancurkan jaringan penyebab aritmia.
   - **Kardioversi**: Mengembalikan ritme normal dengan kejutan listrik.
   - **Alat Pacu Jantung**: Mengatur detak jantung.
3. **Manajemen Risiko**:
   - Kontrol tekanan darah dan kolesterol.
   - Berhenti merokok.
   - Diet seimbang.

**Pertimbangan**:
- Konsultasi rutin dengan kardiologis.
- Pemantauan efek samping obat.
- Penyesuaian gaya hidup untuk mendukung pengobatan.`,
    interactiveElements: [
      {
        id: "quiz-3",
        type: "quiz",
        title: "Kuis: Pengobatan Aritmia",
        data: {
          questions: [
            {
              question:
                "Obat apa yang digunakan untuk mengontrol detak jantung?",
              options: [
                "Antibiotik",
                "Beta-blocker",
                "Analgesik",
                "Antidepresan",
              ],
              correctAnswer: 1,
              explanation:
                "Beta-blocker seperti metoprolol digunakan untuk memperlambat detak jantung.",
            },
            {
              question: "Apa fungsi ablasi kateter?",
              options: [
                "Memasang alat pacu jantung",
                "Menghancurkan jaringan penyebab aritmia",
                "Mengukur tekanan darah",
                "Meningkatkan aliran darah",
              ],
              correctAnswer: 1,
              explanation:
                "Ablasi kateter menghancurkan jaringan jantung yang menyebabkan aritmia.",
            },
            {
              question: "Apa yang harus dihindari selama pengobatan aritmia?",
              options: [
                "Olahraga ringan",
                "Merokok",
                "Diet sehat",
                "Tidur cukup",
              ],
              correctAnswer: 1,
              explanation:
                "Merokok dapat memperburuk aritmia dan meningkatkan risiko komplikasi.",
            },
          ],
        },
      },
      {
        id: "checklist-2",
        type: "checklist",
        title: "Checklist Pengobatan Aritmia",
        data: {
          items: [
            {
              text: "Konsultasi rutin dengan kardiologis",
              category: "Pemantauan",
            },
            { text: "Minum obat sesuai resep", category: "Pengobatan" },
            { text: "Pantau efek samping obat", category: "Pemantauan" },
            { text: "Hindari pemicu aritmia", category: "Gaya Hidup" },
            { text: "Catat gejala untuk dokter", category: "Pemantauan" },
          ],
        },
      },
    ],
    author: "Tim Kardilogiku",
    publishDate: "2024-02-10",
    image: "/images/pengobatan.png",
  },
];

const categories: string[] = [
  "Semua",
  "Dasar-Dasar",
  "Aritmia Spesifik",
  "Gaya Hidup",
  "Pengobatan",
  "Gamifikasi",
];

// Components
const DifficultyBadge: React.FC<{ difficulty: string }> = ({ difficulty }) => {
  const colorMap: { [key: string]: string } = {
    Pemula: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
    Menengah:
      "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200",
    Lanjut: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200",
    Gamifikasi:
      "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200",
  };
  return <Badge className={colorMap[difficulty]}>{difficulty}</Badge>;
};

const RatingStars: React.FC<{ rating: number }> = ({ rating }) => (
  <div className="flex items-center space-x-1">
    {[...Array(5)].map((_, i) => (
      <Star
        key={i}
        className={`h-4 w-4 ${
          i < Math.round(rating)
            ? "fill-yellow-400 text-yellow-400"
            : "text-gray-300 dark:text-gray-600"
        }`}
      />
    ))}
    <span className="text-sm text-gray-600 dark:text-gray-400 ml-1">
      {rating.toFixed(1)}
    </span>
  </div>
);

const EKGAnimation: React.FC<{
  path: string;
  isPlaying: boolean;
  heartRate: number;
}> = ({ path, isPlaying, heartRate }) => {
  const slowdownFactor = 2;
  const speed = 2 * (60 / heartRate) * slowdownFactor;

  return (
    <svg viewBox="0 0 200 100" className="w-full h-24 text-red-500 relative">
      <defs>
        <pattern
          id="ekgGrid"
          width="20"
          height="20"
          patternUnits="userSpaceOnUse"
        >
          <path
            d="M20 0H0V20"
            className="stroke-green-500 stroke-opacity-30 stroke-[0.5]"
          />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#ekgGrid)" />
      <motion.path
        d={path}
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: isPlaying ? 1 : 0 }}
        transition={{
          duration: isPlaying ? speed : 0,
          repeat: isPlaying ? Infinity : 0,
          ease: "linear",
        }}
      />
    </svg>
  );
};

const InteractiveQuiz: React.FC<{ data: QuizData }> = ({ data }) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [isCompleted, setIsCompleted] = useState(false);
  const [streak, setStreak] = useState(0);
  const currentQuestion = data.questions[currentQuestionIndex];
  const showExplanation = selectedAnswer !== null;

  const handleAnswerSelect = (answerIndex: number) => {
    if (showExplanation) return;
    setSelectedAnswer(answerIndex);
    if (answerIndex === currentQuestion.correctAnswer) {
      setScore((prev) => prev + 1);
      setStreak((prev) => prev + 1);
    } else {
      setStreak(0);
    }
  };

  const nextQuestion = () => {
    if (currentQuestionIndex < data.questions.length - 1) {
      setCurrentQuestionIndex((prev) => prev + 1);
      setSelectedAnswer(null);
    } else {
      setIsCompleted(true);
    }
  };

  const resetQuiz = () => {
    setCurrentQuestionIndex(0);
    setSelectedAnswer(null);
    setScore(0);
    setIsCompleted(false);
    setStreak(0);
  };

  if (isCompleted) {
    return (
      <div className="text-center p-6 bg-green-50 dark:bg-green-900/20 rounded-lg">
        <Award className="h-16 w-16 text-yellow-500 mx-auto mb-4" />
        <h3 className="text-2xl font-bold mb-2">Kuis Selesai!</h3>
        <p className="text-lg mb-2">
          Skor Anda: {score}/{data.questions.length} (
          {Math.round((score / data.questions.length) * 100)}%)
        </p>
        <p className="text-sm mb-4">
          Streak: {streak} jawaban benar berturut-turut
        </p>
        <Button onClick={resetQuiz} className="bg-blue-500 hover:bg-blue-600">
          <RotateCcw className="h-4 w-4 mr-2" /> Ulangi Kuis
        </Button>
      </div>
    );
  }

  return (
    <div className="p-4 space-y-6">
      <div className="flex justify-between items-center">
        <Progress
          value={((currentQuestionIndex + 1) / data.questions.length) * 100}
          className="h-2 w-3/4"
        />
        <Badge className="bg-purple-500">Streak: {streak}</Badge>
      </div>
      <h4 className="text-lg font-semibold">{currentQuestion.question}</h4>
      <div className="space-y-3">
        {currentQuestion.options.map((option, index) => {
          const isCorrect = index === currentQuestion.correctAnswer;
          const isSelected = selectedAnswer === index;
          let variant: "default" | "outline" | "secondary" | "destructive" =
            "outline";
          if (showExplanation) {
            if (isCorrect) variant = "secondary";
            else if (isSelected) variant = "destructive";
          }
          return (
            <Button
              key={index}
              variant={variant}
              className="w-full justify-start p-4 h-auto"
              onClick={() => handleAnswerSelect(index)}
              disabled={showExplanation}
            >
              <span className="mr-3 font-semibold">
                {String.fromCharCode(65 + index)}.
              </span>
              {option}
              {showExplanation && isCorrect && (
                <CheckCircle className="h-5 w-5 ml-auto text-green-600" />
              )}
              {showExplanation && isSelected && !isCorrect && (
                <XCircle className="h-5 w-5 ml-auto text-red-600" />
              )}
            </Button>
          );
        })}
      </div>
      <AnimatePresence>
        {showExplanation && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg"
          >
            <h5 className="font-semibold mb-2 text-blue-800 dark:text-blue-200">
              Penjelasan:
            </h5>
            <p className="text-sm text-blue-700 dark:text-blue-300">
              {currentQuestion.explanation}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
      {showExplanation && (
        <Button
          onClick={nextQuestion}
          className="w-full bg-blue-500 hover:bg-blue-600"
        >
          {currentQuestionIndex < data.questions.length - 1
            ? "Lanjut"
            : "Lihat Hasil"}
        </Button>
      )}
    </div>
  );
};

const HeartRateSimulator: React.FC<{ data: SimulatorData }> = ({ data }) => {
  const [currentScenarioIndex, setCurrentScenarioIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const scenario = data.scenarios[currentScenarioIndex];

  return (
    <div className="p-4">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-4">
          <h4 className="font-bold">Pilih Skenario Aritmia:</h4>
          <div className="overflow-x-auto">
            <Tabs
              onValueChange={(val) => setCurrentScenarioIndex(Number(val))}
              defaultValue="0"
              className="w-full"
            >
              <TabsList className="flex gap-2 w-max">
                {data.scenarios.map((s, i) => (
                  <TabsTrigger
                    key={s.name}
                    value={String(i)}
                    className="text-sm px-4 py-2 min-w-[150px] whitespace-nowrap"
                  >
                    {s.name}
                  </TabsTrigger>
                ))}
              </TabsList>
            </Tabs>
          </div>
          <Card className="mt-4 bg-gray-50 dark:bg-gray-800/50">
            <CardHeader>
              <CardTitle>{scenario.name}</CardTitle>
            </CardHeader>
            <CardContent>
              <p>
                <strong>Detak Jantung:</strong> {scenario.heartRate} bpm
              </p>
              <p>
                <strong>Irama:</strong> {scenario.rhythm}
              </p>
              <p>
                <strong>Gejala Umum:</strong> {scenario.symptoms.join(", ")}
              </p>
              <p>
                <strong>P Wave:</strong> {scenario.pWave ? "Ada" : "Tidak Ada"}
              </p>
              <p>
                <strong>Lebar QRS:</strong> {scenario.qrsWidth}
              </p>
              <p>
                <strong>PR Interval:</strong> {scenario.prInterval}
              </p>
            </CardContent>
          </Card>
        </div>
        <div className="bg-black p-4 rounded-lg">
          <div className="flex justify-between items-center text-green-400 mb-2">
            <span className="font-mono text-2xl">
              {scenario.heartRate} <span className="text-lg">BPM</span>
            </span>
            <Heart
              className="h-6 w-6 animate-pulse"
              style={{ animationDuration: `${60 / scenario.heartRate}s` }}
            />
          </div>
          <EKGAnimation
            path={scenario.ekgPath}
            isPlaying={isPlaying}
            heartRate={scenario.heartRate}
          />
          <Button
            onClick={() => setIsPlaying(!isPlaying)}
            className="w-full mt-4 bg-blue-500 hover:bg-blue-600"
          >
            {isPlaying ? (
              <Pause className="mr-2 h-4 w-4" />
            ) : (
              <Play className="mr-2 h-4 w-4" />
            )}
            {isPlaying ? "Jeda Simulasi" : "Mulai Simulasi"}
          </Button>
        </div>
      </div>
    </div>
  );
};

const InteractiveCalculator: React.FC<{ data: CalculatorData }> = ({
  data,
}) => {
  const [formState, setFormState] = useState<Record<string, string | number>>(
    {}
  );
  const [result, setResult] = useState<string | null>(null);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setFormState({ ...formState, [e.target.name]: e.target.value });
  };

  const calculateResult = () => {
    if (data.type === "stroke-risk") {
      let score = 0;
      if (Number(formState.age) >= 75) score += 2;
      else if (Number(formState.age) >= 65) score += 1;
      if (formState.hypertension === "Ya") score += 1;
      if (formState.diabetes === "Ya") score += 1;
      if (formState.stroke === "Ya") score += 2;
      if (formState.vascular_disease === "Ya") score += 1;
      if (formState.gender === "Wanita") score += 1;
      if (formState.heart_failure === "Ya") score += 1;
      setResult(
        `Skor CHA₂DS₂-VASc Anda adalah ${score}. Semakin tinggi skor, semakin tinggi risiko stroke. Diskusikan hasil ini dengan dokter Anda.`
      );
    } else if (data.type === "heart-rate-zones") {
      const age = Number(formState.age);

      const maxHR = 220 - age;
      const zones = {
        Ringan: [Math.round(maxHR * 0.5), Math.round(maxHR * 0.6)],
        Sedang: [Math.round(maxHR * 0.6), Math.round(maxHR * 0.7)],
        Berat: [Math.round(maxHR * 0.7), Math.round(maxHR * 0.85)],
      };
      setResult(
        `Zona detak jantung Anda:\n- Ringan: ${zones.Ringan[0]}-${zones.Ringan[1]} bpm\n- Sedang: ${zones.Sedang[0]}-${zones.Sedang[1]} bpm\n- Berat: ${zones.Berat[0]}-${zones.Berat[1]} bpm`
      );
    }
  };

  return (
    <div className="p-4 space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {data.fields.map((field) => (
          <div key={field.name} className="space-y-1">
            <label className="text-sm font-medium">{field.label}</label>
            {field.type === "number" ? (
              <Input
                type="number"
                name={field.name}
                onChange={handleChange}
                className="w-full p-2 border rounded-md"
              />
            ) : (
              <select
                name={field.name}
                onChange={handleChange}
                className="w-full p-2 border rounded-md bg-transparent"
              >
                <option>Pilih...</option>
                {field.options?.map((opt) => (
                  <option key={opt} value={opt}>
                    {opt}
                  </option>
                ))}
              </select>
            )}
          </div>
        ))}
      </div>
      <Button
        onClick={calculateResult}
        className="w-full bg-blue-500 hover:bg-blue-600"
      >
        Hitung Skor
      </Button>
      {result && (
        <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg text-center font-semibold whitespace-pre-line">
          {result}
        </div>
      )}
    </div>
  );
};

const InteractiveChecklist: React.FC<{ data: ChecklistData }> = ({ data }) => {
  const [checkedItems, setCheckedItems] = useState<string[]>([]);
  const toggleItem = (item: string) =>
    setCheckedItems((prev) =>
      prev.includes(item) ? prev.filter((i) => i !== item) : [...prev, item]
    );
  const progress = (checkedItems.length / data.items.length) * 100;
  const groupedItems = data.items.reduce((acc, item) => {
    acc[item.category] = acc[item.category] || [];
    acc[item.category].push(item);
    return acc;
  }, {} as Record<string, { text: string; category: string }[]>);

  return (
    <div className="p-4 space-y-4">
      <Progress value={progress} className="h-2" />
      {Object.entries(groupedItems).map(([category, items]) => (
        <div key={category}>
          <h5 className="font-semibold text-lg mb-2">{category}</h5>
          <div className="space-y-3">
            {items.map((item) => (
              <div
                key={item.text}
                onClick={() => toggleItem(item.text)}
                className="flex items-center gap-3 p-3 rounded-lg cursor-pointer bg-white dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              >
                <motion.div className="w-6 h-6 border-2 rounded-md flex items-center justify-center border-gray-400">
                  {checkedItems.includes(item.text) && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="w-4 h-4 bg-green-500 rounded-sm"
                    />
                  )}
                </motion.div>
                <span
                  className={
                    checkedItems.includes(item.text)
                      ? "line-through text-gray-500"
                      : ""
                  }
                >
                  {item.text}
                </span>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

const RewardBadge: React.FC<{ reward: Reward; earned: boolean }> = ({
  reward,
  earned,
}) => (
  <div
    className={`text-center p-4 border rounded-lg transition-all duration-300 ${
      earned
        ? "border-yellow-500 bg-yellow-50 dark:bg-yellow-900/20"
        : "border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800"
    }`}
  >
    <reward.icon
      className={`h-12 w-12 mx-auto mb-2 ${
        earned ? "text-yellow-500" : "text-gray-400"
      }`}
    />
    <h4
      className={`font-bold ${
        earned
          ? "text-yellow-600 dark:text-yellow-400"
          : "text-gray-700 dark:text-gray-300"
      }`}
    >
      {reward.name}
    </h4>
    <p className="text-xs text-gray-500 dark:text-gray-400">
      {reward.description}
    </p>
    <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
      {reward.requirement}
    </p>
  </div>
);

const ChallengeCard: React.FC<{
  challenge: Challenge;
  completed: boolean;
  onComplete: () => void;
}> = ({ challenge, completed, onComplete }) => (
  <motion.div
    className={`p-4 rounded-lg border-2 flex items-center justify-between ${
      completed
        ? "bg-green-50 border-green-200 dark:bg-green-900/20 dark:border-green-700"
        : "bg-white dark:bg-gray-800"
    }`}
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay: 0.1 }}
  >
    <div>
      <h5 className="font-bold text-gray-800 dark:text-white">
        {challenge.title}
      </h5>
      <p className="text-sm text-gray-600 dark:text-gray-400">
        {challenge.description}
      </p>
      <div className="flex gap-2 mt-2">
        <Badge variant="secondary">+{challenge.xp} XP</Badge>
        <Badge className="bg-blue-100 text-blue-800">
          {challenge.category}
        </Badge>
      </div>
    </div>
    <Button
      onClick={onComplete}
      disabled={completed}
      size="sm"
      className={completed ? "bg-green-500" : "bg-blue-500 hover:bg-blue-600"}
    >
      {completed ? (
        <CheckCircle className="h-4 w-4 mr-2" />
      ) : (
        <Zap className="h-4 w-4 mr-2" />
      )}
      {completed ? "Selesai" : "Mulai"}
    </Button>
  </motion.div>
);

const InteractiveGamification: React.FC<{ data: GamificationData }> = ({
  data,
}) => {
  const [userProfile, setUserProfile] = useState<UserProfile>(() => {
    const savedProfile = localStorage.getItem("userProfile");
    return savedProfile
      ? JSON.parse(savedProfile)
      : {
          level: 1,
          xp: 0,
          xpToNextLevel: 100,
          completedChallenges: [],
          earnedBadges: [],
          streak: 0,
        };
  });

  useEffect(() => {
    localStorage.setItem("userProfile", JSON.stringify(userProfile));
    const today = new Date().toDateString();
    const lastLogin = localStorage.getItem("lastLogin");
    if (lastLogin !== today) {
      setUserProfile((prev) => ({
        ...prev,
        streak:
          lastLogin &&
          new Date(lastLogin).getDate() === new Date().getDate() - 1
            ? prev.streak + 1
            : 1,
      }));
      localStorage.setItem("lastLogin", today);
      if (
        userProfile.streak >= 6 &&
        !userProfile.earnedBadges.includes("badge-streak")
      ) {
        setUserProfile((prev) => ({
          ...prev,
          earnedBadges: [...prev.earnedBadges, "badge-streak"],
        }));
      }
    }
  }, [userProfile]);

  const completeChallenge = (challengeId: string, xp: number) => {
    if (userProfile.completedChallenges.includes(challengeId)) return;
    const newXp = userProfile.xp + xp;
    const newCompleted = [...userProfile.completedChallenges, challengeId];
    let newLevel = userProfile.level;
    let newXpToNextLevel = userProfile.xpToNextLevel;
    const newBadges = [...userProfile.earnedBadges];

    if (newXp >= userProfile.xpToNextLevel) {
      newLevel++;
      newXpToNextLevel = Math.floor(userProfile.xpToNextLevel * 1.5);
    }

    if (newCompleted.length === 1 && !newBadges.includes("badge-beginner")) {
      newBadges.push("badge-beginner");
    }
    if (
      newCompleted.length === data.challenges.length &&
      !newBadges.includes("badge-expert")
    ) {
      newBadges.push("badge-expert");
    }
    if (
      newCompleted.filter((id) =>
        data.challenges.find((c) => c.id === id && c.category === "Gaya Hidup")
      ).length >= 2 &&
      !newBadges.includes("badge-lifestyle")
    ) {
      newBadges.push("badge-lifestyle");
    }

    setUserProfile({
      level: newLevel,
      xp: newXp,
      xpToNextLevel: newXpToNextLevel,
      completedChallenges: newCompleted,
      earnedBadges: newBadges,
      streak: userProfile.streak,
    });
  };

  return (
    <div className="p-6 bg-gray-100 dark:bg-gray-900 rounded-lg">
      <Card className="mb-6 bg-white/50 dark:bg-gray-800/50">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Profil Pemain</span>
            <div className="flex gap-2">
              <Badge variant="destructive">Level {userProfile.level}</Badge>
              <Badge className="bg-orange-500">
                Streak: {userProfile.streak} Hari
              </Badge>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <p className="text-sm font-medium">Poin Pengalaman (XP)</p>
            <Progress
              value={(userProfile.xp / userProfile.xpToNextLevel) * 100}
              className="h-2"
            />
            <p className="text-xs text-right text-gray-500">
              {userProfile.xp} / {userProfile.xpToNextLevel} XP untuk Level Up
            </p>
          </div>
        </CardContent>
      </Card>
      <h4 className="text-xl font-bold mb-4">Papan Peringkat</h4>
      <Card className="mb-6">
        <CardContent className="pt-4">
          {data.leaderboard.map((entry, index) => (
            <div
              key={index}
              className="flex justify-between py-2 border-b last:border-b-0"
            >
              <span className="font-medium">
                {index + 1}. {entry.user}
              </span>
              <span>{entry.score} XP</span>
            </div>
          ))}
        </CardContent>
      </Card>
      <h4 className="text-xl font-bold mb-4">Tantangan Tersedia</h4>
      <div className="space-y-4 mb-8">
        {data.challenges.map((challenge) => (
          <ChallengeCard
            key={challenge.id}
            challenge={challenge}
            completed={userProfile.completedChallenges.includes(challenge.id)}
            onComplete={() => completeChallenge(challenge.id, challenge.xp)}
          />
        ))}
      </div>
      <h4 className="text-xl font-bold mb-4">Lencana Penghargaan</h4>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
        {data.rewards.map((reward) => (
          <RewardBadge
            key={reward.id}
            reward={reward}
            earned={userProfile.earnedBadges.includes(reward.id)}
          />
        ))}
      </div>
    </div>
  );
};

// Main Component
const InteractiveEducationSection: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState<string>("Semua");
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [selectedArticle, setSelectedArticle] = useState<Article | null>(null);

  const filteredArticles = useMemo(() => {
    return articlesData
      .filter(
        (article) =>
          activeCategory === "Semua" || article.category === activeCategory
      )
      .filter(
        (article) =>
          article.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          article.tags.some((tag) =>
            tag.toLowerCase().includes(searchTerm.toLowerCase())
          )
      );
  }, [activeCategory, searchTerm]);

  const renderInteractiveElement = (element: InteractiveElement) => {
    switch (element.type) {
      case "quiz":
        return <InteractiveQuiz data={element.data as QuizData} />;
      case "simulator":
        return <HeartRateSimulator data={element.data as SimulatorData} />;
      case "checklist":
        return <InteractiveChecklist data={element.data as ChecklistData} />;
      case "calculator":
        return <InteractiveCalculator data={element.data as CalculatorData} />;
      case "gamification":
        return (
          <InteractiveGamification data={element.data as GamificationData} />
        );
      default:
        return (
          <div className="p-4 text-center text-gray-500">
            Elemen interaktif belum tersedia.
          </div>
        );
    }
  };

  return (
    <section
      id="edukasi-interaktif"
      className="py-16 sm:py-24 bg-gray-50 dark:bg-black"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <BookOpen className="h-12 w-12 mx-auto text-red-600 mb-4" />
          <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 dark:text-white mb-4">
            Pusat Edukasi Interaktif
          </h2>
          <p className="text-lg sm:text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
            Belajar tentang kesehatan jantung tidak pernah semenyenangkan ini.
            Jelajahi artikel, kuis, dan simulator kami.
          </p>
        </motion.div>

        <div className="flex flex-col sm:flex-row gap-4 mb-8 sticky top-16 bg-gray-50/80 dark:bg-black/80 backdrop-blur-sm p-4 z-40 rounded-xl shadow-md ">
          <div className="relative flex-grow">
            <Input
              placeholder="Cari artikel, topik, atau tag..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 h-12 w-full"
            />
            <Brain className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
          </div>
          <Tabs value={activeCategory} onValueChange={setActiveCategory}>
            <TabsList className="grid grid-cols-3 sm:grid-cols-6 gap-2 h-12 min-w-max">
              {categories.map((cat) => (
                <TabsTrigger
                  key={cat}
                  value={cat}
                  className="text-xs sm:text-sm py-2 px-3 whitespace-nowrap overflow-hidden text-ellipsis"
                >
                  {cat}
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>
        </div>

        <motion.div
          layout
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8"
        >
          <AnimatePresence>
            {filteredArticles.map((article) => (
              <motion.div
                key={article.id}
                layout
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.8, opacity: 0 }}
                transition={{ type: "spring", stiffness: 200, damping: 25 }}
              >
                <Card
                  onClick={() => setSelectedArticle(article)}
                  className="h-full cursor-pointer hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 flex flex-col group overflow-hidden"
                >
                  <CardHeader className="p-0">
                    <div className="overflow-hidden">
                      <img
                        src={article.image}
                        alt={article.title}
                        className="rounded-t-lg aspect-video object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                  </CardHeader>
                  <CardContent className="p-4 sm:p-6 flex flex-col flex-grow">
                    <div className="flex justify-between items-center mb-2">
                      <DifficultyBadge
                        difficulty={
                          article.category === "Gamifikasi"
                            ? "Gamifikasi"
                            : article.difficulty
                        }
                      />
                      <RatingStars rating={article.rating} />
                    </div>
                    <CardTitle className="mb-2 text-base sm:text-lg">
                      {article.title}
                    </CardTitle>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 flex-grow">
                      {article.excerpt}
                    </p>
                    <div className="flex justify-between items-center text-xs text-gray-500 dark:text-gray-400 border-t pt-3 mt-auto">
                      <span>
                        <Clock className="inline h-3 w-3 mr-1" />
                        {article.duration} min baca
                      </span>
                      <span>
                        <Users className="inline h-3 w-3 mr-1" />
                        {article.readCount.toLocaleString()}x dibaca
                      </span>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>

        <Dialog
          open={!!selectedArticle}
          onOpenChange={() => setSelectedArticle(null)}
        >
          <AnimatePresence>
            {selectedArticle && (
              <DialogContent className="max-w-full sm:max-w-8xl h-[100vh] flex flex-col p-0">
                <motion.div
                  initial={{ y: -50, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                >
                  <div className="relative h-64 sm:h-72 w-full">
                    <img
                      src={selectedArticle.image}
                      alt={selectedArticle.title}
                      className="absolute inset-0 w-full h-full object-cover z-0"
                    />
                    {/* Tombol Close di sudut kanan atas */}
                    <Button
                      onClick={() => setSelectedArticle(null)}
                      className="absolute top-4 right-4 bg-white/80 dark:bg-gray-800/80 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full p-2 h-10 w-10 z-10"
                      aria-label="Close"
                    >
                      <XCircle className="h-6 w-6 text-gray-800 dark:text-gray-200" />
                    </Button>
                  </div>
                  <DialogHeader className="p-4 sm:p-6 text-left">
                    <DialogTitle className="text-2xl sm:text-3xl">
                      {selectedArticle.title}
                    </DialogTitle>
                    <div className="text-sm text-gray-500 dark:text-gray-400 flex flex-col sm:flex-row gap-2 sm:gap-4 pt-2">
                      <span>Oleh: {selectedArticle.author}</span>
                      <span>
                        <Calendar className="inline h-4 w-4 mr-1" />
                        {selectedArticle.publishDate}
                      </span>
                    </div>
                  </DialogHeader>
                </motion.div>

                <div className="flex-grow overflow-y-auto px-4 sm:px-6 pb-6 custom-scrollbar">
                  <div
                    className="prose dark:prose-invert max-w-none mb-8"
                    dangerouslySetInnerHTML={{
                      __html: selectedArticle.content.replace(/\n/g, "<br />"),
                    }}
                  />

                  <Separator className="my-8" />

                  <div className="space-y-6">
                    {selectedArticle.interactiveElements.map((el) => (
                      <Card
                        key={el.id}
                        className="mb-6 bg-gray-50 dark:bg-gray-900/50"
                      >
                        <CardHeader>
                          <CardTitle className="flex items-center gap-2">
                            <Zap size={20} className="text-yellow-500" />
                            {el.title}
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          {renderInteractiveElement(el)}
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              </DialogContent>
            )}
          </AnimatePresence>
        </Dialog>
      </div>
    </section>
  );
};

export default InteractiveEducationSection;

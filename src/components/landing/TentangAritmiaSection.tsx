import { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { motion, AnimatePresence } from "framer-motion";
import {
  Zap,
  ZapOff,
  ShieldAlert,
  Heart,
  Activity,
  Stethoscope,
  AlertTriangle,
  RadioTower,
  Search,
  Dna,
  TrendingUp,
  HeartPulse,
  type LucideIcon,
} from "lucide-react";
import { cn } from "@/lib/utils"; // Pastikan Anda memiliki utilitas ini

// --- PERBAIKAN: Definisikan tipe warna yang valid ---
const colorSchemes = {
  purple: {
    bg: "bg-purple-100 dark:bg-purple-900/30",
    text: "text-purple-600 dark:text-purple-400",
    border: "hover:border-purple-500",
    icon: "text-purple-600",
  },
  orange: {
    bg: "bg-orange-100 dark:bg-orange-900/30",
    text: "text-orange-600 dark:text-orange-400",
    border: "hover:border-orange-500",
    icon: "text-orange-600",
  },
  red: {
    bg: "bg-red-100 dark:bg-red-900/30",
    text: "text-red-600 dark:text-red-400",
    border: "hover:border-red-500",
    icon: "text-red-600",
  },
  pink: {
    bg: "bg-pink-100 dark:bg-pink-900/30",
    text: "text-pink-600 dark:text-pink-400",
    border: "hover:border-pink-500",
    icon: "text-pink-600",
  },
  gray: {
    bg: "bg-gray-100 dark:bg-gray-700/30",
    text: "text-gray-600 dark:text-gray-400",
    border: "hover:border-gray-500",
    icon: "text-gray-600",
  },
  teal: {
    bg: "bg-teal-100 dark:bg-teal-900/30",
    text: "text-teal-600 dark:text-teal-400",
    border: "hover:border-teal-500",
    icon: "text-teal-600",
  },
  blue: {
    bg: "bg-blue-100 dark:bg-blue-900/30",
    text: "text-blue-600 dark:text-blue-400",
    border: "hover:border-blue-500",
    icon: "text-blue-600",
  },
  yellow: {
    bg: "bg-yellow-100 dark:bg-yellow-900/30",
    text: "text-yellow-600 dark:text-yellow-400",
    border: "hover:border-yellow-500",
    icon: "text-yellow-600",
  },
  cyan: {
    bg: "bg-cyan-100 dark:bg-cyan-900/30",
    text: "text-cyan-600 dark:text-cyan-400",
    border: "hover:border-cyan-500",
    icon: "text-cyan-600",
  },
  green: {
    bg: "bg-green-100 dark:bg-green-900/30",
    text: "text-green-600 dark:text-green-400",
    border: "hover:border-green-500",
    icon: "text-green-600",
  },
  indigo: {
    bg: "bg-indigo-100 dark:bg-indigo-900/30",
    text: "text-indigo-600 dark:text-indigo-400",
    border: "hover:border-indigo-500",
    icon: "text-indigo-600",
  },
};

type ColorSchemeName = keyof typeof colorSchemes;

// --- PERBAIKAN: Hanya ada SATU deklarasi interface yang benar ---
interface Arrhythmia {
  category: string;
  title: string;
  subtitle: string;
  description: string;
  risk: string;
  icon: LucideIcon;
  color: ColorSchemeName; // Gunakan tipe warna yang sudah dibuat
  longDescription: string;
  symptomsList: string[];
  riskFactors: string[];
  diagnosis: string[];
  treatment: string[];
  ekgPath: string;
}

// Salin data lengkap Anda dari respons sebelumnya ke sini
const arrhythmiaData: Arrhythmia[] = [
  // Kategori: Takikardia

  {
    category: "Takikardia (Detak Cepat)",

    title: "Fibrilasi Atrium (AF)",

    subtitle: "Irama Kacau & Cepat",

    description:
      "Serambi jantung bergetar tidak teratur. Merupakan penyebab umum stroke jika tidak ditangani.",

    risk: "Sedang hingga Tinggi",

    icon: Stethoscope,

    color: "purple",

    longDescription:
      "Pada Fibrilasi Atrium, sinyal listrik di serambi (atrium) menjadi sangat kacau dan cepat, menyebabkannya hanya bergetar (fibrilasi) bukannya berkontraksi dengan normal. Hal ini mengganggu aliran darah ke bilik (ventrikel) dan dapat membentuk gumpalan darah yang berisiko fatal menyebabkan stroke.",

    symptomsList: [
      "Palpitasi (jantung berdebar kencang atau tidak teratur)",

      "Kelelahan ekstrem dan kelemahan",

      "Sesak napas, terutama saat beraktivitas",

      "Pusing atau perasaan akan pingsan",

      "Nyeri atau rasa tidak nyaman di dada",
    ],

    riskFactors: [
      "Usia di atas 60 tahun",

      "Tekanan darah tinggi (Hipertensi)",

      "Penyakit jantung koroner",

      "Gagal jantung kongestif",

      "Penyakit katup jantung",

      "Diabetes",

      "Obesitas",

      "Konsumsi alkohol berlebih",
    ],

    diagnosis: [
      "Elektrokardiogram (EKG atau ECG)",

      "Holter Monitor (merekam EKG selama 24-48 jam)",

      "Event Monitor (merekam saat gejala muncul)",

      "Ekokardiogram (USG Jantung)",
    ],

    treatment: [
      "Obat pengencer darah (antikoagulan) untuk mencegah stroke",

      "Obat pengontrol laju detak (Beta-blocker, Calcium channel blocker)",

      "Obat pengontrol irama (Antiaritmia)",

      "Kardioversi listrik",

      "Ablasi kateter",
    ],

    ekgPath:
      "M0 50 l20 0 l5 -10 l5 15 l5 -20 l5 15 l5-10 l20 0 l5 -10 l5 15 l5 -20 l5 15 l5-10 l20 0 l5-5 l5 10 l5-15 l5 10 l20 0",
  },

  {
    category: "Takikardia (Detak Cepat)",

    title: "Takikardia Ventrikel (VT)",

    subtitle: "Sinyal Cepat dari Bilik",

    description:
      "Berasal dari bilik jantung. Dapat berkembang menjadi VF dan menyebabkan henti jantung mendadak.",

    risk: "Berbahaya",

    icon: AlertTriangle,

    color: "orange",

    longDescription:
      "Takikardia Ventrikel adalah detak jantung cepat yang berbahaya karena berasal dari bilik jantung, ruang pemompa utama. Irama yang sangat cepat ini seringkali tidak stabil dan menghalangi jantung memompa darah secara efektif, yang dapat dengan cepat berkembang menjadi Fibrilasi Ventrikel yang mengancam nyawa.",

    symptomsList: [
      "Pusing berat atau pingsan (sinkop)",

      "Jantung berdebar sangat cepat dan kuat",

      "Nyeri dada (angina)",

      "Sesak napas parah",

      "Penurunan kesadaran",
    ],

    riskFactors: [
      "Riwayat serangan jantung sebelumnya",

      "Penyakit jantung koroner",

      "Kardiomiopati (otot jantung lemah)",

      "Gagal jantung",

      "Gangguan elektrolit berat (kalium, magnesium)",
    ],

    diagnosis: [
      "EKG 12 sadapan",

      "Studi Elektrofisiologi (EPS)",

      "MRI Jantung untuk melihat struktur",

      "Kateterisasi Jantung",
    ],

    treatment: [
      "Manuver vagal (jika stabil)",

      "Obat antiaritmia intravena",

      "Kardioversi listrik tersinkronisasi",

      "Implantable Cardioverter-Defibrillator (ICD) untuk pencegahan jangka panjang",
    ],

    ekgPath:
      "M0 50 l10 0 l15 -40 l15 40 l15 -40 l15 40 l15 -40 l15 40 l15 -40 l15 40 l10 0",
  },

  {
    category: "Takikardia (Detak Cepat)",

    title: "Fibrilasi Ventrikel (VF)",

    subtitle: "Getaran Mematikan",

    description:
      "Bilik jantung hanya bergetar tanpa memompa darah. Ini adalah darurat medis yang memerlukan CPR dan defibrilasi segera.",

    risk: "Sangat Berbahaya",

    icon: ShieldAlert,

    color: "red",

    longDescription:
      "Ini adalah bentuk henti jantung yang paling sering terjadi. Pada Fibrilasi Ventrikel, bilik jantung menerima sinyal listrik yang sangat cepat dan kacau, menyebabkannya hanya bergetar tak efektif. Tidak ada darah yang dipompa ke tubuh, termasuk ke otak. Tanpa CPR dan kejut listrik (defibrilasi) dalam hitungan menit, kondisi ini fatal.",

    symptomsList: [
      "Hilang kesadaran secara tiba-tiba (kolaps)",

      "Tidak ada denyut nadi",

      "Tidak bernapas atau napas agonal (terengah-engah)",
    ],

    riskFactors: [
      "Penyebab utama adalah serangan jantung akut",

      "Komplikasi dari VT",

      "Syok listrik",

      "Penyakit jantung berat",

      "Sindrom Brugada atau Long QT",
    ],

    diagnosis: [
      "Didiagnosis di tempat berdasarkan kondisi pasien (tidak sadar, tidak ada nadi)",

      "EKG akan menunjukkan getaran kacau tanpa gelombang QRS yang jelas",
    ],

    treatment: [
      "Resusitasi Jantung Paru (CPR) berkualitas tinggi",

      "Defibrilasi sesegera mungkin menggunakan AED atau defibrilator manual",

      "Obat-obatan resusitasi (epinefrin, amiodarone)",
    ],

    ekgPath:
      "M0 50 l5 5 l5 -10 l5 12 l5 -8 l5 10 l5 -5 l5 8 l5 -12 l5 10 l5-5 l5 8 l5-10 l5 5 l5-8 l5 10 l5 -12 l5 8 l5 -10 l5 5",
  },

  {
    category: "Takikardia (Detak Cepat)",

    title: "Inappropriate Sinus Tachycardia (IST)",

    subtitle: "Pacu Jantung Terlalu Aktif",

    description:
      "Detak jantung sinus (normal) yang terus-menerus lebih cepat dari 100 bpm tanpa pemicu yang jelas.",

    risk: "Rendah hingga Sedang",

    icon: Activity,

    color: "pink",

    longDescription:
      "IST adalah kondisi di mana nodus sinus, 'pacu jantung' alami tubuh, bekerja terlalu aktif. Ini menyebabkan detak jantung yang cepat (>100 kali per menit) saat istirahat, atau peningkatan detak jantung yang tidak proporsional dengan aktivitas ringan. Meskipun umumnya tidak berbahaya, gejalanya bisa sangat mengganggu kualitas hidup.",

    symptomsList: [
      "Palpitasi atau kesadaran akan detak jantung yang cepat",

      "Kelelahan",

      "Pusing",

      "Sesak napas saat beraktivitas ringan",

      "Kecemasan atau intoleransi terhadap olahraga",
    ],

    riskFactors: [
      "Lebih umum pada wanita muda hingga paruh baya",

      "Stres emosional atau fisik",

      "Dekondisi (kurang berolahraga)",

      "Kadang-kadang muncul setelah infeksi virus",
    ],

    diagnosis: [
      "EKG menunjukkan irama sinus yang cepat",

      "Holter Monitor untuk melihat pola detak jantung sepanjang hari",

      "Menyingkirkan penyebab lain takikardia (anemia, hipertiroid, dll.)",
    ],

    treatment: [
      "Perubahan gaya hidup (hidrasi, olahraga bertahap)",

      "Obat-obatan (Beta-blocker, Ivabradine)",

      "Ablasi kateter pada nodus sinus (jarang dilakukan)",
    ],

    ekgPath:
      "M0 50 l10 0 l5-10 l5 10 l10 0 l5-10 l5 10 l10 0 l5-10 l5 10 l10 0 l5-10 l5 10 l10 0 l5-10 l5 10 l10 0 l5-10 l5 10 l10 0 l5-10 l5 10 l10 0",
  }, // Kategori: Bradikardia

  {
    category: "Bradikardia (Detak Lambat)",

    title: "Sick Sinus Syndrome",

    subtitle: "Pacu Jantung 'Lelah'",

    description:
      "Gangguan pada nodus sinus, menyebabkan irama bisa sangat lambat (bradycardia) atau bergantian cepat dan lambat.",

    risk: "Sedang",

    icon: ZapOff,

    color: "gray",

    longDescription:
      "Sick Sinus Syndrome (SSS) adalah sekumpulan masalah yang menunjukkan bahwa nodus sinus tidak berfungsi dengan baik. Ini dapat menyebabkan jeda panjang di antara detak jantung, irama yang terlalu lambat, atau ketidakmampuan jantung untuk meningkatkan kecepatannya saat berolahraga. Kadang-kadang, kondisi ini juga bisa berganti dengan irama cepat seperti Fibrilasi Atrium (Tachy-Brady Syndrome).",

    symptomsList: [
      "Kelelahan kronis",

      "Pusing atau hampir pingsan",

      "Pingsan (sinkop)",

      "Sesak napas",

      "Kebingungan atau kesulitan berkonsentrasi",
    ],

    riskFactors: [
      "Usia lanjut (penyebab paling umum)",

      "Penyakit jantung",

      "Obat-obatan tertentu (beta-blocker, digoksin)",

      "Penyakit inflamasi",
    ],

    diagnosis: [
      "EKG",

      "Holter Monitor atau Event Monitor untuk menangkap irama abnormal yang datang dan pergi",
    ],

    treatment: [
      "Menghentikan obat yang mungkin menjadi penyebab",

      "Alat pacu jantung permanen (terapi utama untuk gejala berat)",
    ],

    ekgPath: "M0 50 l40 0 l5-10 l5 10 l80 0 l5-10 l5 10 l40 0",
  },

  {
    category: "Bradikardia (Detak Lambat)",

    title: "Blok Jantung (AV Block)",

    subtitle: "Sinyal Terhambat",

    description:
      "Hambatan pada jalur listrik dari serambi ke bilik. Derajat lanjut memerlukan alat pacu jantung.",

    risk: "Sedang hingga Tinggi",

    icon: RadioTower,

    color: "teal",

    longDescription:
      "Blok Jantung terjadi ketika sinyal listrik yang mengontrol detak jantung melambat atau terganggu saat melewati Nodus AV. Ada beberapa derajat blok: Derajat 1 (perlambatan ringan), Derajat 2 (beberapa sinyal tidak sampai), dan Derajat 3 atau Blok Jantung Total (tidak ada sinyal yang sampai, bilik berdetak dengan iramanya sendiri yang sangat lambat).",

    symptomsList: [
      "Tidak ada gejala (pada derajat 1)",

      "Pusing dan pingsan (pada derajat 2 dan 3)",

      "Kelelahan parah",

      "Sesak napas",

      "Nyeri dada",
    ],

    riskFactors: [
      "Usia lanjut",

      "Kerusakan jaringan jantung akibat serangan jantung",

      "Penyakit Lyme",

      "Efek samping obat-obatan",
    ],

    diagnosis: [
      "EKG dapat menunjukkan pola blok yang khas",

      "Holter Monitor",

      "Studi Elektrofisiologi (EPS)",
    ],

    treatment: [
      "Tidak perlu pengobatan untuk derajat 1",

      "Alat pacu jantung permanen untuk Blok Jantung derajat 2 tipe Mobitz II dan Blok Jantung Total (derajat 3)",
    ],

    ekgPath: "M0 50 l20 0 l5-10 l5 10 l40 0 l5-10 l0 0 l40 0 l5-10 l5 10 l40 0",
  }, // Kategori: Irama Ektopik

  {
    category: "Irama Ektopik (Denyut Tambahan)",

    title: "Premature Contractions (PVC/PAC)",

    subtitle: "Sensasi Jantung 'Melompat'",

    description:
      "Denyut ekstra dari serambi (PAC) atau bilik (PVC). Sangat umum dan seringkali tidak berbahaya pada jantung sehat.",

    risk: "Rendah",

    icon: Heart,

    color: "blue",

    longDescription:
      "Denyut prematur adalah detak jantung yang terjadi lebih awal dari seharusnya. Jika berasal dari serambi disebut PAC (Premature Atrial Contraction), jika dari bilik disebut PVC (Premature Ventricular Contraction). Hampir semua orang pernah mengalaminya. Meskipun terasa aneh (seperti detak yang dilewati atau lebih kuat), ini biasanya tidak berbahaya kecuali terjadi sangat sering atau pada orang dengan penyakit jantung.",

    symptomsList: [
      "Sensasi 'deg' atau 'jedug' di dada",

      "Perasaan jantung berhenti sejenak",

      "Merasa ada 'denyut ekstra'",

      "Tidak ada gejala sama sekali (paling umum)",
    ],

    riskFactors: [
      "Stres",

      "Kelelahan atau kurang tidur",

      "Kafein, alkohol, nikotin",

      "Dehidrasi atau gangguan elektrolit",

      "Penyakit jantung struktural (untuk PVC yang sering)",
    ],

    diagnosis: ["EKG", "Holter Monitor untuk menghitung frekuensi"],

    treatment: [
      "Umumnya tidak memerlukan pengobatan",

      "Mengurangi pemicu (stres, kafein)",

      "Obat Beta-blocker jika gejala sangat mengganggu",

      "Ablasi kateter jika sangat sering dan berasal dari satu lokasi",
    ],

    ekgPath:
      "M0 50 l20 0 l5-10 l5 10 l20 0 l10 20 l10-30 l10 10 l20 0 l5-10 l5 10 l20 0",
  },

  {
    category: "Irama Ektopik (Denyut Tambahan)",

    title: "Sindrom Brugada",

    subtitle: "Kelainan Genetik Berisiko",

    description:
      "Kelainan genetik langka yang ditandai pola EKG abnormal dan peningkatan risiko henti jantung mendadak.",

    risk: "Tinggi",

    icon: Dna, // Mengganti ikon agar lebih sesuai

    color: "yellow",

    longDescription:
      "Sindrom Brugada adalah gangguan kelistrikan jantung yang diwariskan secara genetik. Penderitanya memiliki risiko lebih tinggi untuk mengalami irama jantung yang cepat dan tidak teratur (seperti VT/VF), terutama saat tidur atau istirahat. Pemicu seperti demam tinggi harus dihindari secara agresif.",

    symptomsList: [
      "Pingsan (sinkop) tanpa penyebab jelas",

      "Kejang",

      "Detak jantung tidak teratur saat tidur",

      "Napas terengah-engah di malam hari",

      "Riwayat keluarga henti jantung mendadak di usia muda",
    ],

    riskFactors: [
      "Riwayat keluarga dengan Sindrom Brugada",

      "Keturunan Asia (lebih umum)",

      "Pria (lebih umum)",

      "Demam",
    ],

    diagnosis: [
      "EKG dengan pola Brugada Tipe 1 (spontan atau setelah provokasi obat)",

      "Tes genetik",
    ],

    treatment: [
      "Implantable Cardioverter-Defibrillator (ICD) sebagai pencegahan primer",

      "Menghindari obat-obatan pemicu",

      "Agresif mengobati demam",
    ],

    ekgPath:
      "M0 50 l30 0 q5 0 10 -20 t15 20 l10 0 q5 0 10 -20 t15 20 l10 0 q5 0 10 -20 t15 20 l30 0",
  },

  {
    category: "Takikardia (Detak Cepat)",

    title: "Supraventricular Tachycardia (SVT)",

    subtitle: "Sirkuit Listrik 'Korslet'",

    description:
      "Episode detak jantung sangat cepat yang dimulai di atas bilik jantung. Umumnya tidak mengancam nyawa tetapi bisa sangat mengganggu.",

    risk: "Rendah hingga Sedang",

    icon: Zap, // Menggunakan ikon Zap karena berhubungan dengan sirkuit listrik

    color: "cyan", // Menggunakan warna baru

    longDescription:
      "SVT adalah istilah umum untuk takikardia (detak cepat >100 bpm) yang berasal dari sirkuit listrik abnormal di atas ventrikel. Episode ini biasanya dimulai dan berakhir secara tiba-tiba, bisa berlangsung beberapa detik hingga beberapa jam. Penyebab paling umum adalah adanya 'jalur ekstra' atau sirkuit 're-entry' di sekitar nodus AV.",

    symptomsList: [
      "Palpitasi yang sangat cepat dan teratur",

      "Perasaan 'berdebar' di leher",

      "Pusing atau kepala terasa sangat ringan",

      "Sesak napas",

      "Kecemasan",

      "Nyeri dada (jarang)",
    ],

    riskFactors: [
      "Lebih umum pada orang muda dan wanita",

      "Stres fisik atau emosional",

      "Kurang tidur",

      "Konsumsi kafein atau alkohol",

      "Merokok",
    ],

    diagnosis: [
      "EKG (jika episode sedang berlangsung)",

      "Studi Elektrofisiologi (EPS) untuk menemukan sirkuit abnormal",

      "Holter atau Event Monitor",
    ],

    treatment: [
      "Manuver Vagal (seperti meniup sambil menahan napas atau membasuh muka dengan air es)",

      "Obat intravena (Adenosine) di UGD",

      "Obat oral (Beta-blocker, Verapamil) untuk pencegahan",

      "Ablasi kateter (sangat efektif untuk penyembuhan)",
    ],

    ekgPath:
      "M0 50 l25 0 l2 -5 l2 5 l2 -5 l2 5 l2 -5 l2 5 l2 -5 l2 5 l2 -5 l2 5 l2 -5 l2 5 l2 -5 l2 5 l2 -5 l2 5 l2 -5 l2 5 l2 -5 l2 5 l2 -5 l2 5 l2 -5 l2 5 l25 0",
  },

  {
    category: "Takikardia (Detak Cepat)",

    title: "Atrial Flutter",

    subtitle: "Irama Teratur Seperti Gergaji",

    description:
      "Mirip dengan Fibrilasi Atrium, namun sirkuit listrik di serambi lebih teratur, menciptakan pola 'gigi gergaji' pada EKG.",

    risk: "Sedang",

    icon: Activity,

    color: "green", // Menggunakan warna baru

    longDescription:
      "Atrial Flutter disebabkan oleh satu sirkuit listrik besar yang berputar cepat di dalam serambi kanan. Ini menghasilkan detak serambi yang sangat cepat (sekitar 250-350 bpm) namun teratur. Tidak semua sinyal ini diteruskan ke bilik, sehingga detak nadi biasanya lebih lambat tetapi tetap cepat. Seperti AF, risiko utamanya adalah pembentukan gumpalan darah dan stroke.",

    symptomsList: [
      "Palpitasi yang cepat dan bisa teratur atau tidak teratur",

      "Kelelahan",

      "Sesak napas",

      "Pusing",

      "Tekanan di dada",
    ],

    riskFactors: [
      "Penyakit jantung struktural",

      "Penyakit paru-paru kronis (PPOK)",

      "Riwayat operasi jantung",

      "Hipertensi",

      "Diabetes",
    ],

    diagnosis: [
      "EKG yang menunjukkan pola 'sawtooth' atau gigi gergaji klasik",

      "Holter Monitor",

      "Ekokardiogram",
    ],

    treatment: [
      "Sangat mirip dengan Fibrilasi Atrium: kontrol laju detak, pengencer darah",

      "Ablasi kateter memiliki tingkat keberhasilan yang sangat tinggi untuk menyembuhkan Atrial Flutter",
    ],

    ekgPath:
      "M0 50 l10 0 l5 -10 l5 0 l5 -10 l5 0 l5 -10 l5 0 l5 -10 l5 0 l5 -10 l5 0 l5 -10 l5 0 l5 -10 l5 0 l5 -10 l5 0 l5 -10 l5 0 l5 -10 l5 0 l5 -10 l5 0 l10 0",
  },

  {
    category: "Takikardia (Detak Cepat)",

    title: "Torsades de Pointes (TdP)",

    subtitle: "VT Polimorfik Berpilin",

    description:
      "Bentuk Takikardia Ventrikel yang langka dan khas, di mana sumbu EKG tampak 'berpilin'. Sering dipicu oleh obat-obatan atau Long QT Syndrome.",

    risk: "Sangat Berbahaya",

    icon: ShieldAlert,

    color: "indigo", // Menggunakan warna baru

    longDescription:
      "Torsades de Pointes (TdP) secara harfiah berarti 'memilin titik'. Ini adalah jenis VT polimorfik (bentuk gelombangnya bervariasi) yang ditandai dengan kompleks QRS yang tampak berputar di sekitar garis dasar EKG. Kondisi ini sangat berbahaya karena dapat berhenti dengan sendirinya atau berkembang menjadi Fibrilasi Ventrikel. TdP hampir selalu terkait dengan interval QT yang memanjang.",

    symptomsList: [
      "Episode pusing parah yang berulang",

      "Pingsan (sinkop)",

      "Palpitasi tiba-tiba",

      "Dapat menyebabkan henti jantung mendadak jika tidak berhenti",
    ],

    riskFactors: [
      "Sindrom Long QT bawaan (genetik)",

      "Efek samping obat-obatan (beberapa antibiotik, antiaritmia, antipsikotik)",

      "Gangguan elektrolit berat (hipokalemia, hipomagnesemia)",

      "Bradikardia berat",
    ],

    diagnosis: [
      "EKG saat episode berlangsung menunjukkan gambaran 'pilinan' yang khas",

      "Riwayat penggunaan obat",

      "Pemeriksaan kadar elektrolit darah",
    ],

    treatment: [
      "Menghentikan obat pemicu",

      "Koreksi elektrolit (pemberian Magnesium Sulfat intravena adalah terapi lini pertama, bahkan jika kadar magnesium normal)",

      "Meningkatkan detak jantung (dengan obat atau alat pacu jantung sementara) untuk mempersingkat interval QT",
    ],

    ekgPath:
      "M0 50 l10 0 l5 -10 l10 20 l10 -30 l10 40 l10 -30 l10 20 l5 -10 l10 0 l5 10 l10 -20 l10 30 l10 -40 l10 30 l10 -20 l5 10 l10 0",
  },
];

const categories = [
  "All",
  ...new Set(arrhythmiaData.map((item) => item.category)),
];

const RiskBadge: React.FC<{ risk: string }> = ({ risk }) => {
  const riskColorClass =
    risk === "Berbahaya" || risk === "Sangat Berbahaya"
      ? "bg-red-500"
      : risk === "Tinggi"
      ? "bg-orange-500"
      : risk === "Sedang hingga Tinggi"
      ? "bg-yellow-600"
      : risk === "Sedang"
      ? "bg-yellow-500"
      : "bg-green-500";
  return (
    <div
      className={`absolute top-3 right-3 text-xs font-bold text-white px-2 py-0.5 rounded-full ${riskColorClass}`}
    >
      {risk}
    </div>
  );
};

const EKGAnimation: React.FC<{ path: string }> = ({ path }) => (
  <svg viewBox="0 0 200 100" className="w-full h-24">
    <motion.path
      d={path}
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      initial={{ pathLength: 0 }}
      animate={{ pathLength: 1 }}
      transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
    />
  </svg>
);

const AritmiaCard: React.FC<{
  aritmia: Arrhythmia;
  onCardClick: (a: Arrhythmia) => void;
}> = ({ aritmia, onCardClick }) => {
  const scheme = colorSchemes[aritmia.color];
  const IconComponent = aritmia.icon;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.8 }}
      transition={{ type: "spring", stiffness: 300, damping: 25 }}
    >
      <Card
        onClick={() => onCardClick(aritmia)}
        className={cn(
          "relative overflow-hidden border-2 h-full cursor-pointer",
          "border-transparent dark:bg-gray-800 hover:shadow-2xl hover:-translate-y-2 transition-all duration-300",
          scheme.border
        )}
      >
        <RiskBadge risk={aritmia.risk} />
        <CardHeader className="pt-8">
          <div
            className={cn(
              "w-14 h-14 rounded-lg flex items-center justify-center mb-4",
              scheme.bg
            )}
          >
            <IconComponent className={cn("h-7 w-7", scheme.icon)} />
          </div>
          <CardTitle className="text-gray-900 dark:text-white">
            {aritmia.title}
          </CardTitle>
          <p className={cn("text-sm font-semibold", scheme.text)}>
            {aritmia.subtitle}
          </p>
        </CardHeader>
        <CardContent>
          <p className="text-gray-600 dark:text-gray-400 text-sm">
            {aritmia.description}
          </p>
        </CardContent>
      </Card>
    </motion.div>
  );
};

const TentangAritmiaSection = () => {
  const [activeCategory, setActiveCategory] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedAritmia, setSelectedAritmia] = useState<Arrhythmia | null>(
    null
  );

  const filteredData = useMemo(() => {
    let data = arrhythmiaData;
    if (activeCategory !== "All")
      data = data.filter((item) => item.category === activeCategory);
    if (searchTerm) {
      const lowerCaseSearch = searchTerm.toLowerCase();
      data = data.filter(
        (item) =>
          item.title.toLowerCase().includes(lowerCaseSearch) ||
          item.description.toLowerCase().includes(lowerCaseSearch)
      );
    }
    return data;
  }, [activeCategory, searchTerm]);

  return (
    <section id="tentang-aritmia" className="py-20 bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Pusat Edukasi Aritmia
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
            Aritmia lebih dari sekadar detak cepat atau lambat. Kenali berbagai
            jenisnya untuk memahami kesehatan jantung Anda lebih dalam.
          </p>
        </div>

        <div className="mb-12 sticky top-20 z-20 bg-gray-50/80 dark:bg-gray-900/80 backdrop-blur-sm py-4 rounded-xl">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-grow">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
              <Input
                type="text"
                placeholder="Cari nama aritmia..."
                className="pl-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="flex flex-wrap gap-2">
              {categories.map((category) => (
                <Button
                  key={category}
                  variant={activeCategory === category ? "default" : "outline"}
                  onClick={() => setActiveCategory(category)}
                >
                  {category === "All" ? "Semua" : category.split(" ")[0]}
                </Button>
              ))}
            </div>
          </div>
        </div>

        <motion.div
          layout
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
        >
          <AnimatePresence>
            {filteredData.map((aritmia) => (
              <AritmiaCard
                key={aritmia.title}
                aritmia={aritmia}
                onCardClick={setSelectedAritmia}
              />
            ))}
          </AnimatePresence>
        </motion.div>

        <Dialog
          open={!!selectedAritmia}
          onOpenChange={(isOpen) => !isOpen && setSelectedAritmia(null)}
        >
          <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
            {selectedAritmia && (
              <>
                <DialogHeader>
                  <DialogTitle className="text-3xl font-bold mb-4">
                    {selectedAritmia.title}
                  </DialogTitle>
                </DialogHeader>
                <div
                  className={cn(
                    "w-full p-4 rounded-lg",
                    colorSchemes[selectedAritmia.color].bg,
                    colorSchemes[selectedAritmia.color].text
                  )}
                >
                  <EKGAnimation path={selectedAritmia.ekgPath} />
                </div>
                <div className="mt-6 space-y-6">
                  <div>
                    <h4 className="font-bold text-xl mb-2 flex items-center gap-2">
                      <HeartPulse /> Deskripsi Lengkap
                    </h4>
                    <p className="text-gray-600 dark:text-gray-400">
                      {selectedAritmia.longDescription}
                    </p>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-bold text-xl mb-2 flex items-center gap-2">
                        <Activity /> Gejala Umum
                      </h4>
                      <ul className="list-disc list-inside space-y-1 text-gray-600 dark:text-gray-400">
                        {selectedAritmia.symptomsList.map((s) => (
                          <li key={s}>{s}</li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-bold text-xl mb-2 flex items-center gap-2">
                        <TrendingUp /> Faktor Risiko
                      </h4>
                      <ul className="list-disc list-inside space-y-1 text-gray-600 dark:text-gray-400">
                        {selectedAritmia.riskFactors.map((r) => (
                          <li key={r}>{r}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                  <div>
                    <h4 className="font-bold text-xl mb-2 flex items-center gap-2">
                      <Stethoscope /> Diagnosis & Perawatan
                    </h4>
                    <p className="text-gray-600 dark:text-gray-400">
                      <b>Cara Diagnosis:</b>{" "}
                      {selectedAritmia.diagnosis.join(", ")}.
                    </p>
                    <p className="text-gray-600 dark:text-gray-400 mt-1">
                      <b>Opsi Perawatan:</b>{" "}
                      {selectedAritmia.treatment.join(", ")}.
                    </p>
                  </div>
                </div>
              </>
            )}
          </DialogContent>
        </Dialog>

        <div className="bg-red-50 dark:bg-red-900/20 rounded-2xl p-8 mt-20">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            <div>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
                Gejala Umum yang Harus Diwaspadai
              </h3>
              <div className="space-y-4">
                {[
                  "Palpitasi (sensasi jantung berdebar, melompat, atau berhenti sejenak)",
                  "Sesak napas saat aktivitas ringan atau bahkan istirahat",
                  "Nyeri atau rasa tidak nyaman di dada seperti ditekan",
                  "Pusing, kepala terasa ringan, atau sensasi seperti akan pingsan",
                  "Kelelahan ekstrem yang tidak dapat dijelaskan",
                ].map((gejala, idx) => (
                  <div key={idx} className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-red-600 rounded-full mt-2 flex-shrink-0"></div>
                    <p className="text-gray-700 dark:text-gray-300">{gejala}</p>
                  </div>
                ))}
              </div>
            </div>
            <div className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-lg text-center">
              <ShieldAlert className="h-16 w-16 text-red-600 mx-auto mb-4" />
              <h4 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                Deteksi Dini Adalah Kunci
              </h4>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                Penanganan aritmia yang tepat waktu dapat mencegah komplikasi
                serius seperti stroke dan gagal jantung. Jangan abaikan
                gejalanya.
              </p>
              <Button
                size="lg"
                className="bg-red-600 hover:bg-red-700 dark:bg-red-500 dark:hover:bg-red-600"
              >
                Jadwalkan Konsultasi Sekarang
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TentangAritmiaSection;

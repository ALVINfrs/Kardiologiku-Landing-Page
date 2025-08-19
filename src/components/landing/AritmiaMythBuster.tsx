import { useState, useEffect, useMemo } from "react";
import type { FC, ReactElement } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import {
  HelpCircle,
  ShieldCheck,
  Zap,
  BrainCircuit,
  BarChart,
  UserCheck,
  Activity,
  Lightbulb,
  Search,
  Filter,
  CheckCircle,
  Clock,
  Heart,
  Stethoscope,
  AlertTriangle,
  TrendingUp,
  Award,
  BookOpen,
  Target,
  Sparkles,
  Eye,
  EyeOff,
} from "lucide-react";

// Enhanced Data Types
interface MythFactItem {
  id: number;
  category:
    | "Gaya Hidup & Pemicu"
    | "Gejala & Diagnosis"
    | "Pengobatan & Risiko Serius";
  myth: string;
  theTruth: string;
  deepDive: string;
  dataSnapshot: { value: string; label: string; icon: ReactElement };
  expertsTake: string;
  actionableTip: string;
  colorScheme: "orange" | "blue" | "red";
  severity: "rendah" | "sedang" | "tinggi";
  readingTime: number;
  tags: string[];
  relatedMyths: number[];
  evidenceLevel: "A" | "B" | "C";
  lastUpdated: string;
}

interface UserProgress {
  readMyths: Set<number>;
  bookmarkedMyths: Set<number>;
  completionPercentage: number;
}

// Expanded and More Complex Data
const arrhythmiaMyths: MythFactItem[] = [
  {
    id: 1,
    category: "Gaya Hidup & Pemicu",
    myth: "Jika saya berolahraga, aritmia saya pasti akan memburuk.",
    theTruth: "Olahraga yang tepat justru sangat dianjurkan.",
    deepDive:
      "Bagi kebanyakan pasien aritmia, olahraga ringan hingga sedang yang teratur justru memperkuat jantung dan dapat mengurangi frekuensi episode. Kuncinya adalah 'terukur'. Aktivitas seperti jalan cepat, berenang, atau yoga meningkatkan tonus vagal, yang membantu menstabilkan irama jantung. Yang perlu dihindari adalah olahraga kompetitif atau sangat intens tanpa konsultasi dokter, karena dapat memicu adrenalin berlebih. Penelitian dari European Society of Cardiology menunjukkan bahwa pasien AFib yang berolahraga teratur memiliki risiko stroke 15% lebih rendah dibanding yang tidak aktif.",
    dataSnapshot: {
      value: "30-45 Menit",
      label: "Aktivitas Sedang, 3-5x/minggu",
      icon: <Activity />,
    },
    expertsTake:
      "Saya selalu mendorong pasien aritmia untuk tetap aktif. Jantung adalah otot, dan perlu dilatih dengan bijak. Kuncinya adalah mulai perlahan dan dengarkan tubuh Anda. - Dr. Jantung Sehat, Kardiolog Elektrofisiologi",
    actionableTip:
      "Gunakan monitor detak jantung saat berolahraga dan tetaplah di 'zona aman' yang direkomendasikan oleh dokter Anda.",
    colorScheme: "orange",
    severity: "sedang",
    readingTime: 3,
    tags: ["olahraga", "gaya hidup", "aktivitas fisik", "pencegahan"],
    relatedMyths: [4, 6],
    evidenceLevel: "A",
    lastUpdated: "Agustus 2025",
  },
  {
    id: 2,
    category: "Gejala & Diagnosis",
    myth: "Saya tidak merasakan gejala apa pun, jadi saya pasti tidak punya aritmia berbahaya.",
    theTruth: "Aritmia paling berbahaya bisa jadi 'silent' (tanpa gejala).",
    deepDive:
      "Fibrilasi Atrium (AFib), salah satu penyebab utama stroke, bisa terjadi tanpa gejala apa pun (silent AFib). Pasien mungkin tidak merasakan debaran, namun risiko pembentukan gumpalan darah tetap ada. Inilah mengapa skrining rutin dengan EKG atau bahkan menggunakan fitur EKG pada smartwatch menjadi sangat penting bagi mereka yang memiliki faktor risiko seperti hipertensi atau usia lanjut. Study CHARGE-AF menunjukkan bahwa 1 dari 3 kasus AFib pertama kali terdeteksi tanpa gejala sebelumnya.",
    dataSnapshot: {
      value: "Hingga 30%",
      label: "Kasus AFib tidak menunjukkan gejala awal",
      icon: <BarChart />,
    },
    expertsTake:
      "Pasien yang paling mengejutkan adalah mereka yang datang karena stroke, dan baru saat itu kami menemukan mereka memiliki Fibrilasi Atrium yang tidak pernah mereka sadari. - Prof. Dr. Elektrofisiologi",
    actionableTip:
      "Jika Anda berusia di atas 60 tahun atau memiliki hipertensi, tanyakan kepada dokter Anda tentang pentingnya skrining EKG rutin.",
    colorScheme: "blue",
    severity: "tinggi",
    readingTime: 4,
    tags: ["diagnosis", "gejala", "skrining", "AFib", "silent"],
    relatedMyths: [5, 8],
    evidenceLevel: "A",
    lastUpdated: "Juli 2025",
  },
  {
    id: 3,
    category: "Pengobatan & Risiko Serius",
    myth: "Sekali dipasang alat pacu jantung, saya tidak bisa lagi hidup normal atau dekat dengan alat elektronik.",
    theTruth: "Alat pacu jantung modern sangat canggih dan aman.",
    deepDive:
      "Mitos ini berasal dari teknologi pacu jantung generasi lama. Perangkat modern memiliki pelindung canggih terhadap interferensi elektromagnetik. Anda bisa menggunakan ponsel (di sisi telinga yang berlawanan), microwave, dan melewati detektor keamanan bandara (dengan menunjukkan kartu identitas perangkat Anda). Aktivitas normal, termasuk olahraga non-kontak, sangat dianjurkan. Bahkan MRI sekarang aman dilakukan dengan pacemaker generasi terbaru yang 'MR-conditional'.",
    dataSnapshot: {
      value: "99%+ Aman",
      label: "Dari peralatan rumah tangga umum",
      icon: <ShieldCheck />,
    },
    expertsTake:
      "Saya memberitahu pasien saya: alat pacu jantung ada untuk memberi Anda kebebasan, bukan membatasinya. Hiduplah sepenuhnya, dengan beberapa tindakan pencegahan yang wajar. - Dr. Device Specialist",
    actionableTip:
      "Selalu informasikan teknisi medis atau keamanan bahwa Anda menggunakan alat pacu jantung. Hindari meletakkan ponsel langsung di saku dada di atas perangkat.",
    colorScheme: "red",
    severity: "rendah",
    readingTime: 3,
    tags: ["pacemaker", "teknologi", "keamanan", "elektronik"],
    relatedMyths: [7, 9],
    evidenceLevel: "A",
    lastUpdated: "Agustus 2025",
  },
  {
    id: 4,
    category: "Gaya Hidup & Pemicu",
    myth: "Kopi adalah penyebab utama semua jenis aritmia.",
    theTruth:
      "Hubungannya kompleks; bagi sebagian orang, kopi justru protektif.",
    deepDive:
      "Studi skala besar menunjukkan bahwa konsumsi kopi dalam jumlah sedang (1-3 cangkir per hari) tidak meningkatkan risiko aritmia secara umum, bahkan mungkin sedikit menurunkan risiko Fibrilasi Atrium. Namun, sensitivitas individu sangat bervariasi. Bagi sebagian orang, kafein tetap menjadi pemicu kuat. Kuncinya adalah mengenali respons tubuh Anda sendiri. Meta-analisis 2024 dari 15 studi dengan 800,000+ partisipan menunjukkan pola U-terbalik: konsumsi sedang protektif, konsumsi berlebihan (>6 cangkir/hari) meningkatkan risiko.",
    dataSnapshot: {
      value: "Hingga 13%",
      label: "Penurunan risiko AFib pada peminum kopi reguler (studi)",
      icon: <BarChart />,
    },
    expertsTake:
      "Saya tidak melarang semua pasien aritmia minum kopi. Saya menyarankan mereka untuk membuat 'jurnal pemicu' untuk melihat apakah ada korelasi antara asupan kafein dan episode debaran mereka. - Dr. Nutrisi Kardiovaskular",
    actionableTip:
      "Jika Anda curiga kopi adalah pemicu, coba hentikan selama 2 minggu dan catat gejalanya. Jika membaik, Anda mungkin sensitif terhadap kafein.",
    colorScheme: "orange",
    severity: "rendah",
    readingTime: 4,
    tags: ["kafein", "kopi", "pemicu", "diet", "nutrisi"],
    relatedMyths: [1, 10],
    evidenceLevel: "A",
    lastUpdated: "Juni 2025",
  },
  {
    id: 5,
    category: "Gejala & Diagnosis",
    myth: "Pingsan saat berolahraga itu wajar karena kelelahan.",
    theTruth: "Pingsan saat berolahraga adalah tanda bahaya (red flag) mutlak.",
    deepDive:
      "Pingsan (sinkop) saat beraktivitas fisik bisa menjadi satu-satunya tanda peringatan dari kondisi aritmia berbahaya yang diinduksi oleh olahraga, seperti Takikardia Ventrikel Katekolaminergik (CPVT) atau Kardiomiopati Hipertrofik (HCM). Ini BUKAN hal yang normal dan memerlukan evaluasi kardiologi segera untuk menyingkirkan kondisi yang mengancam nyawa. Bahkan atlet profesional harus menjalani evaluasi komprehensif jika mengalami sinkop saat latihan.",
    dataSnapshot: {
      value: "100%",
      label: "Kasus pingsan saat olahraga memerlukan evaluasi medis",
      icon: <UserCheck />,
    },
    expertsTake:
      "Jika anak Anda atau Anda sendiri pernah pingsan saat berolahraga, jangan pernah menganggapnya remeh. Ini adalah salah satu gejala paling serius yang harus kami selidiki. - Dr. Sports Cardiology",
    actionableTip:
      "Jika Anda atau seseorang di sekitar Anda pingsan saat berolahraga, segera hentikan semua aktivitas dan cari pertolongan medis darurat.",
    colorScheme: "blue",
    severity: "tinggi",
    readingTime: 3,
    tags: ["pingsan", "olahraga", "darurat", "sinkop", "atlet"],
    relatedMyths: [1, 11],
    evidenceLevel: "A",
    lastUpdated: "Agustus 2025",
  },
  {
    id: 6,
    category: "Pengobatan & Risiko Serius",
    myth: "Prosedur ablasi kateter itu sangat berisiko dan seperti operasi jantung terbuka.",
    theTruth:
      "Ablasi adalah prosedur minimal invasif dengan tingkat keberhasilan tinggi.",
    deepDive:
      "Ablasi kateter dilakukan melalui pembuluh darah di pangkal paha, bukan dengan membuka dada. Kateter tipis dimasukkan ke jantung untuk memetakan dan menghancurkan (dengan energi radiofrekuensi atau pembekuan) area kecil jaringan yang menjadi sumber sirkuit listrik abnormal. Untuk aritmia seperti SVT atau Atrial Flutter, tingkat keberhasilannya bisa mencapai lebih dari 95%. Teknologi terbaru seperti 3D mapping dan ablasi kriogen membuat prosedur lebih presisi dan aman.",
    dataSnapshot: {
      value: ">95%",
      label: "Tingkat keberhasilan ablasi untuk SVT",
      icon: <Zap />,
    },
    expertsTake:
      "Bagi pasien yang tepat, ablasi bisa menjadi 'obat' permanen untuk aritmia mereka, membebaskan mereka dari ketergantungan obat seumur hidup dan gejalanya. - Dr. Interventional EP",
    actionableTip:
      "Tanyakan kepada dokter Anda apakah Anda adalah kandidat yang baik untuk prosedur ablasi jika aritmia Anda terus mengganggu kualitas hidup.",
    colorScheme: "red",
    severity: "sedang",
    readingTime: 4,
    tags: ["ablasi", "prosedur", "minimal invasif", "pengobatan"],
    relatedMyths: [3, 12],
    evidenceLevel: "A",
    lastUpdated: "Juli 2025",
  },
  {
    id: 7,
    category: "Pengobatan & Risiko Serius",
    myth: "Obat antiaritmia akan merusak organ tubuh lain dalam jangka panjang.",
    theTruth:
      "Dengan monitoring yang tepat, sebagian besar obat aman untuk penggunaan jangka panjang.",
    deepDive:
      "Meskipun beberapa obat antiaritmia memerlukan monitoring fungsi tiroid, hati, atau paru-paru, sebagian besar dapat digunakan dengan aman dalam jangka panjang dengan pemeriksaan rutin. Obat-obat seperti beta-blocker atau calcium channel blocker bahkan memberikan manfaat kardioprotektif tambahan. Kunci adalah komunikasi terbuka dengan dokter tentang efek samping dan pemeriksaan lab berkala sesuai jadwal.",
    dataSnapshot: {
      value: "85-90%",
      label: "Pasien toleran terhadap terapi jangka panjang",
      icon: <Heart />,
    },
    expertsTake:
      "Risiko aritmia yang tidak terkontrol hampir selalu lebih besar daripada risiko efek samping obat. Kami memiliki protokol monitoring yang ketat untuk memastikan keamanan. - Dr. Clinical Pharmacology",
    actionableTip:
      "Jangan pernah menghentikan obat antiaritmia tanpa berkonsultasi dengan dokter, bahkan jika Anda merasa sudah sembuh.",
    colorScheme: "red",
    severity: "tinggi",
    readingTime: 4,
    tags: ["obat", "efek samping", "monitoring", "jangka panjang"],
    relatedMyths: [6, 3],
    evidenceLevel: "A",
    lastUpdated: "Agustus 2025",
  },
  {
    id: 8,
    category: "Gejala & Diagnosis",
    myth: "Detak jantung cepat selalu berarti ada masalah serius.",
    theTruth: "Takikardia bisa normal atau patologis, tergantung konteksnya.",
    deepDive:
      "Detak jantung cepat (>100 bpm saat istirahat) bisa disebabkan oleh berbagai faktor: dehidrasi, demam, stres, kafein berlebihan, atau memang aritmia patologis. Yang perlu diwaspadai adalah takikardia yang tiba-tiba, disertai sesak napas, nyeri dada, atau pusing. Takikardia sinus (respons normal terhadap stress fisik/emosional) berbeda dengan takikardia patologis seperti SVT atau VT yang memerlukan intervensi medis.",
    dataSnapshot: {
      value: "60-70%",
      label: "Kasus takikardia bersifat sementara/non-patologis",
      icon: <TrendingUp />,
    },
    expertsTake:
      "Konteks sangat penting dalam menilai takikardia. Jantung yang berdetak 130 saat lari normal, tapi 130 saat duduk santai perlu dievaluasi. - Dr. Emergency Cardiology",
    actionableTip:
      "Catat kapan detak jantung cepat terjadi, berapa lama berlangsung, dan gejala yang menyertainya untuk membantu dokter menilai.",
    colorScheme: "blue",
    severity: "sedang",
    readingTime: 3,
    tags: ["takikardia", "detak cepat", "diagnosis", "evaluasi"],
    relatedMyths: [2, 5],
    evidenceLevel: "B",
    lastUpdated: "Juli 2025",
  },
  {
    id: 9,
    category: "Gaya Hidup & Pemicu",
    myth: "Stres emosional tidak bisa benar-benar memicu aritmia yang serius.",
    theTruth:
      "Stres akut dapat memicu aritmia berbahaya, bahkan pada jantung yang sehat.",
    deepDive:
      "Fenomena 'Broken Heart Syndrome' atau Takotsubo Cardiomyopathy menunjukkan bagaimana stres emosional ekstrem dapat menyebabkan disfungsi jantung akut yang menyerupai serangan jantung. Stres kronis meningkatkan kadar kortisol dan adrenalin, yang dapat memicu aritmia pada individu yang rentan. Teknik manajemen stres seperti meditasi, yoga, dan terapi kognitif terbukti mengurangi episode aritmia pada banyak pasien.",
    dataSnapshot: {
      value: "2.5x Lipat",
      label: "Peningkatan risiko aritmia saat stres tinggi",
      icon: <BrainCircuit />,
    },
    expertsTake:
      "Mind-body connection dalam kardiologi sangat nyata. Pasien yang mengelola stres dengan baik sering mengalami perbaikan signifikan dalam kontrol aritmia mereka. - Dr. Behavioral Cardiology",
    actionableTip:
      "Pelajari teknik relaksasi seperti pernapasan dalam atau mindfulness. Bahkan 10 menit sehari dapat membuat perbedaan.",
    colorScheme: "orange",
    severity: "sedang",
    readingTime: 4,
    tags: ["stres", "emosional", "takotsubo", "manajemen", "relaksasi"],
    relatedMyths: [1, 4],
    evidenceLevel: "A",
    lastUpdated: "Agustus 2025",
  },
  {
    id: 10,
    category: "Gaya Hidup & Pemicu",
    myth: "Alkohol dalam jumlah sedikit aman untuk semua pasien aritmia.",
    theTruth:
      "Bahkan alkohol dalam jumlah kecil bisa memicu AFib pada beberapa orang.",
    deepDive:
      "Fenomena 'Holiday Heart Syndrome' menggambarkan bagaimana konsumsi alkohol, bahkan dalam jumlah sedang, dapat memicu episode Fibrilasi Atrium. Alkohol mempengaruhi konduksi listrik jantung dan dapat menyebabkan dehidrasi serta ketidakseimbangan elektrolit. Beberapa pasien sangat sensitif sehingga satu gelas wine pun bisa memicu episode. Studi terbaru menunjukkan tidak ada 'safe threshold' universal untuk alkohol pada pasien AFib.",
    dataSnapshot: {
      value: "12%",
      label: "Peningkatan risiko AFib per 1 drink/hari",
      icon: <AlertTriangle />,
    },
    expertsTake:
      "Saya menyarankan pasien AFib untuk benar-benar menghindari alkohol selama beberapa bulan untuk melihat apakah itu pemicu bagi mereka. Hasilnya sering mengejutkan. - Dr. Lifestyle Medicine",
    actionableTip:
      "Buat catatan harian konsumsi alkohol vs episode aritmia selama 30 hari untuk mengidentifikasi pola.",
    colorScheme: "orange",
    severity: "sedang",
    readingTime: 3,
    tags: ["alkohol", "AFib", "pemicu", "holiday heart"],
    relatedMyths: [4, 9],
    evidenceLevel: "A",
    lastUpdated: "Juni 2025",
  },
  {
    id: 11,
    category: "Gejala & Diagnosis",
    myth: "Smartwatch tidak akurat untuk mendeteksi aritmia.",
    theTruth: "Teknologi consumer sekarang sangat akurat untuk skrining awal.",
    deepDive:
      "Apple Watch Series 4+ dan Samsung Galaxy Watch memiliki akurasi >95% dalam mendeteksi Fibrilasi Atrium dibandingkan dengan EKG 12-lead standar. FDA bahkan telah menyetujui beberapa aplikasi smartwatch untuk deteksi AFib. Namun, hasil positif tetap memerlukan konfirmasi dengan EKG medis standar, dan negatif palsu tetap mungkin terjadi pada aritmia jenis lain.",
    dataSnapshot: {
      value: "95%+",
      label: "Akurasi smartwatch untuk deteksi AFib",
      icon: <Target />,
    },
    expertsTake:
      "Smartwatch telah merevolusi deteksi dini aritmia. Banyak pasien yang terdiagnosis AFib pertama kali melalui alert dari Apple Watch mereka. - Dr. Digital Health",
    actionableTip:
      "Jika smartwatch Anda mendeteksi irama tidak teratur berulang kali, jangan abaikan - konsultasikan dengan dokter untuk EKG konfirmasi.",
    colorScheme: "blue",
    severity: "rendah",
    readingTime: 3,
    tags: ["smartwatch", "teknologi", "deteksi", "skrining"],
    relatedMyths: [2, 8],
    evidenceLevel: "A",
    lastUpdated: "Agustus 2025",
  },
  {
    id: 12,
    category: "Pengobatan & Risiko Serius",
    myth: "Ablasi akan menyelesaikan masalah aritmia saya 100% dan selamanya.",
    theTruth:
      "Ablasi sangat efektif, namun tidak selalu sempurna atau permanen.",
    deepDive:
      "Meskipun ablasi memiliki tingkat keberhasilan tinggi, beberapa faktor mempengaruhi hasil jangka panjang: jenis aritmia, ukuran atrium, durasi AFib sebelum ablasi, dan kondisi penyerta lainnya. Untuk AFib persisten, success rate berkisar 70-80% untuk prosedur pertama, dan bisa meningkat hingga 85-90% dengan prosedur kedua jika diperlukan. Penting untuk memiliki ekspektasi yang realistis dan memahami bahwa beberapa pasien mungkin masih memerlukan obat antiaritmia dosis rendah setelah ablasi.",
    dataSnapshot: {
      value: "80-85%",
      label: "Success rate ablasi AFib jangka panjang",
      icon: <Award />,
    },
    expertsTake:
      "Ablasi adalah game-changer bagi banyak pasien, tapi saya selalu menekankan bahwa ini adalah 'manajemen', bukan 'penyembuhan' total. Realistic expectations sangat penting. - Dr. Advanced EP",
    actionableTip:
      "Diskusikan secara detail dengan dokter Anda tentang ekspektasi realistis berdasarkan jenis aritmia dan kondisi spesifik Anda.",
    colorScheme: "red",
    severity: "sedang",
    readingTime: 4,
    tags: ["ablasi", "ekspektasi", "keberhasilan", "jangka panjang"],
    relatedMyths: [6, 7],
    evidenceLevel: "A",
    lastUpdated: "Juli 2025",
  },
  // ...existing code...
  {
    id: 13,
    category: "Gejala & Diagnosis",
    myth: "Aritmia hanya terjadi pada orang tua, anak muda pasti aman.",
    theTruth: "Aritmia bisa menyerang segala usia, bahkan atlet muda.",
    deepDive:
      "Beberapa jenis aritmia seperti Wolff-Parkinson-White syndrome atau Long QT syndrome justru sering ditemukan pada usia muda dan bisa memicu henti jantung mendadak pada atlet. Skrining EKG pada remaja dengan riwayat pingsan atau keluarga dengan kematian mendadak sangat penting.",
    dataSnapshot: {
      value: "5-10%",
      label: "Kasus aritmia pada usia <30 tahun",
      icon: <AlertTriangle />,
    },
    expertsTake:
      "Kami sering menemukan aritmia serius pada pasien muda yang aktif secara fisik. Jangan abaikan gejala seperti pingsan atau jantung berdebar tiba-tiba.",
    actionableTip:
      "Jika Anda atau anak Anda mengalami pingsan saat aktivitas, segera konsultasikan ke dokter jantung.",
    colorScheme: "blue",
    severity: "tinggi",
    readingTime: 3,
    tags: ["anak muda", "atlet", "pingsan", "skrining"],
    relatedMyths: [5, 8],
    evidenceLevel: "B",
    lastUpdated: "Agustus 2025",
  },
  {
    id: 14,
    category: "Pengobatan & Risiko Serius",
    myth: "Obat pengencer darah pasti menyebabkan pendarahan berat.",
    theTruth: "Risiko pendarahan bisa dikontrol dengan monitoring yang tepat.",
    deepDive:
      "Obat antikoagulan memang meningkatkan risiko pendarahan, namun manfaatnya dalam mencegah stroke pada pasien AFib jauh lebih besar. Dengan pemantauan INR (untuk warfarin) atau pemilihan DOAC yang sesuai, risiko pendarahan berat dapat diminimalkan.",
    dataSnapshot: {
      value: "2-3%",
      label: "Risiko pendarahan mayor/tahun pada terapi antikoagulan",
      icon: <Stethoscope />,
    },
    expertsTake:
      "Dengan edukasi dan monitoring, sebagian besar pasien dapat menggunakan antikoagulan dengan aman.",
    actionableTip:
      "Laporkan segera jika ada tanda pendarahan (mimisan, urin merah, BAB hitam) ke dokter.",
    colorScheme: "red",
    severity: "sedang",
    readingTime: 4,
    tags: ["antikoagulan", "obat", "pendarahan", "monitoring"],
    relatedMyths: [7, 3],
    evidenceLevel: "A",
    lastUpdated: "Agustus 2025",
  },
  {
    id: 15,
    category: "Gaya Hidup & Pemicu",
    myth: "Aritmia tidak berbahaya selama tidak terasa gejala.",
    theTruth: "Aritmia tanpa gejala tetap bisa menyebabkan komplikasi serius.",
    deepDive:
      "Banyak pasien AFib tidak merasakan gejala, namun tetap berisiko tinggi mengalami stroke atau gagal jantung. Deteksi dini dan pengobatan tetap penting meski tanpa keluhan.",
    dataSnapshot: {
      value: "30%",
      label: "AFib tanpa gejala pada populasi lansia",
      icon: <BarChart />,
    },
    expertsTake:
      "Jangan menunggu gejala muncul untuk memulai pengobatan aritmia.",
    actionableTip:
      "Lakukan skrining EKG rutin jika Anda memiliki faktor risiko, meski merasa sehat.",
    colorScheme: "orange",
    severity: "tinggi",
    readingTime: 3,
    tags: ["tanpa gejala", "komplikasi", "skrining", "AFib"],
    relatedMyths: [2, 11],
    evidenceLevel: "A",
    lastUpdated: "Agustus 2025",
  },
];

// Enhanced Main Component
const AritmiaMythBuster: FC = () => {
  const [selectedItem, setSelectedItem] = useState<MythFactItem | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedSeverity, setSelectedSeverity] = useState<string | null>(null);
  const [showFilters, setShowFilters] = useState(false);
  const [userProgress, setUserProgress] = useState<UserProgress>({
    readMyths: new Set(),
    bookmarkedMyths: new Set(),
    completionPercentage: 0,
  });
  const [sortBy, setSortBy] = useState<"default" | "severity" | "readingTime">(
    "default"
  );
  const [viewMode] = useState<"grid" | "list">("grid");

  // Filter and Search Logic
  const filteredMyths = useMemo(() => {
    const filtered = arrhythmiaMyths.filter((item) => {
      const matchesSearch =
        item.myth.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.theTruth.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.tags.some((tag) =>
          tag.toLowerCase().includes(searchTerm.toLowerCase())
        );

      const matchesCategory =
        !selectedCategory || item.category === selectedCategory;
      const matchesSeverity =
        !selectedSeverity || item.severity === selectedSeverity;

      return matchesSearch && matchesCategory && matchesSeverity;
    });

    // Sorting
    if (sortBy === "severity") {
      const severityOrder = { tinggi: 3, sedang: 2, rendah: 1 };
      filtered.sort(
        (a, b) => severityOrder[b.severity] - severityOrder[a.severity]
      );
    } else if (sortBy === "readingTime") {
      filtered.sort((a, b) => a.readingTime - b.readingTime);
    }

    return filtered;
  }, [searchTerm, selectedCategory, selectedSeverity, sortBy]);

  // Update progress when myths are read
  useEffect(() => {
    const newPercentage =
      (userProgress.readMyths.size / arrhythmiaMyths.length) * 100;
    setUserProgress((prev) => ({
      ...prev,
      completionPercentage: newPercentage,
    }));
  }, [userProgress.readMyths]);

  const handleMythRead = (mythId: number) => {
    setUserProgress((prev) => ({
      ...prev,
      readMyths: new Set([...prev.readMyths, mythId]),
    }));
  };

  const handleBookmark = (mythId: number) => {
    setUserProgress((prev) => ({
      ...prev,
      bookmarkedMyths: prev.bookmarkedMyths.has(mythId)
        ? new Set([...prev.bookmarkedMyths].filter((id) => id !== mythId))
        : new Set([...prev.bookmarkedMyths, mythId]),
    }));
  };

  const categories = [
    "Gaya Hidup & Pemicu",
    "Gejala & Diagnosis",
    "Pengobatan & Risiko Serius",
  ];
  const severityLevels = ["rendah", "sedang", "tinggi"];

  const colorClasses = {
    orange: "border-orange-500 bg-orange-50 dark:bg-orange-900/20",
    blue: "border-blue-500 bg-blue-50 dark:bg-blue-900/20",
    red: "border-red-500 bg-red-50 dark:bg-red-900/20",
  };

  const severityColors = {
    rendah: "text-green-600 bg-green-100 dark:bg-green-900/30",
    sedang: "text-yellow-600 bg-yellow-100 dark:bg-yellow-900/30",
    tinggi: "text-red-600 bg-red-100 dark:bg-red-900/30",
  };

  return (
    <section
      id="myth-buster"
      className="py-24 sm:py-32 bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50 dark:from-black dark:via-blue-950 dark:to-purple-950"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Enhanced Header with Progress */}
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.5 }}
        >
          <div className="relative inline-block">
            <BrainCircuit className="h-16 w-16 mx-auto text-red-600 mb-4" />
            <motion.div
              className="absolute -top-2 -right-2 h-6 w-6 bg-blue-500 rounded-full flex items-center justify-center"
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <Sparkles className="h-3 w-3 text-white" />
            </motion.div>
          </div>

          <h2 className="text-4xl sm:text-5xl font-extrabold text-gray-900 dark:text-white mb-4">
            Arrhythmia Myth Buster
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto mb-6">
            Membongkar miskonsepsi paling umum tentang aritmia dengan penjelasan
            mendalam dari para ahli.
          </p>

          {/* Progress Bar */}
          <div className="max-w-md mx-auto mb-8">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Progress Pembelajaran
              </span>
              <span className="text-sm text-blue-600 dark:text-blue-400 font-bold">
                {Math.round(userProgress.completionPercentage)}%
              </span>
            </div>
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
              <motion.div
                className="bg-gradient-to-r from-blue-500 to-purple-600 h-3 rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${userProgress.completionPercentage}%` }}
                transition={{ duration: 0.5 }}
              />
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              {userProgress.readMyths.size} dari {arrhythmiaMyths.length} mitos
              telah dibaca
            </p>
          </div>
        </motion.div>

        {/* Enhanced Search and Filter Section */}
        <motion.div
          className="mb-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 border border-gray-200 dark:border-gray-700">
            {/* Search Bar */}
            <div className="relative mb-4">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Cari mitos berdasarkan kata kunci, gejala, atau tag..."
                className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            {/* Filter Toggle and Options */}
            <div className="flex flex-wrap gap-3 items-center justify-between">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center gap-2"
              >
                <Filter className="h-4 w-4" />
                Filter & Sorting
                {showFilters ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </Button>

              <div className="flex gap-2 text-sm text-gray-600 dark:text-gray-400">
                <span>{filteredMyths.length} mitos ditemukan</span>
                {userProgress.bookmarkedMyths.size > 0 && (
                  <span>• {userProgress.bookmarkedMyths.size} tersimpan</span>
                )}
              </div>
            </div>

            {/* Expanded Filter Options */}
            <AnimatePresence>
              {showFilters && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-600"
                >
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {/* Category Filter */}
                    <div>
                      <label className="block text-sm font-medium mb-2">
                        Kategori
                      </label>
                      <select
                        value={selectedCategory || ""}
                        onChange={(e) =>
                          setSelectedCategory(e.target.value || null)
                        }
                        className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white"
                      >
                        <option value="">Semua Kategori</option>
                        {categories.map((cat) => (
                          <option key={cat} value={cat}>
                            {cat}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Severity Filter */}
                    <div>
                      <label className="block text-sm font-medium mb-2">
                        Tingkat Kepentingan
                      </label>
                      <select
                        value={selectedSeverity || ""}
                        onChange={(e) =>
                          setSelectedSeverity(e.target.value || null)
                        }
                        className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white"
                      >
                        <option value="">Semua Tingkat</option>
                        {severityLevels.map((level) => (
                          <option key={level} value={level}>
                            {level.charAt(0).toUpperCase() + level.slice(1)}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Sort Options */}
                    <div>
                      <label className="block text-sm font-medium mb-2">
                        Urutkan
                      </label>
                      <select
                        value={sortBy}
                        onChange={(e) =>
                          setSortBy(
                            e.target.value as
                              | "default"
                              | "severity"
                              | "readingTime"
                          )
                        }
                        className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white"
                      >
                        <option value="default">Default</option>
                        <option value="severity">Tingkat Kepentingan</option>
                        <option value="readingTime">Waktu Baca</option>
                      </select>
                    </div>
                  </div>

                  {/* Quick Action Buttons */}
                  <div className="flex flex-wrap gap-2 mt-4">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setSearchTerm("");
                        setSelectedCategory(null);
                        setSelectedSeverity(null);
                        setSortBy("default");
                      }}
                    >
                      Reset Filter
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setSortBy("severity")}
                    >
                      Prioritas Tinggi
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setSortBy("readingTime")}
                    >
                      Baca Cepat
                    </Button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>

        {/* Enhanced Myth Cards Grid */}
        <div
          className={cn(
            "gap-8",
            viewMode === "grid"
              ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3"
              : "flex flex-col space-y-6"
          )}
        >
          {filteredMyths.map((item, index) => {
            const isRead = userProgress.readMyths.has(item.id);
            const isBookmarked = userProgress.bookmarkedMyths.has(item.id);

            return (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                whileHover={{
                  y: -8,
                  boxShadow: "0 20px 40px rgba(0,0,0,0.1)",
                  transition: { duration: 0.2 },
                }}
                onClick={() => {
                  setSelectedItem(item);
                  handleMythRead(item.id);
                }}
                className={cn(
                  "relative p-6 rounded-2xl shadow-lg bg-white dark:bg-gray-800 cursor-pointer transition-all duration-300 border-2 border-transparent overflow-hidden",
                  `hover:${colorClasses[item.colorScheme]}`,
                  isRead && "ring-2 ring-green-500 ring-opacity-50"
                )}
              >
                {/* Background Pattern */}
                <div className="absolute inset-0 opacity-5">
                  <div className="absolute inset-0 bg-gradient-to-br from-current to-transparent" />
                </div>

                {/* Status Indicators */}
                <div className="flex justify-between items-start mb-4">
                  <div className="flex gap-2">
                    <Badge variant="destructive" className="text-xs">
                      MITOS
                    </Badge>
                    <Badge
                      className={cn("text-xs", severityColors[item.severity])}
                      variant="outline"
                    >
                      {item.severity.toUpperCase()}
                    </Badge>
                  </div>

                  <div className="flex gap-2">
                    {isRead && (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="h-6 w-6 bg-green-500 rounded-full flex items-center justify-center"
                      >
                        <CheckCircle className="h-4 w-4 text-white" />
                      </motion.div>
                    )}
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleBookmark(item.id);
                      }}
                      className={cn(
                        "h-8 w-8 rounded-full flex items-center justify-center transition-colors",
                        isBookmarked
                          ? "bg-yellow-500 text-white"
                          : "bg-gray-200 dark:bg-gray-700 text-gray-400 hover:text-yellow-500"
                      )}
                    >
                      <BookOpen className="h-4 w-4" />
                    </motion.button>
                    <HelpCircle className="h-8 w-8 text-gray-300 dark:text-gray-600" />
                  </div>
                </div>

                {/* Enhanced Content */}
                <div className="space-y-4">
                  <p className="text-lg font-bold text-gray-800 dark:text-white leading-tight">
                    "{item.myth}"
                  </p>

                  {/* Quick Info */}
                  <div className="flex items-center gap-4 text-xs text-gray-500 dark:text-gray-400">
                    <div className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {item.readingTime} min
                    </div>
                    <div className="flex items-center gap-1">
                      <Award className="h-3 w-3" />
                      Evidence {item.evidenceLevel}
                    </div>
                    <div className="flex items-center gap-1">
                      <Target className="h-3 w-3" />
                      {item.category.split(" ")[0]}
                    </div>
                  </div>

                  {/* Tags Preview */}
                  <div className="flex flex-wrap gap-1">
                    {item.tags.slice(0, 3).map((tag) => (
                      <span
                        key={tag}
                        className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-xs rounded-full text-gray-600 dark:text-gray-300"
                      >
                        #{tag}
                      </span>
                    ))}
                    {item.tags.length > 3 && (
                      <span className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-xs rounded-full text-gray-600 dark:text-gray-300">
                        +{item.tags.length - 3}
                      </span>
                    )}
                  </div>

                  {/* Quick Truth Preview */}
                  <div className="p-3 rounded-lg bg-green-50 dark:bg-green-900/20 border-l-4 border-green-500">
                    <div className="flex items-center gap-2">
                      <ShieldCheck className="h-5 w-5 text-green-600 dark:text-green-400" />
                      <p className="text-sm font-medium text-green-800 dark:text-green-300">
                        Faktanya: {item.theTruth.substring(0, 60)}...
                      </p>
                    </div>
                  </div>

                  <p className="text-sm text-gray-500 dark:text-gray-400 flex items-center gap-2">
                    <Lightbulb className="h-4 w-4" />
                    Klik untuk pembahasan lengkap...
                  </p>
                </div>

                {/* Hover Effect Overlay */}
                <motion.div
                  className="absolute inset-0 bg-gradient-to-br from-transparent via-white/5 to-white/10 opacity-0 pointer-events-none"
                  whileHover={{ opacity: 1 }}
                  transition={{ duration: 0.3 }}
                />
              </motion.div>
            );
          })}
        </div>

        {/* No Results State */}
        {filteredMyths.length === 0 && (
          <motion.div
            className="text-center py-16"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <Search className="h-16 w-16 mx-auto text-gray-300 dark:text-gray-600 mb-4" />
            <p className="text-xl font-medium text-gray-500 dark:text-gray-400 mb-2">
              Tidak ada mitos yang ditemukan
            </p>
            <p className="text-gray-400 dark:text-gray-500">
              Coba ubah kata kunci pencarian atau filter yang dipilih
            </p>
          </motion.div>
        )}
      </div>

      {/* Enhanced Dialog with More Interactive Elements */}
      <Dialog open={!!selectedItem} onOpenChange={() => setSelectedItem(null)}>
        <AnimatePresence>
          {selectedItem && (
            <DialogContent className="max-w-4xl w-full sm:w-[95vw] p-0 h-[90vh]">
              <motion.div
                initial={{ opacity: 0, scale: 0.95, rotateX: -10 }}
                animate={{ opacity: 1, scale: 1, rotateX: 0 }}
                exit={{ opacity: 0, scale: 0.95, rotateX: 10 }}
                transition={{ duration: 0.4, ease: "easeOut" }}
                className="flex-1 overflow-y-auto px-6 pb-6 space-y-6 custom-scrollbar"
              >
                {/* Enhanced Header */}
                <DialogHeader
                  className={cn(
                    "p-6 pb-4 border-b border-gray-200 dark:border-gray-700",
                    colorClasses[selectedItem.colorScheme]
                  )}
                >
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-3">
                        <Badge variant="destructive">MITOS</Badge>
                        <Badge
                          className={severityColors[selectedItem.severity]}
                          variant="outline"
                        >
                          Prioritas {selectedItem.severity}
                        </Badge>
                        <Badge variant="outline">
                          Evidence Level {selectedItem.evidenceLevel}
                        </Badge>
                      </div>
                      <DialogTitle className="text-2xl font-bold text-gray-900 dark:text-white leading-tight">
                        "{selectedItem.myth}"
                      </DialogTitle>
                    </div>

                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleBookmark(selectedItem.id);
                      }}
                      className={cn(
                        "ml-4 h-10 w-10 rounded-full flex items-center justify-center transition-colors",
                        userProgress.bookmarkedMyths.has(selectedItem.id)
                          ? "bg-yellow-500 text-white"
                          : "bg-gray-200 dark:bg-gray-700 text-gray-400 hover:text-yellow-500"
                      )}
                    >
                      <BookOpen className="h-5 w-5" />
                    </motion.button>
                  </div>

                  {/* Meta Information */}
                  <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400 mt-3">
                    <div className="flex items-center gap-1">
                      <Clock className="h-4 w-4" />
                      {selectedItem.readingTime} menit baca
                    </div>
                    <div className="flex items-center gap-1">
                      <Stethoscope className="h-4 w-4" />
                      Update: {selectedItem.lastUpdated}
                    </div>
                  </div>
                </DialogHeader>

                {/* Enhanced Content Area */}
                <div className="px-6 pb-6 space-y-6 flex-1 overflow-y-auto custom-scrollbar">
                  {/* The Truth - Enhanced */}
                  <motion.div
                    initial={{ x: -20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: 0.1 }}
                    className="p-5 rounded-xl bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/30 dark:to-emerald-900/30 border border-green-200 dark:border-green-800"
                  >
                    <div className="flex items-start gap-4">
                      <motion.div
                        animate={{ rotate: [0, 10, -10, 0] }}
                        transition={{ duration: 2, repeat: Infinity, delay: 1 }}
                      >
                        <ShieldCheck className="h-10 w-10 text-green-600 dark:text-green-400" />
                      </motion.div>
                      <div className="flex-1">
                        <h3 className="font-bold text-green-800 dark:text-green-300 text-lg mb-2">
                          Faktanya...
                        </h3>
                        <p className="font-semibold text-xl text-gray-900 dark:text-white leading-relaxed">
                          {selectedItem.theTruth}
                        </p>
                      </div>
                    </div>
                  </motion.div>

                  {/* Deep Dive - Enhanced */}
                  <motion.div
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.2 }}
                    className="bg-gray-50 dark:bg-gray-800/50 rounded-xl p-5 border border-gray-200 dark:border-gray-700"
                  >
                    <div className="flex items-center gap-3 mb-4">
                      <BrainCircuit className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                      <h4 className="font-bold text-lg">Penjelasan Mendalam</h4>
                    </div>
                    <p className="text-gray-700 dark:text-gray-300 leading-relaxed text-base">
                      {selectedItem.deepDive}
                    </p>
                  </motion.div>

                  {/* Enhanced Data Snapshot */}
                  <motion.div
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: 0.3 }}
                    className="relative overflow-hidden"
                  >
                    <div className="flex items-center gap-6 p-5 rounded-xl bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/30 dark:to-indigo-900/30 border border-blue-200 dark:border-blue-800">
                      <motion.div
                        animate={{ rotateY: [0, 360] }}
                        transition={{
                          duration: 4,
                          repeat: Infinity,
                          ease: "linear",
                        }}
                        className="text-blue-500 dark:text-blue-400"
                      >
                        {selectedItem.dataSnapshot.icon}
                      </motion.div>
                      <div className="flex-1">
                        <p className="text-3xl font-black text-blue-600 dark:text-blue-400 mb-1">
                          {selectedItem.dataSnapshot.value}
                        </p>
                        <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                          {selectedItem.dataSnapshot.label}
                        </p>
                      </div>
                      <div className="text-right">
                        <div className="flex items-center gap-1 text-xs text-blue-600 dark:text-blue-400">
                          <BarChart className="h-3 w-3" />
                          Data Snapshot
                        </div>
                      </div>
                    </div>
                  </motion.div>

                  {/* Expert's Take - Enhanced */}
                  <motion.div
                    initial={{ x: 20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: 0.4 }}
                    className="border border-dashed border-gray-300 dark:border-gray-600 rounded-xl p-5"
                  >
                    <div className="flex items-start gap-3 mb-3">
                      <Stethoscope className="h-6 w-6 text-purple-600 dark:text-purple-400 mt-1" />
                      <h4 className="font-bold text-lg text-purple-800 dark:text-purple-300">
                        Kata Ahli
                      </h4>
                    </div>
                    <blockquote className="text-base italic text-gray-700 dark:text-gray-300 leading-relaxed border-l-4 border-purple-500 pl-4">
                      "{selectedItem.expertsTake}"
                    </blockquote>
                  </motion.div>

                  {/* Actionable Tip - Enhanced */}
                  <motion.div
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.5 }}
                    className="p-5 rounded-xl bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-900/30 dark:to-orange-900/30 border border-amber-200 dark:border-amber-800"
                  >
                    <div className="flex items-start gap-4">
                      <motion.div
                        animate={{ rotateZ: [0, 10, -10, 0] }}
                        transition={{ duration: 3, repeat: Infinity }}
                      >
                        <Lightbulb className="h-8 w-8 text-amber-600 dark:text-amber-400 mt-1" />
                      </motion.div>
                      <div className="flex-1">
                        <h3 className="font-bold text-amber-800 dark:text-amber-300 text-lg mb-2">
                          Tips Praktis & Actionable
                        </h3>
                        <p className="text-base text-gray-700 dark:text-gray-300 leading-relaxed">
                          {selectedItem.actionableTip}
                        </p>
                      </div>
                    </div>
                  </motion.div>

                  {/* Tags Section */}
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.6 }}
                    className="pt-4"
                  >
                    <h4 className="font-medium text-gray-700 dark:text-gray-300 mb-3">
                      Tags Terkait:
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {selectedItem.tags.map((tag) => (
                        <motion.span
                          key={tag}
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          whileHover={{ scale: 1.05 }}
                          className="px-3 py-2 bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-sm rounded-full text-gray-700 dark:text-gray-300 cursor-pointer transition-colors"
                          onClick={(e) => {
                            e.stopPropagation();
                            setSearchTerm(tag);
                            setSelectedItem(null);
                          }}
                        >
                          #{tag}
                        </motion.span>
                      ))}
                    </div>
                  </motion.div>

                  {/* Related Myths */}
                  {selectedItem.relatedMyths.length > 0 && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.7 }}
                      className="pt-4 border-t border-gray-200 dark:border-gray-700"
                    >
                      <h4 className="font-medium text-gray-700 dark:text-gray-300 mb-3">
                        Mitos Terkait:
                      </h4>
                      <div className="grid grid-cols-1 gap-2">
                        {selectedItem.relatedMyths.map((relatedId) => {
                          const relatedMyth = arrhythmiaMyths.find(
                            (m) => m.id === relatedId
                          );
                          if (!relatedMyth) return null;

                          return (
                            <motion.button
                              key={relatedId}
                              whileHover={{ x: 5 }}
                              onClick={(e) => {
                                e.stopPropagation();
                                setSelectedItem(relatedMyth);
                                handleMythRead(relatedMyth.id);
                              }}
                              className="flex items-center gap-3 p-3 rounded-lg bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 hover:border-blue-500 dark:hover:border-blue-400 transition-colors text-left"
                            >
                              <div
                                className={cn(
                                  "h-3 w-3 rounded-full",
                                  relatedMyth.colorScheme === "orange" &&
                                    "bg-orange-500",
                                  relatedMyth.colorScheme === "blue" &&
                                    "bg-blue-500",
                                  relatedMyth.colorScheme === "red" &&
                                    "bg-red-500"
                                )}
                              />
                              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                {relatedMyth.myth.substring(0, 80)}...
                              </span>
                            </motion.button>
                          );
                        })}
                      </div>
                    </motion.div>
                  )}
                </div>

                {/* Enhanced Footer */}
                <div className="p-6 bg-gray-50 dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 flex justify-between items-center">
                  <div className="flex items-center gap-4">
                    <div className="text-sm text-gray-500 dark:text-gray-400">
                      <div className="flex items-center gap-2">
                        <Eye className="h-4 w-4" />
                        {userProgress.readMyths.has(selectedItem.id)
                          ? "Sudah dibaca"
                          : "Belum dibaca"}
                      </div>
                    </div>

                    {/* Share-like buttons */}
                    <div className="flex gap-2">
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-full text-xs font-medium"
                      >
                        Bagikan
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="px-3 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 rounded-full text-xs font-medium"
                      >
                        Print PDF
                      </motion.button>
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <Button
                      variant="outline"
                      onClick={() => setSelectedItem(null)}
                      className="flex items-center gap-2"
                    >
                      <Eye className="h-4 w-4" />
                      Kembali ke Daftar
                    </Button>
                    <Button
                      onClick={() => {
                        // Navigate to next unread myth
                        const unreadMyths = arrhythmiaMyths.filter(
                          (m) => !userProgress.readMyths.has(m.id)
                        );
                        if (unreadMyths.length > 0) {
                          const nextMyth = unreadMyths[0];
                          setSelectedItem(nextMyth);
                          handleMythRead(nextMyth.id);
                        }
                      }}
                      disabled={
                        userProgress.readMyths.size === arrhythmiaMyths.length
                      }
                      className="flex items-center gap-2"
                    >
                      <Sparkles className="h-4 w-4" />
                      Mitos Berikutnya
                    </Button>
                  </div>
                </div>
              </motion.div>
            </DialogContent>
          )}
        </AnimatePresence>
      </Dialog>

      {/* Floating Progress Widget */}
      <motion.div
        className="fixed bottom-6 right-6 z-50"
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 1 }}
      >
        <motion.div
          whileHover={{ scale: 1.05 }}
          className="bg-white dark:bg-gray-800 rounded-full shadow-2xl p-4 border border-gray-200 dark:border-gray-700"
        >
          <div className="flex items-center gap-3">
            <div className="relative">
              <svg className="w-8 h-8 transform -rotate-90">
                <circle
                  cx="16"
                  cy="16"
                  r="14"
                  stroke="currentColor"
                  strokeWidth="2"
                  fill="none"
                  className="text-gray-200 dark:text-gray-700"
                />
                <motion.circle
                  cx="16"
                  cy="16"
                  r="14"
                  stroke="currentColor"
                  strokeWidth="2"
                  fill="none"
                  strokeLinecap="round"
                  className="text-blue-500"
                  strokeDasharray={`${2 * Math.PI * 14}`}
                  strokeDashoffset={`${
                    2 *
                    Math.PI *
                    14 *
                    (1 - userProgress.completionPercentage / 100)
                  }`}
                  transition={{ duration: 0.5 }}
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-xs font-bold text-blue-600 dark:text-blue-400">
                  {Math.round(userProgress.completionPercentage)}%
                </span>
              </div>
            </div>
            <div className="text-xs">
              <div className="font-medium text-gray-700 dark:text-gray-300">
                Progress
              </div>
              <div className="text-gray-500 dark:text-gray-400">
                {userProgress.readMyths.size}/{arrhythmiaMyths.length}
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>

      {/* Achievement Popup */}
      <AnimatePresence>
        {userProgress.completionPercentage === 100 && (
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
          >
            <motion.div
              initial={{ rotateY: -90 }}
              animate={{ rotateY: 0 }}
              className="bg-white dark:bg-gray-800 rounded-2xl p-8 max-w-md mx-4 text-center border border-gray-200 dark:border-gray-700 shadow-2xl"
            >
              <motion.div
                animate={{ rotate: [0, 360] }}
                transition={{ duration: 2, ease: "linear" }}
                className="inline-block mb-4"
              >
                <Award className="h-16 w-16 text-yellow-500" />
              </motion.div>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                Selamat! 🎉
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                Anda telah menyelesaikan semua myth-busting session! Pengetahuan
                Anda tentang aritmia sekarang jauh lebih akurat.
              </p>
              <div className="flex gap-3 justify-center">
                <Button
                  onClick={() => {
                    setUserProgress({
                      readMyths: new Set(),
                      bookmarkedMyths: new Set(),
                      completionPercentage: 0,
                    });
                  }}
                  variant="outline"
                >
                  Mulai Ulang
                </Button>
                <Button
                  onClick={() =>
                    setUserProgress((prev) => ({
                      ...prev,
                      completionPercentage: 99,
                    }))
                  }
                >
                  Tutup
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Enhanced Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <motion.div
          animate={{
            rotate: [0, 360],
            scale: [1, 1.1, 1],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "linear",
          }}
          className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-blue-400/5 to-purple-400/5 rounded-full"
        />
        <motion.div
          animate={{
            rotate: [360, 0],
            scale: [1, 0.9, 1],
          }}
          transition={{
            duration: 25,
            repeat: Infinity,
            ease: "linear",
          }}
          className="absolute -bottom-40 -left-40 w-96 h-96 bg-gradient-to-br from-orange-400/5 to-red-400/5 rounded-full"
        />
      </div>
    </section>
  );
};

export default AritmiaMythBuster;

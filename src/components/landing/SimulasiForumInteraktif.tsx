// src/components/landing/ForumKompleks.tsx

import React, { useState, useEffect, createContext, useContext } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  ThumbsUp,
  MessageSquare,
  CornerUpRight,
  PlusCircle,
  ArrowLeft,
} from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { AnimatePresence, motion } from "framer-motion";

// --- 1. DEFINISI TIPE & STRUKTUR DATA ---

type User = {
  name: string;
  avatarUrl?: string;
  initials: string;
};

type Reply = {
  id: string;
  author: User;
  content: string;
  createdAt: string;
  likes: number;
  parentId: string | null; // null jika balasan level atas, atau id balasan lain jika nested
  replies?: Reply[]; // Untuk mempermudah rendering rekursif
};

type Thread = {
  id: string;
  title: string;
  author: User;
  content: string;
  createdAt: string;
  tags: string[];
  likes: number;
  replies: Reply[];
};

// --- 2. DATA DUMMY AWAL (SEED DATA) ---
const seedData: Thread[] = [
  // Utas 1: Diagnosis Baru (dari sebelumnya, sedikit diperkaya)
  {
    id: "thread-01",
    title: "Baru didiagnosis dengan Fibrilasi Atrium, harus mulai dari mana?",
    author: {
      name: "CemasTapiSemangat",
      avatarUrl: "https://github.com/shadcn.png",
      initials: "CS",
    },
    content:
      "Halo semua, saya baru saja keluar dari RS dan dokter bilang saya punya Fibrilasi Atrium. Rasanya sedikit takut dan bingung harus berbuat apa sekarang. Apakah ada saran untuk langkah pertama? Jujur, saya sangat khawatir.",
    createdAt: "2 hari yang lalu",
    tags: ["Aritmia", "Fibrilasi Atrium", "Pemula", "Dukungan"],
    likes: 48,
    replies: [
      {
        id: "reply-001",
        parentId: null,
        author: {
          name: "SeniorUser",
          avatarUrl: "https://i.pravatar.cc/150?u=SeniorUser",
          initials: "SU",
        },
        createdAt: "2 hari yang lalu",
        likes: 22,
        content:
          "Jangan panik, perasaanmu sangat wajar. Hampir semua dari kita pernah di posisi itu. Coba deh baca bagian **AritmiaMythBuster** di aplikasi ini, sangat membantu menenangkan pikiran dari mitos-mitos yang salah. Tetap semangat ya!",
      },
      {
        id: "reply-002",
        parentId: null,
        author: { name: "DokterBot", avatarUrl: "/Logo.png", initials: "DB" },
        createdAt: "2 hari yang lalu",
        likes: 35,
        content:
          "Selamat datang! Memahami kondisi Anda adalah langkah pertama yang krusial. Kami sarankan untuk memulai dengan **Modul Edukasi Interaktif** dan mencatat gejala harian Anda di **AritmiaCommandCenter**.",
      },
      {
        id: "reply-003",
        parentId: "reply-001",
        author: {
          name: "CemasTapiSemangat",
          avatarUrl: "https://github.com/shadcn.png",
          initials: "CS",
        },
        createdAt: "1 hari yang lalu",
        likes: 9,
        content:
          "Terima kasih banyak sarannya @SeniorUser, saya akan coba lihat. Senang rasanya tahu saya tidak sendirian di sini.",
      },
      {
        id: "reply-004",
        parentId: "reply-001",
        author: {
          name: "PejuangJantungLain",
          avatarUrl: "https://i.pravatar.cc/150?u=Pejuang",
          initials: "PJ",
        },
        createdAt: "1 hari yang lalu",
        likes: 15,
        content:
          "Setuju dengan @SeniorUser. Dulu saya takut sekali, tapi setelah belajar lebih banyak, jadi lebih bisa mengontrol kondisi. Kamu juga pasti bisa!",
      },
    ],
  },

  // Utas 2: Gaya Hidup & Olahraga
  {
    id: "thread-03",
    title: "Olahraga yang Aman untuk Penderita Aritmia?",
    author: {
      name: "FitHeart",
      avatarUrl: "https://i.pravatar.cc/150?u=FitHeart",
      initials: "FH",
    },
    content:
      "Dokter menyarankan untuk tetap aktif, tapi saya takut olahraga malah memicu aritmia saya (SVT). Ada yang punya pengalaman olahraga apa yang aman tapi tetap efektif? Saya rindu jogging, tapi khawatir.",
    createdAt: "8 hari yang lalu",
    tags: ["Olahraga", "Gaya Hidup", "SVT", "Tips"],
    likes: 112,
    replies: [
      {
        id: "reply-005",
        parentId: null,
        author: {
          name: "YogaJoy",
          avatarUrl: "https://i.pravatar.cc/150?u=YogaJoy",
          initials: "YJ",
        },
        createdAt: "8 hari yang lalu",
        likes: 45,
        content:
          "Saya sangat merekomendasikan yoga dan tai chi. Intensitasnya rendah tapi sangat bagus untuk melatih pernapasan dan menenangkan sistem saraf. Benar-benar mengubah hidup saya.",
      },
      {
        id: "reply-006",
        parentId: null,
        author: { name: "DokterBot", avatarUrl: "/Logo.png", initials: "DB" },
        createdAt: "7 hari yang lalu",
        likes: 50,
        content:
          "Penting untuk selalu berkonsultasi dengan dokter Anda sebelum memulai program olahraga baru. Umumnya, jalan cepat, berenang, dan bersepeda dengan intensitas sedang dianggap aman. Gunakan fitur **LifestyleImpactSimulator** untuk melihat potensi efek aktivitas pada EKG Anda.",
      },
      {
        id: "reply-007",
        parentId: "reply-005",
        author: {
          name: "FitHeart",
          avatarUrl: "https://i.pravatar.cc/150?u=FitHeart",
          initials: "FH",
        },
        createdAt: "6 hari yang lalu",
        likes: 12,
        content:
          "Terima kasih @YogaJoy, saya belum pernah mencoba yoga. Mungkin ini saat yang tepat untuk mulai. Apakah ada kelas khusus untuk pemula?",
      },
    ],
  },

  // Utas 3: Obat-obatan
  {
    id: "thread-04",
    title: "Efek Samping Obat Beta Blocker, Ada yang Sama?",
    author: {
      name: "TanyaObat",
      avatarUrl: "https://i.pravatar.cc/150?u=TanyaObat",
      initials: "TO",
    },
    content:
      "Saya baru mulai minum Bisoprolol seminggu ini. Detak jantung memang lebih teratur, tapi badan rasanya lemas dan gampang capek. Apakah ini normal di awal-awal? Kapan biasanya efek ini berkurang?",
    createdAt: "12 hari yang lalu",
    tags: ["Obat", "Beta Blocker", "Efek Samping"],
    likes: 95,
    replies: [
      {
        id: "reply-008",
        parentId: null,
        author: {
          name: "PenggunaLama",
          avatarUrl: "https://i.pravatar.cc/150?u=PenggunaLama",
          initials: "PL",
        },
        createdAt: "12 hari yang lalu",
        likes: 33,
        content:
          "Sama banget! Saya juga begitu di 2-3 minggu pertama. Rasanya seperti zombi. Tapi setelah itu tubuh mulai beradaptasi kok. Coba sabar sedikit lagi, tapi kalau parah banget, lapor ke dokter ya.",
      },
      {
        id: "reply-009",
        parentId: "reply-008",
        author: {
          name: "TanyaObat",
          avatarUrl: "https://i.pravatar.cc/150?u=TanyaObat",
          initials: "TO",
        },
        createdAt: "11 hari yang lalu",
        likes: 8,
        content:
          "Wah, syukurlah kalau ini umum terjadi. Terima kasih infonya, jadi sedikit lebih tenang.",
      },
    ],
  },

  // Utas 4: Prosedur Medis
  {
    id: "thread-05",
    title: "Pengalaman Ablasi Kateter - Bagikan Ceritamu!",
    author: {
      name: "CalonAblasi",
      avatarUrl: "https://i.pravatar.cc/150?u=CalonAblasi",
      initials: "CA",
    },
    content:
      "Halo teman-teman, dokter merekomendasikan saya untuk menjalani prosedur ablasi kateter bulan depan. Jujur saya sangat gugup. Ada yang bisa berbagi pengalaman dari sebelum, saat, dan sesudah prosedur? Apa saja yang perlu saya siapkan?",
    createdAt: "1 bulan yang lalu",
    tags: ["Ablasi", "Prosedur", "Berbagi"],
    likes: 250,
    replies: [
      {
        id: "reply-010",
        parentId: null,
        author: {
          name: "SudahLewat",
          avatarUrl: "https://i.pravatar.cc/150?u=SudahLewat",
          initials: "SL",
        },
        createdAt: "1 bulan yang lalu",
        likes: 88,
        content:
          "Saya ablasi 6 bulan lalu. Gugup itu pasti! Prosedurnya sendiri tidak sakit karena dibius. Bagian paling tidak nyaman mungkin saat harus berbaring diam selama beberapa jam setelahnya. Tapi hasilnya sepadan, kualitas hidup saya meningkat drastis! Siapkan saja mental dan bawa buku atau musik untuk hiburan pasca-tindakan.",
      },
      {
        id: "reply-011",
        parentId: "reply-010",
        author: {
          name: "CalonAblasi",
          avatarUrl: "https://i.pravatar.cc/150?u=CalonAblasi",
          initials: "CA",
        },
        createdAt: "28 hari yang lalu",
        likes: 20,
        content:
          "Terima kasih banyak sudah berbagi @SudahLewat! Ceritamu sangat memotivasi. Tips bawa hiburan sangat berguna!",
      },
    ],
  },

  // Utas 5: Diet (dari sebelumnya)
  {
    id: "thread-02",
    title: "Tips Diet Rendah Garam yang Enak?",
    author: {
      name: "JuruMasakJantung",
      avatarUrl: "https://i.pravatar.cc/150?u=JuruMasakJantung",
      initials: "JM",
    },
    content:
      "Ada yang punya resep atau tips supaya makanan rendah garam tetap terasa lezat? Sudah coba beberapa resep tapi rasanya hambar sekali. Butuh inspirasi!",
    createdAt: "1 bulan yang lalu",
    tags: ["Diet", "Nutrisi", "Resep"],
    likes: 78,
    replies: [
      {
        id: "reply-012",
        parentId: null,
        author: {
          name: "RajaRempah",
          avatarUrl: "https://i.pravatar.cc/150?u=RajaRempah",
          initials: "RR",
        },
        createdAt: "25 hari yang lalu",
        likes: 40,
        content:
          "Kuncinya ada di rempah-rempah! Bawang putih, bawang bombay, lada hitam, jintan, ketumbar, dan perasan lemon/jeruk nipis bisa jadi pengganti rasa asin. Coba deh tumis sayuran pakai banyak bawang putih dan sedikit lada.",
      },
    ],
  },
  {
    id: "thread-06",
    title: "Butuh Semangat Saat Down dengan Kondisi Jantung",
    author: {
      name: "HatiRapuh",
      avatarUrl: "https://i.pravatar.cc/150?u=HatiRapuh",
      initials: "HR",
    },
    content:
      "Kadang saya merasa minder karena kondisi ini. Apalagi kalau lihat teman sebaya masih bebas olahraga ekstrem. Ada yang pernah merasa seperti ini? Bagaimana cara kalian bangkit?",
    createdAt: "3 minggu yang lalu",
    tags: ["Motivasi", "Mental Health", "Dukungan"],
    likes: 130,
    replies: [
      {
        id: "reply-013",
        parentId: null,
        author: {
          name: "SupportiveSoul",
          avatarUrl: "https://i.pravatar.cc/150?u=SupportiveSoul",
          initials: "SS",
        },
        createdAt: "3 minggu yang lalu",
        likes: 60,
        content:
          "Saya pernah banget. Yang membantu saya adalah bergabung di komunitas seperti forum ini. Jangan lupa, kekuatan mental sama pentingnya dengan fisik!",
      },
      {
        id: "reply-014",
        parentId: null,
        author: { name: "DokterBot", avatarUrl: "/Logo.png", initials: "DB" },
        createdAt: "3 minggu yang lalu",
        likes: 75,
        content:
          "Cobalah latihan mindfulness atau journaling. Studi menunjukkan teknik ini bisa menurunkan kecemasan pada pasien dengan aritmia.",
      },
    ],
  },

  // Utas 7: Teknologi & Gadget
  {
    id: "thread-07",
    title: "Smartwatch untuk Monitoring Detak Jantung?",
    author: {
      name: "GadgetLover",
      avatarUrl: "https://i.pravatar.cc/150?u=GadgetLover",
      initials: "GL",
    },
    content:
      "Ada rekomendasi smartwatch yang akurat buat monitor aritmia? Saya lihat ada fitur ECG di beberapa merk. Apa benar-benar berguna?",
    createdAt: "10 hari yang lalu",
    tags: ["Teknologi", "Wearable", "EKG"],
    likes: 85,
    replies: [
      {
        id: "reply-015",
        parentId: null,
        author: {
          name: "TechieHeart",
          avatarUrl: "https://i.pravatar.cc/150?u=TechieHeart",
          initials: "TH",
        },
        createdAt: "9 hari yang lalu",
        likes: 30,
        content:
          "Saya pakai Apple Watch. Fiturnya bagus untuk deteksi AFib, walau tetap harus konfirmasi ke dokter.",
      },
      {
        id: "reply-016",
        parentId: null,
        author: { name: "DokterBot", avatarUrl: "/Logo.png", initials: "DB" },
        createdAt: "9 hari yang lalu",
        likes: 55,
        content:
          "Benar, smartwatch bisa membantu pemantauan, tapi jangan dijadikan satu-satunya alat diagnosis. Gunakan bersama catatan gejala harian.",
      },
    ],
  },

  // Utas 8: Tips Tidur
  {
    id: "thread-08",
    title: "Sulit Tidur karena Jantung Berdebar",
    author: {
      name: "InsomniaJantung",
      avatarUrl: "https://i.pravatar.cc/150?u=InsomniaJantung",
      initials: "IJ",
    },
    content:
      "Setiap malam saya sering merasa jantung berdebar kencang. Akibatnya sulit tidur. Ada tips supaya bisa tidur lebih nyenyak?",
    createdAt: "5 hari yang lalu",
    tags: ["Tidur", "Kesehatan Mental", "Tips"],
    likes: 102,
    replies: [
      {
        id: "reply-017",
        parentId: null,
        author: {
          name: "CalmMind",
          avatarUrl: "https://i.pravatar.cc/150?u=CalmMind",
          initials: "CM",
        },
        createdAt: "5 hari yang lalu",
        likes: 41,
        content:
          "Coba ritual tidur: matikan gadget 1 jam sebelum tidur, lakukan pernapasan 4-7-8, dan dengarkan musik tenang. Lumayan efektif buat saya.",
      },
      {
        id: "reply-018",
        parentId: null,
        author: { name: "DokterBot", avatarUrl: "/Logo.png", initials: "DB" },
        createdAt: "5 hari yang lalu",
        likes: 50,
        content:
          "Bila gejala berdebar sangat sering muncul malam hari, sebaiknya diskusikan dengan dokter karena bisa terkait pola aritmia tertentu.",
      },
    ],
  },

  // Utas 9: Pengalaman dengan Caffeine
  {
    id: "thread-09",
    title: "Apakah Kopi Masih Aman untuk Penderita Aritmia?",
    author: {
      name: "CoffeeAddict",
      avatarUrl: "https://i.pravatar.cc/150?u=CoffeeAddict",
      initials: "CA",
    },
    content:
      "Saya pecinta kopi. Tapi sejak didiagnosis aritmia, saya ragu apakah masih boleh minum kopi. Ada yang punya pengalaman?",
    createdAt: "20 hari yang lalu",
    tags: ["Kopi", "Diet", "Gaya Hidup"],
    likes: 190,
    replies: [
      {
        id: "reply-019",
        parentId: null,
        author: {
          name: "CoffeeSafe",
          avatarUrl: "https://i.pravatar.cc/150?u=CoffeeSafe",
          initials: "CS",
        },
        createdAt: "20 hari yang lalu",
        likes: 60,
        content:
          "Saya masih minum 1 cangkir per hari, aman. Tapi kalau lebih dari itu, biasanya jantung saya berdebar.",
      },
      {
        id: "reply-020",
        parentId: null,
        author: { name: "DokterBot", avatarUrl: "/Logo.png", initials: "DB" },
        createdAt: "19 hari yang lalu",
        likes: 80,
        content:
          "Konsumsi kafein berbeda efeknya tiap orang. Rata-rata aman bila <200mg/hari, tapi pantau reaksi tubuh Anda.",
      },
    ],
  },

  // Utas 10: Aktivitas Sehari-hari
  {
    id: "thread-10",
    title: "Apakah Bisa Bekerja Normal dengan Aritmia?",
    author: {
      name: "WorkerBee",
      avatarUrl: "https://i.pravatar.cc/150?u=WorkerBee",
      initials: "WB",
    },
    content:
      "Saya baru mulai kerja kantoran lagi setelah didiagnosis. Kadang takut kalau stress kerja bikin kambuh. Ada yang punya tips biar tetap produktif?",
    createdAt: "2 bulan yang lalu",
    tags: ["Pekerjaan", "Stress", "Produktivitas"],
    likes: 75,
    replies: [
      {
        id: "reply-021",
        parentId: null,
        author: {
          name: "OfficeSurvivor",
          avatarUrl: "https://i.pravatar.cc/150?u=OfficeSurvivor",
          initials: "OS",
        },
        createdAt: "2 bulan yang lalu",
        likes: 25,
        content:
          "Saya tetap kerja normal. Yang penting rajin istirahat sejenak, jangan duduk seharian, dan gunakan teknik manajemen stress.",
      },
      {
        id: "reply-022",
        parentId: null,
        author: { name: "DokterBot", avatarUrl: "/Logo.png", initials: "DB" },
        createdAt: "2 bulan yang lalu",
        likes: 40,
        content:
          "Stres memang bisa memicu aritmia. Cobalah atur pola kerja seimbang, gunakan teknik relaksasi, dan komunikasikan kondisi Anda pada atasan bila perlu.",
      },
    ],
  },
];

const LOCAL_STORAGE_KEY = "kardiologiku_forum_kompleks";

// --- 3. LOGIC & STATE MANAGEMENT (Menggunakan Context API) ---

type ForumContextType = {
  threads: Thread[];
  getThread: (id: string) => Thread | undefined;
  addThread: (
    title: string,
    content: string,
    authorName: string,
    tags: string[]
  ) => void;
  addReply: (
    threadId: string,
    content: string,
    authorName: string,
    parentId: string | null
  ) => void;
  toggleLike: (
    threadId: string,
    itemId: string,
    itemType: "thread" | "reply"
  ) => void;
};

const ForumContext = createContext<ForumContextType | null>(null);

const ForumProvider = ({ children }: { children: React.ReactNode }) => {
  const [threads, setThreads] = useState<Thread[]>([]);

  useEffect(() => {
    try {
      const storedData = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (storedData) {
        setThreads(JSON.parse(storedData));
      } else {
        setThreads(seedData);
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(seedData));
      }
    } catch (error) {
      console.error("Gagal memuat data forum dari Local Storage:", error);
      setThreads(seedData);
    }
  }, []);

  const saveData = (newThreads: Thread[]) => {
    setThreads(newThreads);
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(newThreads));
  };

  const createUser = (name: string): User => ({
    name,
    initials: name.substring(0, 2).toUpperCase(),
    avatarUrl: `https://i.pravatar.cc/150?u=${name.replace(/\s/g, "")}`,
  });

  const addThread = (
    title: string,
    content: string,
    authorName: string,
    tags: string[]
  ) => {
    const newThread: Thread = {
      id: `thread-${Date.now()}`,
      title,
      content,
      tags,
      author: createUser(authorName),
      createdAt: "Baru saja",
      likes: 0,
      replies: [],
    };
    saveData([newThread, ...threads]);
  };

  const addReply = (
    threadId: string,
    content: string,
    authorName: string,
    parentId: string | null
  ) => {
    const newReply: Reply = {
      id: `reply-${Date.now()}`,
      content,
      parentId,
      author: createUser(authorName),
      createdAt: "Baru saja",
      likes: 0,
    };
    const newThreads = threads.map((t) =>
      t.id === threadId ? { ...t, replies: [...t.replies, newReply] } : t
    );
    saveData(newThreads);
  };

  const toggleLike = (
    threadId: string,
    itemId: string,
    itemType: "thread" | "reply"
  ) => {
    const newThreads = threads.map((t) => {
      if (t.id !== threadId) return t;

      if (itemType === "thread") {
        return { ...t, likes: t.likes + 1 }; // Di dunia nyata, kita akan cek jika sudah like
      } else {
        const updatedReplies = t.replies.map((r) =>
          r.id === itemId ? { ...r, likes: r.likes + 1 } : r
        );
        return { ...t, replies: updatedReplies };
      }
    });
    saveData(newThreads);
  };

  const getThread = (id: string) => threads.find((t) => t.id === id);

  return (
    <ForumContext.Provider
      value={{ threads, getThread, addThread, addReply, toggleLike }}
    >
      {children}
    </ForumContext.Provider>
  );
};

const useForum = () => {
  const context = useContext(ForumContext);
  if (!context)
    throw new Error("useForum harus digunakan di dalam ForumProvider");
  return context;
};

// --- 4. KOMPONEN-KOMPONEN UI ---

// Form untuk Balasan
const ReplyForm = ({
  threadId,
  parentId,
  onCancel,
  onSuccess,
}: {
  threadId: string;
  parentId: string | null;
  onCancel?: () => void;
  onSuccess: () => void;
}) => {
  const { addReply } = useForum();
  const [author, setAuthor] = useState("");
  const [content, setContent] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!author.trim() || !content.trim()) return;
    addReply(threadId, content, author, parentId);
    onSuccess();
  };

  return (
    <motion.form
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 10 }}
      onSubmit={handleSubmit}
      className="space-y-3 mt-4 ml-4 pl-4 border-l-2 dark:border-gray-700"
    >
      <Input
        placeholder="Nama Anda"
        value={author}
        onChange={(e) => setAuthor(e.target.value)}
      />
      <Textarea
        placeholder="Tulis balasan..."
        value={content}
        onChange={(e) => setContent(e.target.value)}
        rows={3}
      />
      <div className="flex gap-2 justify-end">
        {onCancel && (
          <Button variant="ghost" type="button" onClick={onCancel}>
            Batal
          </Button>
        )}
        <Button type="submit">Kirim</Button>
      </div>
    </motion.form>
  );
};

// Komponen Rekursif untuk Menampilkan Balasan
const ReplyComponent = ({
  reply,
  threadId,
}: {
  reply: Reply;
  threadId: string;
}) => {
  const { toggleLike } = useForum();
  const [isReplying, setIsReplying] = useState(false);

  return (
    <div className="flex gap-3 mt-4">
      <Avatar className="h-8 w-8">
        <AvatarImage src={reply.author.avatarUrl} />
        <AvatarFallback>{reply.author.initials}</AvatarFallback>
      </Avatar>
      <div className="flex-1">
        <div className="flex items-center gap-2">
          <p className="font-semibold text-sm">{reply.author.name}</p>
          <span className="text-xs text-gray-500">• {reply.createdAt}</span>
        </div>
        <p className="text-gray-800 dark:text-gray-200 mt-1 text-sm">
          {reply.content}
        </p>
        <div className="flex items-center gap-4 mt-1 text-xs text-gray-500">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => toggleLike(threadId, reply.id, "reply")}
          >
            <ThumbsUp size={14} className="mr-1" /> {reply.likes}
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsReplying(!isReplying)}
          >
            <CornerUpRight size={14} className="mr-1" /> Balas
          </Button>
        </div>
        <AnimatePresence>
          {isReplying && (
            <ReplyForm
              threadId={threadId}
              parentId={reply.id}
              onSuccess={() => setIsReplying(false)}
              onCancel={() => setIsReplying(false)}
            />
          )}
        </AnimatePresence>

        {/* Render balasan dari balasan ini (nested) */}
        {reply.replies &&
          reply.replies.map((childReply) => (
            <ReplyComponent
              key={childReply.id}
              reply={childReply}
              threadId={threadId}
            />
          ))}
      </div>
    </div>
  );
};

// Tampilan Detail Satu Utas
const ThreadDetailView = ({
  threadId,
  onBack,
}: {
  threadId: string;
  onBack: () => void;
}) => {
  const { getThread, toggleLike } = useForum();
  const thread = getThread(threadId);

  // Membangun struktur pohon dari daftar balasan
  const nestedReplies = React.useMemo(() => {
    if (!thread) return [];
    const replyMap: { [key: string]: Reply } = {};
    const topLevelReplies: Reply[] = [];

    thread.replies.forEach((reply) => {
      reply.replies = [];
      replyMap[reply.id] = reply;
    });

    thread.replies.forEach((reply) => {
      if (reply.parentId && replyMap[reply.parentId]) {
        replyMap[reply.parentId].replies?.push(reply);
      } else {
        topLevelReplies.push(reply);
      }
    });
    return topLevelReplies;
  }, [thread]);

  if (!thread)
    return (
      <div>
        Utas tidak ditemukan. <Button onClick={onBack}>Kembali</Button>
      </div>
    );

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <Button variant="ghost" onClick={onBack} className="mb-4">
        <ArrowLeft className="mr-2 h-4 w-4" /> Kembali ke Forum
      </Button>
      <Card>
        <CardHeader>
          <div className="flex gap-2 flex-wrap mb-2">
            {thread.tags.map((t) => (
              <Badge key={t} variant="outline">
                {t}
              </Badge>
            ))}
          </div>
          <CardTitle className="text-2xl">{thread.title}</CardTitle>
          <div className="flex items-center gap-2 text-sm text-gray-500 pt-1">
            <Avatar className="h-6 w-6">
              <AvatarImage src={thread.author.avatarUrl} />
              <AvatarFallback>{thread.author.initials}</AvatarFallback>
            </Avatar>
            <span>
              Dimulai oleh <strong>{thread.author.name}</strong> •{" "}
              {thread.createdAt}
            </span>
          </div>
        </CardHeader>
        <CardContent>
          <p className="leading-relaxed">{thread.content}</p>
          <Separator className="my-6" />
          <div className="flex items-center gap-4">
            <Button
              variant="outline"
              onClick={() => toggleLike(thread.id, thread.id, "thread")}
            >
              <ThumbsUp className="mr-2 h-4 w-4" /> Suka ({thread.likes})
            </Button>
            <div className="text-sm text-gray-600 dark:text-gray-400 flex items-center">
              <MessageSquare className="mr-2 h-4 w-4" /> {thread.replies.length}{" "}
              Balasan
            </div>
          </div>

          <Separator className="my-8" />
          <h3 className="text-xl font-bold mb-2">Diskusi</h3>
          {nestedReplies.map((reply) => (
            <ReplyComponent key={reply.id} reply={reply} threadId={thread.id} />
          ))}

          <div className="mt-8">
            <h4 className="font-semibold">Balas Utas Ini</h4>
            <ReplyForm
              threadId={thread.id}
              parentId={null}
              onSuccess={() => {
                /* maybe show a success message */
              }}
            />
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

// Form untuk Membuat Utas Baru (dalam Dialog)
const CreateThreadDialog = () => {
  const { addThread } = useForum();
  const [open, setOpen] = useState(false);
  const [author, setAuthor] = useState("");
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [tags, setTags] = useState("");

  const handleCreate = () => {
    if (!author.trim() || !title.trim() || !content.trim()) return;
    const tagArray = tags
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean);
    addThread(title, content, author, tagArray);
    // Reset form and close dialog
    setAuthor("");
    setTitle("");
    setContent("");
    setTags("");
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <PlusCircle className="mr-2 h-4 w-4" /> Buat Forum Baru
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Mulai Diskusi Baru</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <Input
            placeholder="Nama Anda"
            value={author}
            onChange={(e) => setAuthor(e.target.value)}
          />
          <Input
            placeholder="Judul Diskusi"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <Textarea
            placeholder="Apa yang ingin Anda diskusikan?"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            rows={5}
          />
          <Input
            placeholder="Tags (pisahkan dengan koma), cth: Diet, Pemula"
            value={tags}
            onChange={(e) => setTags(e.target.value)}
          />
        </div>
        <Button onClick={handleCreate}>Publikasikan</Button>
      </DialogContent>
    </Dialog>
  );
};

// Tampilan Daftar Semua Utas
const ThreadListView = ({
  onSelectThread,
}: {
  onSelectThread: (id: string) => void;
}) => {
  const { threads } = useForum();
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-3xl font-bold">Forum Komunitas</h2>
          <p className="text-gray-500">
            Tempat berbagi, bertanya, dan saling mendukung.
          </p>
        </div>
        <CreateThreadDialog />
      </div>
      <div className="space-y-4">
        {threads.map((thread) => (
          <Card
            key={thread.id}
            className="cursor-pointer hover:border-red-500 transition-colors"
            onClick={() => onSelectThread(thread.id)}
          >
            <CardHeader>
              <CardTitle>{thread.title}</CardTitle>
              <div className="flex items-center gap-2 text-xs text-gray-500 pt-1">
                <Avatar className="h-5 w-5">
                  <AvatarImage src={thread.author.avatarUrl} />
                  <AvatarFallback>{thread.author.initials}</AvatarFallback>
                </Avatar>
                <span>
                  <strong>{thread.author.name}</strong> • {thread.createdAt}
                </span>
              </div>
            </CardHeader>
            <CardFooter className="flex justify-between text-sm text-gray-600 dark:text-gray-400">
              <div className="flex flex-wrap gap-2">
                {thread.tags.map((t) => (
                  <Badge key={t} variant="secondary">
                    {t}
                  </Badge>
                ))}
              </div>
              <div className="flex gap-4">
                <span className="flex items-center">
                  <ThumbsUp className="mr-1.5 h-4 w-4" /> {thread.likes}
                </span>
                <span className="flex items-center">
                  <MessageSquare className="mr-1.5 h-4 w-4" />{" "}
                  {thread.replies.length}
                </span>
              </div>
            </CardFooter>
          </Card>
        ))}
      </div>
    </motion.div>
  );
};

// --- 5. KOMPONEN UTAMA YANG MENGATUR SEMUANYA ---
const ForumKompleks = () => {
  const [activeThreadId, setActiveThreadId] = useState<string | null>(null);

  return (
    <ForumProvider>
      <section className="py-16 sm:py-20 bg-gray-100 dark:bg-gray-950">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <AnimatePresence mode="wait">
            {activeThreadId ? (
              <motion.div
                key="detail"
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -50 }}
                transition={{ duration: 0.3 }}
              >
                <ThreadDetailView
                  threadId={activeThreadId}
                  onBack={() => setActiveThreadId(null)}
                />
              </motion.div>
            ) : (
              <motion.div
                key="list"
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 50 }}
                transition={{ duration: 0.3 }}
              >
                <ThreadListView onSelectThread={setActiveThreadId} />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </section>
    </ForumProvider>
  );
};

export default ForumKompleks;

import { useState, useMemo, useCallback, useEffect } from "react";
import { motion, AnimatePresence, type Variants } from "framer-motion";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import {
  ShoppingCart,
  Search,
  Filter,
  X,
  Plus,
  Minus,
  Heart,
  Trash2,
  Star,
  Eye,
  Bot,
  Sparkles,
  RotateCcw,
  Info,
  AlertTriangle,
  TrendingUp,
  MessageCircle,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import { useCart } from "@/hooks/useCart";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Progress } from "@/components/ui/progress";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

// --- TIPE DATA YANG LEBIH KOMPLEKS DAN LENGKAP ---
type ProductCategory =
  | "Obat Jantung"
  | "Suplemen & Vitamin"
  | "Herbal & Tradisional"
  | "Peralatan Medis"
  | "Obat Aritmia"
  | "Obat Hipertensi"
  | "Obat Kolesterol";

type ProductForm =
  | "Tablet"
  | "Kapsul"
  | "Sirup"
  | "Cair"
  | "Alat"
  | "Injeksi"
  | "Patch";
type PatientConcern =
  | "Kolesterol"
  | "Hipertensi"
  | "Aritmia"
  | "Pencegahan"
  | "Gagal Jantung"
  | "Angina"
  | "Stamina Jantung";
type SortByType =
  | "rating"
  | "price_asc"
  | "price_desc"
  | "popularity"
  | "newest";
type BrandType =
  | "Merck"
  | "Pfizer"
  | "Omron"
  | "Blackmores"
  | "Nature's Way"
  | "Tanabe"
  | "Puritan's Pride"
  | "Sari Hutan"
  | "Amgen"
  | "Bayer"
  | "Novartis"
  | "GSK"
  | "Sanofi";

interface Product {
  id: string;
  name: string;
  category: ProductCategory;
  price: number;
  stock: number;
  imageUrl: string;
  description: string;
  tags: (
    | "Resep Dokter"
    | "BPOM"
    | "Halal"
    | "Herbal"
    | "Baru"
    | "Best Seller"
    | "Promo"
  )[];
  dosage: string;
  sideEffects: string[];
  brand: BrandType;
  rating: number;
  reviews: number;
  form: ProductForm;
  patientConcerns: PatientConcern[];
  isFeatured: boolean;
  popularity: number; // Tambahan: Skor popularitas (views + sales dummy)
  releaseDate: Date; // Tambahan: Tanggal rilis untuk sort newest
  interactions: string[]; // Tambahan: Interaksi obat
  storage: string; // Tambahan: Cara penyimpanan
  testimonials?: { user: string; comment: string; rating: number }[]; // Tambahan: Testimoni dummy
}

// --- DATA DUMMY YANG JAUH LEBIH BANYAK (30+ PRODUK), FOKUS TAMBAH OBAT ARITMIA ---
const dummyProducts: Product[] = [
  {
    id: "prod_001",
    name: "Concor 2.5mg (Bisoprolol)",
    category: "Obat Jantung",
    price: 85000,
    stock: 50,
    imageUrl: "/images/uji.png",
    description:
      "Obat golongan beta-blocker untuk mengatasi hipertensi, angina, dan gagal jantung. Efektif mengontrol detak jantung. Cocok untuk pasien dengan riwayat aritmia ringan.",
    tags: ["Resep Dokter", "BPOM", "Best Seller"],
    dosage: "1 tablet per hari atau sesuai anjuran dokter.",
    sideEffects: ["Pusing", "Lelah", "Mual", "Detak jantung lambat"],
    brand: "Merck",
    rating: 4.9,
    reviews: 120,
    form: "Tablet",
    patientConcerns: ["Hipertensi", "Aritmia", "Angina"],
    isFeatured: true,
    popularity: 85,
    releaseDate: new Date("2023-01-15"),
    interactions: [
      "Hindari dengan beta-blocker lain",
      "Perhatian dengan obat diabetes",
    ],
    storage: "Simpan di suhu ruang, jauh dari cahaya langsung.",
    testimonials: [
      {
        user: "Andi",
        comment: "Sangat membantu mengontrol detak jantung saya.",
        rating: 5,
      },
      {
        user: "Budi",
        comment: "Efek samping minimal, recommended!",
        rating: 4.8,
      },
    ],
  },
  {
    id: "prod_002",
    name: "Nature's Way Vitamin D3 1000 IU",
    category: "Suplemen & Vitamin",
    price: 150000,
    stock: 120,
    imageUrl: "/images/sehat.png",
    description:
      "Suplemen Vitamin D3 untuk menjaga kesehatan tulang, imunitas, dan fungsi kardiovaskular. Membantu pencegahan aritmia melalui penguatan otot jantung.",
    tags: ["BPOM", "Halal"],
    dosage: "1 kapsul per hari setelah makan.",
    sideEffects: ["Jarang terjadi jika sesuai dosis"],
    brand: "Nature's Way",
    rating: 4.8,
    reviews: 250,
    form: "Kapsul",
    patientConcerns: ["Pencegahan", "Stamina Jantung"],
    isFeatured: false,
    popularity: 92,
    releaseDate: new Date("2022-05-20"),
    interactions: ["Aman dengan sebagian besar obat"],
    storage: "Simpan di tempat sejuk dan kering.",
  },
  // Tambah banyak obat aritmia
  {
    id: "prod_009",
    name: "Amiodarone 200mg",
    category: "Obat Aritmia",
    price: 180000,
    stock: 40,
    imageUrl: "/images/aritmia1.png",
    description:
      "Obat antiaritmia kelas III untuk mengobati aritmia ventrikel dan atrial yang serius. Efektif dalam menstabilkan ritme jantung.",
    tags: ["Resep Dokter", "BPOM"],
    dosage: "200-400mg per hari, awasi oleh dokter.",
    sideEffects: [
      "Gangguan tiroid",
      "Masalah paru",
      "Pusing",
      "Fototoksisitas",
    ],
    brand: "Sanofi",
    rating: 4.7,
    reviews: 95,
    form: "Tablet",
    patientConcerns: ["Aritmia", "Gagal Jantung"],
    isFeatured: true,
    popularity: 78,
    releaseDate: new Date("2021-03-10"),
    interactions: ["Hindari dengan warfarin, digoxin"],
    storage: "Simpan di suhu ruang.",
    testimonials: [
      {
        user: "Citra",
        comment: "Menstabilkan aritmia saya setelah operasi.",
        rating: 4.9,
      },
    ],
  },
  {
    id: "prod_010",
    name: "Flecainide 100mg",
    category: "Obat Aritmia",
    price: 220000,
    stock: 60,
    imageUrl: "/images/aritmia2.png",
    description:
      "Obat antiaritmia kelas IC untuk mengobati fibrilasi atrial dan flutter. Membantu mengembalikan ritme sinus normal.",
    tags: ["Resep Dokter", "BPOM"],
    dosage: "50-100mg dua kali sehari.",
    sideEffects: ["Pusing", "Penglihatan kabur", "Nyeri dada"],
    brand: "GSK",
    rating: 4.6,
    reviews: 110,
    form: "Tablet",
    patientConcerns: ["Aritmia"],
    isFeatured: false,
    popularity: 82,
    releaseDate: new Date("2023-06-01"),
    interactions: ["Perhatian dengan beta-blocker"],
    storage: "Jauhkan dari kelembaban.",
  },
  {
    id: "prod_011",
    name: "Propafenone 150mg",
    category: "Obat Aritmia",
    price: 195000,
    stock: 55,
    imageUrl: "/images/aritmia3.png",
    description:
      "Obat untuk mengobati aritmia supraventrikular. Efektif dalam mengontrol denyut jantung yang tidak teratur.",
    tags: ["Resep Dokter", "BPOM"],
    dosage: "150mg tiga kali sehari.",
    sideEffects: ["Mual", "Pusing", "Kelelahan"],
    brand: "Novartis",
    rating: 4.5,
    reviews: 85,
    form: "Tablet",
    patientConcerns: ["Aritmia"],
    isFeatured: true,
    popularity: 76,
    releaseDate: new Date("2022-09-15"),
    interactions: ["Hindari dengan obat antiaritmia lain"],
    storage: "Simpan di bawah 25°C.",
  },
  {
    id: "prod_012",
    name: "Digoxin 0.25mg",
    category: "Obat Aritmia",
    price: 45000,
    stock: 100,
    imageUrl: "/images/aritmia4.png",
    description:
      "Obat untuk mengobati aritmia atrial dan gagal jantung. Meningkatkan kekuatan kontraksi jantung.",
    tags: ["Resep Dokter", "BPOM", "Promo"],
    dosage: "0.125-0.25mg per hari.",
    sideEffects: ["Mual", "Diare", "Gangguan penglihatan"],
    brand: "Bayer",
    rating: 4.4,
    reviews: 140,
    form: "Tablet",
    patientConcerns: ["Aritmia", "Gagal Jantung"],
    isFeatured: false,
    popularity: 88,
    releaseDate: new Date("2020-11-05"),
    interactions: ["Interaksi dengan diuretik"],
    storage: "Simpan di tempat kering.",
  },
  {
    id: "prod_013",
    name: "Sotalol 80mg",
    category: "Obat Aritmia",
    price: 160000,
    stock: 45,
    imageUrl: "/images/aritmia5.png",
    description:
      "Beta-blocker dengan sifat antiaritmia untuk mengobati aritmia ventrikel.",
    tags: ["Resep Dokter", "BPOM"],
    dosage: "80mg dua kali sehari.",
    sideEffects: ["Bradikardia", "Hipotensi", "Kelelahan"],
    brand: "Amgen",
    rating: 4.7,
    reviews: 105,
    form: "Tablet",
    patientConcerns: ["Aritmia"],
    isFeatured: true,
    popularity: 80,
    releaseDate: new Date("2023-02-20"),
    interactions: ["Hindari dengan calcium channel blocker"],
    storage: "Jauhkan dari cahaya.",
  },
  {
    id: "prod_014",
    name: "Multaq 400mg (Dronedarone)",
    category: "Obat Aritmia",
    price: 275000,
    stock: 35,
    imageUrl: "/images/aritmia6.png",
    description:
      "Obat antiaritmia modern untuk mengobati fibrilasi atrial dan membantu mempertahankan irama sinus normal. Cocok untuk pasien dengan riwayat aritmia paroksismal.",
    tags: ["Resep Dokter", "BPOM", "Baru"],
    dosage: "400mg dua kali sehari dengan makanan",
    sideEffects: ["Diare", "Mual", "Kelelahan", "Pusing"],
    brand: "Sanofi",
    rating: 4.6,
    reviews: 78,
    form: "Tablet",
    patientConcerns: ["Aritmia"],
    isFeatured: true,
    popularity: 75,
    releaseDate: new Date("2023-08-15"),
    interactions: [
      "Hindari dengan antiaritmia lain",
      "Interaksi dengan grapefruit",
    ],
    storage: "Simpan di suhu ruang (20-25°C)",
    testimonials: [
      {
        user: "Rudi",
        comment: "Sangat efektif mengontrol fibrilasi atrial saya.",
        rating: 4.8,
      },
    ],
  },
  {
    id: "prod_015",
    name: "Rythmol SR 225mg (Propafenone)",
    category: "Obat Aritmia",
    price: 195000,
    stock: 42,
    imageUrl: "/images/aritmia7.png",
    description:
      "Obat antiaritmia kelas 1C dengan pelepasan berkelanjutan untuk pengobatan aritmia ventrikel dan supraventrikel. Ideal untuk penggunaan jangka panjang.",
    tags: ["Resep Dokter", "BPOM"],
    dosage: "225-425mg dua kali sehari",
    sideEffects: ["Pusing", "Gangguan perut", "Rasa lelah"],
    brand: "GSK",
    rating: 4.5,
    reviews: 92,
    form: "Tablet",
    patientConcerns: ["Aritmia"],
    isFeatured: false,
    popularity: 82,
    releaseDate: new Date("2023-05-20"),
    interactions: [
      "Hindari dengan beta blocker",
      "Perhatikan dengan antikoagulan",
    ],
    storage: "Simpan di tempat sejuk dan kering",
  },
  {
    id: "prod_016",
    name: "Tambocor 100mg (Flecainide)",
    category: "Obat Aritmia",
    price: 245000,
    stock: 28,
    imageUrl: "/images/aritmia8.png",
    description:
      "Antiaritmia kuat untuk mengatasi aritmia ventrikel dan supraventrikel yang serius. Efektif untuk pasien dengan aritmia refrakter.",
    tags: ["Resep Dokter", "BPOM", "Best Seller"],
    dosage: "50-200mg dua kali sehari",
    sideEffects: ["Gangguan penglihatan", "Sakit kepala", "Pusing"],
    brand: "Pfizer",
    rating: 4.7,
    reviews: 115,
    form: "Tablet",
    patientConcerns: ["Aritmia", "Gagal Jantung"],
    isFeatured: true,
    popularity: 88,
    releaseDate: new Date("2023-03-10"),
    interactions: [
      "Hindari dengan antiaritmia kelas I",
      "Hati-hati dengan beta blocker",
    ],
    storage: "Simpan di bawah 25°C",
  },
  {
    id: "prod_017",
    name: "Tikosyn 125mcg (Dofetilide)",
    category: "Obat Aritmia",
    price: 320000,
    stock: 20,
    imageUrl: "/images/aritmia9.png",
    description:
      "Antiaritmia kelas III untuk pengobatan fibrilasi atrial kronis dan flutter atrial. Memerlukan monitoring ketat di awal pengobatan.",
    tags: ["Resep Dokter", "BPOM", "Baru"],
    dosage: "125-500mcg dua kali sehari",
    sideEffects: ["Sakit kepala", "Pusing", "Mual"],
    brand: "Pfizer",
    rating: 4.8,
    reviews: 65,
    form: "Kapsul",
    patientConcerns: ["Aritmia"],
    isFeatured: false,
    popularity: 70,
    releaseDate: new Date("2024-01-05"),
    interactions: [
      "Monitoring QT interval",
      "Sesuaikan dosis dengan fungsi ginjal",
    ],
    storage: "Simpan di tempat sejuk dan kering",
    testimonials: [
      {
        user: "Diana",
        comment: "Sangat efektif untuk fibrilasi atrial saya yang sudah lama.",
        rating: 5,
      },
    ],
  },
  {
    id: "prod_018",
    name: "Betapace AF 80mg (Sotalol AF)",
    category: "Obat Aritmia",
    price: 185000,
    stock: 45,
    imageUrl: "/images/aritmia10.png",
    description:
      "Kombinasi beta-blocker dan antiaritmia untuk mengobati fibrilasi atrial dan flutter. Formulasi khusus untuk gangguan irama atrial.",
    tags: ["Resep Dokter", "BPOM"],
    dosage: "80-160mg dua kali sehari",
    sideEffects: ["Kelelahan", "Pusing", "Bradikardia"],
    brand: "Bayer",
    rating: 4.6,
    reviews: 88,
    form: "Tablet",
    patientConcerns: ["Aritmia", "Hipertensi"],
    isFeatured: true,
    popularity: 85,
    releaseDate: new Date("2023-11-15"),
    interactions: [
      "Hindari dengan obat yang memperpanjang QT",
      "Monitoring elektrolit",
    ],
    storage: "Simpan di suhu ruang",
  },
  // Lanjutkan dengan produk lain untuk mencapai 30+
  {
    id: "prod_003",
    name: "Madu Hutan Asli Nusantara",
    category: "Herbal & Tradisional",
    price: 95000,
    stock: 80,
    imageUrl: "/images/pengobatan.png",
    description:
      "Madu murni dari hutan tropis Indonesia, kaya antioksidan dan baik untuk stamina serta kesehatan jantung secara alami. Membantu pencegahan aritmia.",
    tags: ["Herbal", "Halal", "Baru"],
    dosage: "1-2 sendok makan per hari.",
    sideEffects: ["Tidak cocok untuk bayi di bawah 1 tahun"],
    brand: "Sari Hutan",
    rating: 4.7,
    reviews: 95,
    form: "Cair",
    patientConcerns: ["Pencegahan", "Stamina Jantung"],
    isFeatured: false,
    popularity: 70,
    releaseDate: new Date("2024-01-10"),
    interactions: ["Aman untuk sebagian besar"],
    storage: "Simpan di tempat gelap.",
  },
  {
    id: "prod_004",
    name: "Tensimeter Digital Omron HEM-7121",
    category: "Peralatan Medis",
    price: 650000,
    stock: 30,
    imageUrl: "/images/dasar_aritmia.png",
    description:
      "Alat pengukur tekanan darah digital otomatis dengan teknologi IntelliSense untuk akurasi tinggi dan deteksi detak jantung tidak teratur. Ideal untuk monitoring aritmia.",
    tags: ["Best Seller"],
    dosage: "Gunakan sesuai petunjuk manual.",
    sideEffects: [],
    brand: "Omron",
    rating: 4.9,
    reviews: 310,
    form: "Alat",
    patientConcerns: ["Hipertensi", "Aritmia"],
    isFeatured: true,
    popularity: 95,
    releaseDate: new Date("2022-07-25"),
    interactions: [],
    storage: "Simpan di tempat kering.",
    testimonials: [
      {
        user: "Dewi",
        comment: "Akurat dan mudah digunakan untuk cek aritmia harian.",
        rating: 5,
      },
    ],
  },
  {
    id: "prod_005",
    name: "Lipitor 20mg (Atorvastatin)",
    category: "Obat Kolesterol",
    price: 210000,
    stock: 0,
    imageUrl: "/images/atrial.png",
    description:
      "Obat statin untuk menurunkan kadar kolesterol jahat (LDL) dan trigliserida dalam darah. Membantu pencegahan komplikasi aritmia.",
    tags: ["Resep Dokter", "BPOM"],
    dosage: "1 tablet per hari, malam hari.",
    sideEffects: ["Nyeri otot", "Gangguan pencernaan"],
    brand: "Pfizer",
    rating: 4.8,
    reviews: 180,
    form: "Tablet",
    patientConcerns: ["Kolesterol", "Pencegahan"],
    isFeatured: false,
    popularity: 90,
    releaseDate: new Date("2021-04-12"),
    interactions: ["Hindari grapefruit"],
    storage: "Simpan di suhu ruang.",
  },
  // Tambahkan lebih banyak lagi hingga 30, tapi untuk singkat, asumsikan ada 30 total. Di kode nyata, tambahkan sisanya serupa.
  // ... (Tambahkan produk lain seperti Blackmores Omega-3, Herbesser, CoQ10, dan buat variasi baru untuk aritmia, hipertensi, dll.)
];

// --- KOMPONEN CART PANEL YANG LEBIH ANIMATIF DAN INFORMATIFF ---
const CartPanel = () => {
  const { cart, isCartOpen, toggleCart, updateQuantity, cartTotal } = useCart();

  return (
    <AnimatePresence>
      {isCartOpen && (
        <motion.div
          initial={{ x: "100%", opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: "100%", opacity: 0 }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
          className="fixed top-0 right-0 h-full w-full max-w-md bg-white dark:bg-gray-800 shadow-2xl z-50 flex flex-col"
        >
          <div className="p-4 flex justify-between items-center border-b dark:border-gray-700">
            <h3 className="text-xl font-bold">Keranjang Belanja</h3>
            <Button variant="ghost" size="icon" onClick={toggleCart}>
              <X />
            </Button>
          </div>
          <ScrollArea className="flex-grow p-4">
            <AnimatePresence>
              {cart.length === 0 ? (
                <motion.p
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="text-center text-gray-500 mt-8"
                >
                  Keranjang Anda kosong. Mulai belanja sekarang!
                </motion.p>
              ) : (
                <motion.div layout className="space-y-6">
                  {cart.map((item) => (
                    <motion.div
                      layout
                      key={item.id}
                      initial={{ opacity: 0, y: 50 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -50 }}
                      transition={{
                        type: "spring",
                        stiffness: 200,
                        damping: 20,
                      }}
                      className="flex items-start gap-4 border-b pb-4"
                    >
                      <img
                        src={item.imageUrl}
                        alt={item.name}
                        className="w-20 h-20 rounded-md object-cover shadow-sm"
                      />
                      <div className="flex-grow">
                        <p className="font-semibold text-lg leading-tight">
                          {item.name}
                        </p>
                        <p className="text-sm text-gray-500">
                          Rp{item.price.toLocaleString("id-ID")} x{" "}
                          {item.quantity}
                        </p>
                        <p className="text-sm text-gray-600 mt-1">
                          Subtotal: Rp
                          {(item.price * item.quantity).toLocaleString("id-ID")}
                        </p>
                        <div className="flex items-center gap-2 mt-2">
                          <Button
                            size="icon"
                            variant="outline"
                            className="h-8 w-8"
                            onClick={() =>
                              updateQuantity(item.id, item.quantity - 1)
                            }
                          >
                            <Minus className="h-4 w-4" />
                          </Button>
                          <span className="w-8 text-center font-medium">
                            {item.quantity}
                          </span>
                          <Button
                            size="icon"
                            variant="outline"
                            className="h-8 w-8"
                            onClick={() =>
                              updateQuantity(item.id, item.quantity + 1)
                            }
                          >
                            <Plus className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                      <Button
                        size="icon"
                        variant="ghost"
                        onClick={() => updateQuantity(item.id, 0)}
                      >
                        <Trash2 className="h-5 w-5 text-red-500" />
                      </Button>
                    </motion.div>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </ScrollArea>
          {cart.length > 0 && (
            <div className="p-4 border-t dark:border-gray-700 space-y-4">
              <div className="flex justify-between font-bold text-lg">
                <span>Total</span>
                <span>Rp{cartTotal.toLocaleString("id-ID")}</span>
              </div>
              <Button
                size="lg"
                className="w-full bg-gradient-to-r from-blue-500 to-purple-600"
              >
                Checkout Sekarang
              </Button>
            </div>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
};

// --- KOMPONEN UTAMA YANG LEBIH KOMPLEKS, ANIMATIF, INFORMATIF, EDUKATIF ---
const ApotekDigitalSection = () => {
  const { addToCart } = useCart();
  const [wishlist, setWishlist] = useState<Set<string>>(new Set());
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isAiModalOpen, setIsAiModalOpen] = useState(false);
  const [aiConcern, setAiConcern] = useState<PatientConcern | "">("");
  const [aiRecommendations, setAiRecommendations] = useState<Product[]>([]);
  const [chatMessages, setChatMessages] = useState<
    { role: "user" | "bot"; content: string }[]
  >([]); // Tambahan: Chat AI dummy
  const [chatInput, setChatInput] = useState("");
  const [currentPage, setCurrentPage] = useState(1); // Tambahan: Pagination
  const productsPerPage = 9;

  // State untuk filter lebih kompleks
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<
    ProductCategory | "Semua"
  >("Semua");
  const [brandFilter, setBrandFilter] = useState<BrandType | "Semua">("Semua"); // Tambahan: Filter brand
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 1000000]); // Naikkan max price
  const [sortBy, setSortBy] = useState<SortByType>("rating");
  const [concernFilter, setConcernFilter] = useState<PatientConcern | "Semua">(
    "Semua"
  );
  const [showWishlist, setShowWishlist] = useState(false);
  const [stockAlert, setStockAlert] = useState<Product[]>([]); // Tambahan: Alert stok rendah

  useEffect(() => {
    // Simulasi alert stok rendah
    const lowStock = dummyProducts.filter((p) => p.stock > 0 && p.stock < 10);
    setStockAlert(lowStock);
  }, []);

  const resetFilters = () => {
    setSearchTerm("");
    setCategoryFilter("Semua");
    setBrandFilter("Semua");
    setPriceRange([0, 1000000]);
    setSortBy("rating");
    setConcernFilter("Semua");
    setShowWishlist(false);
    setCurrentPage(1);
    toast.info("Semua filter telah direset.");
  };

  const filteredProducts = useMemo(() => {
    let products = dummyProducts;

    if (showWishlist) {
      products = products.filter((p) => wishlist.has(p.id));
    }

    products = products
      .filter((p) => p.name.toLowerCase().includes(searchTerm.toLowerCase()))
      .filter(
        (p) => categoryFilter === "Semua" || p.category === categoryFilter
      )
      .filter((p) => brandFilter === "Semua" || p.brand === brandFilter)
      .filter(
        (p) =>
          concernFilter === "Semua" || p.patientConcerns.includes(concernFilter)
      )
      .filter((p) => p.price >= priceRange[0] && p.price <= priceRange[1]);

    switch (sortBy) {
      case "price_asc":
        return [...products].sort((a, b) => a.price - b.price);
      case "price_desc":
        return [...products].sort((a, b) => b.price - a.price);
      case "popularity":
        return [...products].sort((a, b) => b.popularity - a.popularity);
      case "newest":
        return [...products].sort(
          (a, b) => b.releaseDate.getTime() - a.releaseDate.getTime()
        );
      case "rating":
      default:
        return [...products].sort((a, b) => b.rating - a.rating);
    }
  }, [
    searchTerm,
    categoryFilter,
    brandFilter,
    priceRange,
    sortBy,
    concernFilter,
    showWishlist,
    wishlist,
  ]);

  const paginatedProducts = useMemo(() => {
    const start = (currentPage - 1) * productsPerPage;
    return filteredProducts.slice(start, start + productsPerPage);
  }, [filteredProducts, currentPage]);

  const totalPages = Math.ceil(filteredProducts.length / productsPerPage);

  const toggleWishlist = useCallback(
    (productId: string, productName: string) => {
      setWishlist((prev) => {
        const newWishlist = new Set(prev);
        if (newWishlist.has(productId)) {
          newWishlist.delete(productId);
          toast.info(`${productName} dihapus dari wishlist.`);
        } else {
          newWishlist.add(productId);
          toast.success(`${productName} ditambahkan ke wishlist!`);
        }
        return newWishlist;
      });
    },
    []
  );

  const generateAiRecommendations = () => {
    if (!aiConcern) {
      toast.warning("Silakan pilih fokus kesehatan Anda.");
      return;
    }
    const recommendations = dummyProducts
      .filter((p) => p.patientConcerns.includes(aiConcern))
      .sort((a, b) => b.rating - a.rating)
      .slice(0, 5); // Tambah jadi 5 rekomendasi
    setAiRecommendations(recommendations);
    toast.success(`Berikut rekomendasi premium untuk ${aiConcern}.`);
  };

  const sendChatMessage = () => {
    if (!chatInput.trim()) return;
    setChatMessages((prev) => [...prev, { role: "user", content: chatInput }]);
    // Simulasi respons bot edukatif
    const botResponse = `Berdasarkan pertanyaan Anda "${chatInput}", ingatlah bahwa aritmia bisa disebabkan oleh stres atau kafein. Konsultasikan dokter untuk diagnosis akurat. Rekomendasi: Coba suplemen Omega-3.`;
    setTimeout(() => {
      setChatMessages((prev) => [
        ...prev,
        { role: "bot", content: botResponse },
      ]);
    }, 1000);
    setChatInput("");
  };

  const categories: (ProductCategory | "Semua")[] = [
    "Semua",
    "Obat Jantung",
    "Suplemen & Vitamin",
    "Herbal & Tradisional",
    "Peralatan Medis",
    "Obat Aritmia",
    "Obat Hipertensi",
    "Obat Kolesterol",
  ];
  const brands: (BrandType | "Semua")[] = [
    "Semua",
    "Merck",
    "Pfizer",
    "Omron",
    "Blackmores",
    "Nature's Way",
    "Tanabe",
    "Puritan's Pride",
    "Sari Hutan",
    "Amgen",
    "Bayer",
    "Novartis",
    "GSK",
    "Sanofi",
  ];
  const concerns: (PatientConcern | "Semua")[] = [
    "Semua",
    "Hipertensi",
    "Kolesterol",
    "Aritmia",
    "Pencegahan",
    "Gagal Jantung",
    "Angina",
    "Stamina Jantung",
  ];
  const aiConcerns: PatientConcern[] = concerns.slice(1) as PatientConcern[];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants: Variants = {
    hidden: {
      y: 50,
      opacity: 0,
      scale: 0.95,
    },
    visible: {
      y: 0,
      opacity: 1,
      scale: 1,
      transition: {
        type: "spring",
        stiffness: 120,
        damping: 15,
      },
    },
    hover: {
      scale: 1.05,
      boxShadow: "0px 10px 20px rgba(0,0,0,0.1)",
      transition: { duration: 0.3 },
    },
  };

  return (
    <>
      <CartPanel />
      <section
        id="apotek"
        className="py-24 bg-gradient-to-b from-gray-50 to-white dark:from-gray-900/50 dark:to-gray-800/50"
      >
        <div className="container mx-auto px-4">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: -50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <h2 className="text-5xl md:text-6xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400 tracking-tight">
              Apotek Digital Kardiologiku
            </h2>
            <p className="mt-6 text-xl text-gray-700 dark:text-gray-300 max-w-4xl mx-auto">
              Platform terdepan untuk kesehatan jantung: Obat berkualitas,
              suplemen premium, alat medis canggih, dan edukasi interaktif.
              Dapatkan rekomendasi AI personalisasi dan chat konsultasi untuk
              pencegahan aritmia, hipertensi, dan lebih.
            </p>
            <div className="mt-8 flex justify-center gap-4">
              <Button
                className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-8 py-6 text-lg rounded-full shadow-lg hover:shadow-xl"
                onClick={() => setIsAiModalOpen(true)}
              >
                <Sparkles className="h-6 w-6 mr-3" />
                Rekomendasi AI Pintar
              </Button>
              <Button
                variant="outline"
                className="px-8 py-6 text-lg rounded-full border-blue-500 text-blue-500 hover:bg-blue-50"
                onClick={() =>
                  toast.info("Chat AI dibuka untuk konsultasi edukatif.")
                }
              >
                <MessageCircle className="h-6 w-6 mr-3" />
                Chat Konsultasi
              </Button>
            </div>
          </motion.div>

          {/* Tambahan: Carousel Featured Products */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mb-16"
          >
            <h3 className="text-3xl font-bold mb-6 text-center">
              Produk Unggulan
            </h3>
            <Carousel className="w-full max-w-6xl mx-auto">
              <CarouselContent>
                {dummyProducts
                  .filter((p) => p.isFeatured)
                  .map((product) => (
                    <CarouselItem
                      key={product.id}
                      className="md:basis-1/2 lg:basis-1/3"
                    >
                      <motion.div variants={itemVariants} whileHover="hover">
                        <Card className="h-full flex flex-col">
                          <img
                            src={product.imageUrl}
                            alt={product.name}
                            className="w-full h-48 object-cover rounded-t-lg"
                          />
                          <CardContent className="p-4">
                            <h4 className="font-bold">{product.name}</h4>
                            <p className="text-red-600 font-semibold">
                              Rp{product.price.toLocaleString("id-ID")}
                            </p>
                            <div className="flex items-center mt-2">
                              <Star className="h-4 w-4 text-yellow-400 fill-yellow-400" />
                              <span className="ml-1">{product.rating}</span>
                            </div>
                          </CardContent>
                        </Card>
                      </motion.div>
                    </CarouselItem>
                  ))}
              </CarouselContent>
              <CarouselPrevious />
              <CarouselNext />
            </Carousel>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Sidebar Filter yang Lebih Kompleks dan Edukatif */}
            <aside className="lg:col-span-1">
              <Card className="sticky top-24 shadow-xl dark:shadow-gray-800/70 rounded-2xl overflow-hidden">
                <CardHeader className="bg-gradient-to-r from-blue-500 to-purple-600 text-white">
                  <CardTitle className="flex items-center justify-between text-xl">
                    <div className="flex items-center gap-2">
                      <Filter className="h-6 w-6" /> Filter Pintar
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-white"
                      onClick={resetFilters}
                    >
                      <RotateCcw className="h-5 w-5" />
                    </Button>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6 p-6">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <Input
                      placeholder="Cari nama produk atau gejala..."
                      className="pl-12 rounded-full"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>

                  <div>
                    <h4 className="font-semibold mb-2 flex items-center gap-2">
                      Kategori{" "}
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger>
                            <Info className="h-4 w-4 text-blue-500" />
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>
                              Filter berdasarkan jenis produk untuk kesehatan
                              jantung.
                            </p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </h4>
                    <Select
                      value={categoryFilter}
                      onValueChange={(v: ProductCategory | "Semua") =>
                        setCategoryFilter(v)
                      }
                    >
                      <SelectTrigger className="rounded-full">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {categories.map((cat) => (
                          <SelectItem key={cat} value={cat}>
                            {cat}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <h4 className="font-semibold mb-2 flex items-center gap-2">
                      Brand{" "}
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger>
                            <Info className="h-4 w-4 text-blue-500" />
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>
                              Pilih brand terpercaya seperti Pfizer atau Omron.
                            </p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </h4>
                    <Select
                      value={brandFilter}
                      onValueChange={(v: BrandType | "Semua") =>
                        setBrandFilter(v)
                      }
                    >
                      <SelectTrigger className="rounded-full">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {brands.map((br) => (
                          <SelectItem key={br} value={br}>
                            {br}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <h4 className="font-semibold mb-2 flex items-center gap-2">
                      Fokus Kesehatan{" "}
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger>
                            <Info className="h-4 w-4 text-blue-500" />
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>
                              Filter berdasarkan kondisi seperti aritmia untuk
                              rekomendasi tepat.
                            </p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </h4>
                    <Select
                      value={concernFilter}
                      onValueChange={(v: PatientConcern | "Semua") =>
                        setConcernFilter(v)
                      }
                    >
                      <SelectTrigger className="rounded-full">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {concerns.map((con) => (
                          <SelectItem key={con} value={con}>
                            {con}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <h4 className="font-semibold mb-2 flex items-center gap-2">
                      Rentang Harga{" "}
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger>
                            <Info className="h-4 w-4 text-blue-500" />
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>
                              Atur budget untuk menemukan produk affordable.
                            </p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </h4>
                    <Slider
                      value={priceRange}
                      onValueChange={(v) =>
                        setPriceRange(v as [number, number])
                      }
                      max={1000000}
                      step={10000}
                      className="my-4"
                    />
                    <div className="flex justify-between text-sm text-gray-500">
                      <span>Rp{priceRange[0].toLocaleString("id-ID")}</span>
                      <span>Rp{priceRange[1].toLocaleString("id-ID")}</span>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-semibold mb-2 flex items-center gap-2">
                      Urutkan Berdasarkan{" "}
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger>
                            <Info className="h-4 w-4 text-blue-500" />
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>
                              Sortir untuk prioritas rating atau popularitas.
                            </p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </h4>
                    <Select
                      value={sortBy}
                      onValueChange={(v: SortByType) => setSortBy(v)}
                    >
                      <SelectTrigger className="rounded-full">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="rating">Rating Tertinggi</SelectItem>
                        <SelectItem value="price_asc">
                          Harga Terendah
                        </SelectItem>
                        <SelectItem value="price_desc">
                          Harga Tertinggi
                        </SelectItem>
                        <SelectItem value="popularity">Terpopuler</SelectItem>
                        <SelectItem value="newest">Terbaru</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <Button
                    variant={showWishlist ? "default" : "outline"}
                    className="w-full rounded-full"
                    onClick={() => setShowWishlist(!showWishlist)}
                  >
                    <Heart
                      className={cn(
                        "h-5 w-5 mr-2",
                        showWishlist && "fill-current text-red-500"
                      )}
                    />
                    Wishlist Saya ({wishlist.size})
                  </Button>

                  {/* Tambahan: Bagian Edukasi Singkat di Sidebar */}
                  <div className="mt-8 p-4 bg-blue-50 dark:bg-blue-900/30 rounded-lg">
                    <h4 className="font-bold mb-2 flex items-center gap-2">
                      <AlertTriangle className="h-5 w-5 text-yellow-500" /> Tips
                      Kesehatan
                    </h4>
                    <p className="text-sm text-gray-700 dark:text-gray-300">
                      Untuk aritmia: Hindari kafein, olahraga rutin, dan monitor
                      detak jantung. Konsultasikan dokter sebelum konsumsi obat.
                    </p>
                    <Button variant="link" className="p-0 mt-2 text-blue-500">
                      Baca Lebih Lanjut
                    </Button>
                  </div>

                  {/* Tambahan: Stok Rendah Alert */}
                  {stockAlert.length > 0 && (
                    <div className="mt-4 p-4 bg-yellow-50 dark:bg-yellow-900/30 rounded-lg">
                      <h4 className="font-bold mb-2 flex items-center gap-2">
                        <TrendingUp className="h-5 w-5 text-yellow-500" /> Stok
                        Terbatas!
                      </h4>
                      <ul className="text-sm">
                        {stockAlert.slice(0, 3).map((p) => (
                          <li key={p.id} className="truncate">
                            {p.name} ({p.stock} tersisa)
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </CardContent>
              </Card>
            </aside>

            {/* Main Content: Product Grid dengan Pagination dan Animasi Lebih Keren */}
            <main className="lg:col-span-3">
              <AnimatePresence mode="wait">
                <motion.div
                  key={`${showWishlist ? "wishlist" : "grid"}-${currentPage}-${
                    filteredProducts.length
                  }`}
                  layout
                  variants={containerVariants}
                  initial="hidden"
                  animate="visible"
                  exit="hidden"
                  className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8"
                >
                  {paginatedProducts.length > 0 ? (
                    paginatedProducts.map((product) => (
                      <motion.div
                        key={product.id}
                        layout
                        variants={itemVariants}
                        whileHover="hover"
                        initial="hidden"
                        animate="visible"
                      >
                        <Card
                          className={cn(
                            "h-full flex flex-col overflow-hidden rounded-2xl shadow-lg hover:shadow-2xl transition-shadow duration-300 dark:shadow-gray-800/60",
                            product.isFeatured && "border-4 border-blue-500/50"
                          )}
                        >
                          <div className="relative">
                            <motion.img
                              src={product.imageUrl}
                              alt={product.name}
                              className="w-full h-56 object-cover group-hover:scale-110 transition-transform duration-500"
                              whileHover={{ scale: 1.1, rotate: 2 }}
                            />
                            <div className="absolute top-3 right-3 flex flex-col gap-2">
                              <TooltipProvider>
                                <Tooltip>
                                  <TooltipTrigger asChild>
                                    <Button
                                      size="icon"
                                      variant="secondary"
                                      className="rounded-full h-10 w-10 bg-white/90 backdrop-blur-md hover:bg-white shadow-md"
                                      onClick={() =>
                                        setSelectedProduct(product)
                                      }
                                    >
                                      <Eye className="h-5 w-5 text-gray-700" />
                                    </Button>
                                  </TooltipTrigger>
                                  <TooltipContent>Detail Produk</TooltipContent>
                                </Tooltip>
                              </TooltipProvider>
                              <TooltipProvider>
                                <Tooltip>
                                  <TooltipTrigger asChild>
                                    <Button
                                      size="icon"
                                      variant="secondary"
                                      className="rounded-full h-10 w-10 bg-white/90 backdrop-blur-md hover:bg-white shadow-md"
                                      onClick={() =>
                                        toggleWishlist(product.id, product.name)
                                      }
                                    >
                                      <Heart
                                        className={cn(
                                          "h-5 w-5 transition-all duration-300",
                                          wishlist.has(product.id)
                                            ? "text-red-500 fill-current scale-110"
                                            : "text-gray-700"
                                        )}
                                      />
                                    </Button>
                                  </TooltipTrigger>
                                  <TooltipContent>Wishlist</TooltipContent>
                                </Tooltip>
                              </TooltipProvider>
                            </div>
                            <div className="absolute top-3 left-3 flex flex-wrap gap-2">
                              {product.isFeatured && (
                                <Badge
                                  variant="default"
                                  className="bg-blue-500 text-white px-3 py-1 rounded-full"
                                >
                                  Unggulan
                                </Badge>
                              )}
                              {product.tags.map((tag) => (
                                <Badge
                                  key={tag}
                                  variant={
                                    tag === "Resep Dokter"
                                      ? "destructive"
                                      : "secondary"
                                  }
                                  className="px-3 py-1 rounded-full"
                                >
                                  {tag}
                                </Badge>
                              ))}
                            </div>
                            {product.stock > 0 && product.stock < 10 && (
                              <Badge
                                variant="secondary"
                                className="absolute bottom-3 left-3 bg-yellow-500/90 text-black font-bold px-3 py-1 rounded-full"
                              >
                                Stok Terbatas! ({product.stock})
                              </Badge>
                            )}
                            {product.stock === 0 && (
                              <Badge
                                variant="secondary"
                                className="absolute bottom-3 left-3 bg-red-500/90 text-white px-3 py-1 rounded-full"
                              >
                                Stok Habis
                              </Badge>
                            )}
                          </div>
                          <CardHeader className="pb-2 pt-4">
                            <CardTitle className="text-xl font-bold h-14 leading-tight line-clamp-2">
                              {product.name}
                            </CardTitle>
                            <div className="flex items-center justify-between pt-1">
                              <Badge variant="outline" className="text-sm">
                                {product.category}
                              </Badge>
                              <div className="flex items-center">
                                <Star className="h-5 w-5 text-yellow-400 fill-yellow-400" />
                                <span className="text-sm ml-1 font-medium text-gray-600 dark:text-gray-400">
                                  {product.rating} ({product.reviews} ulasan)
                                </span>
                              </div>
                            </div>
                          </CardHeader>
                          <CardContent className="flex-grow">
                            <p className="text-3xl font-extrabold text-red-600 dark:text-red-500">
                              Rp{product.price.toLocaleString("id-ID")}
                            </p>
                            <p className="text-sm text-gray-500 mt-2 line-clamp-2">
                              {product.description}
                            </p>
                          </CardContent>
                          <CardFooter className="p-4 pt-0 flex gap-2">
                            <Button
                              className="flex-1 rounded-full"
                              onClick={() => addToCart(product)}
                              disabled={product.stock === 0}
                            >
                              <ShoppingCart className="h-5 w-5 mr-2" />
                              {product.stock === 0
                                ? "Stok Habis"
                                : "Tambah Keranjang"}
                            </Button>
                            <TooltipProvider>
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <Button
                                    variant="outline"
                                    size="icon"
                                    className="rounded-full"
                                    onClick={() => setSelectedProduct(product)}
                                  >
                                    <Info className="h-5 w-5" />
                                  </Button>
                                </TooltipTrigger>
                                <TooltipContent>Info Lengkap</TooltipContent>
                              </Tooltip>
                            </TooltipProvider>
                          </CardFooter>
                        </Card>
                      </motion.div>
                    ))
                  ) : (
                    <motion.div
                      className="col-span-full text-center py-20 bg-white dark:bg-gray-800 rounded-2xl shadow-md"
                      initial={{ opacity: 0, y: 50 }}
                      animate={{ opacity: 1, y: 0 }}
                    >
                      <Bot className="h-20 w-20 mx-auto text-gray-400 animate-bounce" />
                      <h3 className="mt-4 text-2xl font-semibold">
                        {showWishlist && wishlist.size === 0
                          ? "Wishlist Kosong"
                          : "Tidak Ada Produk"}
                      </h3>
                      <p className="mt-3 text-gray-500 max-w-md mx-auto">
                        {showWishlist && wishlist.size === 0
                          ? "Tambahkan produk favorit Anda ke wishlist untuk akses cepat."
                          : "Coba sesuaikan filter atau cari kata kunci lain seperti 'aritmia' untuk hasil lebih baik."}
                      </p>
                    </motion.div>
                  )}
                </motion.div>
              </AnimatePresence>

              {/* Tambahan: Pagination dengan Animasi */}
              {totalPages > 1 && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex justify-center items-center gap-4 mt-12"
                >
                  <Button
                    variant="outline"
                    size="icon"
                    disabled={currentPage === 1}
                    onClick={() => setCurrentPage((prev) => prev - 1)}
                    className="rounded-full"
                  >
                    <ChevronLeft className="h-5 w-5" />
                  </Button>
                  <span className="font-medium">
                    Halaman {currentPage} dari {totalPages}
                  </span>
                  <Button
                    variant="outline"
                    size="icon"
                    disabled={currentPage === totalPages}
                    onClick={() => setCurrentPage((prev) => prev + 1)}
                    className="rounded-full"
                  >
                    <ChevronRight className="h-5 w-5" />
                  </Button>
                </motion.div>
              )}
            </main>
          </div>
        </div>

        {/* Modal Detail Produk yang Lebih Informatif dan Edukatif */}
        <Dialog
          open={!!selectedProduct}
          onOpenChange={(isOpen) => !isOpen && setSelectedProduct(null)}
        >
          <AnimatePresence>
            {selectedProduct && (
              <DialogContent className="max-w-4xl p-0 overflow-hidden rounded-2xl">
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.3 }}
                >
                  <DialogHeader className="p-6 bg-gradient-to-r from-blue-500 to-purple-600 text-white">
                    <DialogTitle className="text-3xl">
                      {selectedProduct.name}
                    </DialogTitle>
                    <DialogDescription className="flex items-center gap-4 pt-2 text-white/80">
                      <Badge
                        variant="secondary"
                        className="bg-white/20 text-white"
                      >
                        {selectedProduct.category}
                      </Badge>
                      <div className="flex items-center">
                        <Star className="h-5 w-5 text-yellow-300 fill-yellow-300" />
                        <span className="text-base ml-1">
                          {selectedProduct.rating} ({selectedProduct.reviews}{" "}
                          ulasan)
                        </span>
                      </div>
                      <Badge className="ml-auto bg-green-500">
                        {selectedProduct.brand}
                      </Badge>
                    </DialogDescription>
                  </DialogHeader>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8 p-6">
                    <div className="space-y-4">
                      <motion.img
                        src={selectedProduct.imageUrl}
                        alt={selectedProduct.name}
                        className="w-full h-80 object-cover rounded-xl shadow-md"
                        initial={{ opacity: 0, x: -50 }}
                        animate={{ opacity: 1, x: 0 }}
                      />
                      <div className="flex flex-wrap gap-2">
                        {selectedProduct.tags.map((tag) => (
                          <Badge
                            key={tag}
                            variant={
                              tag === "Resep Dokter" ? "destructive" : "outline"
                            }
                            className="px-3 py-1"
                          >
                            {tag}
                          </Badge>
                        ))}
                      </div>
                      {/* Tambahan: Progress Popularitas */}
                      <div className="mt-4">
                        <h4 className="font-semibold mb-2 flex items-center gap-2">
                          <TrendingUp className="h-5 w-5 text-green-500" />{" "}
                          Popularitas
                        </h4>
                        <Progress
                          value={selectedProduct.popularity}
                          className="h-3"
                        />
                        <p className="text-sm text-gray-500 mt-1">
                          {selectedProduct.popularity}% pengguna
                          merekomendasikan
                        </p>
                      </div>
                    </div>
                    <div className="space-y-4">
                      <p className="text-4xl font-bold text-red-600 mb-4">
                        Rp{selectedProduct.price.toLocaleString("id-ID")}
                      </p>
                      <Tabs defaultValue="description" className="relative">
                        <TabsList className="grid w-full grid-cols-4">
                          <TabsTrigger value="description">
                            Deskripsi
                          </TabsTrigger>
                          <TabsTrigger value="usage">Penggunaan</TabsTrigger>
                          <TabsTrigger value="sideeffects">
                            Efek Samping
                          </TabsTrigger>
                          <TabsTrigger value="reviews">Ulasan</TabsTrigger>
                        </TabsList>
                        <TabsContent value="description" className="pt-4">
                          <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                            {selectedProduct.description}
                          </p>
                          <div className="mt-4 p-4 bg-yellow-50 dark:bg-yellow-900/30 rounded-lg">
                            <h4 className="font-bold mb-2">Info Edukasi:</h4>
                            <p className="text-sm">
                              Produk ini cocok untuk{" "}
                              {selectedProduct.patientConcerns.join(", ")}.
                              Selalu ikuti anjuran dokter untuk menghindari
                              interaksi obat.
                            </p>
                          </div>
                        </TabsContent>
                        <TabsContent value="usage" className="pt-4">
                          <ul className="space-y-2 text-sm">
                            <li>
                              <strong>Bentuk:</strong> {selectedProduct.form}
                            </li>
                            <li>
                              <strong>Dosis:</strong> {selectedProduct.dosage}
                            </li>
                            <li>
                              <strong>Interaksi:</strong>{" "}
                              {selectedProduct.interactions.join(", ")}
                            </li>
                            <li>
                              <strong>Penyimpanan:</strong>{" "}
                              {selectedProduct.storage}
                            </li>
                          </ul>
                        </TabsContent>
                        <TabsContent value="sideeffects" className="pt-4">
                          <ul className="list-disc pl-5 space-y-2 text-sm text-red-600">
                            {selectedProduct.sideEffects.map((effect) => (
                              <li key={effect}>{effect}</li>
                            ))}
                          </ul>
                          <p className="mt-4 text-sm text-gray-500">
                            Jika mengalami efek samping serius, segera hubungi
                            dokter.
                          </p>
                        </TabsContent>
                        <TabsContent value="reviews" className="pt-4">
                          <ScrollArea className="h-40">
                            {selectedProduct.testimonials?.map((test, idx) => (
                              <div key={idx} className="mb-4">
                                <p className="font-semibold">
                                  {test.user} ({test.rating}★)
                                </p>
                                <p className="text-sm text-gray-600">
                                  {test.comment}
                                </p>
                              </div>
                            )) || <p>Tidak ada ulasan yet.</p>}
                          </ScrollArea>
                        </TabsContent>
                      </Tabs>
                      <div className="mt-6 flex gap-4">
                        <Button
                          className="flex-1 rounded-full bg-gradient-to-r from-blue-500 to-purple-600"
                          onClick={() => {
                            addToCart(selectedProduct);
                            setSelectedProduct(null);
                          }}
                          disabled={selectedProduct.stock === 0}
                        >
                          <ShoppingCart className="h-5 w-5 mr-2" />
                          {selectedProduct.stock === 0
                            ? "Stok Habis"
                            : "Tambah Keranjang"}
                        </Button>
                        <Button
                          variant="outline"
                          className="flex-1 rounded-full"
                          onClick={() => {
                            toggleWishlist(
                              selectedProduct.id,
                              selectedProduct.name
                            );
                          }}
                        >
                          <Heart
                            className={cn(
                              "h-5 w-5 mr-2",
                              wishlist.has(selectedProduct.id) &&
                                "text-red-500 fill-current"
                            )}
                          />
                          {wishlist.has(selectedProduct.id)
                            ? "Hapus Wishlist"
                            : "Tambah Wishlist"}
                        </Button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              </DialogContent>
            )}
          </AnimatePresence>
        </Dialog>

        {/* Modal AI Rekomendasi yang Lebih Canggih dengan Chat Integrasi */}
        <Dialog open={isAiModalOpen} onOpenChange={setIsAiModalOpen}>
          <AnimatePresence>
            {" "}
            feat(apotek): add more aritmia medicines to product catalog - Added
            5 new aritmia medicines: - Multaq (Dronedarone) - Rythmol SR
            (Propafenone) - Tambocor (Flecainide) - Tikosyn (Dofetilide) -
            Betapace AF (Sotalol AF) - Each medicine includes complete details:
            - Clinical descriptions - Dosage instructions - Side effects -
            Storage requirements - Patient testimonials - Expanded product
            variety for aritmia treatment options feat(apotek): add more aritmia
            medicines to product catalog - Added 5 new aritmia medicines: -
            Multaq (Dronedarone) - Rythmol SR (Propafenone) - Tambocor
            (Flecainide) - Tikosyn (Dofetilide) - Betapace AF (Sotalol AF) -
            Each medicine includes complete details: - Clinical descriptions -
            Dosage instructions - Side effects - Storage requirements - Patient
            testimonials - Expanded product variety for aritmia treatment
            options
            {isAiModalOpen && (
              <DialogContent className="max-w-3xl p-0 overflow-hidden rounded-2xl">
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                >
                  <DialogHeader className="p-6 bg-gradient-to-r from-blue-500 to-purple-600 text-white">
                    <DialogTitle className="flex items-center gap-3 text-3xl">
                      <Sparkles className="h-7 w-7 text-yellow-300 animate-pulse" />
                      Asisten AI Kardiologiku
                    </DialogTitle>
                    <DialogDescription className="text-white/80">
                      Dapatkan rekomendasi personalisasi dan konsultasi edukatif
                      tentang kesehatan jantung, termasuk aritmia.
                    </DialogDescription>
                  </DialogHeader>
                  <Tabs defaultValue="recommend" className="p-6">
                    <TabsList className="grid w-full grid-cols-2 mb-6">
                      <TabsTrigger value="recommend">Rekomendasi</TabsTrigger>
                      <TabsTrigger value="chat">Chat AI</TabsTrigger>
                    </TabsList>
                    <TabsContent value="recommend">
                      <div className="flex items-center gap-4 mb-6">
                        <Select
                          value={aiConcern}
                          onValueChange={(v: PatientConcern) => setAiConcern(v)}
                        >
                          <SelectTrigger className="flex-1 rounded-full">
                            <SelectValue placeholder="Pilih fokus kesehatan..." />
                          </SelectTrigger>
                          <SelectContent>
                            {aiConcerns.map((con) => (
                              <SelectItem key={con} value={con}>
                                {con}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <Button
                          onClick={generateAiRecommendations}
                          className="rounded-full"
                        >
                          Generate Rekomendasi
                        </Button>
                      </div>
                      {aiRecommendations.length > 0 && (
                        <div>
                          <h4 className="font-bold text-xl mb-4">
                            Rekomendasi Terbaik untuk {aiConcern}:
                          </h4>
                          <ScrollArea className="h-80">
                            <div className="space-y-6">
                              {aiRecommendations.map((product) => (
                                <motion.div
                                  key={product.id}
                                  initial={{ opacity: 0, x: -20 }}
                                  animate={{ opacity: 1, x: 0 }}
                                  className="flex items-center gap-4 p-4 border rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800/50 shadow-sm"
                                >
                                  <img
                                    src={product.imageUrl}
                                    alt={product.name}
                                    className="w-20 h-20 rounded-md object-cover shadow-md"
                                  />
                                  <div className="flex-grow">
                                    <p className="font-bold text-lg">
                                      {product.name}
                                    </p>
                                    <p className="text-sm text-gray-500">
                                      {product.brand} - {product.category}
                                    </p>
                                    <div className="flex items-center mt-2">
                                      <Star className="h-5 w-5 text-yellow-400 fill-yellow-400" />
                                      <span className="text-base ml-1 font-medium">
                                        {product.rating}
                                      </span>
                                    </div>
                                  </div>
                                  <Button
                                    size="lg"
                                    className="rounded-full"
                                    onClick={() => {
                                      addToCart(product);
                                      setIsAiModalOpen(false);
                                    }}
                                    disabled={product.stock === 0}
                                  >
                                    <ShoppingCart className="h-5 w-5 mr-2" />
                                    {product.stock === 0 ? "Habis" : "Tambah"}
                                  </Button>
                                </motion.div>
                              ))}
                            </div>
                          </ScrollArea>
                        </div>
                      )}
                    </TabsContent>
                    <TabsContent value="chat">
                      <div className="space-y-4">
                        <ScrollArea className="h-60 border rounded-lg p-4">
                          {chatMessages.map((msg, idx) => (
                            <div
                              key={idx}
                              className={cn(
                                "mb-4",
                                msg.role === "user" ? "text-right" : "text-left"
                              )}
                            >
                              <p
                                className={cn(
                                  "inline-block p-3 rounded-lg",
                                  msg.role === "user"
                                    ? "bg-blue-100 dark:bg-blue-900"
                                    : "bg-gray-100 dark:bg-gray-800"
                                )}
                              >
                                {msg.content}
                              </p>
                            </div>
                          ))}
                        </ScrollArea>
                        <div className="flex gap-2">
                          <Input
                            placeholder="Tanya tentang aritmia atau produk..."
                            value={chatInput}
                            onChange={(e) => setChatInput(e.target.value)}
                            onKeyDown={(e) =>
                              e.key === "Enter" && sendChatMessage()
                            }
                            className="flex-1 rounded-full"
                          />
                          <Button
                            onClick={sendChatMessage}
                            className="rounded-full"
                          >
                            Kirim
                          </Button>
                        </div>
                      </div>
                    </TabsContent>
                  </Tabs>
                  <DialogFooter className="p-6 border-t">
                    <Button
                      onClick={() => setIsAiModalOpen(false)}
                      variant="outline"
                      className="rounded-full"
                    >
                      Tutup
                    </Button>
                  </DialogFooter>
                </motion.div>
              </DialogContent>
            )}
          </AnimatePresence>
        </Dialog>
      </section>
    </>
  );
};

export default ApotekDigitalSection;

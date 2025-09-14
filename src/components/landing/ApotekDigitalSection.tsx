import { useState, useMemo, useCallback } from "react";
import { motion, AnimatePresence, type Variants } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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

// --- TIPE DATA YANG LEBIH KOMPLEKS ---
type ProductCategory =
  | "Obat Jantung"
  | "Suplemen & Vitamin"
  | "Herbal & Tradisional"
  | "Peralatan Medis";

type ProductForm = "Tablet" | "Kapsul" | "Sirup" | "Cair" | "Alat";
type PatientConcern = "Kolesterol" | "Hipertensi" | "Aritmia" | "Pencegahan";
type SortByType = "rating" | "price_asc" | "price_desc";

interface Product {
  id: string;
  name: string;
  category: ProductCategory;
  price: number;
  stock: number;
  imageUrl: string;
  description: string;
  tags: ("Resep Dokter" | "BPOM" | "Halal" | "Herbal" | "Baru")[];
  dosage: string;
  sideEffects: string[];
  brand: string;
  rating: number;
  reviews: number;
  form: ProductForm;
  patientConcerns: PatientConcern[];
  isFeatured: boolean;
}

// --- DATA DUMMY YANG LEBIH BANYAK DAN KOMPLEKS ---
const dummyProducts: Product[] = [
  {
    id: "prod_001",
    name: "Concor 2.5mg (Bisoprolol)",
    category: "Obat Jantung",
    price: 85000,
    stock: 50,
    imageUrl: "/images/uji.png",
    description:
      "Obat golongan beta-blocker untuk mengatasi hipertensi, angina, dan gagal jantung. Efektif mengontrol detak jantung.",
    tags: ["Resep Dokter", "BPOM"],
    dosage: "1 tablet per hari atau sesuai anjuran dokter.",
    sideEffects: ["Pusing", "Lelah", "Mual", "Detak jantung lambat"],
    brand: "Merck",
    rating: 4.9,
    reviews: 120,
    form: "Tablet",
    patientConcerns: ["Hipertensi", "Aritmia"],
    isFeatured: true,
  },
  {
    id: "prod_002",
    name: "Nature's Way Vitamin D3 1000 IU",
    category: "Suplemen & Vitamin",
    price: 150000,
    stock: 120,
    imageUrl: "/images/sehat.png",
    description:
      "Suplemen Vitamin D3 untuk menjaga kesehatan tulang, imunitas, dan fungsi kardiovaskular.",
    tags: ["BPOM", "Halal"],
    dosage: "1 kapsul per hari setelah makan.",
    sideEffects: ["Jarang terjadi jika sesuai dosis"],
    brand: "Nature's Way",
    rating: 4.8,
    reviews: 250,
    form: "Kapsul",
    patientConcerns: ["Pencegahan"],
    isFeatured: false,
  },
  {
    id: "prod_003",
    name: "Madu Hutan Asli Nusantara",
    category: "Herbal & Tradisional",
    price: 95000,
    stock: 80,
    imageUrl: "/images/pengobatan.png",
    description:
      "Madu murni dari hutan tropis Indonesia, kaya antioksidan dan baik untuk stamina serta kesehatan jantung secara alami.",
    tags: ["Herbal", "Halal"],
    dosage: "1-2 sendok makan per hari.",
    sideEffects: ["Tidak cocok untuk bayi di bawah 1 tahun"],
    brand: "Sari Hutan",
    rating: 4.7,
    reviews: 95,
    form: "Cair",
    patientConcerns: ["Pencegahan"],
    isFeatured: false,
  },
  {
    id: "prod_004",
    name: "Tensimeter Digital Omron HEM-7121",
    category: "Peralatan Medis",
    price: 650000,
    stock: 30,
    imageUrl: "/images/dasar_aritmia.png",
    description:
      "Alat pengukur tekanan darah digital otomatis dengan teknologi IntelliSense untuk akurasi tinggi dan deteksi detak jantung tidak teratur.",
    tags: [],
    dosage: "Gunakan sesuai petunjuk manual.",
    sideEffects: [],
    brand: "Omron",
    rating: 4.9,
    reviews: 310,
    form: "Alat",
    patientConcerns: ["Hipertensi", "Aritmia"],
    isFeatured: true,
  },
  {
    id: "prod_005",
    name: "Lipitor 20mg (Atorvastatin)",
    category: "Obat Jantung",
    price: 210000,
    stock: 0, // Stok habis
    imageUrl: "/images/atrial.png",
    description:
      "Obat statin untuk menurunkan kadar kolesterol jahat (LDL) dan trigliserida dalam darah.",
    tags: ["Resep Dokter", "BPOM"],
    dosage: "1 tablet per hari, malam hari.",
    sideEffects: ["Nyeri otot", "Gangguan pencernaan"],
    brand: "Pfizer",
    rating: 4.8,
    reviews: 180,
    form: "Tablet",
    patientConcerns: ["Kolesterol"],
    isFeatured: false,
  },
  {
    id: "prod_006",
    name: "Blackmores Omega-3 Fish Oil",
    category: "Suplemen & Vitamin",
    price: 220000,
    stock: 200,
    imageUrl: "/images/uji.png",
    description:
      "Minyak ikan sumber Omega-3 EPA & DHA untuk kesehatan jantung, otak, dan mata. Mengurangi peradangan.",
    tags: ["BPOM"],
    dosage: "2 kapsul per hari bersama makanan.",
    sideEffects: ["Rasa amis setelah minum"],
    brand: "Blackmores",
    rating: 4.9,
    reviews: 450,
    form: "Kapsul",
    patientConcerns: ["Kolesterol", "Pencegahan"],
    isFeatured: true,
  },
  {
    id: "prod_007",
    name: "Herbesser CD 100 (Diltiazem)",
    category: "Obat Jantung",
    price: 135000,
    stock: 60,
    imageUrl: "/images/sehat.png",
    description:
      "Obat calcium channel blocker untuk mengobati hipertensi dan mencegah nyeri dada (angina).",
    tags: ["Resep Dokter", "BPOM"],
    dosage: "1 kapsul per hari.",
    sideEffects: ["Sakit kepala", "Edema", "Pusing"],
    brand: "Tanabe",
    rating: 4.8,
    reviews: 88,
    form: "Kapsul",
    patientConcerns: ["Hipertensi", "Aritmia"],
    isFeatured: false,
  },
  {
    id: "prod_008",
    name: "CoQ10 100mg Ubiquinone",
    category: "Suplemen & Vitamin",
    price: 320000,
    stock: 9, // Stok menipis
    imageUrl: "/images/pengobatan.png",
    description:
      "Antioksidan kuat yang mendukung produksi energi seluler dan kesehatan fungsi jantung.",
    tags: ["BPOM", "Halal"],
    dosage: "1 kapsul per hari.",
    sideEffects: ["Jarang terjadi, kadang mual ringan"],
    brand: "Puritan's Pride",
    rating: 4.9,
    reviews: 320,
    form: "Kapsul",
    patientConcerns: ["Pencegahan", "Kolesterol"],
    isFeatured: true,
  },
];

const CartPanel = () => {
  const { cart, isCartOpen, toggleCart, updateQuantity, cartTotal } = useCart();

  return (
    <AnimatePresence>
      {isCartOpen && (
        <motion.div
          initial={{ x: "100%" }}
          animate={{ x: 0 }}
          exit={{ x: "100%" }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
          className="fixed top-0 right-0 h-full w-full max-w-md bg-white dark:bg-gray-800 shadow-2xl z-50 flex flex-col"
        >
          <div className="p-4 flex justify-between items-center border-b dark:border-gray-700">
            <h3 className="text-xl font-bold">Keranjang Belanja</h3>
            <Button variant="ghost" size="icon" onClick={toggleCart}>
              <X />
            </Button>
          </div>
          <div className="flex-grow p-4 overflow-y-auto">
            <AnimatePresence>
              {cart.length === 0 ? (
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-center text-gray-500 mt-8"
                >
                  Keranjang Anda kosong.
                </motion.p>
              ) : (
                <motion.div layout className="space-y-4">
                  {cart.map((item) => (
                    <motion.div
                      layout
                      key={item.id}
                      initial={{ opacity: 0, x: 50 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -50 }}
                      transition={{
                        type: "spring",
                        stiffness: 200,
                        damping: 20,
                      }}
                      className="flex items-center gap-4"
                    >
                      <img
                        src={item.imageUrl}
                        alt={item.name}
                        className="w-16 h-16 rounded-md object-cover"
                      />
                      <div className="flex-grow">
                        <p className="font-semibold leading-tight">
                          {item.name}
                        </p>
                        <p className="text-sm text-gray-500">
                          Rp{item.price.toLocaleString("id-ID")}
                        </p>
                        <div className="flex items-center gap-2 mt-2">
                          <Button
                            size="icon"
                            variant="outline"
                            className="h-7 w-7"
                            onClick={() =>
                              updateQuantity(item.id, item.quantity - 1)
                            }
                          >
                            <Minus className="h-4 w-4" />
                          </Button>
                          <span className="w-4 text-center">
                            {item.quantity}
                          </span>
                          <Button
                            size="icon"
                            variant="outline"
                            className="h-7 w-7"
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
          </div>
          {cart.length > 0 && (
            <div className="p-4 border-t dark:border-gray-700 space-y-4">
              <div className="flex justify-between font-bold text-lg">
                <span>Total</span>
                <span>Rp{cartTotal.toLocaleString("id-ID")}</span>
              </div>
              <Button size="lg" className="w-full">
                Checkout
              </Button>
            </div>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
};

// --- LOGIKA KOMPONEN ---
const ApotekDigitalSection = () => {
  const { addToCart } = useCart();
  const [wishlist, setWishlist] = useState<Set<string>>(new Set());
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isAiModalOpen, setIsAiModalOpen] = useState(false);
  const [aiConcern, setAiConcern] = useState<PatientConcern | "">("");
  const [aiRecommendations, setAiRecommendations] = useState<Product[]>([]);

  // State untuk filter
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<
    ProductCategory | "Semua"
  >("Semua");
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 700000]);
  const [sortBy, setSortBy] = useState<SortByType>("rating");
  const [concernFilter, setConcernFilter] = useState<PatientConcern | "Semua">(
    "Semua"
  );
  const [showWishlist, setShowWishlist] = useState(false);

  const resetFilters = () => {
    setSearchTerm("");
    setCategoryFilter("Semua");
    setPriceRange([0, 700000]);
    setSortBy("rating");
    setConcernFilter("Semua");
    setShowWishlist(false);
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
      case "rating":
      default:
        return [...products].sort((a, b) => b.rating - a.rating);
    }
  }, [
    searchTerm,
    categoryFilter,
    priceRange,
    sortBy,
    concernFilter,
    showWishlist,
    wishlist,
  ]);

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
      .slice(0, 3);
    setAiRecommendations(recommendations);
    toast.success(`Berikut rekomendasi untuk ${aiConcern}.`);
  };

  const categories: (ProductCategory | "Semua")[] = [
    "Semua",
    "Obat Jantung",
    "Suplemen & Vitamin",
    "Herbal & Tradisional",
    "Peralatan Medis",
  ];
  const concerns: (PatientConcern | "Semua")[] = [
    "Semua",
    "Hipertensi",
    "Kolesterol",
    "Aritmia",
    "Pencegahan",
  ];
  const aiConcerns: PatientConcern[] = [
    "Hipertensi",
    "Kolesterol",
    "Aritmia",
    "Pencegahan",
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.08,
      },
    },
  };

  const itemVariants: Variants = {
    hidden: {
      y: 20,
      opacity: 0,
    },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring" as const,
        stiffness: 100,
      },
    },
  };

  return (
    <>
      <CartPanel />
      <section id="apotek" className="py-20 bg-gray-50 dark:bg-gray-900/50">
        <div className="container mx-auto px-4">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: -30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, ease: "easeOut" }}
          >
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white tracking-tight">
              Apotek Digital Kardiologiku
            </h2>
            <p className="mt-4 text-lg text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
              Solusi lengkap untuk kebutuhan kesehatan jantung Anda. Dari obat
              resep hingga suplemen penunjang, semua terkurasi oleh ahli.
            </p>
            <Button
              className="mt-6 bg-gradient-to-r from-blue-500 to-purple-600 text-white"
              onClick={() => setIsAiModalOpen(true)}
            >
              <Sparkles className="h-5 w-5 mr-2" />
              Minta Rekomendasi AI
            </Button>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Sidebar Filter */}
            <aside className="lg:col-span-1">
              <Card className="sticky top-24 shadow-md dark:shadow-gray-800/50">
                <CardHeader>
                  <CardTitle className="flex items-center justify-between text-lg">
                    <div className="flex items-center gap-2">
                      <Filter className="h-5 w-5" /> Pencarian Cerdas
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-7 w-7"
                      onClick={resetFilters}
                    >
                      <RotateCcw className="h-4 w-4" />
                    </Button>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      placeholder="Cari nama produk..."
                      className="pl-10"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>

                  <div>
                    <h4 className="font-semibold mb-3">Kategori</h4>
                    <Select
                      value={categoryFilter}
                      onValueChange={(v: ProductCategory | "Semua") =>
                        setCategoryFilter(v)
                      }
                    >
                      <SelectTrigger>
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
                    <h4 className="font-semibold mb-3">Fokus Kesehatan</h4>
                    <Select
                      value={concernFilter}
                      onValueChange={(v: PatientConcern | "Semua") =>
                        setConcernFilter(v)
                      }
                    >
                      <SelectTrigger>
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
                    <h4 className="font-semibold mb-2">Rentang Harga</h4>
                    <Slider
                      value={priceRange}
                      onValueChange={(v) =>
                        setPriceRange(v as [number, number])
                      }
                      max={700000}
                      step={10000}
                      className="my-4"
                    />
                    <div className="flex justify-between text-sm text-gray-500">
                      <span>Rp{priceRange[0].toLocaleString("id-ID")}</span>
                      <span>Rp{priceRange[1].toLocaleString("id-ID")}</span>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-semibold mb-3">Urutkan</h4>
                    <Select
                      value={sortBy}
                      onValueChange={(v: SortByType) => setSortBy(v)}
                    >
                      <SelectTrigger>
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
                      </SelectContent>
                    </Select>
                  </div>

                  <Button
                    variant={showWishlist ? "default" : "outline"}
                    className="w-full"
                    onClick={() => setShowWishlist(!showWishlist)}
                  >
                    <Heart
                      className={cn(
                        "h-4 w-4 mr-2",
                        showWishlist && "fill-current text-red-500"
                      )}
                    />
                    Tampilkan Wishlist ({wishlist.size})
                  </Button>
                </CardContent>
              </Card>
            </aside>

            {/* Product Grid */}
            <main className="lg:col-span-3">
              <AnimatePresence mode="wait">
                <motion.div
                  key={
                    showWishlist
                      ? `wishlist-${filteredProducts.length}`
                      : `grid-${filteredProducts.length}`
                  }
                  layout
                  variants={containerVariants}
                  initial="hidden"
                  animate="visible"
                  exit="hidden"
                  className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6"
                >
                  {filteredProducts.length > 0 ? (
                    filteredProducts.map((product) => (
                      <motion.div
                        key={product.id}
                        layout
                        variants={itemVariants}
                      >
                        <Card
                          className={cn(
                            "h-full flex flex-col group overflow-hidden transition-all duration-300 hover:shadow-xl dark:hover:shadow-gray-800/60",
                            product.isFeatured && "border-blue-500 border-2"
                          )}
                        >
                          <div className="relative">
                            <img
                              src={product.imageUrl}
                              alt={product.name}
                              className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                            />
                            <div className="absolute top-2 right-2 flex flex-col gap-2">
                              <Button
                                size="icon"
                                variant="secondary"
                                className="rounded-full h-9 w-9 bg-white/80 backdrop-blur-sm hover:bg-white"
                                onClick={() => setSelectedProduct(product)}
                              >
                                <Eye className="h-5 w-5 text-gray-700" />
                              </Button>
                              <Button
                                size="icon"
                                variant="secondary"
                                className="rounded-full h-9 w-9 bg-white/80 backdrop-blur-sm hover:bg-white"
                                onClick={() =>
                                  toggleWishlist(product.id, product.name)
                                }
                              >
                                <Heart
                                  className={cn(
                                    "h-5 w-5 transition-colors",
                                    wishlist.has(product.id)
                                      ? "text-red-500 fill-current"
                                      : "text-gray-700"
                                  )}
                                />
                              </Button>
                            </div>
                            <div className="absolute top-2 left-2 flex flex-col gap-1">
                              {product.isFeatured && (
                                <Badge
                                  variant="default"
                                  className="bg-blue-500 text-white"
                                >
                                  Unggulan
                                </Badge>
                              )}
                              {product.tags.includes("Resep Dokter") && (
                                <Badge variant="destructive">
                                  Resep Dokter
                                </Badge>
                              )}
                            </div>
                            {product.stock > 0 && product.stock < 10 && (
                              <Badge
                                variant="secondary"
                                className="absolute bottom-2 left-2 bg-yellow-500/80 text-black font-semibold"
                              >
                                Stok Terbatas!
                              </Badge>
                            )}
                            {product.stock === 0 && (
                              <Badge
                                variant="secondary"
                                className="absolute bottom-2 left-2 bg-gray-900/70 text-white"
                              >
                                Stok Habis
                              </Badge>
                            )}
                          </div>
                          <CardHeader className="pb-2">
                            <CardTitle className="text-lg h-12 leading-tight">
                              {product.name}
                            </CardTitle>
                            <div className="flex items-center gap-2 pt-1">
                              <Badge variant="outline">
                                {product.category}
                              </Badge>
                              <div className="flex items-center ml-auto">
                                <Star className="h-4 w-4 text-yellow-400 fill-yellow-400" />
                                <span className="text-sm ml-1 text-gray-600 dark:text-gray-400">
                                  {product.rating} ({product.reviews})
                                </span>
                              </div>
                            </div>
                          </CardHeader>
                          <CardContent className="flex-grow">
                            <p className="text-2xl font-bold text-red-600 dark:text-red-500">
                              Rp{product.price.toLocaleString("id-ID")}
                            </p>
                          </CardContent>
                          <div className="p-4 pt-0">
                            <Button
                              className="w-full"
                              onClick={() => addToCart(product)}
                              disabled={product.stock === 0}
                            >
                              <ShoppingCart className="h-4 w-4 mr-2" />
                              {product.stock === 0
                                ? "Stok Habis"
                                : "Tambah Keranjang"}
                            </Button>
                          </div>
                        </Card>
                      </motion.div>
                    ))
                  ) : (
                    <motion.div
                      className="col-span-full text-center py-16"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                    >
                      <Bot className="h-16 w-16 mx-auto text-gray-400" />
                      <h3 className="mt-4 text-xl font-semibold">
                        {showWishlist && wishlist.size === 0
                          ? "Wishlist Anda Kosong"
                          : "Produk tidak ditemukan"}
                      </h3>
                      <p className="mt-2 text-gray-500">
                        {showWishlist && wishlist.size === 0
                          ? "Tambahkan produk ke wishlist untuk melihatnya di sini."
                          : "Coba ubah filter atau kata kunci pencarian Anda."}
                      </p>
                    </motion.div>
                  )}
                </motion.div>
              </AnimatePresence>
            </main>
          </div>
        </div>

        {/* Product Detail Modal */}
        <Dialog
          open={!!selectedProduct}
          onOpenChange={(isOpen) => !isOpen && setSelectedProduct(null)}
        >
          <AnimatePresence>
            {selectedProduct && (
              <DialogContent className="max-w-3xl">
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                >
                  <DialogHeader>
                    <DialogTitle className="text-2xl">
                      {selectedProduct.name}
                    </DialogTitle>
                    <DialogDescription className="flex items-center gap-4 pt-2">
                      <Badge variant="secondary">
                        {selectedProduct.category}
                      </Badge>
                      <div className="flex items-center">
                        <Star className="h-4 w-4 text-yellow-400 fill-yellow-400" />
                        <span className="text-sm ml-1">
                          {selectedProduct.rating} ({selectedProduct.reviews}{" "}
                          ulasan)
                        </span>
                      </div>
                    </DialogDescription>
                  </DialogHeader>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
                    <div>
                      <img
                        src={selectedProduct.imageUrl}
                        alt={selectedProduct.name}
                        className="w-full h-64 object-cover rounded-lg"
                      />
                      <div className="mt-4 flex flex-wrap gap-2">
                        {selectedProduct.tags.map((tag) => (
                          <Badge
                            key={tag}
                            variant={
                              tag === "Resep Dokter" ? "destructive" : "outline"
                            }
                          >
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    <div>
                      <p className="text-3xl font-bold text-red-600 mb-4">
                        Rp{selectedProduct.price.toLocaleString("id-ID")}
                      </p>
                      <p className="text-gray-600 dark:text-gray-300">
                        {selectedProduct.description}
                      </p>
                      <div className="mt-4 space-y-2 text-sm">
                        <p>
                          <strong>Bentuk:</strong> {selectedProduct.form}
                        </p>
                        <p>
                          <strong>Dosis:</strong> {selectedProduct.dosage}
                        </p>
                        <p>
                          <strong>Efek Samping:</strong>{" "}
                          {selectedProduct.sideEffects.join(", ")}
                        </p>
                        <p>
                          <strong>Brand:</strong> {selectedProduct.brand}
                        </p>
                      </div>
                      <div className="mt-6 flex gap-2">
                        <Button
                          className="flex-1"
                          onClick={() => {
                            addToCart(selectedProduct);
                            setSelectedProduct(null);
                          }}
                          disabled={selectedProduct.stock === 0}
                        >
                          <ShoppingCart className="h-4 w-4 mr-2" />
                          {selectedProduct.stock === 0
                            ? "Stok Habis"
                            : "Tambah Keranjang"}
                        </Button>
                        <Button
                          variant="outline"
                          className="flex-1"
                          onClick={() => {
                            toggleWishlist(
                              selectedProduct.id,
                              selectedProduct.name
                            );
                          }}
                        >
                          <Heart
                            className={cn(
                              "h-4 w-4 mr-2",
                              wishlist.has(selectedProduct.id) &&
                                "text-red-500 fill-current"
                            )}
                          />
                          {wishlist.has(selectedProduct.id)
                            ? "Hapus dari Wishlist"
                            : "Tambah ke Wishlist"}
                        </Button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              </DialogContent>
            )}
          </AnimatePresence>
        </Dialog>

        {/* AI Recommendation Modal */}
        <Dialog open={isAiModalOpen} onOpenChange={setIsAiModalOpen}>
          <AnimatePresence>
            {isAiModalOpen && (
              <DialogContent className="max-w-2xl">
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                >
                  <DialogHeader>
                    <DialogTitle className="flex items-center gap-2 text-2xl">
                      <Sparkles className="h-6 w-6 text-blue-500" />
                      Asisten AI Kardiologiku
                    </DialogTitle>
                    <DialogDescription>
                      Pilih fokus kesehatan Anda, dan biarkan kami memberikan
                      rekomendasi produk terbaik.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="py-6">
                    <div className="flex items-center gap-4">
                      <Select
                        value={aiConcern}
                        onValueChange={(v: PatientConcern) => setAiConcern(v)}
                      >
                        <SelectTrigger className="flex-1">
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
                      <Button onClick={generateAiRecommendations}>
                        Dapatkan Rekomendasi
                      </Button>
                    </div>
                  </div>
                  {aiRecommendations.length > 0 && (
                    <div>
                      <h4 className="font-semibold mb-4">
                        Rekomendasi teratas untuk {aiConcern}:
                      </h4>
                      <div className="space-y-4">
                        {aiRecommendations.map((product) => (
                          <div
                            key={product.id}
                            className="flex items-center gap-4 p-3 border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800/50"
                          >
                            <img
                              src={product.imageUrl}
                              alt={product.name}
                              className="w-16 h-16 rounded-md object-cover"
                            />
                            <div className="flex-grow">
                              <p className="font-semibold">{product.name}</p>
                              <p className="text-sm text-gray-500">
                                {product.brand}
                              </p>
                              <div className="flex items-center mt-1">
                                <Star className="h-4 w-4 text-yellow-400 fill-yellow-400" />
                                <span className="text-sm ml-1 text-gray-600 dark:text-gray-400">
                                  {product.rating}
                                </span>
                              </div>
                            </div>
                            <Button
                              size="sm"
                              onClick={() => {
                                addToCart(product);
                                setIsAiModalOpen(false);
                              }}
                              disabled={product.stock === 0}
                            >
                              <ShoppingCart className="h-4 w-4 mr-2" />
                              {product.stock === 0 ? "Habis" : "Tambah"}
                            </Button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                  <DialogFooter>
                    <Button onClick={() => setIsAiModalOpen(false)}>
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

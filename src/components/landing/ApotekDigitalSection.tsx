// src/components/landing/ApotekDigitalSection.tsx
import React, { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
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
  Brain,
  Leaf,
  Sparkles,
  Trash2,
  Star,
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner"; // Asumsi Anda menggunakan sonner untuk notifikasi

// --- TIPE DATA YANG KOMPLEKS ---
type ProductCategory =
  | "Obat Jantung"
  | "Suplemen & Vitamin"
  | "Herbal & Tradisional"
  | "Peralatan Medis";

interface Product {
  id: string;
  name: string;
  category: ProductCategory;
  price: number;
  stock: number;
  imageUrl: string;
  description: string;
  tags: ("Resep Dokter" | "BPOM" | "Halal" | "Herbal")[];
  dosage: string;
  sideEffects: string[];
  brand: string;
  rating: number;
  reviews: number;
}

interface CartItem extends Product {
  quantity: number;
}

// --- DATA DUMMY YANG LENGKAP ---
const dummyProducts: Product[] = [
  {
    id: "prod_001",
    name: "Concor 2.5mg (Bisoprolol)",
    category: "Obat Jantung",
    price: 85000,
    stock: 50,
    imageUrl: "/api/placeholder/300/300?text=Concor",
    description:
      "Obat golongan beta-blocker untuk mengatasi hipertensi, angina, dan gagal jantung.",
    tags: ["Resep Dokter", "BPOM"],
    dosage: "1 tablet per hari atau sesuai anjuran dokter.",
    sideEffects: ["Pusing", "Lelah", "Mual", "Detak jantung lambat"],
    brand: "Merck",
    rating: 4.9,
    reviews: 120,
  },
  {
    id: "prod_002",
    name: "Nature's Way Vitamin D3 1000 IU",
    category: "Suplemen & Vitamin",
    price: 150000,
    stock: 120,
    imageUrl: "/api/placeholder/300/300?text=VitD3",
    description:
      "Suplemen Vitamin D3 untuk menjaga kesehatan tulang, imunitas, dan fungsi kardiovaskular.",
    tags: ["BPOM", "Halal"],
    dosage: "1 kapsul per hari setelah makan.",
    sideEffects: ["Jarang terjadi jika sesuai dosis"],
    brand: "Nature's Way",
    rating: 4.8,
    reviews: 250,
  },
  {
    id: "prod_003",
    name: "Madu Hutan Asli Nusantara",
    category: "Herbal & Tradisional",
    price: 95000,
    stock: 80,
    imageUrl: "/api/placeholder/300/300?text=Madu",
    description:
      "Madu murni dari hutan tropis Indonesia, kaya antioksidan dan baik untuk stamina.",
    tags: ["Herbal", "Halal"],
    dosage: "1-2 sendok makan per hari.",
    sideEffects: ["Tidak cocok untuk bayi di bawah 1 tahun"],
    brand: "Sari Hutan",
    rating: 4.7,
    reviews: 95,
  },
  {
    id: "prod_004",
    name: "Tensimeter Digital Omron",
    category: "Peralatan Medis",
    price: 650000,
    stock: 30,
    imageUrl: "/api/placeholder/300/300?text=Omron",
    description:
      "Alat pengukur tekanan darah digital otomatis dengan teknologi IntelliSense untuk akurasi tinggi.",
    tags: [],
    dosage: "Gunakan sesuai petunjuk manual.",
    sideEffects: [],
    brand: "Omron",
    rating: 4.9,
    reviews: 310,
  },
  {
    id: "prod_005",
    name: "Lipitor 20mg (Atorvastatin)",
    category: "Obat Jantung",
    price: 210000,
    stock: 45,
    imageUrl: "/api/placeholder/300/300?text=Lipitor",
    description: "Obat statin untuk menurunkan kadar kolesterol jahat (LDL).",
    tags: ["Resep Dokter", "BPOM"],
    dosage: "1 tablet per hari, malam hari.",
    sideEffects: ["Nyeri otot", "Gangguan pencernaan"],
    brand: "Pfizer",
    rating: 4.8,
    reviews: 180,
  },
  {
    id: "prod_006",
    name: "Blackmores Omega-3 Fish Oil",
    category: "Suplemen & Vitamin",
    price: 220000,
    stock: 200,
    imageUrl: "/api/placeholder/300/300?text=Omega3",
    description:
      "Minyak ikan sumber Omega-3 EPA & DHA untuk kesehatan jantung, otak, dan mata.",
    tags: ["BPOM"],
    dosage: "2 kapsul per hari bersama makanan.",
    sideEffects: ["Rasa amis setelah minum"],
    brand: "Blackmores",
    rating: 4.9,
    reviews: 450,
  },
];

// --- LOGIKA KOMPONEN ---
const ApotekDigitalSection = () => {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<
    ProductCategory | "Semua"
  >("Semua");
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 700000]);
  const [sortBy, setSortBy] = useState<"rating" | "price_asc" | "price_desc">(
    "rating"
  );

  const filteredProducts = useMemo(() => {
    const products = dummyProducts
      .filter((p) => p.name.toLowerCase().includes(searchTerm.toLowerCase()))
      .filter(
        (p) => categoryFilter === "Semua" || p.category === categoryFilter
      )
      .filter((p) => p.price >= priceRange[0] && p.price <= priceRange[1]);

    switch (sortBy) {
      case "price_asc":
        products.sort((a, b) => a.price - b.price);
        break;
      case "price_desc":
        products.sort((a, b) => b.price - a.price);
        break;
      case "rating":
      default:
        products.sort((a, b) => b.rating - a.rating);
        break;
    }

    return products;
  }, [searchTerm, categoryFilter, priceRange, sortBy]);

  const addToCart = (product: Product, quantity = 1) => {
    setCart((prevCart) => {
      const existingItem = prevCart.find((item) => item.id === product.id);
      if (existingItem) {
        return prevCart.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      return [...prevCart, { ...product, quantity }];
    });
    toast.success(`${product.name} ditambahkan ke keranjang!`);
  };

  const updateQuantity = (productId: string, newQuantity: number) => {
    setCart((prevCart) => {
      if (newQuantity <= 0) {
        return prevCart.filter((item) => item.id !== productId);
      }
      return prevCart.map((item) =>
        item.id === productId ? { ...item, quantity: newQuantity } : item
      );
    });
  };

  const cartTotal = useMemo(() => {
    return cart.reduce((total, item) => total + item.price * item.quantity, 0);
  }, [cart]);

  const categories: (ProductCategory | "Semua")[] = [
    "Semua",
    "Obat Jantung",
    "Suplemen & Vitamin",
    "Herbal & Tradisional",
    "Peralatan Medis",
  ];
  const categoryIcons: Record<ProductCategory, React.ElementType> = {
    "Obat Jantung": Heart,
    "Suplemen & Vitamin": Sparkles,
    "Herbal & Tradisional": Leaf,
    "Peralatan Medis": Brain,
  };

  return (
    <section id="apotek" className="py-20 bg-gray-50 dark:bg-gray-900/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-4xl font-bold text-gray-900 dark:text-white">
            Apotek Digital Kardiologiku
          </h2>
          <p className="mt-4 text-lg text-gray-600 dark:text-gray-400">
            Temukan obat, suplemen, dan vitamin pilihan untuk kesehatan jantung
            Anda.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar Filter */}
          <aside className="lg:col-span-1">
            <Card className="sticky top-24">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Filter /> Filter & Urutkan
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Cari produk..."
                    className="pl-10"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Kategori</h4>
                  <div className="space-y-2">
                    {categories.map((cat) => (
                      <Button
                        key={cat}
                        variant={categoryFilter === cat ? "default" : "outline"}
                        className="w-full justify-start"
                        onClick={() => setCategoryFilter(cat)}
                      >
                        {cat !== "Semua" &&
                          React.createElement(categoryIcons[cat], {
                            className: "h-4 w-4 mr-2",
                          })}
                        {cat}
                      </Button>
                    ))}
                  </div>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Rentang Harga</h4>
                  <Slider
                    value={priceRange}
                    onValueChange={(value) =>
                      setPriceRange(value as [number, number])
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
                  <h4 className="font-semibold mb-2">Urutkan Berdasarkan</h4>
                  <Select
                    value={sortBy}
                    onValueChange={(v) =>
                      setSortBy(v as "rating" | "price_asc" | "price_desc")
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="rating">Rating Tertinggi</SelectItem>
                      <SelectItem value="price_asc">Harga Terendah</SelectItem>
                      <SelectItem value="price_desc">
                        Harga Tertinggi
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>
          </aside>

          {/* Product Grid */}
          <main className="lg:col-span-3">
            <motion.div
              layout
              className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6"
            >
              <AnimatePresence>
                {filteredProducts.map((product) => (
                  <motion.div
                    key={product.id}
                    layout
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    transition={{ type: "spring", duration: 0.5 }}
                  >
                    <Card className="h-full flex flex-col group overflow-hidden">
                      <div className="relative">
                        <img
                          src={product.imageUrl}
                          alt={product.name}
                          className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                        {product.tags.includes("Resep Dokter") && (
                          <Badge
                            variant="destructive"
                            className="absolute top-2 left-2"
                          >
                            Resep Dokter
                          </Badge>
                        )}
                      </div>
                      <CardHeader>
                        <CardTitle className="text-lg h-12">
                          {product.name}
                        </CardTitle>
                        <div className="flex items-center gap-2">
                          <Badge variant="secondary">{product.category}</Badge>
                          <div className="flex items-center">
                            <Star className="h-4 w-4 text-yellow-400 fill-yellow-400" />
                            <span className="text-sm ml-1">
                              {product.rating} ({product.reviews})
                            </span>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent className="flex-grow">
                        <p className="text-2xl font-bold text-red-600">
                          Rp{product.price.toLocaleString("id-ID")}
                        </p>
                        <p className="text-sm text-gray-500 mt-2">
                          Stok: {product.stock}
                        </p>
                      </CardContent>
                      <div className="p-4 pt-0">
                        <Button
                          className="w-full"
                          onClick={() => addToCart(product)}
                        >
                          <ShoppingCart className="h-4 w-4 mr-2" />
                          Tambah ke Keranjang
                        </Button>
                      </div>
                    </Card>
                  </motion.div>
                ))}
              </AnimatePresence>
            </motion.div>
          </main>
        </div>
      </div>

      {/* Shopping Cart FAB */}
      <motion.div
        className="fixed bottom-8 right-8 z-50"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
      >
        <Button
          size="lg"
          className="rounded-full w-16 h-16 shadow-lg"
          onClick={() => setIsCartOpen(true)}
        >
          <ShoppingCart />
          {cart.length > 0 && (
            <Badge variant="destructive" className="absolute -top-1 -right-1">
              {cart.reduce((sum, item) => sum + item.quantity, 0)}
            </Badge>
          )}
        </Button>
      </motion.div>

      {/* Shopping Cart Panel */}
      <AnimatePresence>
        {isCartOpen && (
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="fixed top-0 right-0 h-full w-full max-w-md bg-white dark:bg-gray-800 shadow-2xl z-50 flex flex-col"
          >
            <div className="p-4 flex justify-between items-center border-b">
              <h3 className="text-xl font-bold">Keranjang Belanja</h3>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsCartOpen(false)}
              >
                <X />
              </Button>
            </div>
            <div className="flex-grow p-4 overflow-y-auto space-y-4">
              {cart.length === 0 ? (
                <p>Keranjang Anda kosong.</p>
              ) : (
                cart.map((item) => (
                  <div key={item.id} className="flex items-center gap-4">
                    <img
                      src={item.imageUrl}
                      alt={item.name}
                      className="w-16 h-16 rounded-md object-cover"
                    />
                    <div className="flex-grow">
                      <p className="font-semibold">{item.name}</p>
                      <p className="text-sm text-gray-500">
                        Rp{item.price.toLocaleString("id-ID")}
                      </p>
                      <div className="flex items-center gap-2 mt-2">
                        <Button
                          size="icon"
                          variant="outline"
                          className="h-6 w-6"
                          onClick={() =>
                            updateQuantity(item.id, item.quantity - 1)
                          }
                        >
                          <Minus className="h-4 w-4" />
                        </Button>
                        <span>{item.quantity}</span>
                        <Button
                          size="icon"
                          variant="outline"
                          className="h-6 w-6"
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
                  </div>
                ))
              )}
            </div>
            {cart.length > 0 && (
              <div className="p-4 border-t space-y-4">
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
    </section>
  );
};

export default ApotekDigitalSection;

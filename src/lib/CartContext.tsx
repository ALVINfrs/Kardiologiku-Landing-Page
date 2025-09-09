
import { createContext, useContext, useState, useMemo, useCallback, ReactNode } from 'react';
import { toast } from "sonner";

// Definisikan tipe yang sama seperti di ApotekDigitalSection
type ProductCategory =
  | "Obat Jantung"
  | "Suplemen & Vitamin"
  | "Herbal & Tradisional"
  | "Peralatan Medis";

type ProductForm = "Tablet" | "Kapsul" | "Sirup" | "Cair" | "Alat";
type PatientConcern = "Kolesterol" | "Hipertensi" | "Aritmia" | "Pencegahan";

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

interface CartItem extends Product {
  quantity: number;
}

// Tipe untuk context
interface CartContextType {
  cart: CartItem[];
  isCartOpen: boolean;
  cartCount: number;
  cartTotal: number;
  addToCart: (product: Product, quantity?: number) => void;
  updateQuantity: (productId: string, newQuantity: number) => void;
  toggleCart: () => void;
  openCart: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
};

interface CartProviderProps {
  children: ReactNode;
}

export const CartProvider = ({ children }: CartProviderProps) => {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);

  const addToCart = useCallback((product: Product, quantity = 1) => {
    if (product.stock < quantity) {
      toast.error(`Stok ${product.name} tidak mencukupi.`);
      return;
    }
    setCart((prevCart) => {
      const existingItem = prevCart.find((item) => item.id === product.id);
      if (existingItem) {
        const newQuantity = existingItem.quantity + quantity;
        if (newQuantity > product.stock) {
          toast.warning(`Hanya ${product.stock} item ${product.name} yang tersedia.`);
          return prevCart.map((item) =>
            item.id === product.id ? { ...item, quantity: product.stock } : item
          );
        }
        return prevCart.map((item) =>
          item.id === product.id ? { ...item, quantity: newQuantity } : item
        );
      }
      return [...prevCart, { ...product, quantity }];
    });
    toast.success(`${product.name} ditambahkan ke keranjang!`);
    setIsCartOpen(true);
  }, []);

  const updateQuantity = useCallback((productId: string, newQuantity: number) => {
    setCart((prevCart) => {
      const itemToUpdate = prevCart.find((item) => item.id === productId);
      if (!itemToUpdate) return prevCart;

      if (newQuantity <= 0) {
        toast.info(`${itemToUpdate.name} dihapus dari keranjang.`);
        return prevCart.filter((item) => item.id !== productId);
      }

      if (newQuantity > itemToUpdate.stock) {
        toast.warning(`Stok ${itemToUpdate.name} hanya ${itemToUpdate.stock}.`);
        newQuantity = itemToUpdate.stock;
      }

      return prevCart.map((item) =>
        item.id === productId ? { ...item, quantity: newQuantity } : item
      );
    });
  }, []);

  const toggleCart = () => setIsCartOpen(!isCartOpen);
  const openCart = () => setIsCartOpen(true);

  const cartCount = useMemo(() => {
    return cart.reduce((sum, item) => sum + item.quantity, 0);
  }, [cart]);

  const cartTotal = useMemo(() => {
    return cart.reduce((total, item) => total + item.price * item.quantity, 0);
  }, [cart]);

  const value = {
    cart,
    isCartOpen,
    cartCount,
    cartTotal,
    addToCart,
    updateQuantity,
    toggleCart,
    openCart,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

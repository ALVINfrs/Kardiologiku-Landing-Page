import { useState, useMemo, useCallback, type ReactNode } from "react";
import { toast } from "sonner";
import {
  CartContext,
  type CartContextType,
  type Product,
  type CartItem,
} from "./CartContext";

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
          toast.warning(
            `Hanya ${product.stock} item ${product.name} yang tersedia.`
          );
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

  const updateQuantity = useCallback(
    (productId: string, newQuantity: number) => {
      setCart((prevCart) => {
        const itemToUpdate = prevCart.find((item) => item.id === productId);
        if (!itemToUpdate) return prevCart;

        if (newQuantity <= 0) {
          toast.info(`${itemToUpdate.name} dihapus dari keranjang.`);
          return prevCart.filter((item) => item.id !== productId);
        }

        if (newQuantity > itemToUpdate.stock) {
          toast.warning(
            `Stok ${itemToUpdate.name} hanya ${itemToUpdate.stock}.`
          );
          newQuantity = itemToUpdate.stock;
        }

        return prevCart.map((item) =>
          item.id === productId ? { ...item, quantity: newQuantity } : item
        );
      });
    },
    []
  );

  const toggleCart = () => setIsCartOpen(!isCartOpen);
  const openCart = () => setIsCartOpen(true);

  const cartCount = useMemo(
    () => cart.reduce((sum, item) => sum + item.quantity, 0),
    [cart]
  );

  const cartTotal = useMemo(
    () => cart.reduce((total, item) => total + item.price * item.quantity, 0),
    [cart]
  );

  const value: CartContextType = {
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

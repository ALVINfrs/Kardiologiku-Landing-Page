import { createContext } from "react";

export interface Product {
  id: string;
  name: string;
  price: number;
  stock: number;
  imageUrl: string;
}

export interface CartItem extends Product {
  quantity: number;
}

export interface CartContextType {
  cart: CartItem[];
  isCartOpen: boolean;
  cartCount: number;
  cartTotal: number;
  addToCart: (product: Product, quantity?: number) => void;
  updateQuantity: (productId: string, newQuantity: number) => void;
  toggleCart: () => void;
  openCart: () => void;
}

export const CartContext = createContext<CartContextType | undefined>(
  undefined
);

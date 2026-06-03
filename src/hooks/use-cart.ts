import { useCallback, useEffect, useState } from "react";
import {
  addToCart,
  CART_UPDATE_EVENT,
  clearCart,
  getCartCount,
  loadCart,
  removeFromCart,
  setCartQuantity,
  type CartItem,
} from "@/lib/cart";

export function useCartState() {
  const [items, setItems] = useState<CartItem[]>([]);

  const refresh = useCallback(() => setItems(loadCart()), []);

  useEffect(() => {
    refresh();
    const handler = () => refresh();
    window.addEventListener(CART_UPDATE_EVENT, handler);
    return () => window.removeEventListener(CART_UPDATE_EVENT, handler);
  }, [refresh]);

  const addItem = useCallback((productId: string, quantity = 1) => {
    setItems(addToCart(productId, quantity));
  }, []);

  const removeItem = useCallback((productId: string) => {
    setItems(removeFromCart(productId));
  }, []);

  const updateQuantity = useCallback((productId: string, quantity: number) => {
    setItems(setCartQuantity(productId, quantity));
  }, []);

  const clear = useCallback(() => {
    setItems(clearCart());
  }, []);

  return {
    items,
    itemCount: getCartCount(items),
    addItem,
    removeItem,
    updateQuantity,
    clear,
  };
}

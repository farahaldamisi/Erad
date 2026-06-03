export interface CartItem {
  productId: string;
  quantity: number;
}

const STORAGE_KEY = "erad_cart_v1";

export const CART_UPDATE_EVENT = "erad-cart-update";

export function loadCart(): CartItem[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as CartItem[]) : [];
  } catch {
    return [];
  }
}

function saveCart(items: CartItem[]) {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  window.dispatchEvent(new Event(CART_UPDATE_EVENT));
}

export function getCartCount(items: CartItem[]): number {
  return items.reduce((sum, item) => sum + item.quantity, 0);
}

export function addToCart(productId: string, quantity = 1): CartItem[] {
  const cart = loadCart();
  const idx = cart.findIndex(i => i.productId === productId);
  if (idx === -1) {
    cart.push({ productId, quantity });
  } else {
    cart[idx] = { ...cart[idx], quantity: cart[idx].quantity + quantity };
  }
  saveCart(cart);
  return cart;
}

export function removeFromCart(productId: string): CartItem[] {
  const cart = loadCart().filter(i => i.productId !== productId);
  saveCart(cart);
  return cart;
}

export function setCartQuantity(productId: string, quantity: number): CartItem[] {
  if (quantity <= 0) return removeFromCart(productId);
  const cart = loadCart();
  const idx = cart.findIndex(i => i.productId === productId);
  if (idx === -1) return cart;
  cart[idx] = { ...cart[idx], quantity };
  saveCart(cart);
  return cart;
}

export function clearCart(): CartItem[] {
  saveCart([]);
  return [];
}

import { products as seedProducts, normalizeProduct, type Product } from "./products";

const STORAGE_KEY = "erad_products_v1";

export function loadProducts(): Product[] {
  if (typeof window === "undefined") return seedProducts;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return seedProducts;
    return (JSON.parse(raw) as Product[]).map(normalizeProduct);
  } catch {
    return seedProducts;
  }
}

export function saveProducts(products: Product[]) {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(products.map(normalizeProduct)));
}

export function findProduct(id: string): Product | undefined {
  return loadProducts().find(p => p.id === id);
}

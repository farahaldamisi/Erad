import { logActivity } from "@/lib/activity";
import type { DictKey } from "@/lib/i18n";
import type { Product } from "@/lib/products";

export const LOW_STOCK_THRESHOLD = 5;

const LOGGED_KEY = "erad_low_stock_logged_v1";

export function isLowStock(stock: number): boolean {
  return stock > 0 && stock <= LOW_STOCK_THRESHOLD;
}

export function getLowStockProducts(products: Product[]): Product[] {
  return products
    .filter(p => isLowStock(p.stock))
    .sort((a, b) => a.stock - b.stock);
}

function loadLoggedKeys(): Set<string> {
  if (typeof window === "undefined") return new Set();
  try {
    const raw = localStorage.getItem(LOGGED_KEY);
    return new Set(raw ? (JSON.parse(raw) as string[]) : []);
  } catch {
    return new Set();
  }
}

function saveLoggedKeys(keys: Set<string>) {
  if (typeof window === "undefined") return;
  localStorage.setItem(LOGGED_KEY, JSON.stringify([...keys].slice(0, 300)));
}

function clearLoggedKeysForProduct(productId: string) {
  const keys = loadLoggedKeys();
  for (const key of [...keys]) {
    if (key.startsWith(`${productId}:`)) keys.delete(key);
  }
  saveLoggedKeys(keys);
}

export function formatLowStockAlertLabel(
  productName: string,
  stock: number,
  t: (key: DictKey) => string,
): string {
  if (stock === 1) {
    return t("admin_low_stock_one").replace("{name}", productName);
  }
  return t("admin_low_stock_left")
    .replace("{name}", productName)
    .replace("{count}", String(stock));
}

export function maybeLogLowStockAlert(params: {
  productId: string;
  productName: string;
  previousStock: number;
  newStock: number;
  brand?: string;
  category?: string;
  subcategory?: string;
}) {
  const { productId, productName, previousStock, newStock } = params;

  if (!isLowStock(newStock)) {
    if (previousStock > 0 && previousStock <= LOW_STOCK_THRESHOLD) {
      clearLoggedKeysForProduct(productId);
    }
    return;
  }

  const enteredLowZone = previousStock > LOW_STOCK_THRESHOLD && newStock <= LOW_STOCK_THRESHOLD;
  const decreasedInLowZone = previousStock > newStock;
  const createdLow = previousStock === newStock && previousStock <= LOW_STOCK_THRESHOLD;

  if (!enteredLowZone && !decreasedInLowZone && !createdLow) return;

  const dedupeKey = `${productId}:${newStock}`;
  const logged = loadLoggedKeys();
  if (logged.has(dedupeKey)) return;

  logActivity({
    type: "low_stock",
    label: productName,
    meta: {
      productId,
      stock: String(newStock),
      previousStock: String(previousStock),
      brand: params.brand ?? "",
      category: params.category ?? "",
      subcategory: params.subcategory ?? "",
    },
  });

  logged.add(dedupeKey);
  saveLoggedKeys(logged);
}

export function decrementProductStock(
  products: Product[],
  items: { productId: string; quantity: number; name: string }[],
): Product[] {
  const qtyById = new Map<string, number>();
  for (const item of items) {
    qtyById.set(item.productId, (qtyById.get(item.productId) ?? 0) + item.quantity);
  }

  return products.map(product => {
    const qty = qtyById.get(product.id);
    if (!qty) return product;

    const previousStock = product.stock;
    const newStock = Math.max(0, product.stock - qty);

    maybeLogLowStockAlert({
      productId: product.id,
      productName: product.name,
      previousStock,
      newStock,
      brand: product.brand,
      category: product.category,
      subcategory: product.subcategory,
    });

    return { ...product, stock: newStock };
  });
}

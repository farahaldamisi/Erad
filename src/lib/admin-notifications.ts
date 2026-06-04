import type { ActivityEvent } from "@/lib/activity";
import type { Product } from "@/lib/products";
import { getLowStockProducts, isLowStock } from "@/lib/stock-alerts";

export type AdminNotificationKind = "low_stock" | "out_of_stock";

export interface AdminNotificationItem {
  id: string;
  kind: AdminNotificationKind;
  title: string;
  subtitle?: string;
  brand: string;
  category: string;
  subcategory: string;
  subcategoryAr: string;
  createdAt: string;
  href?: string;
  productId?: string;
}

function itemFromProduct(product: Product, kind: AdminNotificationKind): AdminNotificationItem {
  return {
    id: `${kind === "low_stock" ? "low" : "out"}-${product.id}`,
    kind,
    title: product.name,
    subtitle: kind === "low_stock" ? String(product.stock) : undefined,
    brand: product.brand,
    category: product.category,
    subcategory: product.subcategory,
    subcategoryAr: product.subcategoryAr,
    createdAt: new Date().toISOString(),
    href: "/admin/products",
    productId: product.id,
  };
}

export function getOutOfStockProducts(products: Product[]): Product[] {
  return products.filter(p => p.stock <= 0);
}

export function isStockAlertProduct(product: Product): boolean {
  return product.stock <= 0 || isLowStock(product.stock);
}

const ACK_KEY = "erad_admin_notif_ack_v1";

function getActiveAlertKeys(products: Product[]): string[] {
  const keys = [
    ...getLowStockProducts(products).map(p => `low:${p.id}:${p.stock}`),
    ...getOutOfStockProducts(products).map(p => `out:${p.id}`),
  ];
  return keys.sort();
}

function loadAcknowledgedKeys(): Set<string> {
  if (typeof window === "undefined") return new Set();
  try {
    const raw = localStorage.getItem(ACK_KEY);
    if (!raw) return new Set();
    const parsed = JSON.parse(raw) as { keys?: string[] };
    return new Set(parsed.keys ?? []);
  } catch {
    return new Set();
  }
}

export function acknowledgeAdminNotifications(products: Product[]) {
  if (typeof window === "undefined") return;
  const keys = getActiveAlertKeys(products);
  localStorage.setItem(ACK_KEY, JSON.stringify({ keys, at: new Date().toISOString() }));
  window.dispatchEvent(new Event("erad-notifications-ack"));
}

export function getUnreadAdminNotificationCount(products: Product[]): number {
  const current = getActiveAlertKeys(products);
  const acknowledged = loadAcknowledgedKeys();
  return current.filter(key => !acknowledged.has(key)).length;
}

export function getAdminNotificationCount(products: Product[]): number {
  return getLowStockProducts(products).length + getOutOfStockProducts(products).length;
}

export function buildActiveAdminNotifications(products: Product[]): AdminNotificationItem[] {
  const items: AdminNotificationItem[] = [];

  for (const product of getLowStockProducts(products)) {
    items.push(itemFromProduct(product, "low_stock"));
  }

  for (const product of getOutOfStockProducts(products)) {
    items.push(itemFromProduct(product, "out_of_stock"));
  }

  return items.sort((a, b) => Number(a.subtitle ?? 0) - Number(b.subtitle ?? 0));
}

export function getAdminNotificationHistory(
  activities: ActivityEvent[],
  products: Product[],
): ActivityEvent[] {
  const productById = new Map(products.map(p => [p.id, p]));

  return activities.filter(event => {
    if (event.type !== "low_stock") return false;
    const productId = event.meta?.productId;
    if (!productId) return false;
    const product = productById.get(productId);
    if (!product) return false;
    return isStockAlertProduct(product);
  });
}

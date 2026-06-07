import type { Lang } from "./i18n";
import type { Product } from "./products";
import { resolveSectionLabel, type Section } from "./sections";

export const DAHUA_MONITORS_SEARCH = {
  category: "monitors",
  sort: "newest" as const,
};

export const GAMING_PC_SEARCH = {
  category: "desktops",
  sub: "gaming",
  sort: "newest" as const,
};

export function getGamingPcProducts(products: Product[]): Product[] {
  return products.filter(p => p.category === "desktops" && p.subcategory === "gaming");
}

export function getNewArrivalProducts(products: Product[]): Product[] {
  return products.filter(p => p.isNewArrival);
}

export function getSpecialOfferProducts(products: Product[]): Product[] {
  return products.filter(p => (p.discountPercent ?? 0) > 0);
}

export function getLatestNewArrival(products: Product[]): Product | null {
  return getNewArrivalProducts(products)[0] ?? null;
}

export function getNewArrivalCategoryLabel(
  product: Product | null,
  sections: Section[],
  lang: Lang,
): string | null {
  if (!product) return null;
  return resolveSectionLabel(sections, product.category, lang);
}

export function hasProductDiscount(product: Product): boolean {
  return (product.discountPercent ?? 0) > 0;
}

import type { Product } from "./products";
import { getProductName } from "./products";

import type { Section } from "./sections";
import { sortSections } from "./sections";

export interface ProductSearchParams {
  category?: string | "all";
  sub?: string;
  brand?: string;
  inStock?: boolean;
  outOfStock?: boolean;
  sort?: "newest" | "price_low" | "price_high";
  q?: string;
  minPrice?: number;
  maxPrice?: number;
}

function normalizeQuery(q?: string) {
  return q?.trim().toLowerCase() ?? "";
}

export function filterProducts(products: Product[], search: ProductSearchParams): Product[] {
  let list = [...products];
  const query = normalizeQuery(search.q);

  if (search.category && search.category !== "all") {
    list = list.filter(p => p.category === search.category);
  }
  if (search.sub && search.category && search.category !== "all") {
    list = list.filter(p => p.subcategory === search.sub);
  }
  if (search.brand) {
    list = list.filter(p => p.brand === search.brand);
  }
  if (search.inStock && !search.outOfStock) {
    list = list.filter(p => p.stock > 0);
  } else if (search.outOfStock && !search.inStock) {
    list = list.filter(p => p.stock <= 0);
  }
  if (typeof search.minPrice === "number" && !Number.isNaN(search.minPrice)) {
    list = list.filter(p => p.price >= search.minPrice!);
  }
  if (typeof search.maxPrice === "number" && !Number.isNaN(search.maxPrice)) {
    list = list.filter(p => p.price <= search.maxPrice!);
  }
  if (query) {
    list = list.filter(p => {
      const haystack = [
        getProductName(p),
        p.nameAr,
        p.brand,
        p.subcategory,
        p.subcategoryAr,
        p.overview,
        p.overviewAr,
      ]
        .join(" ")
        .toLowerCase();
      return haystack.includes(query);
    });
  }

  if (search.sort === "price_low") list.sort((a, b) => a.price - b.price);
  if (search.sort === "price_high") list.sort((a, b) => b.price - a.price);

  return list;
}

export function countProductsInSection(products: Product[], sectionId: string): number {
  return products.filter(p => p.category === sectionId).length;
}

export interface SubcategoryOption {
  en: string;
  ar: string;
  count: number;
}

export function getSubcategoriesForSection(products: Product[], sectionId: string): SubcategoryOption[] {
  const map = new Map<string, SubcategoryOption>();
  for (const product of products.filter(p => p.category === sectionId)) {
    const existing = map.get(product.subcategory);
    if (existing) existing.count += 1;
    else map.set(product.subcategory, { en: product.subcategory, ar: product.subcategoryAr, count: 1 });
  }
  return Array.from(map.values()).sort((a, b) => a.en.localeCompare(b.en));
}

export function groupProductsBySection(
  products: Product[],
  sections: Section[],
  options?: { hideEmpty?: boolean },
): { section: Section; products: Product[] }[] {
  const hideEmpty = options?.hideEmpty ?? false;
  return sortSections(sections)
    .map(section => ({
      section,
      products: products.filter(p => p.category === section.id),
    }))
    .filter(group => !hideEmpty || group.products.length > 0);
}

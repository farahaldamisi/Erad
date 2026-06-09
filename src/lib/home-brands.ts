import logoAsus from "@/assets/brands/asus.svg";
import logoHp from "@/assets/brands/hp.svg";
import logoLenovo from "@/assets/brands/lenovo.svg";
import logoDell from "@/assets/brands/dell.svg";
import logoEpson from "@/assets/brands/epson.svg";
import logoCanon from "@/assets/brands/canon.svg";
import logoDahua from "@/assets/brands/dahua.svg";
import { DAHUA_MONITORS_SEARCH } from "@/lib/home-spotlights";

export interface HomeBrandSearch {
  category?: string;
  brand?: string;
  q?: string;
  sort?: "newest";
}

export interface HomeBrandItem {
  id: string;
  name: string;
  logo: string;
  search: HomeBrandSearch;
  logoClassName?: string;
  order: number;
}

export const seedHomeBrands: HomeBrandItem[] = [
  { id: "asus", name: "ASUS", logo: logoAsus, search: { brand: "ASUS", sort: "newest" }, logoClassName: "h-7 sm:h-8", order: 0 },
  { id: "hp", name: "HP", logo: logoHp, search: { brand: "HP", sort: "newest" }, logoClassName: "h-10 sm:h-11", order: 1 },
  { id: "lenovo", name: "Lenovo", logo: logoLenovo, search: { brand: "Lenovo", sort: "newest" }, logoClassName: "h-7 sm:h-8", order: 2 },
  { id: "dell", name: "Dell", logo: logoDell, search: { brand: "Dell", sort: "newest" }, logoClassName: "h-10 sm:h-12", order: 3 },
  { id: "epson", name: "Epson", logo: logoEpson, search: { category: "printers", brand: "Epson", sort: "newest" }, logoClassName: "h-7 sm:h-8", order: 4 },
  { id: "canon", name: "Canon", logo: logoCanon, search: { category: "printers", brand: "Canon", sort: "newest" }, logoClassName: "h-8 sm:h-9", order: 5 },
  {
    id: "dahua",
    name: "Dahua",
    logo: logoDahua,
    search: DAHUA_MONITORS_SEARCH,
    logoClassName: "h-10 sm:h-12",
    order: 6,
  },
];

/** @deprecated use seedHomeBrands */
export const homeBrands = seedHomeBrands;

export function sortHomeBrands(brands: HomeBrandItem[]): HomeBrandItem[] {
  return [...brands].sort((a, b) => a.order - b.order || a.name.localeCompare(b.name));
}

export function slugifyBrandId(name: string): string {
  return name
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 48) || "brand";
}

export function createBrandId(name?: string): string {
  return name ? `${slugifyBrandId(name)}-${Date.now().toString(36)}` : `brand-${Date.now().toString(36)}`;
}

export function normalizeHomeBrand(brand: HomeBrandItem): HomeBrandItem {
  const category = brand.search.category?.trim();
  const filterBrand = brand.search.brand?.trim();
  const q = brand.search.q?.trim();
  return {
    id: brand.id.trim(),
    name: brand.name.trim(),
    logo: brand.logo.trim(),
    logoClassName: brand.logoClassName?.trim() || undefined,
    order: Number.isFinite(brand.order) ? brand.order : 0,
    search: {
      sort: "newest",
      ...(category && category !== "all" ? { category } : {}),
      ...(filterBrand ? { brand: filterBrand } : {}),
      ...(q ? { q } : {}),
    },
  };
}

export function homeBrandSearch(item: HomeBrandItem) {
  const { category = "all", brand, q, sort = "newest" } = item.search;
  return {
    category,
    sort,
    ...(brand ? { brand } : {}),
    ...(q ? { q } : {}),
  };
}

export function getCatalogBrandNames(brands: HomeBrandItem[]): string[] {
  return sortHomeBrands(brands).map(item => item.search.brand ?? item.name);
}

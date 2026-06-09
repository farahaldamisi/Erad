import {
  normalizeHomeBrand,
  seedHomeBrands,
  sortHomeBrands,
  type HomeBrandItem,
} from "./home-brands";

const STORAGE_KEY = "erad_home_brands_v1";

export function loadHomeBrands(): HomeBrandItem[] {
  if (typeof window === "undefined") return seedHomeBrands;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return seedHomeBrands;
    const parsed = JSON.parse(raw) as HomeBrandItem[];
    if (!Array.isArray(parsed)) return seedHomeBrands;
    return sortHomeBrands(parsed.map(normalizeHomeBrand));
  } catch {
    return seedHomeBrands;
  }
}

export function saveHomeBrands(brands: HomeBrandItem[]) {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(sortHomeBrands(brands).map(normalizeHomeBrand)));
}

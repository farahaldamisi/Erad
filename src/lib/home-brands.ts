import logoAsus from "@/assets/brands/asus.svg";
import logoHp from "@/assets/brands/hp.svg";
import logoLenovo from "@/assets/brands/lenovo.svg";
import logoDell from "@/assets/brands/dell.svg";
import logoEpson from "@/assets/brands/epson.svg";
import logoCanon from "@/assets/brands/canon.svg";
import logoDahua from "@/assets/brands/dahua.svg";
import { DAHUA_MONITORS_SEARCH } from "@/lib/home-spotlights";

export interface HomeBrandItem {
  id: string;
  name: string;
  logo: string;
  search: { category?: string; brand?: string; q?: string; sort?: "newest" };
  logoClassName?: string;
}

export const homeBrands: HomeBrandItem[] = [
  { id: "asus", name: "ASUS", logo: logoAsus, search: { brand: "ASUS", sort: "newest" }, logoClassName: "h-7 sm:h-8" },
  { id: "hp", name: "HP", logo: logoHp, search: { brand: "HP", sort: "newest" }, logoClassName: "h-10 sm:h-11" },
  { id: "lenovo", name: "Lenovo", logo: logoLenovo, search: { brand: "Lenovo", sort: "newest" }, logoClassName: "h-7 sm:h-8" },
  { id: "dell", name: "Dell", logo: logoDell, search: { brand: "Dell", sort: "newest" }, logoClassName: "h-10 sm:h-12" },
  { id: "epson", name: "Epson", logo: logoEpson, search: { category: "printers", brand: "Epson", sort: "newest" }, logoClassName: "h-7 sm:h-8" },
  { id: "canon", name: "Canon", logo: logoCanon, search: { category: "printers", brand: "Canon", sort: "newest" }, logoClassName: "h-8 sm:h-9" },
  {
    id: "dahua",
    name: "Dahua",
    logo: logoDahua,
    search: DAHUA_MONITORS_SEARCH,
    logoClassName: "h-10 sm:h-12",
  },
];

export function homeBrandSearch(item: HomeBrandItem) {
  const { category = "all", brand, q, sort = "newest" } = item.search;
  return {
    category,
    sort,
    ...(brand ? { brand } : {}),
    ...(q ? { q } : {}),
  };
}

/** Curated brands shown in filters and on the home strip */
export function getCatalogBrandNames(): string[] {
  return homeBrands.map(item => item.search.brand ?? item.name);
}

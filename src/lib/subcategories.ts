import type { Product } from "./products";
import { getSubcategoriesForSection } from "./product-filters";

export interface SubcategoryCatalogItem {
  slug: string;
  labelEn: string;
  labelAr: string;
}

const catalogBySection: Record<string, SubcategoryCatalogItem[]> = {
  laptops: [
    { slug: "gaming", labelEn: "Gaming Laptop", labelAr: "لابتوب جيمنغ" },
    { slug: "touch", labelEn: "Touch Screen Laptop", labelAr: "لابتوب تاتش" },
    { slug: "business", labelEn: "Business Laptop", labelAr: "لابتوب أعمال" },
  ],
  monitors: [
    { slug: "gaming", labelEn: "Gaming Monitor", labelAr: "شاشة جيمنغ" },
    { slug: "business", labelEn: "Business Monitor", labelAr: "شاشة أعمال" },
  ],
  components: [
    { slug: "cpu", labelEn: "CPU / Processor", labelAr: "معالج CPU" },
    { slug: "motherboard", labelEn: "Motherboard", labelAr: "لوحة أم" },
    { slug: "ram", labelEn: "RAM", labelAr: "ذاكرة RAM" },
    { slug: "case", labelEn: "PC Case", labelAr: "كيس" },
    { slug: "power-supply", labelEn: "Power Supply", labelAr: "مزود طاقة" },
    { slug: "cooling", labelEn: "Cooling System", labelAr: "نظام تبريد" },
  ],
  gaming: [
    { slug: "accessories", labelEn: "Gaming Accessories", labelAr: "إكسسوارات جيمنغ" },
    { slug: "desk", labelEn: "Gaming Desk", labelAr: "طاولة جيمنغ" },
    { slug: "chair", labelEn: "Gaming Chair", labelAr: "كرسي جيمنغ" },
  ],
  accessories: [
    { slug: "mouse", labelEn: "Mouse", labelAr: "ماوس" },
    { slug: "keyboard", labelEn: "Keyboard", labelAr: "كيبورد" },
    { slug: "headset", labelEn: "Headset", labelAr: "سماعة" },
    { slug: "webcam", labelEn: "Webcam", labelAr: "كاميرا ويب" },
    { slug: "mousepad", labelEn: "Mouse Pad", labelAr: "ماوس باد" },
    { slug: "speaker", labelEn: "Speaker", labelAr: "سبيكر" },
    { slug: "storage", labelEn: "External Storage", labelAr: "تخزين خارجي" },
    { slug: "hub", labelEn: "USB Hub / Dock", labelAr: "Hub / Dock" },
  ],
  printers: [{ slug: "general", labelEn: "All Printers", labelAr: "كل الطابعات" }],
  network: [
    { slug: "router", labelEn: "Router", labelAr: "راوتر" },
    { slug: "switch", labelEn: "Network Switch", labelAr: "سويتش شبكة" },
    { slug: "access-point", labelEn: "Access Point", labelAr: "Access Point" },
    { slug: "modem", labelEn: "Modem", labelAr: "مودم" },
    { slug: "cables", labelEn: "Network Cables", labelAr: "كابلات شبكة" },
    { slug: "adapters", labelEn: "Adapters", labelAr: "محولات" },
  ],
  desktops: [
    { slug: "standard", labelEn: "Desktop PC", labelAr: "جهاز مكتبي" },
    { slug: "gaming", labelEn: "Gaming Desktop", labelAr: "جهاز جيمنغ" },
    { slug: "all-in-one", labelEn: "All-in-One", labelAr: "جهاز متكامل" },
    { slug: "business", labelEn: "Business Desktop", labelAr: "جهاز أعمال" },
  ],
};

/** Sections that show all products together without sub-type cards (printers). */
export const SECTIONS_WITHOUT_SUBNAV = new Set<string>(["printers"]);

export function sectionHasSubcategoryNav(sectionId: string): boolean {
  return !SECTIONS_WITHOUT_SUBNAV.has(sectionId);
}

export interface SectionSubcategoryCard {
  slug: string;
  labelEn: string;
  labelAr: string;
  count: number;
  image?: string;
}

export function getSectionSubcategoryCards(
  products: Product[],
  sectionId: string,
  fallbackImage?: string,
): SectionSubcategoryCard[] {
  if (!sectionHasSubcategoryNav(sectionId)) return [];

  const fromProducts = getSubcategoriesForSection(products, sectionId);
  const productBySlug = new Map(fromProducts.map(item => [item.en, item]));
  const catalog = catalogBySection[sectionId] ?? [];

  const slugs = new Set<string>([
    ...catalog.map(item => item.slug),
    ...fromProducts.map(item => item.en),
  ]);

  return Array.from(slugs).map(slug => {
    const catalogItem = catalog.find(item => item.slug === slug);
    const productItem = productBySlug.get(slug);
    return {
      slug,
      labelEn: catalogItem?.labelEn ?? formatSlugLabel(slug),
      labelAr: catalogItem?.labelAr ?? productItem?.ar ?? formatSlugLabel(slug),
      count: productItem?.count ?? 0,
      image: productItem?.image ?? fallbackImage,
    };
  });
}

function formatSlugLabel(slug: string): string {
  return slug
    .split(/[-_]/)
    .filter(Boolean)
    .map(part => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

export function getSubcategoryCatalogForSection(sectionId: string): SubcategoryCatalogItem[] {
  return (
    catalogBySection[sectionId] ?? [{ slug: "general", labelEn: "General", labelAr: "عام" }]
  );
}

export function getSubcategoryCatalogLabel(sectionId: string, slug: string, lang: "en" | "ar"): string {
  const item = getSubcategoryCatalogForSection(sectionId).find(entry => entry.slug === slug);
  if (!item) return slug;
  return lang === "ar" ? item.labelAr : item.labelEn;
}

export function resolveSubcategoryAr(sectionId: string, slug: string): string {
  return getSubcategoryCatalogForSection(sectionId).find(entry => entry.slug === slug)?.labelAr ?? slug;
}

export function getSubcategoryLabel(item: SectionSubcategoryCard, lang: "en" | "ar"): string {
  return lang === "ar" ? item.labelAr : item.labelEn;
}

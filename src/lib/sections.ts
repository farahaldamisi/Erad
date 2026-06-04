import imgAccessories from "@/assets/p-acc1.jpg";
import imgCables from "@/assets/p-cable1.jpg";
import imgCases from "@/assets/p-case1.jpg";
import imgDesktops from "@/assets/p-desktop1.jpg";
import imgLaptops from "@/assets/p-laptop1.jpg";
import imgPrinters from "@/assets/p-printer1.jpg";
import type { Lang } from "./i18n";

export interface Section {
  id: string;
  name: string;
  nameAr: string;
  image: string;
  order: number;
}

export const seedSections: Section[] = [
  { id: "laptops", name: "Laptops", nameAr: "لابتوبات", image: imgLaptops, order: 0 },
  { id: "printers", name: "Printers", nameAr: "طابعات", image: imgPrinters, order: 1 },
  { id: "desktops", name: "Desktops", nameAr: "أجهزة حاسوب", image: imgDesktops, order: 2 },
  { id: "cases", name: "PC Cases", nameAr: "كيسات", image: imgCases, order: 3 },
  { id: "accessories", name: "Accessories", nameAr: "إكسسوارات", image: imgAccessories, order: 4 },
  { id: "cables-adapters", name: "Cables & Adapters", nameAr: "كابلات ومحولات", image: imgCables, order: 5 },
];

export function slugifySectionId(name: string): string {
  const slug = name
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
  return slug || `sec-${Date.now()}`;
}

const LEGACY_SECTION_IMAGE_MARKERS = ["categories/cat-", ".svg"] as const;
const STALE_CABLES_IMAGE_MARKERS = ["p-acc2.jpg", "p-acc1.jpg"] as const;

const defaultSectionImages = Object.fromEntries(seedSections.map(s => [s.id, s.image])) as Record<
  string,
  string
>;

export function migrateSeedSections(sections: Section[]): Section[] {
  const existing = new Set(sections.map(s => s.id));
  const merged = [...sections];
  for (const seed of seedSections) {
    if (!existing.has(seed.id)) merged.push(seed);
  }
  return sortSections(merged);
}

export function migrateSectionImages(sections: Section[]): Section[] {
  return sections.map(section => {
    const defaultImage = defaultSectionImages[section.id];
    if (!defaultImage) return section;

    const usesLegacyImage =
      !section.image ||
      LEGACY_SECTION_IMAGE_MARKERS.some(marker => section.image.includes(marker)) ||
      (section.id === "cables-adapters" && STALE_CABLES_IMAGE_MARKERS.some(marker => section.image.includes(marker)));

    return usesLegacyImage ? { ...section, image: defaultImage } : section;
  });
}

export function normalizeSection(section: Section): Section {
  return {
    ...section,
    name: section.name?.trim() ?? "",
    nameAr: section.nameAr?.trim() ?? section.name?.trim() ?? "",
    image: section.image?.trim() ?? "",
    order: Number.isFinite(section.order) ? section.order : 0,
  };
}

export function sortSections(sections: Section[]): Section[] {
  return [...sections].sort((a, b) => a.order - b.order || a.name.localeCompare(b.name));
}

export function getSectionLabel(section: Pick<Section, "name" | "nameAr">, lang: Lang): string {
  return lang === "ar" ? section.nameAr || section.name : section.name;
}

export function findSection(sections: Section[], id: string): Section | undefined {
  return sections.find(s => s.id === id);
}

export function resolveSectionLabel(sections: Section[], id: string, lang: Lang): string {
  const section = findSection(sections, id);
  return section ? getSectionLabel(section, lang) : id;
}

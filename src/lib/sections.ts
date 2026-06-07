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
  { id: "monitors", name: "Monitors", nameAr: "شاشات", image: imgLaptops, order: 1 },
  { id: "components", name: "Components", nameAr: "قطع حاسوب", image: imgCases, order: 2 },
  { id: "desktops", name: "Desktop Computers", nameAr: "أجهزة مكتبية", image: imgDesktops, order: 3 },
  { id: "gaming", name: "Gaming", nameAr: "جيمنغ", image: imgCases, order: 4 },
  { id: "accessories", name: "Accessories", nameAr: "إكسسوارات", image: imgAccessories, order: 5 },
  { id: "printers", name: "Printers", nameAr: "طابعات", image: imgPrinters, order: 6 },
  { id: "network", name: "Network", nameAr: "شبكات", image: imgCables, order: 7 },
];

const LEGACY_SECTION_IDS: Record<string, string> = {
  cases: "components",
  "cables-adapters": "network",
};

export function slugifySectionId(name: string): string {
  const slug = name
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
  return slug || `sec-${Date.now()}`;
}

const LEGACY_SECTION_IMAGE_MARKERS = ["categories/cat-", ".svg"] as const;
const STALE_NETWORK_IMAGE_MARKERS = ["p-acc2.jpg", "p-acc1.jpg"] as const;

const defaultSectionImages = Object.fromEntries(seedSections.map(s => [s.id, s.image])) as Record<
  string,
  string
>;

export function migrateSectionCatalog(sections: Section[]): Section[] {
  const migrated = sections.map(section => {
    const nextId = LEGACY_SECTION_IDS[section.id];
    if (!nextId) return section;
    const seed = seedSections.find(s => s.id === nextId);
    return {
      ...section,
      id: nextId,
      name: seed?.name ?? section.name,
      nameAr: seed?.nameAr ?? section.nameAr,
      image: seed?.image ?? section.image,
    };
  });

  const byId = new Map<string, Section>();
  for (const section of migrated) {
    const existing = byId.get(section.id);
    if (!existing || section.order < existing.order) {
      byId.set(section.id, section);
    }
  }
  return Array.from(byId.values());
}

export function migrateSeedSections(sections: Section[]): Section[] {
  const migrated = migrateSectionCatalog(sections);
  const existing = new Set(migrated.map(s => s.id));
  const merged = [...migrated];
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
      (section.id === "network" && STALE_NETWORK_IMAGE_MARKERS.some(marker => section.image.includes(marker)));

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

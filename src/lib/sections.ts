import catAccessories from "@/assets/p-acc1.jpg";
import catCases from "@/assets/p-case1.jpg";
import catDesktops from "@/assets/p-desktop1.jpg";
import catLaptops from "@/assets/p-laptop1.jpg";
import catPrinters from "@/assets/p-printer1.jpg";
import type { Lang } from "./i18n";

export interface Section {
  id: string;
  name: string;
  nameAr: string;
  image: string;
  order: number;
}

export const seedSections: Section[] = [
  { id: "laptops", name: "Laptops", nameAr: "لابتوبات", image: catLaptops, order: 0 },
  { id: "printers", name: "Printers", nameAr: "طابعات", image: catPrinters, order: 1 },
  { id: "desktops", name: "Desktops", nameAr: "أجهزة حاسوب", image: catDesktops, order: 2 },
  { id: "cases", name: "PC Cases", nameAr: "كيسات", image: catCases, order: 3 },
  { id: "accessories", name: "Accessories", nameAr: "إكسسوارات", image: catAccessories, order: 4 },
];

export function slugifySectionId(name: string): string {
  const slug = name
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
  return slug || `sec-${Date.now()}`;
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

import { normalizeSection, seedSections, sortSections, type Section } from "./sections";

const STORAGE_KEY = "erad_sections_v1";

export function loadSections(): Section[] {
  if (typeof window === "undefined") return seedSections;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return seedSections;
    return sortSections((JSON.parse(raw) as Section[]).map(normalizeSection));
  } catch {
    return seedSections;
  }
}

export function saveSections(sections: Section[]) {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(sortSections(sections).map(normalizeSection)));
}

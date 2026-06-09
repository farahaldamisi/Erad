import {
  normalizeHeroSlide,
  seedHeroSlides,
  sortHeroSlides,
  type HeroSlide,
} from "./hero-slides";

const STORAGE_KEY = "erad_hero_slides_v1";

export function loadHeroSlides(): HeroSlide[] {
  if (typeof window === "undefined") return seedHeroSlides;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return seedHeroSlides;
    const parsed = JSON.parse(raw) as HeroSlide[];
    if (!Array.isArray(parsed) || parsed.length === 0) return seedHeroSlides;
    return sortHeroSlides(parsed.map(normalizeHeroSlide));
  } catch {
    return seedHeroSlides;
  }
}

export function saveHeroSlides(slides: HeroSlide[]) {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(sortHeroSlides(slides).map(normalizeHeroSlide)));
}

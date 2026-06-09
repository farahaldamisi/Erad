import hero1 from "@/assets/hero-laptop.jpg";
import hero2 from "@/assets/hero-store.jpg";
import hero3 from "@/assets/hero-components.jpg";

export type HeroSlideIcon = "badge-check" | "shield-check" | "gift" | "users";

export interface HeroSlide {
  id: string;
  image: string;
  badgeEn: string;
  badgeAr: string;
  titleEn: string;
  titleAr: string;
  subEn: string;
  subAr: string;
  icon: HeroSlideIcon;
  order: number;
}

export const heroSlideIcons: HeroSlideIcon[] = ["badge-check", "shield-check", "gift", "users"];

export const seedHeroSlides: HeroSlide[] = [
  {
    id: "hero-1",
    image: hero1,
    badgeEn: "Official partner",
    badgeAr: "وكيل معتمد",
    titleEn: "Your trusted tech partner",
    titleAr: "شريكك الموثوق في التقنية",
    subEn: "Laptops, printers and computer components — genuine products with full local support.",
    subAr: "لابتوبات، طابعات وقطع حاسوب — منتجات أصلية مع دعم محلي كامل.",
    icon: "badge-check",
    order: 0,
  },
  {
    id: "hero-2",
    image: hero2,
    badgeEn: "Peace of mind",
    badgeAr: "اطمئنان",
    titleEn: "Warranty on every device",
    titleAr: "كفالة على كل جهاز",
    subEn: "Every product comes with manufacturer warranty plus our local after-sales support.",
    subAr: "كل منتج يأتي بكفالة المصنّع مع دعمنا المحلي بعد البيع.",
    icon: "shield-check",
    order: 1,
  },
  {
    id: "hero-3",
    image: hero3,
    badgeEn: "Special offer",
    badgeAr: "عرض خاص",
    titleEn: "Gifts on orders over 500 JOD",
    titleAr: "هدايا للمشتريات فوق 500 د.أ",
    subEn: "Spend 500 JOD or more and receive exclusive free gifts with your purchase.",
    subAr: "اشتري بقيمة 500 دينار أو أكثر واحصل على هدايا مجانية حصرية.",
    icon: "gift",
    order: 2,
  },
  {
    id: "hero-4",
    image: hero1,
    badgeEn: "Expert team",
    badgeAr: "طاقم متمكّن",
    titleEn: "A skilled team at your service",
    titleAr: "فريقنا جاهز لخدمتك",
    subEn: "Certified specialists ready to guide you — from choosing the right product to setup, maintenance, and after-sales support.",
    subAr: "متخصصون في التقنية — من الاستشارة واختيار الجهاز المناسب إلى التركيب والصيانة والدعم بعد البيع.",
    icon: "users",
    order: 3,
  },
];

export function sortHeroSlides(slides: HeroSlide[]): HeroSlide[] {
  return [...slides].sort((a, b) => a.order - b.order || a.id.localeCompare(b.id));
}

export function normalizeHeroSlide(slide: HeroSlide): HeroSlide {
  return {
    id: slide.id.trim(),
    image: slide.image.trim(),
    badgeEn: slide.badgeEn.trim(),
    badgeAr: slide.badgeAr.trim() || slide.badgeEn.trim(),
    titleEn: slide.titleEn.trim(),
    titleAr: slide.titleAr.trim() || slide.titleEn.trim(),
    subEn: slide.subEn.trim(),
    subAr: slide.subAr.trim() || slide.subEn.trim(),
    icon: heroSlideIcons.includes(slide.icon) ? slide.icon : "badge-check",
    order: Number.isFinite(slide.order) ? slide.order : 0,
  };
}

export function getHeroSlideText(
  slide: HeroSlide,
  field: "badge" | "title" | "sub",
  lang: "en" | "ar",
): string {
  if (lang === "ar") {
    if (field === "badge") return slide.badgeAr || slide.badgeEn;
    if (field === "title") return slide.titleAr || slide.titleEn;
    return slide.subAr || slide.subEn;
  }
  if (field === "badge") return slide.badgeEn;
  if (field === "title") return slide.titleEn;
  return slide.subEn;
}

export function createHeroSlideId(): string {
  return `hero-${Date.now().toString(36)}`;
}

import { Link } from "@tanstack/react-router";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, BadgeCheck, ChevronLeft, ChevronRight, Gift, ShieldCheck, Users } from "lucide-react";
import { useEffect, useState } from "react";
import { useI18n } from "@/lib/i18n";
import { cn } from "@/lib/utils";
import hero1 from "@/assets/hero-laptop.jpg";
import hero2 from "@/assets/hero-store.jpg";
import hero3 from "@/assets/hero-components.jpg";

const heroSlides = [
  {
    image: hero1,
    badge: "hero_slide_dahua_badge",
    title: "hero_slide_dahua_title",
    sub: "hero_slide_dahua_sub",
    icon: BadgeCheck,
  },
  {
    image: hero2,
    badge: "hero_slide_warranty_badge",
    title: "hero_slide_warranty_title",
    sub: "hero_slide_warranty_sub",
    icon: ShieldCheck,
  },
  {
    image: hero3,
    badge: "hero_slide_gifts_badge",
    title: "hero_slide_gifts_title",
    sub: "hero_slide_gifts_sub",
    icon: Gift,
  },
  {
    image: hero1,
    badge: "hero_slide_team_badge",
    title: "hero_slide_team_title",
    sub: "hero_slide_team_sub",
    icon: Users,
  },
] as const;

export function HomeHeroCarousel({ className }: { className?: string }) {
  const { t } = useI18n();
  const [i, setI] = useState(0);
  const slide = heroSlides[i];

  useEffect(() => {
    const id = setInterval(() => setI(x => (x + 1) % heroSlides.length), 4500);
    return () => clearInterval(id);
  }, []);

  const prev = () => setI(x => (x - 1 + heroSlides.length) % heroSlides.length);
  const next = () => setI(x => (x + 1) % heroSlides.length);

  return (
    <div className={cn("relative rounded-2xl border border-border overflow-hidden shadow-card min-h-[280px] sm:min-h-[360px] lg:min-h-[420px]", className)}>
      {heroSlides.map((s, idx) => (
        <motion.div
          key={idx}
          initial={false}
          animate={{ opacity: idx === i ? 1 : 0 }}
          transition={{ duration: 0.9, ease: "easeInOut" }}
          className="absolute inset-0 pointer-events-none"
          aria-hidden={idx !== i}
        >
          <img src={s.image} alt="" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/45 to-black/20" />
        </motion.div>
      ))}

      <div className="relative h-full min-h-[inherit] flex flex-col justify-center px-5 sm:px-8 py-8 pointer-events-none">
        <AnimatePresence mode="wait">
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.45 }}
            className="max-w-lg pointer-events-auto"
          >
            <span className="inline-flex items-center gap-2 px-3 py-1 mb-3 text-[10px] sm:text-xs uppercase tracking-widest font-semibold rounded-full bg-white/10 text-white border border-white/20 backdrop-blur">
              <slide.icon className="size-3.5" />
              {t(slide.badge)}
            </span>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white leading-tight mb-3">
              {t(slide.title)}
            </h1>
            <p className="text-sm sm:text-base text-white/85 mb-5 max-w-md leading-relaxed line-clamp-2 sm:line-clamp-none">
              {t(slide.sub)}
            </p>
            <Link
              to="/products"
              search={{ category: "all", sort: "newest" }}
              className="inline-flex items-center gap-2 h-10 px-5 rounded-full bg-primary text-primary-foreground text-sm font-semibold shadow-glow hover:scale-105 transition"
            >
              {t("cta_shop")} <ArrowRight className="size-4 rtl:rotate-180" />
            </Link>
          </motion.div>
        </AnimatePresence>
      </div>

      <button
        type="button"
        onClick={prev}
        className="absolute start-3 top-1/2 -translate-y-1/2 size-9 rounded-full bg-black/35 text-white hover:bg-black/55 backdrop-blur inline-flex items-center justify-center transition pointer-events-auto"
        aria-label="Previous slide"
      >
        <ChevronLeft className="size-5 rtl:rotate-180" />
      </button>
      <button
        type="button"
        onClick={next}
        className="absolute end-3 top-1/2 -translate-y-1/2 size-9 rounded-full bg-black/35 text-white hover:bg-black/55 backdrop-blur inline-flex items-center justify-center transition pointer-events-auto"
        aria-label="Next slide"
      >
        <ChevronRight className="size-5 rtl:rotate-180" />
      </button>

      <div className="absolute bottom-3 inset-x-0 flex justify-center gap-1.5 pointer-events-auto">
        {heroSlides.map((_, idx) => (
          <button
            key={idx}
            type="button"
            onClick={() => setI(idx)}
            aria-label={`Slide ${idx + 1}`}
            className={cn("h-1.5 rounded-full transition-all", idx === i ? "w-7 bg-primary" : "w-2 bg-white/45 hover:bg-white/70")}
          />
        ))}
      </div>
    </div>
  );
}

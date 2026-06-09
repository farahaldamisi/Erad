import { Link } from "@tanstack/react-router";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, BadgeCheck, ChevronLeft, ChevronRight, Gift, ShieldCheck, Users } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { useI18n } from "@/lib/i18n";
import { getHeroSlideText, sortHeroSlides, type HeroSlideIcon } from "@/lib/hero-slides";
import { useProducts } from "@/lib/products-context";
import { cn } from "@/lib/utils";

const iconMap: Record<HeroSlideIcon, LucideIcon> = {
  "badge-check": BadgeCheck,
  "shield-check": ShieldCheck,
  gift: Gift,
  users: Users,
};

export function HomeHeroCarousel({ className }: { className?: string }) {
  const { t, lang } = useI18n();
  const { heroSlides } = useProducts();
  const slides = useMemo(() => sortHeroSlides(heroSlides), [heroSlides]);
  const [i, setI] = useState(0);

  useEffect(() => {
    setI(current => (slides.length === 0 ? 0 : Math.min(current, slides.length - 1)));
  }, [slides.length]);

  useEffect(() => {
    if (slides.length <= 1) return;
    const id = setInterval(() => setI(x => (x + 1) % slides.length), 4500);
    return () => clearInterval(id);
  }, [slides.length]);

  if (slides.length === 0) return null;

  const slide = slides[i];
  const SlideIcon = iconMap[slide.icon];

  const prev = () => setI(x => (x - 1 + slides.length) % slides.length);
  const next = () => setI(x => (x + 1) % slides.length);

  return (
    <div className={cn("relative rounded-2xl border border-border overflow-hidden shadow-card min-h-[280px] sm:min-h-[360px] lg:min-h-[420px]", className)}>
      {slides.map((s, idx) => (
        <motion.div
          key={s.id}
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
            key={slide.id}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.45 }}
            className="max-w-lg pointer-events-auto"
          >
            <span className="inline-flex items-center gap-2 px-3 py-1 mb-3 text-[10px] sm:text-xs uppercase tracking-widest font-semibold rounded-full bg-white/10 text-white border border-white/20 backdrop-blur">
              <SlideIcon className="size-3.5" />
              {getHeroSlideText(slide, "badge", lang)}
            </span>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white leading-tight mb-3">
              {getHeroSlideText(slide, "title", lang)}
            </h1>
            <p className="text-sm sm:text-base text-white/85 mb-5 max-w-md leading-relaxed line-clamp-2 sm:line-clamp-none">
              {getHeroSlideText(slide, "sub", lang)}
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

      {slides.length > 1 && (
        <>
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
            {slides.map((s, idx) => (
              <button
                key={s.id}
                type="button"
                onClick={() => setI(idx)}
                aria-label={`Slide ${idx + 1}`}
                className={cn("h-1.5 rounded-full transition-all", idx === i ? "w-7 bg-primary" : "w-2 bg-white/45 hover:bg-white/70")}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}

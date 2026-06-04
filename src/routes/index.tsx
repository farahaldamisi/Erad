import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import { ArrowRight, Wrench, Network, ShieldCheck, BadgeCheck, Gift, X, Users } from "lucide-react";
import { useProducts } from "@/lib/products-context";
import { ProductCard } from "@/components/ProductCard";
import { getSectionLabel, sortSections } from "@/lib/sections";
import { useI18n } from "@/lib/i18n";
import hero1 from "@/assets/hero-laptop.jpg";
import hero2 from "@/assets/hero-store.jpg";
import hero3 from "@/assets/hero-components.jpg";

interface HomeSearch {
  welcome?: "login" | "register";
}

export const Route = createFileRoute("/")({
  validateSearch: (s: Record<string, unknown>): HomeSearch => ({
    welcome: s.welcome === "login" || s.welcome === "register" ? s.welcome : undefined,
  }),
  head: () => ({ meta: [{ title: "ERAD — Premium Computer Trading" }] }),
  component: Home,
});

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

function Home() {
  const { t, lang } = useI18n();
  const { products, sections } = useProducts();
  const search = Route.useSearch();
  const nav = Route.useNavigate();
  const [showWelcome, setShowWelcome] = useState(Boolean(search.welcome));
  const [i, setI] = useState(0);
  const slide = heroSlides[i];
  const featuredSections = sortSections(sections);

  useEffect(() => {
    if (!search.welcome) return;
    setShowWelcome(true);
    const timer = window.setTimeout(() => {
      setShowWelcome(false);
      nav({ search: {}, replace: true });
    }, 5000);
    return () => window.clearTimeout(timer);
  }, [search.welcome, nav]);

  useEffect(() => {
    const id = setInterval(() => setI(x => (x + 1) % heroSlides.length), 4500);
    return () => clearInterval(id);
  }, []);

  const cats = featuredSections.map(section => ({
    id: section.id,
    label: getSectionLabel(section, lang),
    image: section.image,
  }));

  return (
    <>
      <AnimatePresence>
        {showWelcome && search.welcome && (
          <motion.div
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            className="fixed top-20 inset-x-4 z-[60] mx-auto max-w-lg"
          >
            <div className="flex items-start gap-3 rounded-2xl border border-primary/20 bg-primary text-primary-foreground px-4 py-3 shadow-elegant">
              <p className="text-sm font-medium leading-snug flex-1">
                {search.welcome === "register" ? t("welcome_register_msg") : t("welcome_login_msg")}
              </p>
              <button
                type="button"
                onClick={() => {
                  setShowWelcome(false);
                  nav({ search: {}, replace: true });
                }}
                className="shrink-0 rounded-full p-1 hover:bg-white/15 transition"
                aria-label={t("cancel")}
              >
                <X className="size-4" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* HERO */}
      <section className="relative h-[88vh] min-h-[600px] overflow-hidden -mt-16">
        {heroSlides.map((s, idx) => (
          <motion.div
            key={idx}
            initial={false}
            animate={{ opacity: idx === i ? 1 : 0 }}
            transition={{ duration: 1.2, ease: "easeInOut" }}
            className="absolute inset-0 pointer-events-none"
            aria-hidden={idx !== i}
          >
            <img src={s.image} alt="" className="w-full h-full object-cover scale-105" />
            <div className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/55 to-black/25" />
          </motion.div>
        ))}

        <div className="relative h-full container mx-auto px-4 flex flex-col justify-center">
          <AnimatePresence mode="wait">
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -16 }}
              transition={{ duration: 0.55 }}
              className="max-w-2xl"
            >
              <span className="inline-flex items-center gap-2 px-3 py-1 mb-5 text-xs uppercase tracking-widest font-semibold rounded-full bg-white/10 text-white border border-white/20 backdrop-blur">
                <slide.icon className="size-3.5" />
                {t(slide.badge)}
              </span>
              <h1 className="text-4xl sm:text-6xl lg:text-7xl font-bold text-white leading-[1.08] mb-5">
                {t(slide.title)}
              </h1>
              <p className="text-lg text-white/85 mb-8 max-w-lg leading-relaxed">{t(slide.sub)}</p>
              <div className="flex flex-wrap gap-3">
                <Link to="/products" className="inline-flex items-center gap-2 h-12 px-7 rounded-full bg-primary text-primary-foreground font-semibold shadow-glow hover:scale-105 transition pointer-events-auto">
                  {t("cta_shop")} <ArrowRight className="size-4 rtl:rotate-180" />
                </Link>
                <Link to="/services" className="inline-flex items-center h-12 px-7 rounded-full bg-white/10 text-white font-semibold border border-white/20 backdrop-blur hover:bg-white/20 transition pointer-events-auto">
                  {t("cta_explore")}
                </Link>
              </div>
            </motion.div>
          </AnimatePresence>

          <div className="absolute bottom-6 start-4 end-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pointer-events-auto">
            <div className="flex flex-wrap gap-2">
              {heroSlides.map((s, idx) => (
                <button
                  key={s.title}
                  type="button"
                  onClick={() => setI(idx)}
                  className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[11px] font-semibold border backdrop-blur transition-all ${
                    idx === i
                      ? "bg-primary text-primary-foreground border-primary shadow-glow"
                      : "bg-white/10 text-white/80 border-white/20 hover:bg-white/20"
                  }`}
                >
                  <s.icon className="size-3" />
                  {t(s.badge)}
                </button>
              ))}
            </div>
            <div className="flex gap-2">
              {heroSlides.map((_, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setI(idx)}
                  aria-label={`Slide ${idx + 1}`}
                  className={`h-1.5 rounded-full transition-all ${idx === i ? "w-8 bg-primary" : "w-3 bg-white/40"}`}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CATEGORIES */}
      <section className="container mx-auto px-4 py-20">
        <div className="text-center mb-12">
          <h2 className="text-4xl sm:text-5xl font-bold mb-3">{t("featured")}</h2>
          <p className="text-muted-foreground">{t("featured_sub")}</p>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          {cats.map((c, idx) => (
            <motion.div key={c.id} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: idx * 0.08 }}>
              <Link
                to="/products"
                search={{ category: c.id }}
                className="group block bg-card border border-border rounded-2xl overflow-hidden shadow-card hover:shadow-glow hover:border-primary/40 hover:-translate-y-1 transition-all"
              >
                <div className="aspect-square overflow-hidden bg-white p-5 sm:p-6 border-b border-border/60">
                  <img
                    src={c.image}
                    alt={c.label}
                    loading="lazy"
                    className="w-full h-full object-contain transition-transform duration-500 group-hover:scale-105 drop-shadow-sm"
                  />
                </div>
                <div className="px-3 py-4 text-center">
                  <div className="font-semibold text-sm group-hover:text-primary transition-colors">{c.label}</div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </section>

      {/* BEST SELLERS */}
      <section className="container mx-auto px-4 pb-20">
        <div className="flex items-end justify-between mb-10">
          <div>
            <h2 className="text-4xl sm:text-5xl font-bold mb-2">{t("bestsellers")}</h2>
            <p className="text-muted-foreground">{t("bestsellers_sub")}</p>
          </div>
          <Link to="/products" className="hidden sm:inline-flex items-center gap-2 text-sm font-semibold text-primary hover:gap-3 transition-all">
            {t("nav_products")} <ArrowRight className="size-4 rtl:rotate-180" />
          </Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {products.slice(0, 8).map(p => <ProductCard key={p.id} p={p} />)}
        </div>
      </section>

      {/* SERVICES STRIP */}
      <section className="container mx-auto px-4 pb-24">
        <div className="grid md:grid-cols-3 gap-5">
          {[
            { icon: Wrench, title: t("cat_maintenance"), desc: t("maintenance_desc") },
            { icon: Network, title: t("cat_networking"), desc: t("networking_desc") },
            { icon: ShieldCheck, title: t("warranty_title"), desc: t("warranty_desc") },
          ].map((s, idx) => (
            <motion.div key={idx} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: idx * 0.1 }} className="relative overflow-hidden rounded-3xl p-8 bg-hero text-white shadow-elegant">
              <s.icon className="size-10 mb-4 text-white/90" />
              <h3 className="text-2xl font-bold mb-2">{s.title}</h3>
              <p className="text-white/80 text-sm leading-relaxed">{s.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>
    </>
  );
}

import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import { ArrowRight, Wrench, Network, ShieldCheck, X } from "lucide-react";
import { useProducts } from "@/lib/products-context";
import { ProductCard } from "@/components/ProductCard";
import { sortSections } from "@/lib/sections";
import { useI18n } from "@/lib/i18n";
import { HomeCategoryBar } from "@/components/home/HomeCategoryBar";
import { HomeCategorySidebar } from "@/components/home/HomeCategorySidebar";
import { HomeHeroCarousel } from "@/components/home/HomeHeroCarousel";
import { HomeBrandsStrip } from "@/components/home/HomeBrandsStrip";
import { HomeGamingPcSection } from "@/components/home/HomeGamingPcSection";
import { HomeNewArrivalsSection } from "@/components/home/HomeNewArrivalsSection";

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

function Home() {
  const { t } = useI18n();
  const { products, sections } = useProducts();
  const search = Route.useSearch();
  const nav = Route.useNavigate();
  const [showWelcome, setShowWelcome] = useState(Boolean(search.welcome));
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

      <section className="container mx-auto px-4 pt-6 pb-8">
        <HomeCategoryBar className="mb-4" />

        <div className="grid lg:grid-cols-[240px_minmax(0,1fr)] gap-4">
          <HomeCategorySidebar sections={featuredSections} className="hidden lg:flex" />
          <HomeHeroCarousel />
        </div>

        <HomeGamingPcSection className="mt-10" />
        <HomeBrandsStrip className="mt-8" />
        <HomeNewArrivalsSection className="mt-8" />
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
          {products.slice(0, 8).map(p => (
            <ProductCard key={p.id} p={p} />
          ))}
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
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              className="relative overflow-hidden rounded-3xl p-8 bg-hero text-white shadow-elegant"
            >
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

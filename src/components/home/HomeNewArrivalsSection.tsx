import { Link } from "@tanstack/react-router";
import { ArrowRight, Sparkles } from "lucide-react";
import { useMemo } from "react";
import { ProductCard } from "@/components/ProductCard";
import { getNewArrivalProducts } from "@/lib/home-spotlights";
import { useProducts } from "@/lib/products-context";
import { useI18n } from "@/lib/i18n";
import { cn } from "@/lib/utils";

const NEW_ARRIVALS_SEARCH = { category: "all" as const, sort: "newest" as const, newArrivals: true as const };

export function HomeNewArrivalsSection({ className }: { className?: string }) {
  const { t } = useI18n();
  const { products } = useProducts();
  const newArrivals = useMemo(() => getNewArrivalProducts(products).slice(0, 4), [products]);

  if (newArrivals.length === 0) return null;

  return (
    <section className={cn("space-y-5", className)}>
      <div className="flex items-end justify-between gap-3">
        <div>
          <span className="inline-flex items-center gap-1.5 text-amber-600 mb-1">
            <Sparkles className="size-4" />
            <span className="text-xs font-bold uppercase tracking-wider">{t("home_new_arrivals_hint")}</span>
          </span>
          <h2 className="text-xl sm:text-2xl font-bold">{t("home_new_arrivals")}</h2>
          <p className="text-sm text-muted-foreground mt-0.5">{t("home_new_arrivals_sub")}</p>
        </div>
        <Link
          to="/products"
          search={NEW_ARRIVALS_SEARCH}
          className="hidden sm:inline-flex items-center gap-2 text-sm font-semibold text-primary hover:gap-3 transition-all shrink-0"
        >
          {t("view_all_in_category")} <ArrowRight className="size-4 rtl:rotate-180" />
        </Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
        {newArrivals.map(p => (
          <ProductCard key={p.id} p={p} />
        ))}
      </div>

      <Link
        to="/products"
        search={NEW_ARRIVALS_SEARCH}
        className="sm:hidden inline-flex items-center justify-center gap-2 w-full h-11 rounded-full border border-border text-sm font-semibold hover:bg-accent transition"
      >
        {t("view_all_in_category")} <ArrowRight className="size-4 rtl:rotate-180" />
      </Link>
    </section>
  );
}

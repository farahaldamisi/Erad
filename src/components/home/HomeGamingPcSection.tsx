import { Link } from "@tanstack/react-router";
import { ArrowRight, Gamepad2 } from "lucide-react";
import { useMemo } from "react";
import { GamingPcCard } from "@/components/home/GamingPcCard";
import { GAMING_PC_SEARCH, getGamingPcProducts } from "@/lib/home-spotlights";
import { useProducts } from "@/lib/products-context";
import { useI18n } from "@/lib/i18n";
import { cn } from "@/lib/utils";

export function HomeGamingPcSection({ className }: { className?: string }) {
  const { t } = useI18n();
  const { products } = useProducts();
  const gamingPcs = useMemo(() => getGamingPcProducts(products).slice(0, 3), [products]);

  if (gamingPcs.length === 0) return null;

  return (
    <section className={cn("space-y-5", className)}>
      <div className="flex items-end justify-between gap-3">
        <div>
          <span className="inline-flex items-center gap-1.5 text-violet-600 mb-1">
            <Gamepad2 className="size-4" />
            <span className="text-xs font-bold uppercase tracking-wider">{t("home_gaming_pc_badge")}</span>
          </span>
          <h2 className="text-xl sm:text-2xl font-bold">{t("home_gaming_pc_title")}</h2>
          <p className="text-sm text-muted-foreground mt-0.5">{t("home_gaming_pc_sub")}</p>
        </div>
        <Link
          to="/products"
          search={GAMING_PC_SEARCH}
          className="hidden sm:inline-flex items-center gap-2 text-sm font-semibold text-primary hover:gap-3 transition-all shrink-0"
        >
          {t("view_all_in_category")} <ArrowRight className="size-4 rtl:rotate-180" />
        </Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
        {gamingPcs.map(product => (
          <GamingPcCard key={product.id} product={product} />
        ))}
      </div>

      <Link
        to="/products"
        search={GAMING_PC_SEARCH}
        className="sm:hidden inline-flex items-center justify-center gap-2 w-full h-11 rounded-full border border-border text-sm font-semibold hover:bg-accent transition"
      >
        {t("view_all_in_category")} <ArrowRight className="size-4 rtl:rotate-180" />
      </Link>
    </section>
  );
}

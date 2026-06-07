import { Link } from "@tanstack/react-router";
import { Percent, Sparkles } from "lucide-react";
import dahuaLogo from "@/assets/brands/dahua.svg";
import { homeQuickCategories, homeQuickCategorySearch } from "@/lib/home-categories";
import {
  DAHUA_MONITORS_SEARCH,
  getLatestNewArrival,
  getNewArrivalCategoryLabel,
  getSpecialOfferProducts,
} from "@/lib/home-spotlights";
import { useProducts } from "@/lib/products-context";
import { useI18n } from "@/lib/i18n";
import { formatNumber } from "@/lib/format";
import { cn } from "@/lib/utils";

function CategoryLinks({ className, inline }: { className?: string; inline?: boolean }) {
  const { t } = useI18n();

  return (
    <>
      {homeQuickCategories.map(item => {
        const Icon = item.icon;
        return (
          <Link
            key={item.labelKey}
            to="/products"
            search={homeQuickCategorySearch(item)}
            className={cn(
              "group flex flex-col items-center justify-center gap-1.5 min-w-[4.75rem] sm:min-w-[5.25rem] px-2 py-2.5 rounded-xl hover:bg-accent transition shrink-0",
              inline && "snap-start",
              className,
            )}
          >
            <Icon
              className="size-5 text-muted-foreground group-hover:text-foreground transition-colors"
              strokeWidth={1.75}
            />
            <span className="text-[10px] sm:text-[11px] font-semibold text-muted-foreground group-hover:text-foreground text-center leading-tight transition-colors">
              {t(item.labelKey)}
            </span>
          </Link>
        );
      })}
    </>
  );
}

function SpotlightLinks({
  latestCategory,
  offerCount,
  className,
  inline,
}: {
  latestCategory: string | null;
  offerCount: number;
  className?: string;
  inline?: boolean;
}) {
  const { t, lang } = useI18n();

  const cardClass = cn("shrink-0", inline && "snap-start", className);

  return (
    <>
      <Link
        to="/products"
        search={{ category: "all", sort: "newest", newArrivals: true }}
        className={cn(
          "group flex flex-col justify-center gap-1 min-w-[6.25rem] sm:min-w-[7rem] px-3 py-2 rounded-xl border-2 border-amber-400/70 bg-gradient-to-br from-amber-50 via-orange-50 to-amber-100/80 hover:from-amber-100 hover:to-orange-100 transition shadow-sm",
          cardClass,
        )}
      >
        <span className="inline-flex items-center gap-1.5 text-amber-700">
          <Sparkles className="size-4 shrink-0" />
          <span className="text-[10px] sm:text-[11px] font-bold uppercase tracking-wide leading-none">
            {t("home_new_arrivals")}
          </span>
        </span>
        <span className="text-[10px] font-semibold text-amber-900/80 line-clamp-1">
          {latestCategory ?? t("home_new_arrivals_hint")}
        </span>
      </Link>

      <Link
        to="/products"
        search={{ category: "all", sort: "newest", specialOffers: true }}
        className={cn(
          "group flex flex-col justify-center gap-1 min-w-[6.25rem] sm:min-w-[7rem] px-3 py-2 rounded-xl border-2 border-primary/40 bg-gradient-to-br from-primary/10 via-primary/5 to-rose-50 hover:from-primary/15 hover:to-rose-100/80 transition shadow-sm",
          cardClass,
        )}
      >
        <span className="inline-flex items-center gap-1.5 text-primary">
          <Percent className="size-4 shrink-0" />
          <span className="text-[10px] sm:text-[11px] font-bold uppercase tracking-wide leading-none">
            {t("home_special_offers")}
          </span>
        </span>
        <span className="text-[10px] font-semibold text-primary/80">
          {offerCount > 0
            ? t("home_special_offers_count").replace("{count}", formatNumber(offerCount))
            : t("home_special_offers_hint")}
        </span>
      </Link>

      <Link
        to="/products"
        search={DAHUA_MONITORS_SEARCH}
        title={t("home_dahua_monitors")}
        className={cn(
          "flex flex-col items-center justify-center gap-1 min-w-[5.25rem] sm:min-w-[6rem] px-2.5 py-2 rounded-xl border-2 border-border bg-card hover:border-primary/30 hover:shadow-md transition",
          cardClass,
        )}
      >
        <img src={dahuaLogo} alt="Dahua" className="h-6 sm:h-7 w-auto object-contain" />
        <span className="inline-flex items-center justify-center gap-1 text-[9px] sm:text-[10px] font-semibold text-muted-foreground leading-tight">
          {lang === "ar" ? (
            <>
              <span>{t("home_dahua_monitors_prefix")}</span>
              <img src={dahuaLogo} alt="" aria-hidden className="h-3 w-auto object-contain" />
            </>
          ) : (
            <>
              <img src={dahuaLogo} alt="" aria-hidden className="h-3 w-auto object-contain" />
              <span>{t("home_dahua_monitors_prefix")}</span>
            </>
          )}
        </span>
      </Link>
    </>
  );
}

export function HomeCategoryBar({ className }: { className?: string }) {
  const { lang } = useI18n();
  const { products, sections } = useProducts();
  const latestNew = getLatestNewArrival(products);
  const latestCategory = getNewArrivalCategoryLabel(latestNew, sections, lang);
  const offerCount = getSpecialOfferProducts(products).length;

  return (
    <div className={cn("rounded-2xl border border-border bg-card shadow-card overflow-hidden", className)}>
      {/* Mobile / tablet: one scroll row — categories first, then promos */}
      <div className="lg:hidden overflow-x-auto overscroll-x-contain scrollbar-none touch-pan-x snap-x snap-mandatory">
        <div className="flex items-stretch gap-1 p-2 min-w-max">
          <CategoryLinks inline />
          <div className="w-px bg-border shrink-0 self-stretch my-1" aria-hidden />
          <SpotlightLinks latestCategory={latestCategory} offerCount={offerCount} inline />
        </div>
      </div>

      {/* Desktop (with sidebar layout): categories + promos in one row */}
      <div className="hidden lg:flex items-stretch min-h-[4.5rem]">
        <div className="flex items-stretch gap-0.5 overflow-x-auto p-2 flex-1 min-w-0 scrollbar-none">
          <CategoryLinks />
        </div>
        <div className="w-px bg-border shrink-0 my-2" aria-hidden />
        <div className="flex items-stretch gap-2 p-2 shrink-0 overflow-x-auto scrollbar-none">
          <SpotlightLinks latestCategory={latestCategory} offerCount={offerCount} />
        </div>
      </div>
    </div>
  );
}

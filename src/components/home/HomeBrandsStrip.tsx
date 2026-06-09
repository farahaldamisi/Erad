import { Link } from "@tanstack/react-router";
import { useMemo } from "react";
import { homeBrandSearch, sortHomeBrands, type HomeBrandItem } from "@/lib/home-brands";
import { useProducts } from "@/lib/products-context";
import { useI18n } from "@/lib/i18n";
import { cn } from "@/lib/utils";

function BrandLogo({ brand }: { brand: HomeBrandItem }) {
  return (
    <Link
      to="/products"
      search={homeBrandSearch(brand)}
      title={brand.name}
      className="group flex flex-1 min-w-0 items-center justify-center px-2 py-2 sm:px-3 sm:py-3 hover:bg-gray-100 transition rounded-xl"
    >
      <img
        src={brand.logo}
        alt={brand.name}
        className={cn(
          "w-auto max-w-full max-h-8 sm:max-h-10 object-contain opacity-90 group-hover:opacity-100 transition",
          brand.logoClassName,
        )}
      />
    </Link>
  );
}

export function HomeBrandsStrip({ className }: { className?: string }) {
  const { t } = useI18n();
  const { homeBrands } = useProducts();
  const brands = useMemo(() => sortHomeBrands(homeBrands), [homeBrands]);

  if (brands.length === 0) return null;

  return (
    <section className={cn("space-y-4", className)}>
      <div>
        <h2 className="text-xl sm:text-2xl font-bold">{t("home_shop_by_brand")}</h2>
        <p className="text-sm text-muted-foreground mt-0.5">{t("home_shop_by_brand_sub")}</p>
      </div>

      <div className="rounded-2xl border border-gray-200 bg-white shadow-card overflow-hidden">
        <div className="flex items-center divide-x divide-gray-200 overflow-x-auto">
          {brands.map(brand => (
            <BrandLogo key={brand.id} brand={brand} />
          ))}
        </div>
      </div>
    </section>
  );
}

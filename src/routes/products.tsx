import { createFileRoute } from "@tanstack/react-router";
import { useMemo } from "react";
import { motion } from "framer-motion";
import { Search, SlidersHorizontal } from "lucide-react";
import { useProducts } from "@/lib/products-context";
import { ProductCard } from "@/components/ProductCard";
import { CategorySubcategoryGrid } from "@/components/products/CategorySubcategoryGrid";
import { filterProducts, type ProductSearchParams } from "@/lib/product-filters";
import { getSectionLabel, sortSections } from "@/lib/sections";
import { sectionHasSubcategoryNav } from "@/lib/subcategories";
import { getCatalogBrandNames } from "@/lib/home-brands";
import { useI18n } from "@/lib/i18n";
import { formatNumber } from "@/lib/format";

type Search = ProductSearchParams;

function parseSearch(raw: Record<string, unknown>): Search {
  const min = raw.minPrice != null ? Number(raw.minPrice) : undefined;
  const max = raw.maxPrice != null ? Number(raw.maxPrice) : undefined;
  return {
    category: typeof raw.category === "string" ? raw.category : "all",
    sub: typeof raw.sub === "string" ? raw.sub : undefined,
    brand: typeof raw.brand === "string" ? raw.brand : undefined,
    inStock: raw.inStock === true || raw.inStock === "true",
    outOfStock: raw.outOfStock === true || raw.outOfStock === "true",
    newArrivals: raw.newArrivals === true || raw.newArrivals === "true",
    specialOffers: raw.specialOffers === true || raw.specialOffers === "true",
    sort: (raw.sort as Search["sort"]) ?? "newest",
    q: typeof raw.q === "string" ? raw.q : undefined,
    minPrice: min != null && !Number.isNaN(min) ? min : undefined,
    maxPrice: max != null && !Number.isNaN(max) ? max : undefined,
  };
}

export const Route = createFileRoute("/products")({
  validateSearch: parseSearch,
  head: () => ({ meta: [{ title: "Products — ERAD" }] }),
  component: ProductsPage,
});

function ProductsPage() {
  const { products, sections } = useProducts();
  const search = Route.useSearch();
  const nav = Route.useNavigate();
  const { t, lang } = useI18n();

  const categorySelected = Boolean(search.category && search.category !== "all");

  const sortedSections = useMemo(() => sortSections(sections), [sections]);
  const activeSection = sortedSections.find(section => section.id === search.category);
  const showSubcategoryGrid =
    categorySelected &&
    !search.newArrivals &&
    !search.specialOffers &&
    Boolean(activeSection && sectionHasSubcategoryNav(activeSection.id));
  const brands = useMemo(() => getCatalogBrandNames(), []);
  const subs = useMemo(() => {
    if (!categorySelected) return [];
    const scoped = products.filter(p => p.category === search.category);
    return Array.from(
      new Set(scoped.map(p => JSON.stringify({ en: p.subcategory, ar: p.subcategoryAr }))),
    ).map(s => JSON.parse(s) as { en: string; ar: string });
  }, [products, search.category, categorySelected]);

  const filtered = useMemo(() => filterProducts(products, search), [products, search]);
  const stockCounts = useMemo(() => {
    const base = filterProducts(products, {
      ...search,
      inStock: undefined,
      outOfStock: undefined,
    });
    return {
      inStock: base.filter(p => p.stock > 0).length,
      outOfStock: base.filter(p => p.stock <= 0).length,
    };
  }, [products, search]);

  const updateSearch = (patch: Partial<Search>) => {
    const next: Search = { ...search, ...patch, category: patch.category ?? search.category ?? "all", sort: patch.sort ?? search.sort ?? "newest" };
    if (!next.q?.trim()) delete next.q;
    else next.q = next.q.trim();
    if (!next.brand) delete next.brand;
    if (!next.sub) delete next.sub;
    if (!next.inStock) delete next.inStock;
    if (!next.outOfStock) delete next.outOfStock;
    if (!next.newArrivals) delete next.newArrivals;
    if (!next.specialOffers) delete next.specialOffers;
    if (next.minPrice == null || Number.isNaN(next.minPrice)) delete next.minPrice;
    if (next.maxPrice == null || Number.isNaN(next.maxPrice)) delete next.maxPrice;
    nav({ search: next });
  };

  const resetFilters = () => {
    nav({ search: { category: "all", sort: "newest" } });
  };

  return (
    <div className="container mx-auto px-4 py-12">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
        {!showSubcategoryGrid && (
          <>
            <h1 className="text-5xl font-bold mb-2">
              {search.newArrivals
                ? t("home_new_arrivals")
                : search.specialOffers
                  ? t("home_special_offers")
                  : t("nav_products")}
            </h1>
            <p className="text-muted-foreground">
              {search.newArrivals
                ? t("home_new_arrivals_sub")
                : search.specialOffers
                  ? t("home_special_offers_sub")
                  : t("featured_sub")}
            </p>
          </>
        )}
      </motion.div>

      <div className="relative mb-6 max-w-2xl">
        <Search className="absolute top-1/2 -translate-y-1/2 start-4 size-5 text-muted-foreground" />
        <input
          value={search.q ?? ""}
          onChange={e => updateSearch({ q: e.target.value })}
          placeholder={t("search_products")}
          className="w-full h-12 rounded-2xl border border-border bg-card ps-12 pe-4 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 shadow-card"
        />
      </div>

      <div className="flex flex-wrap gap-2 mb-6">
        <button
          type="button"
          onClick={() => updateSearch({ category: "all", sub: undefined })}
          className={`px-4 py-2 rounded-full text-sm font-semibold border transition ${
            (search.category ?? "all") === "all"
              ? "bg-primary text-primary-foreground border-primary shadow-glow"
              : "bg-card border-border hover:border-primary/40"
          }`}
        >
          {t("all")}
        </button>
        {sortedSections.map(section => {
          const active = search.category === section.id;
          return (
            <button
              key={section.id}
              type="button"
              onClick={() => updateSearch({ category: section.id, sub: undefined })}
              className={`px-4 py-2 rounded-full text-sm font-semibold border transition ${
                active
                  ? "bg-primary text-primary-foreground border-primary shadow-glow"
                  : "bg-card border-border hover:border-primary/40"
              }`}
            >
              {getSectionLabel(section, lang)}
            </button>
          );
        })}
      </div>

      {showSubcategoryGrid && activeSection && (
        <CategorySubcategoryGrid
          section={activeSection}
          products={products}
          activeSub={search.sub}
          onSelect={sub => updateSearch({ sub })}
        />
      )}

      <div className="grid lg:grid-cols-[280px_1fr] gap-8">
        <aside className="bg-card border border-border rounded-2xl p-5 h-fit sticky top-[5.5rem] space-y-5 shadow-card">
          <div className="flex items-center gap-2">
            <SlidersHorizontal className="size-4 text-primary" />
            <h3 className="font-bold text-lg">{t("filter")}</h3>
          </div>

          {categorySelected && subs.length > 0 && !showSubcategoryGrid && sectionHasSubcategoryNav(search.category ?? "") && (
            <div>
              <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2 block">
                {t("subcategory")}
              </label>
              <div className="flex flex-wrap gap-1.5">
                <button
                  type="button"
                  onClick={() => updateSearch({ sub: undefined })}
                  className={`px-3 py-1.5 text-xs rounded-full border ${!search.sub ? "bg-primary text-primary-foreground border-primary" : "bg-card border-border"}`}
                >
                  {t("all")}
                </button>
                {subs.map(s => (
                  <button
                    key={s.en}
                    type="button"
                    onClick={() => updateSearch({ sub: s.en })}
                    className={`px-3 py-1.5 text-xs rounded-full border ${search.sub === s.en ? "bg-primary text-primary-foreground border-primary" : "bg-card border-border"}`}
                  >
                    {lang === "ar" ? s.ar : s.en}
                  </button>
                ))}
              </div>
            </div>
          )}

          <div>
            <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2 block">
              {t("stock")}
            </label>
            <div className="space-y-2">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={search.inStock ?? false}
                  onChange={e => updateSearch({ inStock: e.target.checked })}
                  className="size-4 accent-primary"
                />
                <span className="text-sm flex-1">{t("in_stock")}</span>
                <span className="text-xs text-muted-foreground">({formatNumber(stockCounts.inStock)})</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={search.outOfStock ?? false}
                  onChange={e => updateSearch({ outOfStock: e.target.checked })}
                  className="size-4 accent-primary"
                />
                <span className="text-sm flex-1">{t("out_stock")}</span>
                <span className="text-xs text-muted-foreground">({formatNumber(stockCounts.outOfStock)})</span>
              </label>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2 block">
                {t("price_min")}
              </label>
              <input
                type="number"
                min={0}
                value={search.minPrice ?? ""}
                onChange={e =>
                  updateSearch({ minPrice: e.target.value === "" ? undefined : Number(e.target.value) })
                }
                className="w-full h-10 rounded-lg border border-border bg-background px-3 text-sm"
              />
            </div>
            <div>
              <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2 block">
                {t("price_max")}
              </label>
              <input
                type="number"
                min={0}
                value={search.maxPrice ?? ""}
                onChange={e =>
                  updateSearch({ maxPrice: e.target.value === "" ? undefined : Number(e.target.value) })
                }
                className="w-full h-10 rounded-lg border border-border bg-background px-3 text-sm"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2 block">
              {t("brand_label")}
            </label>
            <select
              value={search.brand ?? ""}
              onChange={e => updateSearch({ brand: e.target.value })}
              className="w-full h-10 rounded-lg border border-border bg-background px-3 text-sm"
            >
              <option value="">{t("all")}</option>
              {brands.map(b => (
                <option key={b} value={b}>
                  {b}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2 block">
              {t("sort_by")}
            </label>
            <select
              value={search.sort ?? "newest"}
              onChange={e => updateSearch({ sort: e.target.value as Search["sort"] })}
              className="w-full h-10 rounded-lg border border-border bg-background px-3 text-sm"
            >
              <option value="newest">{t("newest")}</option>
              <option value="price_low">{t("price_low")}</option>
              <option value="price_high">{t("price_high")}</option>
            </select>
          </div>

          <button
            type="button"
            onClick={resetFilters}
            className="w-full h-10 rounded-full border border-border text-sm font-semibold hover:bg-accent transition"
          >
            {t("reset_filters")}
          </button>
        </aside>

        <div>
          {showSubcategoryGrid && (
            <h3 className="text-xl font-bold mb-4">
              {search.sub ? t("category_products_filtered") : t("category_products_heading")}
            </h3>
          )}

          {filtered.length === 0 ? (
            <div className="text-center py-20 text-muted-foreground">
              {t("no_products")}
              <div className="mt-4">
                <button type="button" onClick={resetFilters} className="text-primary font-semibold">
                  {t("reset_filters")}
                </button>
              </div>
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-6">
              {filtered.map(p => (
                <ProductCard key={p.id} p={p} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

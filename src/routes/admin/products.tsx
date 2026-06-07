import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Edit3, Plus, Search, SlidersHorizontal, Trash2 } from "lucide-react";
import { ProductForm } from "@/components/admin/ProductForm";
import { normalizeProduct, type Product } from "@/lib/products";
import { filterProducts, groupProductsBySection, type ProductSearchParams } from "@/lib/product-filters";
import { GAMING_PC_SEARCH } from "@/lib/home-spotlights";
import { isGamingDesktop } from "@/lib/products";
import { getSubcategoryCatalogForSection, getSubcategoryCatalogLabel } from "@/lib/subcategories";
import { maybeLogLowStockAlert } from "@/lib/stock-alerts";
import { formatPrice } from "@/lib/currency";
import { formatNumber } from "@/lib/format";
import { getSectionLabel, sortSections } from "@/lib/sections";
import { getCatalogBrandNames } from "@/lib/home-brands";
import { useProducts } from "@/lib/products-context";
import { useI18n } from "@/lib/i18n";

export const Route = createFileRoute("/admin/products")({
  head: () => ({ meta: [{ title: "Products — ERAD Admin" }] }),
  component: AdminProductsPage,
});

const emptyFilters: ProductSearchParams = {
  category: "all",
  sort: "newest",
};

function AdminProductsPage() {
  const { t, lang } = useI18n();
  const { products: list, setProducts: setList, sections } = useProducts();
  const [showForm, setShowForm] = useState(false);
  const [edit, setEdit] = useState<Product | null>(null);
  const [addSectionId, setAddSectionId] = useState<string | undefined>();
  const [filters, setFilters] = useState<ProductSearchParams>(emptyFilters);

  const sortedSections = useMemo(() => sortSections(sections), [sections]);
  const brands = useMemo(() => getCatalogBrandNames(), []);

  const filtered = useMemo(() => filterProducts(list, filters), [list, filters]);
  const grouped = useMemo(
    () => groupProductsBySection(filtered, sections, { hideEmpty: hasActiveFilters(filters) }),
    [filtered, sections, filters],
  );

  const removeP = (id: string) => setList(l => l.filter(p => p.id !== id));
  const saveP = (p: Product) => {
    const previous = edit ? list.find(x => x.id === p.id) : null;
    const normalized = normalizeProduct(p);
    setList(l => (edit ? l.map(x => (x.id === p.id ? normalized : x)) : [normalized, ...l]));
    maybeLogLowStockAlert({
      productId: normalized.id,
      productName: normalized.name,
      previousStock: previous?.stock ?? normalized.stock,
      newStock: normalized.stock,
      brand: normalized.brand,
      category: normalized.category,
      subcategory: normalized.subcategory,
    });
    setShowForm(false);
    setEdit(null);
    setAddSectionId(undefined);
  };

  const openAdd = (sectionId?: string) => {
    setEdit(null);
    setAddSectionId(sectionId);
    setShowForm(true);
  };

  const updateFilters = (patch: Partial<ProductSearchParams>) => {
    setFilters(prev => {
      const next = { ...prev, ...patch, category: patch.category ?? prev.category ?? "all", sort: patch.sort ?? prev.sort ?? "newest" };
      if (!next.q?.trim()) delete next.q;
      else next.q = next.q.trim();
      if (!next.brand) delete next.brand;
      if (!next.sub) delete next.sub;
      if (!next.inStock) delete next.inStock;
      if (!next.newArrivals) delete next.newArrivals;
      if (!next.specialOffers) delete next.specialOffers;
      if (next.minPrice == null || Number.isNaN(next.minPrice)) delete next.minPrice;
      if (next.maxPrice == null || Number.isNaN(next.maxPrice)) delete next.maxPrice;
      return next;
    });
  };

  const resetFilters = () => setFilters(emptyFilters);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-3xl font-bold">{t("nav_products")}</h2>
          <p className="text-muted-foreground mt-1">
            {formatNumber(filtered.length)} / {formatNumber(list.length)} {t("admin_items")}
          </p>
        </div>
        <button
          type="button"
          onClick={() => openAdd()}
          className="inline-flex items-center gap-2 h-11 px-5 rounded-full bg-primary text-primary-foreground font-semibold shadow-glow"
        >
          <Plus className="size-4" /> {t("add_product")}
        </button>
      </div>

      <div className="bg-card border border-border rounded-2xl p-4 md:p-5 shadow-card space-y-4">
        <div className="relative">
          <Search className="absolute top-1/2 -translate-y-1/2 start-3 size-4 text-muted-foreground" />
          <input
            value={filters.q ?? ""}
            onChange={e => updateFilters({ q: e.target.value })}
            placeholder={t("search_products")}
            className="w-full h-11 rounded-xl border border-border bg-background ps-10 pe-4 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
          />
        </div>

        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => updateFilters({ category: "all" })}
            className={`px-3 py-1.5 rounded-full text-xs font-semibold border transition ${
              (filters.category ?? "all") === "all"
                ? "bg-primary text-primary-foreground border-primary"
                : "bg-background border-border hover:border-primary/40"
            }`}
          >
            {t("all")}
          </button>
          {sortedSections.map(section => (
            <button
              key={section.id}
              type="button"
              onClick={() => updateFilters({ category: section.id, sub: undefined })}
              className={`px-3 py-1.5 rounded-full text-xs font-semibold border transition ${
                filters.category === section.id
                  ? "bg-primary text-primary-foreground border-primary"
                  : "bg-background border-border hover:border-primary/40"
              }`}
            >
              {getSectionLabel(section, lang)}
            </button>
          ))}
          <button
            type="button"
            onClick={() => updateFilters({ category: GAMING_PC_SEARCH.category, sub: GAMING_PC_SEARCH.sub })}
            className={`px-3 py-1.5 rounded-full text-xs font-semibold border transition ${
              filters.category === GAMING_PC_SEARCH.category && filters.sub === GAMING_PC_SEARCH.sub
                ? "bg-violet-600 text-white border-violet-600"
                : "bg-background border-border hover:border-violet-500/40"
            }`}
          >
            {t("admin_filter_gaming_pc")}
          </button>
        </div>

        {filters.category && filters.category !== "all" && (
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => updateFilters({ sub: undefined })}
              className={`px-3 py-1.5 rounded-full text-xs font-semibold border transition ${
                !filters.sub ? "bg-primary text-primary-foreground border-primary" : "bg-background border-border"
              }`}
            >
              {t("all")} — {t("subcategory")}
            </button>
            {getSubcategoryCatalogForSection(filters.category).map(option => (
              <button
                key={option.slug}
                type="button"
                onClick={() => updateFilters({ sub: option.slug })}
                className={`px-3 py-1.5 rounded-full text-xs font-semibold border transition ${
                  filters.sub === option.slug
                    ? "bg-primary text-primary-foreground border-primary"
                    : "bg-background border-border hover:border-primary/40"
                }`}
              >
                {lang === "ar" ? option.labelAr : option.labelEn}
              </button>
            ))}
          </div>
        )}

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3 pt-1 border-t border-border">
          <div className="flex items-center gap-2 sm:col-span-2 lg:col-span-1">
            <SlidersHorizontal className="size-4 text-primary shrink-0" />
            <span className="text-sm font-semibold">{t("filter")}</span>
          </div>
          <select
            value={filters.brand ?? ""}
            onChange={e => updateFilters({ brand: e.target.value })}
            className="h-10 rounded-lg border border-border bg-background px-3 text-sm"
          >
            <option value="">{t("all")} — {t("brand_label")}</option>
            {brands.map(b => (
              <option key={b} value={b}>
                {b}
              </option>
            ))}
          </select>
          <select
            value={filters.sort ?? "newest"}
            onChange={e => updateFilters({ sort: e.target.value as ProductSearchParams["sort"] })}
            className="h-10 rounded-lg border border-border bg-background px-3 text-sm"
          >
            <option value="newest">{t("newest")}</option>
            <option value="price_low">{t("price_low")}</option>
            <option value="price_high">{t("price_high")}</option>
          </select>
          <label className="flex items-center gap-2 h-10 px-1 cursor-pointer">
            <input
              type="checkbox"
              checked={filters.inStock ?? false}
              onChange={e => updateFilters({ inStock: e.target.checked })}
              className="size-4 accent-primary"
            />
            <span className="text-sm">{t("in_stock")}</span>
          </label>
          <label className="flex items-center gap-2 h-10 px-1 cursor-pointer">
            <input
              type="checkbox"
              checked={filters.newArrivals ?? false}
              onChange={e => updateFilters({ newArrivals: e.target.checked })}
              className="size-4 accent-primary"
            />
            <span className="text-sm">{t("home_new_arrivals")}</span>
          </label>
          <label className="flex items-center gap-2 h-10 px-1 cursor-pointer">
            <input
              type="checkbox"
              checked={filters.specialOffers ?? false}
              onChange={e => updateFilters({ specialOffers: e.target.checked })}
              className="size-4 accent-primary"
            />
            <span className="text-sm">{t("home_special_offers")}</span>
          </label>
        </div>

        <button
          type="button"
          onClick={resetFilters}
          className="text-xs font-semibold text-primary hover:underline"
        >
          {t("reset_filters")}
        </button>
      </div>

      {grouped.length === 0 ? (
        <div className="bg-card border border-border rounded-2xl p-12 text-center text-muted-foreground shadow-card">
          {t("no_products")}
        </div>
      ) : (
        grouped.map(({ section, products }) => (
          <SectionProductsBlock
            key={section.id}
            section={section}
            products={products}
            onAdd={() => openAdd(section.id)}
            onEdit={p => {
              setEdit(p);
              setAddSectionId(undefined);
              setShowForm(true);
            }}
            onRemove={removeP}
          />
        ))
      )}

      {showForm && (
        <ProductForm
          initial={edit}
          defaultSectionId={addSectionId}
          onClose={() => {
            setShowForm(false);
            setEdit(null);
            setAddSectionId(undefined);
          }}
          onSave={saveP}
        />
      )}
    </div>
  );
}

function hasActiveFilters(filters: ProductSearchParams) {
  return Boolean(
    filters.q?.trim() ||
      (filters.category && filters.category !== "all") ||
      filters.sub ||
      filters.brand ||
      filters.inStock ||
      filters.newArrivals ||
      filters.specialOffers ||
      filters.minPrice != null ||
      filters.maxPrice != null,
  );
}

function SectionProductsBlock({
  section,
  products,
  onAdd,
  onEdit,
  onRemove,
}: {
  section: { id: string; name: string; nameAr: string; image: string };
  products: Product[];
  onAdd: () => void;
  onEdit: (p: Product) => void;
  onRemove: (id: string) => void;
}) {
  const { t, lang } = useI18n();
  const label = getSectionLabel(section, lang);

  return (
    <section className="bg-card border border-border rounded-2xl shadow-card overflow-hidden">
      <div className="px-4 md:px-5 py-4 border-b border-border flex flex-wrap items-center justify-between gap-3 bg-subtle/40">
        <div className="flex items-center gap-3 min-w-0">
          {section.image ? (
            <img src={section.image} alt="" className="size-12 rounded-xl object-cover border border-border shrink-0" />
          ) : (
            <div className="size-12 rounded-xl bg-subtle border border-border shrink-0" />
          )}
          <div>
            <h3 className="font-bold text-lg">{label}</h3>
            <p className="text-xs text-muted-foreground">
              {formatNumber(products.length)} {t("admin_products_in_section")}
            </p>
          </div>
        </div>
        <button
          type="button"
          onClick={onAdd}
          className="inline-flex items-center gap-1.5 h-9 px-3 rounded-full border border-primary/30 text-primary text-xs font-semibold hover:bg-primary/10 transition"
        >
          <Plus className="size-3.5" /> {t("admin_add_to_section")}
        </button>
      </div>

      {products.length === 0 ? (
        <p className="px-5 py-10 text-center text-sm text-muted-foreground">{t("admin_no_products_in_section")}</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-subtle">
              <tr>
                <th className="text-start px-4 py-3 font-semibold text-xs uppercase tracking-wider">{t("product_name")}</th>
                <th className="text-start px-4 py-3 font-semibold text-xs uppercase tracking-wider">{t("brand_label")}</th>
                <th className="text-start px-4 py-3 font-semibold text-xs uppercase tracking-wider">{t("subcategory")}</th>
                <th className="text-start px-4 py-3 font-semibold text-xs uppercase tracking-wider">{t("admin_col_badges")}</th>
                <th className="text-start px-4 py-3 font-semibold text-xs uppercase tracking-wider">{t("price")}</th>
                <th className="text-start px-4 py-3 font-semibold text-xs uppercase tracking-wider">{t("stock")}</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {products.map(p => (
                <tr key={p.id} className="border-t border-border hover:bg-accent/30">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <img src={p.image} alt="" className="size-9 rounded object-contain bg-subtle shrink-0" />
                      <span className="font-medium">{p.name}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">{p.brand}</td>
                  <td className="px-4 py-3 text-muted-foreground text-xs">
                    {getSubcategoryCatalogLabel(section.id, p.subcategory, lang)}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex flex-wrap gap-1">
                      {isGamingDesktop(p.category, p.subcategory) && (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-violet-500/15 text-violet-700">
                          {t("home_gaming_pc_title")}
                        </span>
                      )}
                      {p.isNewArrival && (
                        <span className="px-2 py-0.5 rounded-sm text-[10px] font-bold bg-primary text-primary-foreground uppercase">
                          {t("badge_new")}
                        </span>
                      )}
                      {(p.discountPercent ?? 0) > 0 && (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-500/15 text-rose-600">
                          −{formatNumber(p.discountPercent ?? 0)}%
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="px-4 py-3 font-semibold whitespace-nowrap">{formatPrice(p.price, lang)}</td>
                  <td className="px-4 py-3">
                    <span
                      className={`px-2 py-0.5 rounded-full text-xs font-semibold ${
                        p.stock > 0 ? "bg-primary/10 text-primary" : "bg-muted text-muted-foreground"
                      }`}
                    >
                      {formatNumber(p.stock)}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex gap-1 justify-end">
                      <button
                        type="button"
                        onClick={() => onEdit(p)}
                        className="size-8 rounded-lg hover:bg-accent inline-flex items-center justify-center"
                      >
                        <Edit3 className="size-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => onRemove(p.id)}
                        className="size-8 rounded-lg hover:bg-destructive/10 text-destructive inline-flex items-center justify-center"
                      >
                        <Trash2 className="size-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}

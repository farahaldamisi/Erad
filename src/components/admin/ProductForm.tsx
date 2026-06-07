import { useState } from "react";
import { motion } from "framer-motion";
import { SpecEditor } from "@/components/SpecEditor";
import { ProductImageGalleryEditor } from "@/components/ProductImageGalleryEditor";
import { getSubcategoryCatalogForSection } from "@/lib/subcategories";
import { isGamingDesktop, isLaptopLikeSection, normalizeProduct, type Product, type SpecGroup } from "@/lib/products";
import {
  createGamingDesktopSpecTemplate,
  createLaptopSpecTemplate,
  mergeWithGamingDesktopTemplate,
  mergeWithLaptopTemplate,
} from "@/lib/spec-templates";
import { useProducts } from "@/lib/products-context";
import { useI18n } from "@/lib/i18n";

function resolveSpecTemplate(category: string, subcategory: string, existing: SpecGroup[]): SpecGroup[] {
  if (isGamingDesktop(category, subcategory)) {
    return existing.length ? mergeWithGamingDesktopTemplate(existing) : createGamingDesktopSpecTemplate();
  }
  if (isLaptopLikeSection(category)) {
    return existing.length ? mergeWithLaptopTemplate(existing) : createLaptopSpecTemplate();
  }
  return existing;
}

function initialSpecs(initial: Product | null, category: string, subcategory: string): SpecGroup[] {
  if (initial?.specs?.length) {
    return resolveSpecTemplate(category, subcategory, initial.specs);
  }
  return resolveSpecTemplate(category, subcategory, []);
}

function Field({ label, children, className = "" }: { label: string; children: React.ReactNode; className?: string }) {
  return (
    <label className={`block ${className}`}>
      <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1.5 block">{label}</span>
      {children}
    </label>
  );
}

export function ProductForm({
  initial,
  defaultSectionId,
  onClose,
  onSave,
}: {
  initial: Product | null;
  defaultSectionId?: string;
  onClose: () => void;
  onSave: (p: Product) => void;
}) {
  const { t, lang } = useI18n();
  const { sections } = useProducts();
  const defaultCategory = initial?.category ?? defaultSectionId ?? sections[0]?.id ?? "laptops";
  const defaultSubcategory = initial?.subcategory ?? getSubcategoryCatalogForSection(defaultCategory)[0]?.slug ?? "standard";
  const [name, setName] = useState(initial?.name ?? "");
  const [brand, setBrand] = useState(initial?.brand ?? "");
  const [price, setPrice] = useState(initial?.price ?? 0);
  const [stock, setStock] = useState(initial?.stock ?? 0);
  const [isNewArrival, setIsNewArrival] = useState(initial?.isNewArrival ?? false);
  const [discountPercent, setDiscountPercent] = useState(initial?.discountPercent ?? 0);
  const [category, setCategory] = useState(defaultCategory);
  const [subcategory, setSubcategory] = useState(defaultSubcategory);
  const subcategoryOptions = getSubcategoryCatalogForSection(category);
  const isGamingPc = isGamingDesktop(category, subcategory);
  const [overview, setOverview] = useState(initial?.overview ?? "");
  const [gallery, setGallery] = useState<string[]>(() =>
    initial?.gallery?.length ? initial.gallery : initial?.image ? [initial.image] : [],
  );
  const [overviewGallery, setOverviewGallery] = useState<string[]>(initial?.overviewGallery ?? []);
  const [specs, setSpecs] = useState<SpecGroup[]>(() => initialSpecs(initial, defaultCategory, defaultSubcategory));

  const applySpecTemplate = (nextCategory: string, nextSubcategory: string, prev: SpecGroup[]) =>
    resolveSpecTemplate(nextCategory, nextSubcategory, prev);

  const onCategoryChange = (next: string) => {
    setCategory(next);
    const nextSubs = getSubcategoryCatalogForSection(next);
    const nextSub = nextSubs[0]?.slug ?? "standard";
    setSubcategory(nextSub);
    setSpecs(prev => applySpecTemplate(next, nextSub, prev));
  };

  const onSubcategoryChange = (next: string) => {
    setSubcategory(next);
    setSpecs(prev => applySpecTemplate(category, next, prev));
  };

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const filledSpecs = isLaptopLikeSection(category)
      ? specs
          .map(g => ({
            ...g,
            items: g.items.filter(item => item.value.trim() !== ""),
          }))
          .filter(g => g.items.length > 0)
      : specs;

    const coverImage = gallery[0] ?? initial?.image ?? "";
    const selectedSub = subcategoryOptions.find(item => item.slug === subcategory) ?? subcategoryOptions[0];

    onSave(
      normalizeProduct({
        id: initial?.id ?? `new-${Date.now()}`,
        name,
        nameAr: name,
        brand,
        price: Number(price),
        stock: Number(stock),
        category,
        subcategory: selectedSub?.slug ?? subcategory,
        subcategoryAr: selectedSub?.labelAr ?? "عادي",
        image: coverImage,
        gallery,
        overview,
        overviewAr: overview,
        overviewGallery,
        specs: filledSpecs,
        isNewArrival,
        discountPercent: Number(discountPercent) || 0,
      }),
    );
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={onClose}>
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        onClick={e => e.stopPropagation()}
        className="bg-card rounded-3xl w-full max-w-4xl p-7 shadow-elegant max-h-[92vh] overflow-y-auto"
      >
        <h2 className="text-2xl font-bold mb-5">{initial ? t("edit_product") : t("add_product")}</h2>
        <form onSubmit={submit} className="grid sm:grid-cols-2 gap-4">
          <Field label={t("product_name")} className="sm:col-span-2">
            <input value={name} onChange={e => setName(e.target.value)} required className="input" />
            {isGamingPc && (
              <p className="text-xs text-muted-foreground mt-1.5">{t("admin_gaming_pc_name_hint")}</p>
            )}
          </Field>
          <Field label={t("brand_label")}>
            <input value={brand} onChange={e => setBrand(e.target.value)} required className="input" />
          </Field>
          <Field label={t("category")}>
            <select value={category} onChange={e => onCategoryChange(e.target.value)} className="input" required>
              {sections.map(section => (
                <option key={section.id} value={section.id}>
                  {section.name}
                </option>
              ))}
            </select>
          </Field>
          <Field label={t("subcategory")}>
            <select value={subcategory} onChange={e => onSubcategoryChange(e.target.value)} className="input" required>
              {subcategoryOptions.map(option => (
                <option key={option.slug} value={option.slug}>
                  {lang === "ar" ? option.labelAr : option.labelEn}
                </option>
              ))}
            </select>
          </Field>
          <Field label={t("price_jod")}>
            <input type="number" value={price} onChange={e => setPrice(Number(e.target.value))} required min={0} step={0.001} className="input" />
          </Field>
          <Field label={t("stock")}>
            <input type="number" value={stock} onChange={e => setStock(Number(e.target.value))} required className="input" />
          </Field>
          <Field label={t("product_discount")}>
            <input
              type="number"
              value={discountPercent}
              onChange={e => setDiscountPercent(Number(e.target.value))}
              min={0}
              max={100}
              className="input"
            />
            <p className="text-xs text-muted-foreground mt-1.5">{t("admin_discount_hint")}</p>
          </Field>

          {isGamingPc && (
            <div className="sm:col-span-2 rounded-xl border border-violet-500/25 bg-violet-500/5 px-4 py-3 text-sm text-muted-foreground">
              {t("admin_gaming_pc_hint")}
            </div>
          )}

          <label className="sm:col-span-2 flex items-center gap-2 cursor-pointer rounded-xl border border-border px-4 py-3 bg-subtle/40">
            <input
              type="checkbox"
              checked={isNewArrival}
              onChange={e => setIsNewArrival(e.target.checked)}
              className="size-4 accent-primary"
            />
            <div>
              <span className="text-sm font-semibold block">{t("product_new_arrival")}</span>
              <span className="text-xs text-muted-foreground">{t("admin_new_arrival_hint")}</span>
            </div>
          </label>

          <Field label={t("overview_text")} className="sm:col-span-2">
            <textarea value={overview} onChange={e => setOverview(e.target.value)} rows={3} className="input" />
            {isGamingPc && (
              <p className="text-xs text-muted-foreground mt-1.5">{t("admin_gaming_pc_overview_hint")}</p>
            )}
          </Field>

          <div className="sm:col-span-2 space-y-3">
            <h3 className="font-bold text-lg">{t("product_gallery")}</h3>
            <ProductImageGalleryEditor images={gallery} onChange={setGallery} variant="product" />
          </div>

          <div className="sm:col-span-2 space-y-3">
            <h3 className="font-bold text-lg">{t("overview_images")}</h3>
            <ProductImageGalleryEditor images={overviewGallery} onChange={setOverviewGallery} variant="overview" />
          </div>

          {isLaptopLikeSection(category) && (
            <div className="sm:col-span-2 space-y-3">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <h3 className="font-bold text-lg">{t("specifications")}</h3>
                <button
                  type="button"
                  onClick={() =>
                    setSpecs(prev =>
                      isGamingPc ? mergeWithGamingDesktopTemplate(prev) : mergeWithLaptopTemplate(prev),
                    )
                  }
                  className="text-xs font-semibold px-3 py-1.5 rounded-full border border-border hover:bg-accent transition"
                >
                  {isGamingPc ? t("load_gaming_specs") : t("load_laptop_specs")}
                </button>
              </div>
              <p className="text-xs text-muted-foreground">
                {isGamingPc ? t("admin_gaming_specs_hint") : t("specs_hint")}
              </p>
              <SpecEditor specs={specs} onChange={setSpecs} />
            </div>
          )}

          <div className="sm:col-span-2 flex gap-2 justify-end pt-2 sticky bottom-0 bg-card pb-1">
            <button type="button" onClick={onClose} className="h-11 px-5 rounded-full border border-border font-semibold">
              {t("cancel")}
            </button>
            <button type="submit" className="h-11 px-6 rounded-full bg-primary text-primary-foreground font-semibold shadow-glow">
              {t("save")}
            </button>
          </div>
        </form>
        <style>{`.input { width: 100%; height: 2.75rem; border-radius: 0.5rem; border: 1px solid var(--border); background: var(--background); padding: 0 0.75rem; font-size: 0.875rem; outline: none; } .input:focus { border-color: var(--primary); box-shadow: 0 0 0 3px oklch(0.55 0.22 25 / 0.18); } textarea.input { height: auto; padding: 0.5rem 0.75rem; }`}</style>
      </motion.div>
    </div>
  );
}

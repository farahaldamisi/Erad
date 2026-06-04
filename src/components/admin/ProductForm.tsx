import { useState } from "react";
import { motion } from "framer-motion";
import { SpecEditor } from "@/components/SpecEditor";
import { ProductImageGalleryEditor } from "@/components/ProductImageGalleryEditor";
import { normalizeProduct, isLaptopLikeSection, type Product, type SpecGroup } from "@/lib/products";
import { createLaptopSpecTemplate, mergeWithLaptopTemplate } from "@/lib/spec-templates";
import { useProducts } from "@/lib/products-context";
import { useI18n } from "@/lib/i18n";

function initialSpecs(initial: Product | null, category: string): SpecGroup[] {
  if (initial?.specs?.length) {
    return isLaptopLikeSection(category) ? mergeWithLaptopTemplate(initial.specs) : initial.specs;
  }
  if (isLaptopLikeSection(category)) return createLaptopSpecTemplate();
  return [];
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
  const { t } = useI18n();
  const { sections } = useProducts();
  const defaultCategory = initial?.category ?? defaultSectionId ?? sections[0]?.id ?? "laptops";
  const [name, setName] = useState(initial?.name ?? "");
  const [brand, setBrand] = useState(initial?.brand ?? "");
  const [price, setPrice] = useState(initial?.price ?? 0);
  const [stock, setStock] = useState(initial?.stock ?? 0);
  const [category, setCategory] = useState(defaultCategory);
  const [overview, setOverview] = useState(initial?.overview ?? "");
  const [gallery, setGallery] = useState<string[]>(() =>
    initial?.gallery?.length ? initial.gallery : initial?.image ? [initial.image] : [],
  );
  const [overviewGallery, setOverviewGallery] = useState<string[]>(initial?.overviewGallery ?? []);
  const [specs, setSpecs] = useState<SpecGroup[]>(() =>
    initialSpecs(initial, defaultCategory),
  );

  const onCategoryChange = (next: string) => {
    setCategory(next);
    if (isLaptopLikeSection(next)) {
      setSpecs(prev => (prev.length ? mergeWithLaptopTemplate(prev) : createLaptopSpecTemplate()));
    }
  };

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const filledSpecs =
      isLaptopLikeSection(category)
        ? specs
            .map(g => ({
              ...g,
              items: g.items.filter(item => item.value.trim() !== ""),
            }))
            .filter(g => g.items.length > 0)
        : specs;

    const coverImage = gallery[0] ?? initial?.image ?? "";

    onSave(
      normalizeProduct({
        id: initial?.id ?? `new-${Date.now()}`,
        name,
        nameAr: name,
        brand,
        price: Number(price),
        stock: Number(stock),
        category,
        subcategory: initial?.subcategory ?? "standard",
        subcategoryAr: initial?.subcategoryAr ?? "عادي",
        image: coverImage,
        gallery,
        overview,
        overviewAr: overview,
        overviewGallery,
        specs: filledSpecs,
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
          <Field label={t("product_name")}>
            <input value={name} onChange={e => setName(e.target.value)} required className="input" />
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
          <Field label={t("price_jod")}>
            <input type="number" value={price} onChange={e => setPrice(Number(e.target.value))} required min={0} step={0.001} className="input" />
          </Field>
          <Field label={t("stock")}>
            <input type="number" value={stock} onChange={e => setStock(Number(e.target.value))} required className="input" />
          </Field>
          <Field label={t("overview_text")} className="sm:col-span-2">
            <textarea value={overview} onChange={e => setOverview(e.target.value)} rows={3} className="input" />
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
                  onClick={() => setSpecs(prev => mergeWithLaptopTemplate(prev))}
                  className="text-xs font-semibold px-3 py-1.5 rounded-full border border-border hover:bg-accent transition"
                >
                  {t("load_laptop_specs")}
                </button>
              </div>
              <p className="text-xs text-muted-foreground">{t("specs_hint")}</p>
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

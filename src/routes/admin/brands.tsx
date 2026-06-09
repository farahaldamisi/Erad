import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useRef, useState } from "react";
import { Edit3, ImagePlus, Plus, Trash2 } from "lucide-react";
import {
  createBrandId,
  normalizeHomeBrand,
  slugifyBrandId,
  sortHomeBrands,
  type HomeBrandItem,
} from "@/lib/home-brands";
import { getSectionLabel, sortSections } from "@/lib/sections";
import { useProducts } from "@/lib/products-context";
import { useI18n } from "@/lib/i18n";

export const Route = createFileRoute("/admin/brands")({
  head: () => ({ meta: [{ title: "Brand Logos — ERAD Admin" }] }),
  component: AdminBrandsPage,
});

function AdminBrandsPage() {
  const { t } = useI18n();
  const { homeBrands, setHomeBrands } = useProducts();
  const [showForm, setShowForm] = useState(false);
  const [edit, setEdit] = useState<HomeBrandItem | null>(null);
  const sorted = useMemo(() => sortHomeBrands(homeBrands), [homeBrands]);

  const saveBrand = (brand: HomeBrandItem) => {
    setHomeBrands(list => {
      const exists = list.some(b => b.id === brand.id);
      if (exists) return sortHomeBrands(list.map(b => (b.id === brand.id ? brand : b)));
      return sortHomeBrands([...list, brand]);
    });
    setShowForm(false);
    setEdit(null);
  };

  const removeBrand = (id: string) => {
    if (!window.confirm(t("brand_delete_confirm"))) return;
    setHomeBrands(list => list.filter(b => b.id !== id));
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-3xl font-bold">{t("admin_brands")}</h2>
          <p className="text-muted-foreground mt-1">{t("admin_brands_sub")}</p>
        </div>
        <button
          type="button"
          onClick={() => {
            setEdit(null);
            setShowForm(true);
          }}
          className="inline-flex items-center gap-2 h-11 px-5 rounded-full bg-primary text-primary-foreground font-semibold shadow-glow"
        >
          <Plus className="size-4" /> {t("add_brand_logo")}
        </button>
      </div>

      <div className="rounded-2xl border border-gray-200 bg-white shadow-card overflow-hidden">
        <div className="flex items-center divide-x divide-gray-200 overflow-x-auto p-1">
          {sorted.length === 0 ? (
            <p className="px-4 py-8 text-sm text-muted-foreground w-full text-center">{t("admin_brands_empty")}</p>
          ) : (
            sorted.map(brand => (
              <div key={brand.id} className="flex flex-1 min-w-[5.5rem] items-center justify-center px-2 py-3">
                <img
                  src={brand.logo}
                  alt={brand.name}
                  className="max-h-10 w-auto object-contain"
                  title={brand.name}
                />
              </div>
            ))
          )}
        </div>
      </div>

      <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-4">
        {sorted.map(brand => (
          <div key={brand.id} className="bg-card border border-border rounded-2xl overflow-hidden shadow-card">
            <div className="aspect-[3/1] bg-white border-b border-border/60 flex items-center justify-center p-4">
              {brand.logo ? (
                <img src={brand.logo} alt={brand.name} className="max-h-12 w-auto object-contain" />
              ) : (
                <span className="text-sm text-muted-foreground">{t("brand_no_logo")}</span>
              )}
            </div>
            <div className="p-4 space-y-2">
              <h3 className="font-bold text-lg">{brand.name}</h3>
              <p className="text-xs text-muted-foreground">
                {brand.search.brand
                  ? t("brand_filter_label").replace("{brand}", brand.search.brand)
                  : t("brand_filter_all")}
              </p>
              <p className="text-xs text-muted-foreground">
                {brand.search.category && brand.search.category !== "all"
                  ? t("brand_category_label").replace("{category}", brand.search.category)
                  : t("brand_category_all")}
              </p>
              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => {
                    setEdit(brand);
                    setShowForm(true);
                  }}
                  className="inline-flex items-center gap-1.5 h-9 px-3 rounded-full border border-border text-sm font-semibold hover:bg-accent"
                >
                  <Edit3 className="size-3.5" /> {t("edit_brand_logo")}
                </button>
                <button
                  type="button"
                  onClick={() => removeBrand(brand.id)}
                  className="inline-flex items-center gap-1.5 h-9 px-3 rounded-full border border-destructive/30 text-destructive text-sm font-semibold hover:bg-destructive/10"
                >
                  <Trash2 className="size-3.5" /> {t("delete")}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {showForm && (
        <BrandForm
          initial={edit}
          onClose={() => {
            setShowForm(false);
            setEdit(null);
          }}
          onSave={saveBrand}
        />
      )}
    </div>
  );
}

function BrandForm({
  initial,
  onClose,
  onSave,
}: {
  initial: HomeBrandItem | null;
  onClose: () => void;
  onSave: (brand: HomeBrandItem) => void;
}) {
  const { t, lang } = useI18n();
  const { sections } = useProducts();
  const fileRef = useRef<HTMLInputElement>(null);
  const sortedSections = useMemo(() => sortSections(sections), [sections]);

  const [name, setName] = useState(initial?.name ?? "");
  const [logo, setLogo] = useState(initial?.logo ?? "");
  const [logoClassName, setLogoClassName] = useState(initial?.logoClassName ?? "");
  const [searchCategory, setSearchCategory] = useState(initial?.search.category ?? "all");
  const [searchBrand, setSearchBrand] = useState(initial?.search.brand ?? "");
  const [order, setOrder] = useState(initial?.order ?? 0);

  const onFile = (files: FileList | null) => {
    const file = files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === "string") setLogo(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(
      normalizeHomeBrand({
        id: initial?.id ?? createBrandId(name),
        name,
        logo,
        logoClassName: logoClassName || undefined,
        order: Number(order),
        search: {
          category: searchCategory === "all" ? undefined : searchCategory,
          brand: searchBrand || undefined,
          sort: "newest",
        },
      }),
    );
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div
        className="bg-card rounded-3xl w-full max-w-lg max-h-[90vh] overflow-y-auto p-7 shadow-elegant"
        onClick={e => e.stopPropagation()}
      >
        <h2 className="text-2xl font-bold mb-5">{initial ? t("edit_brand_logo") : t("add_brand_logo")}</h2>
        <form onSubmit={submit} className="space-y-4">
          <Field label={t("brand_name")}>
            <input
              value={name}
              onChange={e => {
                setName(e.target.value);
                if (!searchBrand && !initial) setSearchBrand(e.target.value);
              }}
              required
              className="input"
            />
          </Field>

          <Field label={t("brand_logo")}>
            <div className="space-y-3">
              {logo && (
                <div className="h-24 rounded-xl border border-border bg-white flex items-center justify-center p-3">
                  <img src={logo} alt="" className="max-h-full w-auto object-contain" />
                </div>
              )}
              <input value={logo} onChange={e => setLogo(e.target.value)} placeholder="https://..." className="input" />
              <button
                type="button"
                onClick={() => fileRef.current?.click()}
                className="inline-flex items-center gap-2 h-10 px-4 rounded-full border border-border text-sm font-semibold hover:bg-accent"
              >
                <ImagePlus className="size-4" /> {t("upload_brand_logo")}
              </button>
              <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={e => onFile(e.target.files)} />
            </div>
          </Field>

          <Field label={t("brand_logo_size")}>
            <input
              value={logoClassName}
              onChange={e => setLogoClassName(e.target.value)}
              placeholder="h-8 sm:h-10"
              className="input"
            />
          </Field>

          <Field label={t("brand_link_category")}>
            <select value={searchCategory} onChange={e => setSearchCategory(e.target.value)} className="input">
              <option value="all">{t("all")}</option>
              {sortedSections.map(section => (
                <option key={section.id} value={section.id}>
                  {getSectionLabel(section, lang)}
                </option>
              ))}
            </select>
          </Field>

          <Field label={t("brand_filter_name")}>
            <input
              value={searchBrand}
              onChange={e => setSearchBrand(e.target.value)}
              placeholder="ASUS, HP, Dahua..."
              className="input"
            />
          </Field>

          <Field label={t("brand_order")}>
            <input type="number" value={order} onChange={e => setOrder(Number(e.target.value))} className="input" />
          </Field>

          {!initial && name && (
            <p className="text-xs text-muted-foreground">
              ID: {slugifyBrandId(name)}
            </p>
          )}

          <div className="flex gap-2 justify-end pt-2">
            <button type="button" onClick={onClose} className="h-11 px-5 rounded-full border border-border font-semibold">
              {t("cancel")}
            </button>
            <button type="submit" className="h-11 px-6 rounded-full bg-primary text-primary-foreground font-semibold shadow-glow">
              {t("save")}
            </button>
          </div>
        </form>
        <style>{`.input { width: 100%; height: 2.75rem; border-radius: 0.5rem; border: 1px solid var(--border); background: var(--background); padding: 0 0.75rem; font-size: 0.875rem; outline: none; } .input:focus { border-color: var(--primary); box-shadow: 0 0 0 3px oklch(0.55 0.22 25 / 0.18); }`}</style>
      </div>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1.5 block">{label}</span>
      {children}
    </label>
  );
}

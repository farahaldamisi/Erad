import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Edit3, FolderOpen, Plus, Trash2 } from "lucide-react";
import { countProductsInSection } from "@/lib/product-filters";
import { normalizeSection, slugifySectionId, sortSections, type Section } from "@/lib/sections";
import { useProducts } from "@/lib/products-context";
import { useI18n } from "@/lib/i18n";
import { formatNumber } from "@/lib/format";

export const Route = createFileRoute("/admin/sections")({
  head: () => ({ meta: [{ title: "Sections — ERAD Admin" }] }),
  component: AdminSectionsPage,
});

function AdminSectionsPage() {
  const { t, lang } = useI18n();
  const { products, sections, setSections } = useProducts();
  const [showForm, setShowForm] = useState(false);
  const [edit, setEdit] = useState<Section | null>(null);
  const sorted = useMemo(() => sortSections(sections), [sections]);

  const removeSection = (id: string) => {
    if (countProductsInSection(products, id) > 0) {
      window.alert(t("section_delete_blocked"));
      return;
    }
    setSections(list => list.filter(s => s.id !== id));
  };

  const saveSection = (section: Section) => {
    setSections(list => {
      const exists = list.some(s => s.id === section.id);
      if (exists) return sortSections(list.map(s => (s.id === section.id ? section : s)));
      return sortSections([...list, section]);
    });
    setShowForm(false);
    setEdit(null);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-3xl font-bold">{t("admin_sections")}</h2>
          <p className="text-muted-foreground mt-1">{t("admin_sections_sub")}</p>
        </div>
        <button
          type="button"
          onClick={() => {
            setEdit(null);
            setShowForm(true);
          }}
          className="inline-flex items-center gap-2 h-11 px-5 rounded-full bg-primary text-primary-foreground font-semibold shadow-glow"
        >
          <Plus className="size-4" /> {t("add_section")}
        </button>
      </div>

      <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-4">
        {sorted.map(section => {
          const count = countProductsInSection(products, section.id);
          const label = lang === "ar" ? section.nameAr || section.name : section.name;
          return (
            <div key={section.id} className="bg-card border border-border rounded-2xl overflow-hidden shadow-card">
              <div className="aspect-square bg-white overflow-hidden p-4 border-b border-border/60">
                {section.image ? (
                  <img src={section.image} alt={label} className="w-full h-full object-contain" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                    <FolderOpen className="size-10 opacity-40" />
                  </div>
                )}
              </div>
              <div className="p-4">
                <h3 className="font-bold text-lg">{label}</h3>
                <p className="text-xs text-muted-foreground mt-1">{section.id}</p>
                <p className="text-sm text-muted-foreground mt-2">
                  {formatNumber(count)} {t("admin_products_in_section")}
                </p>
                <div className="flex gap-2 mt-4">
                  <button
                    type="button"
                    onClick={() => {
                      setEdit(section);
                      setShowForm(true);
                    }}
                    className="inline-flex items-center gap-1.5 h-9 px-3 rounded-full border border-border text-sm font-semibold hover:bg-accent"
                  >
                    <Edit3 className="size-3.5" /> {t("edit_section")}
                  </button>
                  <button
                    type="button"
                    onClick={() => removeSection(section.id)}
                    className="inline-flex items-center gap-1.5 h-9 px-3 rounded-full border border-destructive/30 text-destructive text-sm font-semibold hover:bg-destructive/10"
                  >
                    <Trash2 className="size-3.5" /> {t("delete")}
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {showForm && (
        <SectionForm
          initial={edit}
          onClose={() => {
            setShowForm(false);
            setEdit(null);
          }}
          onSave={saveSection}
        />
      )}
    </div>
  );
}

function SectionForm({
  initial,
  onClose,
  onSave,
}: {
  initial: Section | null;
  onClose: () => void;
  onSave: (section: Section) => void;
}) {
  const { t } = useI18n();
  const [name, setName] = useState(initial?.name ?? "");
  const [nameAr, setNameAr] = useState(initial?.nameAr ?? "");
  const [image, setImage] = useState(initial?.image ?? "");
  const [order, setOrder] = useState(initial?.order ?? 0);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const id = initial?.id ?? slugifySectionId(name);
    onSave(
      normalizeSection({
        id,
        name,
        nameAr: nameAr || name,
        image,
        order: Number(order),
      }),
    );
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div
        className="bg-card rounded-3xl w-full max-w-lg p-7 shadow-elegant"
        onClick={e => e.stopPropagation()}
      >
        <h2 className="text-2xl font-bold mb-5">{initial ? t("edit_section") : t("add_section")}</h2>
        <form onSubmit={submit} className="space-y-4">
          <Field label={t("section_name")}>
            <input value={name} onChange={e => setName(e.target.value)} required className="input" />
          </Field>
          <Field label={t("section_name_ar")}>
            <input value={nameAr} onChange={e => setNameAr(e.target.value)} className="input" />
          </Field>
          <Field label={t("section_image")}>
            <input value={image} onChange={e => setImage(e.target.value)} placeholder="https://..." className="input" />
          </Field>
          <Field label={t("section_order")}>
            <input type="number" value={order} onChange={e => setOrder(Number(e.target.value))} className="input" />
          </Field>
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

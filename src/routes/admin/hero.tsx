import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useRef, useState } from "react";
import { Edit3, ImagePlus, Plus, Trash2 } from "lucide-react";
import {
  createHeroSlideId,
  getHeroSlideText,
  heroSlideIcons,
  normalizeHeroSlide,
  sortHeroSlides,
  type HeroSlide,
  type HeroSlideIcon,
} from "@/lib/hero-slides";
import { useProducts } from "@/lib/products-context";
import { useI18n } from "@/lib/i18n";

export const Route = createFileRoute("/admin/hero")({
  head: () => ({ meta: [{ title: "Hero Banner — ERAD Admin" }] }),
  component: AdminHeroPage,
});

function AdminHeroPage() {
  const { t, lang } = useI18n();
  const { heroSlides, setHeroSlides } = useProducts();
  const [showForm, setShowForm] = useState(false);
  const [edit, setEdit] = useState<HeroSlide | null>(null);
  const sorted = useMemo(() => sortHeroSlides(heroSlides), [heroSlides]);

  const saveSlide = (slide: HeroSlide) => {
    setHeroSlides(list => {
      const exists = list.some(s => s.id === slide.id);
      if (exists) return sortHeroSlides(list.map(s => (s.id === slide.id ? slide : s)));
      return sortHeroSlides([...list, slide]);
    });
    setShowForm(false);
    setEdit(null);
  };

  const removeSlide = (id: string) => {
    if (heroSlides.length <= 1) {
      window.alert(t("hero_slide_delete_blocked"));
      return;
    }
    setHeroSlides(list => list.filter(s => s.id !== id));
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-3xl font-bold">{t("admin_hero")}</h2>
          <p className="text-muted-foreground mt-1">{t("admin_hero_sub")}</p>
        </div>
        <button
          type="button"
          onClick={() => {
            setEdit(null);
            setShowForm(true);
          }}
          className="inline-flex items-center gap-2 h-11 px-5 rounded-full bg-primary text-primary-foreground font-semibold shadow-glow"
        >
          <Plus className="size-4" /> {t("add_hero_slide")}
        </button>
      </div>

      <div className="grid lg:grid-cols-2 gap-4">
        {sorted.map((slide, index) => (
          <div key={slide.id} className="bg-card border border-border rounded-2xl overflow-hidden shadow-card">
            <div className="aspect-[21/9] bg-muted overflow-hidden relative">
              {slide.image ? (
                <img src={slide.image} alt="" className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-muted-foreground text-sm">
                  {t("hero_slide_no_image")}
                </div>
              )}
              <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/35 to-transparent" />
              <div className="absolute inset-0 flex flex-col justify-center px-5 text-white">
                <p className="text-[10px] uppercase tracking-widest font-semibold opacity-90">
                  {getHeroSlideText(slide, "badge", lang)}
                </p>
                <h3 className="text-lg font-bold mt-1">{getHeroSlideText(slide, "title", lang)}</h3>
                <p className="text-xs text-white/85 mt-1 line-clamp-2">{getHeroSlideText(slide, "sub", lang)}</p>
              </div>
            </div>
            <div className="p-4 flex flex-wrap items-center justify-between gap-3">
              <p className="text-xs text-muted-foreground">
                {t("hero_slide_number").replace("{n}", String(index + 1))}
              </p>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setEdit(slide);
                    setShowForm(true);
                  }}
                  className="inline-flex items-center gap-1.5 h-9 px-3 rounded-full border border-border text-sm font-semibold hover:bg-accent"
                >
                  <Edit3 className="size-3.5" /> {t("edit_hero_slide")}
                </button>
                <button
                  type="button"
                  onClick={() => removeSlide(slide.id)}
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
        <HeroSlideForm
          initial={edit}
          onClose={() => {
            setShowForm(false);
            setEdit(null);
          }}
          onSave={saveSlide}
        />
      )}
    </div>
  );
}

function HeroSlideForm({
  initial,
  onClose,
  onSave,
}: {
  initial: HeroSlide | null;
  onClose: () => void;
  onSave: (slide: HeroSlide) => void;
}) {
  const { t } = useI18n();
  const fileRef = useRef<HTMLInputElement>(null);
  const [badgeEn, setBadgeEn] = useState(initial?.badgeEn ?? "");
  const [badgeAr, setBadgeAr] = useState(initial?.badgeAr ?? "");
  const [titleEn, setTitleEn] = useState(initial?.titleEn ?? "");
  const [titleAr, setTitleAr] = useState(initial?.titleAr ?? "");
  const [subEn, setSubEn] = useState(initial?.subEn ?? "");
  const [subAr, setSubAr] = useState(initial?.subAr ?? "");
  const [image, setImage] = useState(initial?.image ?? "");
  const [icon, setIcon] = useState<HeroSlideIcon>(initial?.icon ?? "badge-check");
  const [order, setOrder] = useState(initial?.order ?? 0);

  const onFile = (files: FileList | null) => {
    const file = files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === "string") setImage(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(
      normalizeHeroSlide({
        id: initial?.id ?? createHeroSlideId(),
        image,
        badgeEn,
        badgeAr,
        titleEn,
        titleAr,
        subEn,
        subAr,
        icon,
        order: Number(order),
      }),
    );
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div
        className="bg-card rounded-3xl w-full max-w-2xl max-h-[90vh] overflow-y-auto p-7 shadow-elegant"
        onClick={e => e.stopPropagation()}
      >
        <h2 className="text-2xl font-bold mb-5">{initial ? t("edit_hero_slide") : t("add_hero_slide")}</h2>
        <form onSubmit={submit} className="space-y-4">
          <Field label={t("hero_slide_image")}>
            <div className="space-y-3">
              {image && (
                <div className="aspect-[21/9] rounded-xl overflow-hidden border border-border bg-muted">
                  <img src={image} alt="" className="w-full h-full object-cover" />
                </div>
              )}
              <input
                value={image}
                onChange={e => setImage(e.target.value)}
                placeholder="https://..."
                className="input"
              />
              <button
                type="button"
                onClick={() => fileRef.current?.click()}
                className="inline-flex items-center gap-2 h-10 px-4 rounded-full border border-border text-sm font-semibold hover:bg-accent"
              >
                <ImagePlus className="size-4" /> {t("upload_hero_image")}
              </button>
              <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={e => onFile(e.target.files)} />
            </div>
          </Field>

          <div className="grid sm:grid-cols-2 gap-4">
            <Field label={t("hero_slide_badge")}>
              <input value={badgeEn} onChange={e => setBadgeEn(e.target.value)} required className="input" />
            </Field>
            <Field label={t("hero_slide_badge_ar")}>
              <input value={badgeAr} onChange={e => setBadgeAr(e.target.value)} className="input" />
            </Field>
            <Field label={t("hero_slide_title")}>
              <input value={titleEn} onChange={e => setTitleEn(e.target.value)} required className="input" />
            </Field>
            <Field label={t("hero_slide_title_ar")}>
              <input value={titleAr} onChange={e => setTitleAr(e.target.value)} className="input" />
            </Field>
          </div>

          <Field label={t("hero_slide_sub")}>
            <textarea value={subEn} onChange={e => setSubEn(e.target.value)} required rows={3} className="textarea" />
          </Field>
          <Field label={t("hero_slide_sub_ar")}>
            <textarea value={subAr} onChange={e => setSubAr(e.target.value)} rows={3} className="textarea" />
          </Field>

          <div className="grid sm:grid-cols-2 gap-4">
            <Field label={t("hero_slide_icon")}>
              <select value={icon} onChange={e => setIcon(e.target.value as HeroSlideIcon)} className="input">
                {heroSlideIcons.map(value => (
                  <option key={value} value={value}>
                    {value}
                  </option>
                ))}
              </select>
            </Field>
            <Field label={t("hero_slide_order")}>
              <input type="number" value={order} onChange={e => setOrder(Number(e.target.value))} className="input" />
            </Field>
          </div>

          <div className="flex gap-2 justify-end pt-2">
            <button type="button" onClick={onClose} className="h-11 px-5 rounded-full border border-border font-semibold">
              {t("cancel")}
            </button>
            <button type="submit" className="h-11 px-6 rounded-full bg-primary text-primary-foreground font-semibold shadow-glow">
              {t("save")}
            </button>
          </div>
        </form>
        <style>{`.input { width: 100%; height: 2.75rem; border-radius: 0.5rem; border: 1px solid var(--border); background: var(--background); padding: 0 0.75rem; font-size: 0.875rem; outline: none; } .input:focus { border-color: var(--primary); box-shadow: 0 0 0 3px oklch(0.55 0.22 25 / 0.18); } .textarea { width: 100%; border-radius: 0.5rem; border: 1px solid var(--border); background: var(--background); padding: 0.75rem; font-size: 0.875rem; outline: none; resize: vertical; } .textarea:focus { border-color: var(--primary); box-shadow: 0 0 0 3px oklch(0.55 0.22 25 / 0.18); }`}</style>
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

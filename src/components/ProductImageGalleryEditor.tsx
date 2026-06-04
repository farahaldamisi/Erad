import { ImagePlus, Link2, Star, Trash2 } from "lucide-react";
import { useRef, useState } from "react";
import { useI18n, type DictKey } from "@/lib/i18n";
import { formatNumber } from "@/lib/format";

type GalleryVariant = "overview" | "product";

const copyKeys: Record<
  GalleryVariant,
  {
    hint: DictKey;
    empty: DictKey;
    count: DictKey;
    upload: DictKey;
    delete: DictKey;
    invalidUrl: DictKey;
    urlPlaceholder: DictKey;
  }
> = {
  overview: {
    hint: "overview_images_hint",
    empty: "overview_images_empty",
    count: "overview_images_count",
    upload: "upload_overview_images",
    delete: "delete_overview_image",
    invalidUrl: "overview_image_invalid_url",
    urlPlaceholder: "overview_image_url_placeholder",
  },
  product: {
    hint: "product_gallery_hint",
    empty: "product_gallery_empty",
    count: "overview_images_count",
    upload: "upload_product_images",
    delete: "delete_image",
    invalidUrl: "overview_image_invalid_url",
    urlPlaceholder: "overview_image_url_placeholder",
  },
};

interface ProductImageGalleryEditorProps {
  images: string[];
  onChange: (images: string[]) => void;
  variant?: GalleryVariant;
}

export function ProductImageGalleryEditor({
  images,
  onChange,
  variant = "overview",
}: ProductImageGalleryEditorProps) {
  const { t } = useI18n();
  const keys = copyKeys[variant];
  const fileRef = useRef<HTMLInputElement>(null);
  const imagesRef = useRef(images);
  imagesRef.current = images;
  const [urlInput, setUrlInput] = useState("");
  const [error, setError] = useState("");

  const addUrl = () => {
    const url = urlInput.trim();
    if (!url) return;
    try {
      new URL(url);
    } catch {
      setError(t(keys.invalidUrl));
      return;
    }
    setError("");
    onChange([...images, url]);
    setUrlInput("");
  };

  const onFiles = (files: FileList | null) => {
    if (!files?.length) return;
    Array.from(files).forEach(file => {
      if (!file.type.startsWith("image/")) return;
      const reader = new FileReader();
      reader.onload = () => {
        if (typeof reader.result === "string") {
          onChange([...imagesRef.current, reader.result]);
        }
      };
      reader.readAsDataURL(file);
    });
    if (fileRef.current) fileRef.current.value = "";
  };

  const remove = (index: number) => {
    onChange(images.filter((_, i) => i !== index));
  };

  const setAsCover = (index: number) => {
    if (index === 0) return;
    const next = [...images];
    const [picked] = next.splice(index, 1);
    onChange([picked, ...next]);
  };

  return (
    <div className="rounded-2xl border border-border bg-subtle/30 p-4 sm:p-5 space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <p className="text-xs text-muted-foreground">{t(keys.hint)}</p>
        {images.length > 0 && (
          <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-background border border-border">
            {formatNumber(images.length)} {t(keys.count)}
          </span>
        )}
      </div>

      {images.length > 0 ? (
        <div className="space-y-4">
          {images.map((src, i) => (
            <div
              key={`${src.slice(0, 40)}-${i}`}
              className="relative rounded-2xl border border-border bg-background p-3 sm:p-4"
            >
              {variant === "product" && i === 0 && (
                <span className="absolute top-5 start-5 inline-flex items-center gap-1 h-8 px-3 rounded-full bg-primary text-primary-foreground text-xs font-semibold shadow-md">
                  <Star className="size-3.5 fill-current" />
                  {t("main_product_image")}
                </span>
              )}
              <div className="rounded-xl overflow-hidden bg-subtle border border-border">
                <img src={src} alt="" className="w-full max-h-56 object-contain p-3" />
              </div>
              <div className="absolute top-5 end-5 flex flex-wrap gap-2 justify-end">
                {variant === "product" && i > 0 && (
                  <button
                    type="button"
                    onClick={() => setAsCover(i)}
                    className="inline-flex items-center gap-1.5 h-9 px-3 rounded-full border border-border bg-background text-xs font-semibold hover:bg-accent"
                  >
                    {t("set_as_cover")}
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => remove(i)}
                  className="inline-flex items-center gap-1.5 h-9 px-3 rounded-full bg-destructive text-destructive-foreground text-xs font-semibold shadow-md hover:opacity-95"
                  aria-label={t(keys.delete)}
                >
                  <Trash2 className="size-3.5" />
                  {t(keys.delete)}
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="rounded-xl border border-dashed border-border py-10 text-center text-sm text-muted-foreground bg-background">
          {t(keys.empty)}
        </div>
      )}

      <div className="pt-2 border-t border-border space-y-3">
        <div className="flex flex-col sm:flex-row gap-2">
          <input
            type="text"
            value={urlInput}
            onChange={e => setUrlInput(e.target.value)}
            placeholder={t(keys.urlPlaceholder)}
            className="input flex-1"
            onKeyDown={e => e.key === "Enter" && (e.preventDefault(), addUrl())}
          />
          <button
            type="button"
            onClick={addUrl}
            className="inline-flex items-center justify-center gap-2 h-11 px-4 rounded-lg border border-border font-semibold text-sm hover:bg-accent shrink-0 bg-background"
          >
            <Link2 className="size-4" />
            {t("add_image_url")}
          </button>
        </div>
        {error && <p className="text-xs text-destructive">{error}</p>}

        <input ref={fileRef} type="file" accept="image/*" multiple className="hidden" onChange={e => onFiles(e.target.files)} />
        <button
          type="button"
          onClick={() => fileRef.current?.click()}
          className="w-full inline-flex items-center justify-center gap-2 h-11 rounded-lg bg-primary/10 text-primary font-semibold text-sm hover:bg-primary/15 transition"
        >
          <ImagePlus className="size-4" />
          {t(keys.upload)}
        </button>
      </div>

      <style>{`.input { width: 100%; height: 2.75rem; border-radius: 0.5rem; border: 1px solid var(--border); background: var(--background); padding: 0 0.75rem; font-size: 0.875rem; outline: none; } .input:focus { border-color: var(--primary); box-shadow: 0 0 0 3px oklch(0.55 0.22 25 / 0.18); }`}</style>
    </div>
  );
}

/** @deprecated Use ProductImageGalleryEditor */
export const OverviewGalleryEditor = ProductImageGalleryEditor;

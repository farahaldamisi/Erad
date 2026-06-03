import { ImagePlus, Link2, Trash2 } from "lucide-react";
import { useRef, useState } from "react";
import { useI18n } from "@/lib/i18n";

interface OverviewGalleryEditorProps {
  images: string[];
  onChange: (images: string[]) => void;
}

export function OverviewGalleryEditor({ images, onChange }: OverviewGalleryEditorProps) {
  const { t } = useI18n();
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
      setError(t("overview_image_invalid_url"));
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

  return (
    <div className="space-y-4">
      <p className="text-xs text-muted-foreground">{t("overview_images_hint")}</p>

      {images.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {images.map((src, i) => (
            <div key={`${src.slice(0, 40)}-${i}`} className="relative group aspect-[4/3] rounded-xl overflow-hidden border border-border bg-subtle">
              <img src={src} alt="" className="w-full h-full object-cover" />
              <button
                type="button"
                onClick={() => remove(i)}
                className="absolute top-2 end-2 size-8 rounded-full bg-destructive text-destructive-foreground flex items-center justify-center opacity-90 hover:opacity-100 shadow-md"
                aria-label={t("delete_overview_image")}
              >
                <Trash2 className="size-4" />
              </button>
            </div>
          ))}
        </div>
      ) : (
        <div className="rounded-xl border border-dashed border-border py-10 text-center text-sm text-muted-foreground">
          {t("overview_images_empty")}
        </div>
      )}

      <div className="flex flex-col sm:flex-row gap-2">
        <input
          type="text"
          value={urlInput}
          onChange={e => setUrlInput(e.target.value)}
          placeholder={t("overview_image_url_placeholder")}
          className="input flex-1"
          onKeyDown={e => e.key === "Enter" && (e.preventDefault(), addUrl())}
        />
        <button
          type="button"
          onClick={addUrl}
          className="inline-flex items-center justify-center gap-2 h-11 px-4 rounded-lg border border-border font-semibold text-sm hover:bg-accent shrink-0"
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
        {t("upload_overview_images")}
      </button>

      <style>{`.input { width: 100%; height: 2.75rem; border-radius: 0.5rem; border: 1px solid var(--border); background: var(--background); padding: 0 0.75rem; font-size: 0.875rem; outline: none; } .input:focus { border-color: var(--primary); box-shadow: 0 0 0 3px oklch(0.55 0.22 25 / 0.18); }`}</style>
    </div>
  );
}

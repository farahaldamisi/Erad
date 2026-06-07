import { Link } from "@tanstack/react-router";
import type { Product } from "@/lib/products";
import { getProductName } from "@/lib/products";
import { formatPrice } from "@/lib/currency";
import { getProductSpecSummary } from "@/lib/product-highlights";
import { useI18n } from "@/lib/i18n";
import { cn } from "@/lib/utils";

function specValue(product: Product, group: string, label: string): string | null {
  return (
    product.specs
      .find(g => g.group === group)
      ?.items.find(i => i.label === label && i.value.trim())
      ?.value.trim() ?? null
  );
}

function getModelCode(product: Product): string {
  const match = product.name.match(/\b[A-Z0-9]+-\d+\b/i);
  return match?.[0] ?? product.id.replace(/^gpc-/, "").toUpperCase();
}

function getGpuBadge(product: Product): { label: string; tone: "amd" | "nvidia" | "default" } | null {
  const manufacturer = specValue(product, "Graphic Card Specifications", "Graphic Manufacturer");
  const model = specValue(product, "Graphic Card Specifications", "Graphic Card Model");
  const memory = specValue(product, "Graphic Card Specifications", "Graphic Memory Size");
  const label = [manufacturer, model, memory].filter(Boolean).join(" ");
  if (!label) return null;

  const lower = label.toLowerCase();
  if (lower.includes("amd") || lower.includes("radeon")) {
    return { label, tone: "amd" };
  }
  if (lower.includes("nvidia") || lower.includes("rtx") || lower.includes("geforce")) {
    return { label, tone: "nvidia" };
  }
  return { label, tone: "default" };
}

export function GamingPcCard({ product }: { product: Product }) {
  const { lang } = useI18n();
  const name = getProductName(product);
  const summary = getProductSpecSummary(product, lang);
  const detail = lang === "ar" ? product.overviewAr || product.overview : product.overview;
  const gpuBadge = getGpuBadge(product);
  const modelCode = getModelCode(product);

  return (
    <Link
      to="/product/$id"
      params={{ id: product.id }}
      className="group flex flex-col rounded-2xl border border-border bg-card p-4 sm:p-5 shadow-card hover:border-primary/30 hover:shadow-elegant transition"
    >
      <p className="text-center text-sm font-black tracking-tight mb-3">
        <span className="text-primary">{product.brand.split(" ")[0] ?? product.brand}</span>{" "}
        <span className="text-foreground">{product.brand.split(" ").slice(1).join(" ") || "POWER"}</span>
      </p>

      <div className="relative aspect-[4/3] rounded-xl bg-subtle border border-border/60 overflow-hidden mb-3">
        <img
          src={product.image}
          alt={name}
          className="w-full h-full object-contain p-4 group-hover:scale-105 transition-transform duration-500"
        />
        {gpuBadge && (
          <span
            className={cn(
              "absolute bottom-3 start-3 max-w-[85%] rounded-md px-2 py-1 text-[9px] sm:text-[10px] font-bold uppercase leading-tight text-white shadow-md",
              gpuBadge.tone === "amd" && "bg-gradient-to-r from-rose-600 to-red-700",
              gpuBadge.tone === "nvidia" && "bg-gradient-to-r from-emerald-700 to-lime-600",
              gpuBadge.tone === "default" && "bg-slate-800",
            )}
          >
            {gpuBadge.label}
          </span>
        )}
        <span className="absolute bottom-2 end-2 text-[10px] font-semibold text-muted-foreground">
          {modelCode}
        </span>
      </div>

      <h3 className="font-bold text-sm sm:text-base leading-snug line-clamp-2 mb-2 group-hover:text-primary transition-colors">
        {name}
      </h3>
      <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed line-clamp-3 flex-1 mb-4">
        {detail || summary}
      </p>
      <p className="text-center text-xl sm:text-2xl font-bold text-foreground">{formatPrice(product.price, lang)}</p>
    </Link>
  );
}

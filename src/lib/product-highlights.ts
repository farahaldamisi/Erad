import { isLaptopLikeSection, type Product, type Category } from "./products";
import { mergeWithLaptopTemplate } from "./spec-templates";
import type { Lang } from "./i18n";

function specValue(product: Product, group: string, label: string): string | null {
  const value = product.specs
    .find(g => g.group === group)
    ?.items.find(i => i.label === label && i.value.trim())
    ?.value.trim();
  return value ?? null;
}

function joinParts(...parts: (string | null | undefined)[]): string | null {
  const text = parts.filter(Boolean).join(" ").trim();
  return text || null;
}

function formatDisplaySize(size: string | null, lang: Lang): string | null {
  if (!size) return null;
  if (lang === "ar") return size.replace(/"/g, " إنش").trim();
  return size;
}

function withMergedSpecs(product: Product): Product {
  if (!isLaptopLikeSection(product.category)) return product;
  return { ...product, specs: mergeWithLaptopTemplate(product.specs) };
}

function laptopSummary(product: Product, lang: Lang): string | null {
  const cpu = joinParts(
    specValue(product, "Processor Specifications", "Processor Model"),
    specValue(product, "Processor Specifications", "Processor Type"),
    specValue(product, "Processor", "Model"),
  );
  const ram = joinParts(
    specValue(product, "Memory", "Memory Size"),
    specValue(product, "Memory", "Memory Type"),
  );
  const storage = joinParts(
    specValue(product, "Storage", "Storage Size"),
    specValue(product, "Storage", "Storage Technology"),
  );
  const display = formatDisplaySize(specValue(product, "Display", "Display Size"), lang);
  const os = specValue(product, "Operating System", "Operating System");
  const isDesktop = product.category === "desktops";

  if (lang === "ar") {
    const chunks: string[] = [];
    if (cpu) {
      chunks.push(
        isDesktop
          ? `جهاز حاسوب ${product.brand} بمعالج ${cpu}`
          : `لاب توب ${product.brand} بمعالج ${cpu}`,
      );
    } else {
      chunks.push(isDesktop ? `جهاز حاسوب ${product.brand}` : `لاب توب ${product.brand}`);
    }
    if (ram) chunks.push(`ذاكرة ${ram}`);
    if (storage) chunks.push(`سعة تخزين ${storage}`);
    if (display) chunks.push(`شاشة ${display}`);
    if (os) chunks.push(`يعمل بنظام ${os}`);
    return chunks.length > 1 || cpu || ram || storage || display || os ? chunks.join("، ") : null;
  }

  const chunks: string[] = [];
  const device = isDesktop ? "desktop" : "laptop";
  if (cpu) chunks.push(`${product.brand} ${device} with ${cpu} processor`);
  else chunks.push(`${product.brand} ${device}`);
  if (ram) chunks.push(`${ram} memory`);
  if (storage) chunks.push(`${storage} storage`);
  if (display) chunks.push(`${display} display`);
  if (os) chunks.push(`runs ${os}`);
  return chunks.join(", ");
}

function printerSummary(product: Product, lang: Lang): string | null {
  const tech = specValue(product, "Print", "Technology");
  const speed = specValue(product, "Print", "Speed");
  const resolution = specValue(product, "Print", "Resolution");
  const network = specValue(product, "Connectivity", "Network");

  if (lang === "ar") {
    const chunks: string[] = [`طابعة ${product.brand}`];
    if (tech) chunks.push(`بتقنية ${tech}`);
    if (speed) chunks.push(`سرعة ${speed}`);
    if (resolution) chunks.push(`دقة ${resolution}`);
    if (network) chunks.push(`اتصال ${network}`);
    return chunks.length > 1 ? chunks.join("، ") : null;
  }

  const chunks: string[] = [`${product.brand} printer`];
  if (tech) chunks.push(`${tech} technology`);
  if (speed) chunks.push(`${speed} speed`);
  if (resolution) chunks.push(`${resolution} resolution`);
  if (network) chunks.push(`${network} connectivity`);
  return chunks.join(", ");
}

function genericSummary(product: Product, lang: Lang, max = 5): string | null {
  const parts: string[] = [];
  for (const group of product.specs) {
    for (const item of group.items) {
      if (!item.value.trim()) continue;
      parts.push(`${item.label}: ${item.value.trim()}`);
      if (parts.length >= max) break;
    }
    if (parts.length >= max) break;
  }
  if (parts.length === 0) return null;
  return lang === "ar" ? parts.join("، ") : parts.join(", ");
}

export function getProductSpecSummary(product: Product, lang: Lang): string | null {
  const p = withMergedSpecs(product);
  let summary: string | null = null;

  switch (p.category as Category) {
    case "laptops":
    case "desktops":
      summary = laptopSummary(p, lang);
      break;
    case "printers":
      summary = printerSummary(p, lang);
      break;
    default:
      summary = genericSummary(p, lang);
      break;
  }

  if (!summary) summary = genericSummary(p, lang);
  return summary;
}

/** @deprecated Use getProductSpecSummary for card/details display */
export function getProductHighlights(product: Product, max = 4): string[] {
  const summary = getProductSpecSummary(product, "en");
  if (!summary) return [];
  return summary.split(/,\s*/).slice(0, max);
}

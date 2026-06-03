import type { Product, Category } from "./products";

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

function laptopHighlights(product: Product): string[] {
  const cpu = joinParts(
    specValue(product, "Processor Specifications", "Processor Type"),
    specValue(product, "Processor Specifications", "Processor Model"),
    specValue(product, "Processor", "Type"),
    specValue(product, "Processor", "Model"),
  );
  const ram = joinParts(
    specValue(product, "Memory", "Memory Size"),
    specValue(product, "Memory", "Memory Type"),
    specValue(product, "Memory", "Size"),
  );
  const storage = joinParts(
    specValue(product, "Storage", "Storage Size"),
    specValue(product, "Storage", "Storage Technology"),
    specValue(product, "Storage", "Size"),
    specValue(product, "Storage", "Type"),
  );
  const display = joinParts(
    specValue(product, "Display", "Display Size"),
    specValue(product, "Display", "Display Technology"),
    specValue(product, "Display", "Size"),
  );
  return [cpu, ram, storage, display].filter(Boolean) as string[];
}

function printerHighlights(product: Product): string[] {
  return [
    specValue(product, "Print", "Technology"),
    specValue(product, "Print", "Speed"),
    specValue(product, "Print", "Resolution"),
    specValue(product, "Connectivity", "Network"),
  ].filter(Boolean) as string[];
}

function genericHighlights(product: Product, max = 4): string[] {
  const items: string[] = [];
  for (const group of product.specs) {
    for (const item of group.items) {
      if (!item.value.trim()) continue;
      items.push(item.value.trim());
      if (items.length >= max) return items;
    }
  }
  return items;
}

export function getProductHighlights(product: Product, max = 4): string[] {
  let highlights: string[];
  switch (product.category as Category) {
    case "laptops":
    case "desktops":
      highlights = laptopHighlights(product);
      break;
    case "printers":
      highlights = printerHighlights(product);
      break;
    default:
      highlights = genericHighlights(product, max);
      break;
  }

  if (highlights.length === 0) {
    highlights = genericHighlights(product, max);
  }

  return highlights.slice(0, max);
}

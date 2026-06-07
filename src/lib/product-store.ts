import { products as seedProducts, normalizeProduct, type Product } from "./products";
import { resolveSubcategoryAr } from "./subcategories";

const STORAGE_KEY = "erad_products_v1";

const LEGACY_CATEGORY_IDS: Record<string, string> = {
  cases: "components",
  "cables-adapters": "network",
};

function migrateSubcategory(category: string, subcategory: string): string {
  if (category === "laptops") {
    if (subcategory === "standard" || subcategory === "lightweight") return "business";
  }
  if (category === "monitors" && subcategory === "standard") return "business";
  if (category === "cases") {
    if (subcategory === "gaming" || subcategory === "standard") return "case";
  }
  if (category === "accessories") {
    if (subcategory === "standard") return "mouse";
    if (subcategory === "gaming") return "keyboard";
  }
  if (category === "printers") {
    if (subcategory === "office" || subcategory === "enterprise" || subcategory === "inkjet") {
      return "general";
    }
  }
  if (category === "network" && subcategory === "cables") return "cables";
  if (category === "network" && subcategory === "adapters") return "adapters";
  return subcategory;
}

export function migrateProductCatalog(products: Product[]): Product[] {
  return products.map(product => {
    const category = LEGACY_CATEGORY_IDS[product.category] ?? product.category;
    const subcategory = migrateSubcategory(product.category, product.subcategory);
    if (category === product.category && subcategory === product.subcategory) {
      return normalizeProduct(product);
    }
    return normalizeProduct({
      ...product,
      category,
      subcategory,
      subcategoryAr: resolveSubcategoryAr(category, subcategory),
    });
  });
}

function migrateSeedProducts(products: Product[]): Product[] {
  const migrated = migrateProductCatalog(products);
  const existing = new Set(migrated.map(p => p.id));
  const merged = [...migrated];
  for (const seed of seedProducts) {
    if (!existing.has(seed.id)) merged.push(seed);
  }
  return merged.map(normalizeProduct);
}

export function loadProducts(): Product[] {
  if (typeof window === "undefined") return seedProducts;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return seedProducts;
    return migrateSeedProducts((JSON.parse(raw) as Product[]).map(normalizeProduct));
  } catch {
    return seedProducts;
  }
}

export function saveProducts(products: Product[]) {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(migrateProductCatalog(products).map(normalizeProduct)));
}

export function findProduct(id: string): Product | undefined {
  return loadProducts().find(p => p.id === id);
}

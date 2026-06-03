import { createContext, useContext, type ReactNode } from "react";
import { useProductCatalog } from "@/hooks/use-product-catalog";
import type { Product } from "@/lib/products";
import type { Section } from "@/lib/sections";

interface ProductsCtx {
  products: Product[];
  setProducts: (next: Product[] | ((prev: Product[]) => Product[])) => void;
  sections: Section[];
  setSections: (next: Section[] | ((prev: Section[]) => Section[])) => void;
}

const Ctx = createContext<ProductsCtx | null>(null);

export function ProductsProvider({ children }: { children: ReactNode }) {
  const { products, setProducts, sections, setSections } = useProductCatalog();
  return (
    <Ctx.Provider value={{ products, setProducts, sections, setSections }}>
      {children}
    </Ctx.Provider>
  );
}

export function useProducts() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useProducts must be inside ProductsProvider");
  return ctx;
}

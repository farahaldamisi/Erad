import { useCallback, useEffect, useState } from "react";
import { products as seedProducts, type Product } from "@/lib/products";
import { loadProducts, saveProducts } from "@/lib/product-store";
import { loadSections, saveSections } from "@/lib/section-store";
import { seedSections, type Section } from "@/lib/sections";

export function useProductCatalog() {
  const [products, setProductsState] = useState<Product[]>(seedProducts);
  const [sections, setSectionsState] = useState<Section[]>(seedSections);

  useEffect(() => {
    setProductsState(loadProducts());
    setSectionsState(loadSections());
  }, []);

  const setProducts = useCallback((next: Product[] | ((prev: Product[]) => Product[])) => {
    setProductsState(prev => {
      const updated = typeof next === "function" ? next(prev) : next;
      saveProducts(updated);
      return updated;
    });
  }, []);

  const setSections = useCallback((next: Section[] | ((prev: Section[]) => Section[])) => {
    setSectionsState(prev => {
      const updated = typeof next === "function" ? next(prev) : next;
      saveSections(updated);
      return updated;
    });
  }, []);

  return { products, setProducts, sections, setSections };
}

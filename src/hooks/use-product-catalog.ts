import { useCallback, useEffect, useState } from "react";
import { products as seedProducts, type Product } from "@/lib/products";
import { loadProducts, saveProducts } from "@/lib/product-store";
import { loadSections, saveSections } from "@/lib/section-store";
import { loadHeroSlides, saveHeroSlides } from "@/lib/hero-slide-store";
import { loadHomeBrands, saveHomeBrands } from "@/lib/home-brand-store";
import { seedSections, type Section } from "@/lib/sections";
import { seedHeroSlides, type HeroSlide } from "@/lib/hero-slides";
import { seedHomeBrands, type HomeBrandItem } from "@/lib/home-brands";

export function useProductCatalog() {
  const [products, setProductsState] = useState<Product[]>(seedProducts);
  const [sections, setSectionsState] = useState<Section[]>(seedSections);
  const [heroSlides, setHeroSlidesState] = useState<HeroSlide[]>(seedHeroSlides);
  const [homeBrands, setHomeBrandsState] = useState<HomeBrandItem[]>(seedHomeBrands);

  useEffect(() => {
    setProductsState(loadProducts());
    setSectionsState(loadSections());
    setHeroSlidesState(loadHeroSlides());
    setHomeBrandsState(loadHomeBrands());
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

  const setHeroSlides = useCallback((next: HeroSlide[] | ((prev: HeroSlide[]) => HeroSlide[])) => {
    setHeroSlidesState(prev => {
      const updated = typeof next === "function" ? next(prev) : next;
      saveHeroSlides(updated);
      return updated;
    });
  }, []);

  const setHomeBrands = useCallback((next: HomeBrandItem[] | ((prev: HomeBrandItem[]) => HomeBrandItem[])) => {
    setHomeBrandsState(prev => {
      const updated = typeof next === "function" ? next(prev) : next;
      saveHomeBrands(updated);
      return updated;
    });
  }, []);

  return { products, setProducts, sections, setSections, heroSlides, setHeroSlides, homeBrands, setHomeBrands };
}

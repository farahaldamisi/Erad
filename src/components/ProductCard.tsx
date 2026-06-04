import { Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { ShoppingCart } from "lucide-react";
import { useState } from "react";
import type { Product } from "@/lib/products";
import { getProductName } from "@/lib/products";
import { formatPrice } from "@/lib/currency";
import { getProductSpecSummary } from "@/lib/product-highlights";
import { ProductSpecSummaryBox } from "@/components/ProductSpecSummaryBox";
import { useCart } from "@/lib/cart-context";
import { useI18n } from "@/lib/i18n";

export function ProductCard({ p }: { p: Product }) {
  const { t, lang } = useI18n();
  const { addItem } = useCart();
  const [justAdded, setJustAdded] = useState(false);
  const inStock = p.stock > 0;
  const name = getProductName(p);
  const specSummary = getProductSpecSummary(p, lang);

  const handleAddToCart = () => {
    if (!inStock) return;
    addItem(p.id);
    setJustAdded(true);
    window.setTimeout(() => setJustAdded(false), 1500);
  };

  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      whileHover={{ y: -6 }}
      transition={{ duration: 0.4 }}
      className="group relative bg-card rounded-2xl border border-border overflow-hidden shadow-card hover:shadow-elegant transition-all"
    >
      <Link
        to="/product/$id"
        params={{ id: p.id }}
        className="block focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 rounded-t-2xl"
      >
        <div className="aspect-square bg-subtle overflow-hidden relative">
          <img
            src={p.image}
            alt={name}
            loading="lazy"
            className="w-full h-full object-contain p-6 group-hover:scale-110 transition-transform duration-500"
          />
          <span
            className={`absolute top-3 ${lang === "ar" ? "left-3" : "right-3"} text-[11px] uppercase tracking-wider px-2.5 py-1 rounded-full font-semibold ${inStock ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"}`}
          >
            {inStock ? t("in_stock") : t("out_stock")}
          </span>
        </div>
        <div className="p-5 pb-3">
          <p className="text-sm text-muted-foreground uppercase tracking-wider mb-1">{p.brand}</p>
          <h3 className="font-semibold text-lg mb-2 line-clamp-1 group-hover:text-primary transition-colors">{name}</h3>
          <ProductSpecSummaryBox text={specSummary} className="mb-3" />
          <p className="text-sm text-muted-foreground mb-3">{lang === "ar" ? p.subcategoryAr : p.subcategory}</p>
          <span className="text-2xl font-bold text-gradient">{formatPrice(p.price, lang)}</span>
        </div>
      </Link>

      <div className="flex flex-col gap-2.5 px-4 pb-4">
        <div className="grid grid-cols-2 gap-2.5">
          <Link
            to="/product/$id"
            params={{ id: p.id }}
            hash="details"
            className="inline-flex items-center justify-center h-11 rounded-full border border-border text-sm font-semibold hover:bg-accent transition"
          >
            {t("details")}
          </Link>
          <Link
            to="/product/$id"
            params={{ id: p.id }}
            hash="order"
            className="inline-flex items-center justify-center h-11 rounded-full bg-primary text-primary-foreground text-sm font-semibold hover:opacity-90 transition shadow-glow"
          >
            {t("order_now")}
          </Link>
        </div>
        <button
          type="button"
          disabled={!inStock}
          onClick={handleAddToCart}
          aria-label={justAdded ? t("added_to_cart") : t("add_to_cart")}
          className={`w-full inline-flex items-center justify-center gap-2 h-12 rounded-full text-sm font-semibold transition disabled:opacity-40 disabled:cursor-not-allowed ${
            justAdded
              ? "bg-primary text-primary-foreground shadow-glow"
              : "border border-primary/40 text-primary bg-primary/5 hover:bg-primary/10"
          }`}
        >
          <ShoppingCart className="size-4 shrink-0" />
          <span>{justAdded ? t("added_to_cart") : t("add_to_cart")}</span>
        </button>
      </div>
    </motion.article>
  );
}

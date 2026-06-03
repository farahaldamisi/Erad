import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { Minus, Plus, ShoppingCart, Trash2 } from "lucide-react";
import { formatPrice } from "@/lib/currency";
import { formatNumber } from "@/lib/format";
import { useCart } from "@/lib/cart-context";
import { useProducts } from "@/lib/products-context";
import { getProductName } from "@/lib/products";
import { useI18n } from "@/lib/i18n";

export const Route = createFileRoute("/cart")({
  head: () => ({ meta: [{ title: "Cart — ERAD" }] }),
  component: CartPage,
});

function CartPage() {
  const { t, lang } = useI18n();
  const { items, itemCount, removeItem, updateQuantity, clear } = useCart();
  const { products } = useProducts();

  const lines = items
    .map(item => {
      const product = products.find(p => p.id === item.productId);
      if (!product) return null;
      return { item, product };
    })
    .filter(Boolean) as { item: (typeof items)[0]; product: (typeof products)[0] }[];

  const total = lines.reduce((sum, { item, product }) => sum + product.price * item.quantity, 0);

  return (
    <div className="container mx-auto px-4 py-12 max-w-3xl">
      <div className="flex flex-wrap items-center justify-between gap-3 mb-8">
        <div>
          <h1 className="text-4xl font-bold flex items-center gap-3">
            <ShoppingCart className="size-9 text-primary" />
            {t("nav_cart")}
          </h1>
          <p className="text-muted-foreground mt-1">
            {itemCount > 0 ? `${formatNumber(itemCount)} ${t("cart_items")}` : t("cart_empty")}
          </p>
        </div>
        {lines.length > 0 && (
          <button
            type="button"
            onClick={clear}
            className="text-sm font-semibold text-destructive hover:underline"
          >
            {t("clear_cart")}
          </button>
        )}
      </div>

      {lines.length === 0 ? (
        <div className="text-center py-16 bg-card border border-border rounded-3xl">
          <ShoppingCart className="size-14 text-muted-foreground mx-auto mb-4 opacity-40" />
          <p className="text-muted-foreground mb-6">{t("cart_empty_sub")}</p>
          <Link
            to="/products"
            className="inline-flex h-11 px-6 items-center rounded-full bg-primary text-primary-foreground font-semibold shadow-glow"
          >
            {t("cta_shop")}
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {lines.map(({ item, product }, idx) => {
            const name = getProductName(product);
            return (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.05 }}
                className="flex gap-4 p-4 bg-card border border-border rounded-2xl shadow-card"
              >
                <Link to="/product/$id" params={{ id: product.id }} className="shrink-0">
                  <img
                    src={product.image}
                    alt={name}
                    className="size-20 rounded-xl object-contain bg-subtle p-2"
                  />
                </Link>
                <div className="flex-1 min-w-0">
                  <Link
                    to="/product/$id"
                    params={{ id: product.id }}
                    className="font-semibold hover:text-primary transition line-clamp-2"
                  >
                    {name}
                  </Link>
                  <p className="text-sm text-muted-foreground mt-0.5">{product.brand}</p>
                  <p className="font-bold text-primary mt-2">{formatPrice(product.price, lang)}</p>
                  <div className="flex items-center gap-3 mt-3">
                    <div className="inline-flex items-center rounded-full border border-border">
                      <button
                        type="button"
                        onClick={() => updateQuantity(product.id, item.quantity - 1)}
                        className="size-8 inline-flex items-center justify-center hover:bg-accent rounded-s-full"
                        aria-label="-"
                      >
                        <Minus className="size-3.5" />
                      </button>
                      <span className="w-8 text-center text-sm font-semibold">{formatNumber(item.quantity)}</span>
                      <button
                        type="button"
                        onClick={() => updateQuantity(product.id, item.quantity + 1)}
                        disabled={item.quantity >= product.stock}
                        className="size-8 inline-flex items-center justify-center hover:bg-accent rounded-e-full disabled:opacity-40"
                        aria-label="+"
                      >
                        <Plus className="size-3.5" />
                      </button>
                    </div>
                    <button
                      type="button"
                      onClick={() => removeItem(product.id)}
                      className="size-8 inline-flex items-center justify-center rounded-full hover:bg-destructive/10 text-destructive"
                      aria-label={t("remove_from_cart")}
                    >
                      <Trash2 className="size-4" />
                    </button>
                  </div>
                </div>
                <div className="text-end font-bold shrink-0">
                  {formatPrice(product.price * item.quantity, lang)}
                </div>
              </motion.div>
            );
          })}

          <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-border">
            <p className="text-lg font-bold">
              {t("cart_total")}: <span className="text-primary">{formatPrice(total, lang)}</span>
            </p>
            <div className="flex flex-wrap gap-2">
              <Link
                to="/products"
                className="inline-flex h-11 px-6 items-center rounded-full border border-border font-semibold hover:bg-accent transition"
              >
                {t("continue_shopping")}
              </Link>
              <Link
                to="/checkout"
                className="inline-flex h-11 px-6 items-center rounded-full bg-primary text-primary-foreground font-semibold shadow-glow hover:opacity-90 transition"
              >
                {t("continue_order")}
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

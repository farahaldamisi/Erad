import { createFileRoute, Link, redirect } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { ArrowLeft, CheckCircle2 } from "lucide-react";
import { useState } from "react";
import { OrderForm } from "@/components/OrderForm";
import { formatPrice } from "@/lib/currency";
import { formatNumber } from "@/lib/format";
import { useCart } from "@/lib/cart-context";
import { loadCart } from "@/lib/cart";
import { useProducts } from "@/lib/products-context";
import { getProductName } from "@/lib/products";
import { useI18n } from "@/lib/i18n";

export const Route = createFileRoute("/checkout")({
  beforeLoad: () => {
    if (typeof window === "undefined") return;
    if (loadCart().length === 0) {
      throw redirect({ to: "/cart" });
    }
  },
  head: () => ({ meta: [{ title: "Checkout — ERAD" }] }),
  component: CheckoutPage,
});

function CheckoutPage() {
  const { t, lang } = useI18n();
  const { items, clear } = useCart();
  const { products } = useProducts();
  const [submitted, setSubmitted] = useState(false);

  const lines = items
    .map(item => {
      const product = products.find(p => p.id === item.productId);
      if (!product) return null;
      return { item, product };
    })
    .filter(Boolean) as { item: (typeof items)[0]; product: (typeof products)[0] }[];

  if (lines.length === 0) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <p className="text-muted-foreground mb-4">{t("cart_empty")}</p>
        <Link to="/cart" className="text-primary font-semibold hover:underline">
          {t("nav_cart")}
        </Link>
      </div>
    );
  }

  const total = lines.reduce((sum, { item, product }) => sum + product.price * item.quantity, 0);
  const allInStock = lines.every(({ item, product }) => product.stock >= item.quantity);

  const cartSummary = {
    items: lines.map(({ item, product }) => ({
      productId: product.id,
      name: getProductName(product),
      quantity: item.quantity,
      lineTotal: product.price * item.quantity,
    })),
    total,
  };

  if (submitted) {
    return (
      <div className="container mx-auto px-4 py-20 max-w-lg">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-card border border-border rounded-3xl p-10 text-center shadow-elegant"
        >
          <CheckCircle2 className="size-16 text-primary mx-auto mb-4" />
          <h1 className="text-2xl font-bold mb-2">{t("order_success")}</h1>
          <p className="text-muted-foreground mb-8">{t("order_success_sub")}</p>
          <Link
            to="/products"
            className="inline-flex h-11 px-6 items-center rounded-full bg-primary text-primary-foreground font-semibold shadow-glow"
          >
            {t("continue_shopping")}
          </Link>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12 max-w-2xl">
      <Link
        to="/cart"
        className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary mb-6"
      >
        <ArrowLeft className="size-4 rtl:rotate-180" />
        {t("nav_cart")}
      </Link>

      <h1 className="text-4xl font-bold mb-2">{t("continue_order")}</h1>
      <p className="text-muted-foreground mb-8">
        {formatNumber(lines.reduce((s, l) => s + l.item.quantity, 0))} {t("cart_items")} ·{" "}
        {formatPrice(total, lang)}
      </p>

      <div className="bg-card border border-border rounded-3xl p-6 md:p-8 shadow-card">
        <h2 className="font-bold text-lg mb-4">{t("place_order")}</h2>
        <OrderForm
          inStock={allInStock}
          cartSummary={cartSummary}
          onSuccess={() => {
            clear();
            setSubmitted(true);
          }}
        />
        {!allInStock && (
          <p className="text-sm text-destructive mt-3">{t("cart_stock_warning")}</p>
        )}
      </div>
    </div>
  );
}

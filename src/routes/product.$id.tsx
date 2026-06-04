import { createFileRoute, Link, notFound, useNavigate } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Check, X, MessageCircle, ArrowLeft, ArrowRight, ShoppingCart } from "lucide-react";
import { products, getProductName, isLaptopLikeSection } from "@/lib/products";
import { findProduct } from "@/lib/product-store";
import { formatPrice } from "@/lib/currency";
import { formatNumber } from "@/lib/format";
import { mergeWithLaptopTemplate } from "@/lib/spec-templates";
import { useI18n } from "@/lib/i18n";
import { whatsappUrl } from "@/lib/contact";
import { OrderForm } from "@/components/OrderForm";
import { ProductSpecSummaryBox } from "@/components/ProductSpecSummaryBox";
import { OverviewGalleryStack } from "@/components/OverviewGalleryStack";
import { ProductCard } from "@/components/ProductCard";
import { getProductSpecSummary } from "@/lib/product-highlights";
import { useProducts } from "@/lib/products-context";
import { resolveSectionLabel } from "@/lib/sections";
import { logActivity } from "@/lib/activity";
import { useAuth } from "@/lib/auth";
import { useCart } from "@/lib/cart-context";

export const Route = createFileRoute("/product/$id")({
  loader: ({ params }) => {
    const p = findProduct(params.id) ?? products.find(x => x.id === params.id);
    if (!p) throw notFound();
    return { product: p };
  },
  head: ({ loaderData }) => ({
    meta: [{ title: loaderData ? `${loaderData.product.name} — ERAD` : "Product" }],
  }),
  notFoundComponent: () => <div className="container mx-auto p-20 text-center"><h2 className="text-2xl">Product not found</h2><Link to="/products" className="text-primary mt-4 inline-block">← Back</Link></div>,
  component: ProductPage,
});

function ProductPage() {
  const { product: loaded } = Route.useLoaderData();
  const { products, sections } = useProducts();
  const p = products.find(x => x.id === loaded.id) ?? loaded;
  const { t, lang } = useI18n();
  const { user } = useAuth();
  const { addItem } = useCart();
  const nav = useNavigate();
  const [active, setActive] = useState(0);
  const [detailTab, setDetailTab] = useState<"overview" | "specs">("overview");
  const [zoomPos, setZoomPos] = useState<{ x: number; y: number } | null>(null);
  const [justAdded, setJustAdded] = useState(false);
  const inStock = p.stock > 0;
  const overviewImages = p.overviewGallery.length > 0 ? p.overviewGallery : p.gallery;
  const displaySpecs =
    isLaptopLikeSection(p.category)
      ? mergeWithLaptopTemplate(p.specs)
      : p.specs;
  const filledSpecGroups = displaySpecs
    .map(g => ({ ...g, items: g.items.filter(it => it.value.trim()) }))
    .filter(g => g.items.length > 0);
  const otherOptions = useMemo(
    () =>
      products
        .filter(x => x.id !== p.id && x.category === p.category)
        .sort((a, b) => (b.stock > 0 ? 1 : 0) - (a.stock > 0 ? 1 : 0) || a.price - b.price)
        .slice(0, 4),
    [products, p.id, p.category],
  );
  const categoryLabel = resolveSectionLabel(sections, p.category, lang);
  const specSummary = getProductSpecSummary(p, lang);

  const handleAddToCart = () => {
    if (!inStock) return;
    addItem(p.id);
    setJustAdded(true);
    window.setTimeout(() => setJustAdded(false), 1500);
  };

  const onMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const r = e.currentTarget.getBoundingClientRect();
    setZoomPos({ x: ((e.clientX - r.left) / r.width) * 100, y: ((e.clientY - r.top) / r.height) * 100 });
  };

  useEffect(() => {
    if (window.location.hash === "#details" && filledSpecGroups.length > 0) {
      setDetailTab("specs");
    }
  }, [filledSpecGroups.length]);

  useEffect(() => {
    logActivity({
      type: "product_view",
      path: `/product/${p.id}`,
      userId: user?.id,
      userName: user?.name,
      userEmail: user?.email,
      label: getProductName(p),
      meta: { productId: p.id, price: String(p.price) },
    });
  }, [p.id, p.name, p.price, lang, user?.id, user?.name, user?.email]);

  return (
    <>
    <div className="container mx-auto px-4 py-10">
      <Link to="/products" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary mb-6">
        <ArrowLeft className="size-4 rtl:rotate-180" /> {t("nav_products")}
      </Link>

      <div className="grid lg:grid-cols-[1.2fr_1fr] gap-10 items-start">
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
          <div className="space-y-3">
            <div
              className="relative aspect-square bg-subtle rounded-3xl overflow-hidden border border-border shadow-card cursor-zoom-in"
              onMouseMove={onMove}
              onMouseLeave={() => setZoomPos(null)}
            >
              <img
                src={p.gallery[active]}
                alt={p.name}
                className="w-full h-full object-contain p-10 transition-transform duration-200"
                style={
                  zoomPos
                    ? { transform: `scale(2)`, transformOrigin: `${zoomPos.x}% ${zoomPos.y}%` }
                    : undefined
                }
              />
            </div>
            <div className="flex gap-3">
              {p.gallery.map((g: string, i: number) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => setActive(i)}
                  className={`flex-1 aspect-square rounded-xl overflow-hidden bg-subtle border-2 transition ${
                    active === i ? "border-primary shadow-glow" : "border-border hover:border-primary/40"
                  }`}
                >
                  <img src={g} alt="" className="w-full h-full object-contain p-2" />
                </button>
              ))}
            </div>
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
          <p className="text-xs uppercase tracking-widest text-primary font-semibold mb-2">
            {p.brand} · {lang === "ar" ? p.subcategoryAr : p.subcategory}
          </p>
          <h1 className="text-3xl sm:text-4xl font-bold mb-4 leading-tight">{getProductName(p)}</h1>
          <ProductSpecSummaryBox text={specSummary} className="mb-5" />

          <div className="flex items-center gap-4 mb-6">
            <span className="text-4xl font-bold text-gradient">{formatPrice(p.price, lang)}</span>
            <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold ${inStock ? "bg-primary/10 text-primary" : "bg-muted text-muted-foreground"}`}>
              {inStock ? <Check className="size-3.5" /> : <X className="size-3.5" />}
              {inStock ? t("in_stock") : t("out_stock")}
            </span>
          </div>

          <div id="order" className="bg-card border border-border rounded-2xl p-6 shadow-card">
            <h3 className="font-bold text-lg mb-4">{t("place_order")}</h3>
            <OrderForm
              inStock={inStock}
              productId={p.id}
              productName={getProductName(p)}
              productPrice={p.price}
              productBrand={p.brand}
              onSuccess={() => nav({ to: "/my-orders" })}
            />
            <button
              type="button"
              disabled={!inStock}
              onClick={handleAddToCart}
              className={`mt-3 w-full inline-flex items-center justify-center gap-2 h-12 rounded-full font-semibold transition disabled:opacity-40 disabled:cursor-not-allowed ${
                justAdded
                  ? "bg-primary text-primary-foreground shadow-glow"
                  : "border-2 border-primary text-primary bg-primary/5 hover:bg-primary/10"
              }`}
            >
              <ShoppingCart className="size-4" />
              {justAdded ? t("added_to_cart") : t("add_to_cart")}
            </button>
            <a href={whatsappUrl(`Hi, I'm interested in ${p.name}`)} target="_blank" rel="noreferrer" className="mt-3 w-full inline-flex items-center justify-center gap-2 h-12 rounded-full bg-[#25D366] text-white font-semibold hover:opacity-90 transition">
              <MessageCircle className="size-4" /> {t("ask_whatsapp")}
            </a>
          </div>
        </motion.div>
      </div>

      <section id="details" className="mt-14 lg:mt-20 scroll-mt-24">
        <div className="flex w-full max-w-2xl p-2 rounded-full bg-subtle border border-border shadow-sm mb-8">
          <button
            type="button"
            onClick={() => setDetailTab("overview")}
            className={`flex-1 px-6 py-4 sm:py-5 rounded-full text-lg sm:text-xl font-bold transition ${
              detailTab === "overview"
                ? "bg-background text-primary shadow-md border border-border"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            {t("overview")}
          </button>
          {filledSpecGroups.length > 0 && (
            <button
              type="button"
              onClick={() => setDetailTab("specs")}
              className={`flex-1 px-6 py-4 sm:py-5 rounded-full text-lg sm:text-xl font-bold transition ${
                detailTab === "specs"
                  ? "bg-background text-primary shadow-md border border-border"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {t("details")}
            </button>
          )}
        </div>

        <AnimatePresence mode="wait">
          {detailTab === "specs" && filledSpecGroups.length > 0 ? (
            <motion.div
              key="specs"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.25 }}
              className="w-full rounded-2xl overflow-hidden border border-border bg-subtle/40 shadow-card"
            >
              {specSummary && (
                <div className="px-5 md:px-8 lg:px-10 py-5 border-b border-border bg-card">
                  <ProductSpecSummaryBox text={specSummary} />
                </div>
              )}
              <div className="w-full bg-card overflow-hidden">
                {filledSpecGroups.map((g: { group: string; items: { label: string; value: string }[] }) => (
                  <div key={g.group}>
                    <div className="bg-subtle px-5 md:px-8 lg:px-10 py-4 border-b border-border font-bold text-sm uppercase tracking-wider">
                      {g.group}
                    </div>
                    {g.items.map((it: { label: string; value: string }) => (
                      <div
                        key={it.label}
                        className="grid grid-cols-1 md:grid-cols-[minmax(220px,1fr)_2fr] border-b border-border last:border-b-0"
                      >
                        <div className="px-5 md:px-8 lg:px-10 py-4 text-sm text-muted-foreground bg-background/50">
                          {it.label}
                        </div>
                        <div className="px-5 md:px-8 lg:px-10 py-4 text-sm font-medium md:border-s border-border whitespace-pre-line">
                          {it.value}
                        </div>
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="overview"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.25 }}
              className="w-full space-y-6"
            >
              {(p.overview || p.overviewAr) && (
                <p className="text-base sm:text-lg text-muted-foreground leading-relaxed max-w-4xl">
                  {lang === "ar" ? p.overviewAr : p.overview}
                </p>
              )}

              {overviewImages.length > 0 ? (
                <div className="relative left-1/2 w-screen max-w-[100vw] -translate-x-1/2">
                  <OverviewGalleryStack images={overviewImages} fullWidth />
                </div>
              ) : (
                !p.overview && !p.overviewAr && (
                  <p className="text-sm text-muted-foreground">{t("overview_no_images")}</p>
                )
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </section>

      {otherOptions.length > 0 && (
        <div className="mt-12 md:mt-14 pt-10 border-t border-border">
          <div className="flex flex-wrap items-end justify-between gap-4 mb-8">
            <div>
              <h2 className="text-2xl sm:text-3xl font-bold mb-2">{t("other_options")}</h2>
              <p className="text-muted-foreground text-sm sm:text-base">
                {t("other_options_sub").replace("{category}", categoryLabel)}
              </p>
            </div>
            <Link
              to="/products"
              search={{ category: p.category }}
              className="inline-flex items-center gap-2 text-sm font-semibold text-primary hover:gap-3 transition-all shrink-0"
            >
              {t("view_all_in_category")} <ArrowRight className="size-4 rtl:rotate-180" />
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {otherOptions.map(item => (
              <ProductCard key={item.id} p={item} />
            ))}
          </div>
        </div>
      )}
    </div>
    </>
  );
}

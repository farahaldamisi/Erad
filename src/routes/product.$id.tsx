import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Check, X, MessageCircle, ArrowLeft } from "lucide-react";
import { products, getProductName, isLaptopLikeSection } from "@/lib/products";
import { findProduct } from "@/lib/product-store";
import { formatPrice } from "@/lib/currency";
import { formatNumber } from "@/lib/format";
import { mergeWithLaptopTemplate } from "@/lib/spec-templates";
import { useI18n } from "@/lib/i18n";
import { whatsappUrl } from "@/lib/contact";
import { OrderForm } from "@/components/OrderForm";
import { useProducts } from "@/lib/products-context";
import { logActivity } from "@/lib/activity";
import { useAuth } from "@/lib/auth";

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
  const { products } = useProducts();
  const p = products.find(x => x.id === loaded.id) ?? loaded;
  const { t, lang } = useI18n();
  const { user } = useAuth();
  const [active, setActive] = useState(0);
  const [overviewActive, setOverviewActive] = useState(0);
  const [detailTab, setDetailTab] = useState<"overview" | "specs">("overview");
  const [zoomPos, setZoomPos] = useState<{ x: number; y: number } | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const inStock = p.stock > 0;
  const overviewImages = p.overviewGallery.length > 0 ? p.overviewGallery : p.gallery;
  const displaySpecs =
    isLaptopLikeSection(p.category)
      ? mergeWithLaptopTemplate(p.specs)
      : p.specs;
  const filledSpecGroups = displaySpecs
    .map(g => ({ ...g, items: g.items.filter(it => it.value.trim()) }))
    .filter(g => g.items.length > 0);

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

      {/* Top section: gallery + order */}
      <div className="grid lg:grid-cols-[1.2fr_1fr] gap-10">
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="space-y-4">
          <div
            className="relative aspect-square bg-subtle rounded-3xl overflow-hidden border border-border shadow-card cursor-zoom-in"
            onMouseMove={onMove}
            onMouseLeave={() => setZoomPos(null)}
          >
            <img src={p.gallery[active]} alt={p.name} className="w-full h-full object-contain p-10 transition-transform duration-200" style={zoomPos ? { transform: `scale(2)`, transformOrigin: `${zoomPos.x}% ${zoomPos.y}%` } : undefined} />
          </div>
          <div className="grid grid-cols-4 gap-3">
            {p.gallery.map((g: string, i: number) => (
              <button key={i} onClick={() => setActive(i)} className={`aspect-square rounded-xl overflow-hidden bg-subtle border-2 transition ${active === i ? "border-primary shadow-glow" : "border-border"}`}>
                <img src={g} alt="" className="w-full h-full object-contain p-2" />
              </button>
            ))}
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
          <p className="text-xs uppercase tracking-widest text-primary font-semibold mb-2">{p.brand} · {lang === "ar" ? p.subcategoryAr : p.subcategory}</p>
          <h1 className="text-4xl font-bold mb-3">{getProductName(p)}</h1>
          <p className="text-muted-foreground mb-5 leading-relaxed">{lang === "ar" ? p.overviewAr : p.overview}</p>

          <div className="flex items-center gap-4 mb-6">
            <span className="text-4xl font-bold text-gradient">{formatPrice(p.price, lang)}</span>
            <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold ${inStock ? "bg-primary/10 text-primary" : "bg-muted text-muted-foreground"}`}>
              {inStock ? <Check className="size-3.5" /> : <X className="size-3.5" />}
              {inStock ? `${t("in_stock")} (${formatNumber(p.stock)})` : t("out_stock")}
            </span>
          </div>

          <div id="order" className="bg-card border border-border rounded-2xl p-6 shadow-card">
            <h3 className="font-bold text-lg mb-4">{t("place_order")}</h3>
            {submitted ? (
              <div className="p-4 bg-primary/10 text-primary rounded-xl text-sm font-semibold text-center">{t("order_success")}</div>
            ) : (
              <OrderForm
                inStock={inStock}
                onSuccess={() => setSubmitted(true)}
                productId={p.id}
                productName={getProductName(p)}
              />
            )}
            <a href={whatsappUrl(`Hi, I'm interested in ${p.name}`)} target="_blank" rel="noreferrer" className="mt-3 w-full inline-flex items-center justify-center gap-2 h-11 rounded-full bg-[#25D366] text-white font-semibold hover:opacity-90 transition">
              <MessageCircle className="size-4" /> {t("ask_whatsapp")}
            </a>
          </div>
        </motion.div>
      </div>

    </div>

      {/* Overview / Details tabs */}
      <section id="details" className="container mx-auto px-4 mt-16 scroll-mt-24">
        <div className="inline-flex flex-wrap gap-1 p-1 rounded-xl bg-subtle border border-border">
          <button
            type="button"
            onClick={() => setDetailTab("overview")}
            className={`px-4 py-2 rounded-lg text-sm font-semibold transition ${
              detailTab === "overview"
                ? "bg-background text-primary shadow-sm border border-border"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            {t("overview")}
          </button>
          {filledSpecGroups.length > 0 && (
            <button
              type="button"
              onClick={() => setDetailTab("specs")}
              className={`px-4 py-2 rounded-lg text-sm font-semibold transition ${
                detailTab === "specs"
                  ? "bg-background text-primary shadow-sm border border-border"
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
              className="w-full mt-5 rounded-2xl overflow-hidden border border-border bg-subtle/40"
            >
              <div className="w-full bg-card overflow-hidden">
                {filledSpecGroups.map((g: { group: string; items: { label: string; value: string }[] }) => (
                  <div key={g.group}>
                    <div className="bg-subtle px-5 md:px-8 py-3.5 border-b border-border font-bold text-sm uppercase tracking-wider">
                      {g.group}
                    </div>
                    {g.items.map((it: { label: string; value: string }) => (
                      <div
                        key={it.label}
                        className="grid grid-cols-1 md:grid-cols-[minmax(200px,1fr)_2fr] border-b border-border last:border-b-0"
                      >
                        <div className="px-5 md:px-8 py-3.5 text-sm text-muted-foreground bg-background/50">
                          {it.label}
                        </div>
                        <div className="px-5 md:px-8 py-3.5 text-sm font-medium md:border-s border-border whitespace-pre-line">
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
              className="w-full mt-5 rounded-2xl overflow-hidden border border-border"
            >
              <div className="relative w-full min-h-[min(70vh,720px)] overflow-hidden bg-foreground">
                <img
                  src={overviewImages[overviewActive] ?? p.image}
                  alt={p.name}
                  className="absolute inset-0 w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/35 to-black/20" />
                <div className="relative z-10 flex flex-col justify-end min-h-[min(70vh,720px)] w-full px-4 sm:px-6 lg:px-10 py-14 md:py-20">
                  <div className="max-w-3xl">
                    <p className="text-lg text-white/90 leading-relaxed">
                      {lang === "ar" ? p.overviewAr : p.overview}
                    </p>
                  </div>
                </div>
              </div>

              {overviewImages.length > 1 && (
                <div className="w-full px-4 sm:px-6 lg:px-10 py-10 md:py-14 bg-background border-t border-border">
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 w-full">
                    {overviewImages.map((g: string, i: number) => (
                      <button
                        key={i}
                        type="button"
                        onClick={() => setOverviewActive(i)}
                        className={`aspect-[4/3] rounded-2xl overflow-hidden bg-subtle border-2 transition ${
                          overviewActive === i
                            ? "border-primary shadow-glow ring-2 ring-primary/30"
                            : "border-border hover:border-primary/40"
                        }`}
                      >
                        <img src={g} alt="" loading="lazy" className="w-full h-full object-cover" />
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </section>
    </>
  );
}

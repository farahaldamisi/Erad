import { Link, useNavigate, useRouterState } from "@tanstack/react-router";
import { Search, Globe, ShoppingCart, Menu, X, LayoutDashboard, ShoppingBag } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { useI18n } from "@/lib/i18n";
import { UserMenu } from "@/components/UserMenu";
import logo from "@/assets/logo.png";
import { motion, AnimatePresence } from "framer-motion";
import { useCart } from "@/lib/cart-context";
import { formatNumber } from "@/lib/format";
import { cn } from "@/lib/utils";
import { useAuth } from "@/lib/auth";
import { useOrdersCtx } from "@/lib/orders-context";

export function Navbar() {
  const { t, lang, setLang } = useI18n();
  const { itemCount } = useCart();
  const { isAdmin } = useAuth();
  const { orders } = useOrdersCtx();
  const nav = useNavigate();
  const [q, setQ] = useState("");
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = useRouterState({ select: s => s.location.pathname });
  const urlQuery = useRouterState({
    select: s => (s.location.search as { q?: string }).q ?? "",
  });
  const isHome = pathname === "/";
  const overHero = isHome && !scrolled;

  const pendingAdminOrders = useMemo(
    () => orders.filter(o => o.status === "received").length,
    [orders],
  );

  const customerLinks: { to: string; key: "nav_home" | "nav_products" | "nav_services" }[] = [
    { to: "/", key: "nav_home" },
    { to: "/products", key: "nav_products" },
    { to: "/services", key: "nav_services" },
  ];

  const adminLinks: {
    to: string;
    key: "dashboard" | "nav_products" | "recent_orders";
    exact?: boolean;
  }[] = [
    { to: "/admin", key: "dashboard", exact: true },
    { to: "/admin/products", key: "nav_products" },
    { to: "/admin/orders", key: "recent_orders" },
  ];

  const navLinks = isAdmin ? adminLinks : customerLinks;

  useEffect(() => {
    if (pathname === "/products") setQ(urlQuery);
  }, [pathname, urlQuery]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 16);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [pathname]);

  const runSearch = () => {
    const query = q.trim();
    nav({
      to: "/products",
      search: {
        category: "all",
        sort: "newest",
        ...(query ? { q: query } : {}),
      },
    });
  };

  const isCartActive = pathname === "/cart" || pathname === "/checkout";
  const isAdminDashboardActive = pathname === "/admin";
  const isAdminOrdersActive = pathname.startsWith("/admin/orders");

  const circleIconClass = (active: boolean) =>
    cn(
      "relative hidden sm:inline-flex h-11 w-11 items-center justify-center rounded-full transition hover:scale-105",
      active
        ? overHero
          ? "bg-white text-black shadow-md ring-2 ring-white/40"
          : "bg-primary text-primary-foreground shadow-glow"
        : overHero
          ? "border border-white/25 bg-white/10 text-white hover:bg-white/20"
          : "border border-border bg-card hover:bg-accent",
    );

  return (
    <header
      className={cn(
        "fixed top-0 inset-x-0 z-50 transition-all duration-300",
        scrolled
          ? "glass border-b border-border/60 shadow-sm backdrop-blur-xl bg-background/80"
          : "bg-transparent border-b border-transparent",
      )}
    >
      <div className="container mx-auto px-4 py-3 flex items-center gap-3 md:gap-6">
        <Link to="/" className="flex items-center gap-2 shrink-0">
          <img
            src={logo}
            alt="ERAD"
            className={cn("h-12 sm:h-14 w-auto max-w-[140px] sm:max-w-[160px] object-contain transition", overHero && "brightness-0 invert")}
          />
        </Link>

        <nav className="hidden lg:flex items-center gap-1">
          {navLinks.map(l => (
            <Link
              key={l.to}
              to={l.to}
              activeOptions={"exact" in l && l.exact ? { exact: true } : undefined}
              className={cn(
                "px-3.5 py-2.5 text-base font-medium transition-colors rounded-md",
                overHero
                  ? "text-white/85 hover:text-white hover:bg-white/10"
                  : "text-foreground/80 hover:text-primary hover:bg-accent",
              )}
              activeProps={{
                className: overHero ? "text-white bg-white/15" : "text-primary bg-accent",
              }}
            >
              {t(l.key)}
            </Link>
          ))}
        </nav>

        <form
          className="flex-1 max-w-xl hidden md:block"
          onSubmit={e => {
            e.preventDefault();
            runSearch();
          }}
        >
          <div className="relative">
            <Search className={cn("absolute top-1/2 -translate-y-1/2 start-3 size-[18px]", overHero ? "text-white/60" : "text-muted-foreground")} />
            <input
              value={q}
              onChange={e => setQ(e.target.value)}
              placeholder={t("search_products")}
              className={cn(
                "w-full h-11 rounded-full border ps-11 pe-4 text-base outline-none transition",
                overHero
                  ? "bg-white/10 border-white/20 text-white placeholder:text-white/50 focus:border-white/40 focus:ring-2 focus:ring-white/20"
                  : "bg-secondary border-border focus:border-primary focus:ring-2 focus:ring-primary/20",
              )}
            />
          </div>
        </form>

        <div className="flex items-center gap-2 ms-auto">
          <button
            onClick={() => setLang(lang === "en" ? "ar" : "en")}
            className={cn(
              "inline-flex items-center gap-1.5 h-11 px-3.5 rounded-full border text-base font-semibold transition",
              overHero
                ? "border-white/25 bg-white/10 text-white hover:bg-white/20"
                : "border-border bg-card hover:bg-accent",
            )}
            aria-label="Toggle language"
          >
            <Globe className="size-4" />
            {lang === "en" ? "العربية" : "EN"}
          </button>
          {isAdmin ? (
            <>
              <Link
                to="/admin"
                aria-label={t("dashboard")}
                title={t("dashboard")}
                aria-current={isAdminDashboardActive ? "page" : undefined}
                className={circleIconClass(isAdminDashboardActive)}
              >
                <LayoutDashboard className="size-4" />
              </Link>
              <Link
                to="/admin/orders"
                aria-label={t("recent_orders")}
                title={t("recent_orders")}
                aria-current={isAdminOrdersActive ? "page" : undefined}
                className={circleIconClass(isAdminOrdersActive)}
              >
                <ShoppingBag className="size-4" />
                {pendingAdminOrders > 0 && (
                  <span className="absolute -top-1 -end-1 min-w-5 h-5 px-1 rounded-full bg-destructive text-destructive-foreground text-[10px] font-bold inline-flex items-center justify-center">
                    {formatNumber(pendingAdminOrders)}
                  </span>
                )}
              </Link>
            </>
          ) : (
            <Link
              to="/cart"
              aria-label={t("nav_cart")}
              title={t("nav_cart")}
              aria-current={isCartActive ? "page" : undefined}
              className={circleIconClass(isCartActive)}
            >
              <ShoppingCart className="size-4" />
              {itemCount > 0 && (
                <span className="absolute -top-1 -end-1 min-w-5 h-5 px-1 rounded-full bg-destructive text-destructive-foreground text-[10px] font-bold inline-flex items-center justify-center">
                  {formatNumber(itemCount)}
                </span>
              )}
            </Link>
          )}
          <UserMenu overHero={overHero} />
          <button
            onClick={() => setOpen(o => !o)}
            className={cn(
              "lg:hidden h-10 w-10 inline-flex items-center justify-center rounded-full border transition",
              overHero ? "border-white/25 text-white hover:bg-white/10" : "border-border",
            )}
            aria-label="Menu"
          >
            {open ? <X className="size-4" /> : <Menu className="size-4" />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className={cn(
              "lg:hidden border-t overflow-hidden",
              overHero ? "border-white/15 bg-black/40 backdrop-blur-xl" : "border-border glass",
            )}
          >
            <div className="container mx-auto px-4 py-3 flex flex-col gap-1">
              {navLinks.map(l => (
                <Link
                  key={l.to}
                  to={l.to}
                  onClick={() => setOpen(false)}
                  activeOptions={"exact" in l && l.exact ? { exact: true } : undefined}
                  className={cn(
                    "px-3 py-2.5 rounded-md text-base font-medium transition",
                    overHero ? "text-white hover:bg-white/10" : "hover:bg-accent",
                  )}
                  activeProps={{
                    className: overHero
                      ? "text-white bg-white/15 font-semibold"
                      : "bg-primary/10 text-primary font-semibold",
                  }}
                >
                  {t(l.key)}
                </Link>
              ))}
              {!isAdmin && (
                <Link
                  to="/cart"
                  onClick={() => setOpen(false)}
                  className={cn(
                    "px-3 py-2.5 rounded-md text-base font-medium transition",
                    isCartActive
                      ? overHero
                        ? "text-white bg-white/15 font-semibold"
                        : "bg-primary/10 text-primary font-semibold"
                      : overHero
                        ? "text-white hover:bg-white/10"
                        : "hover:bg-accent",
                  )}
                >
                  {t("nav_cart")}
                </Link>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}

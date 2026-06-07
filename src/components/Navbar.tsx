import { Link, useNavigate, useRouterState } from "@tanstack/react-router";
import { Search, Globe, ShoppingCart, Menu, X, LayoutDashboard, ShoppingBag, Moon, Sun } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { useI18n } from "@/lib/i18n";
import { UserMenu } from "@/components/UserMenu";
import logo from "@/assets/logo.png";
import { motion, AnimatePresence } from "framer-motion";
import { useCart } from "@/lib/cart-context";
import { formatNumber } from "@/lib/format";
import { cn } from "@/lib/utils";
import { useAuth } from "@/lib/auth";
import { useTheme } from "@/lib/theme";
import { useOrdersCtx } from "@/lib/orders-context";

export function Navbar() {
  const { t, lang, setLang } = useI18n();
  const { theme, toggleTheme } = useTheme();
  const { itemCount } = useCart();
  const { isAdmin } = useAuth();
  const { orders } = useOrdersCtx();
  const nav = useNavigate();
  const [q, setQ] = useState("");
  const [open, setOpen] = useState(false);
  const pathname = useRouterState({ select: s => s.location.pathname });
  const urlQuery = useRouterState({
    select: s => (s.location.search as { q?: string }).q ?? "",
  });

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

  const mobileNavLinks = isAdmin ? adminLinks : customerLinks.filter(l => l.key !== "nav_home");

  useEffect(() => {
    if (pathname === "/products") setQ(urlQuery);
  }, [pathname, urlQuery]);

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

  const isHomeActive = pathname === "/";
  const isCartActive = pathname === "/cart" || pathname === "/checkout";
  const isAdminDashboardActive = pathname === "/admin";
  const isAdminOrdersActive = pathname.startsWith("/admin/orders");

  const navLinkClass = (active: boolean) =>
    cn(
      "px-3.5 py-2.5 text-base font-semibold transition-colors rounded-full whitespace-nowrap shrink-0",
      active
        ? "text-primary bg-accent"
        : "text-foreground/80 hover:text-primary hover:bg-accent",
    );

  const circleIconClass = (active: boolean) =>
    cn(
      "relative inline-flex h-11 w-11 items-center justify-center rounded-full transition hover:scale-105 shrink-0 border border-border bg-card hover:bg-accent",
      active && "bg-primary text-primary-foreground border-primary shadow-glow",
    );

  return (
    <header className="fixed top-0 inset-x-0 z-50 border-b border-border/60 bg-background/95 backdrop-blur-xl shadow-sm">
      <div className="container mx-auto px-4 py-3 flex items-center gap-2 sm:gap-3">
        <Link to="/" className="flex items-center shrink-0">
          <img
            src={logo}
            alt="ERAD"
            className="h-11 sm:h-12 w-auto max-w-[120px] sm:max-w-[140px] object-contain"
          />
        </Link>

        {!isAdmin && (
          <Link
            to="/"
            aria-current={isHomeActive ? "page" : undefined}
            className={cn(navLinkClass(isHomeActive), "hidden sm:inline-flex")}
          >
            {t("nav_home")}
          </Link>
        )}

        {isAdmin && (
          <nav className="hidden md:flex items-center gap-1 shrink-0">
            {adminLinks.map(l => (
              <Link
                key={l.to}
                to={l.to}
                activeOptions={l.exact ? { exact: true } : undefined}
                className={navLinkClass(l.exact ? pathname === l.to : pathname.startsWith(l.to))}
              >
                {t(l.key)}
              </Link>
            ))}
          </nav>
        )}

        <form
          className="flex-1 min-w-0 hidden md:block"
          onSubmit={e => {
            e.preventDefault();
            runSearch();
          }}
        >
          <div className="relative">
            <Search className="absolute top-1/2 -translate-y-1/2 start-3 size-[18px] text-muted-foreground" />
            <input
              value={q}
              onChange={e => setQ(e.target.value)}
              placeholder={t("search_products")}
              className="w-full h-11 rounded-full border border-border bg-secondary ps-11 pe-4 text-base outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
            />
          </div>
        </form>

        <div className="flex items-center gap-2 ms-auto md:ms-0 shrink-0">
          <button
            type="button"
            onClick={toggleTheme}
            className={circleIconClass(false)}
            aria-label={theme === "dark" ? t("theme_switch_to_light") : t("theme_switch_to_dark")}
            title={theme === "dark" ? t("theme_light") : t("theme_dark")}
          >
            {theme === "dark" ? <Sun className="size-4" /> : <Moon className="size-4" />}
          </button>

          <button
            type="button"
            onClick={() => setLang(lang === "en" ? "ar" : "en")}
            className={circleIconClass(false)}
            aria-label={lang === "en" ? "Switch to Arabic" : "Switch to English"}
            title={lang === "en" ? "العربية" : "EN"}
          >
            <Globe className="size-4" />
          </button>

          {isAdmin ? (
            <>
              <Link
                to="/admin"
                aria-label={t("dashboard")}
                title={t("dashboard")}
                aria-current={isAdminDashboardActive ? "page" : undefined}
                className={cn(circleIconClass(isAdminDashboardActive), "hidden sm:inline-flex")}
              >
                <LayoutDashboard className="size-4" />
              </Link>
              <Link
                to="/admin/orders"
                aria-label={t("recent_orders")}
                title={t("recent_orders")}
                aria-current={isAdminOrdersActive ? "page" : undefined}
                className={cn(circleIconClass(isAdminOrdersActive), "hidden sm:inline-flex")}
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

          <UserMenu />

          <button
            type="button"
            onClick={() => setOpen(o => !o)}
            className="md:hidden h-11 w-11 inline-flex items-center justify-center rounded-full border border-border transition shrink-0 hover:bg-accent"
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
            className="md:hidden border-t border-border bg-background/95 backdrop-blur-xl overflow-hidden"
          >
            <div className="container mx-auto px-4 py-3 flex flex-col gap-1">
              <form
                className="mb-2"
                onSubmit={e => {
                  e.preventDefault();
                  runSearch();
                  setOpen(false);
                }}
              >
                <div className="relative">
                  <Search className="absolute top-1/2 -translate-y-1/2 start-3 size-[18px] text-muted-foreground" />
                  <input
                    value={q}
                    onChange={e => setQ(e.target.value)}
                    placeholder={t("search_products")}
                    className="w-full h-11 rounded-full border border-border bg-secondary ps-11 pe-4 text-base outline-none transition"
                  />
                </div>
              </form>

              {mobileNavLinks.map(l => (
                <Link
                  key={l.to}
                  to={l.to}
                  onClick={() => setOpen(false)}
                  activeOptions={"exact" in l && l.exact ? { exact: true } : undefined}
                  className="px-3 py-2.5 rounded-md text-base font-medium transition hover:bg-accent"
                  activeProps={{
                    className: "bg-primary/10 text-primary font-semibold",
                  }}
                >
                  {t(l.key)}
                </Link>
              ))}

              {!isAdmin && (
                <Link
                  to="/"
                  onClick={() => setOpen(false)}
                  className={cn(
                    "px-3 py-2.5 rounded-md text-base font-medium transition sm:hidden",
                    isHomeActive ? "bg-primary/10 text-primary font-semibold" : "hover:bg-accent",
                  )}
                >
                  {t("nav_home")}
                </Link>
              )}

              <button
                type="button"
                onClick={toggleTheme}
                className="flex items-center gap-2 px-3 py-2.5 rounded-md text-base font-medium transition hover:bg-accent md:hidden"
              >
                {theme === "dark" ? <Sun className="size-4" /> : <Moon className="size-4" />}
                {theme === "dark" ? t("theme_light") : t("theme_dark")}
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}

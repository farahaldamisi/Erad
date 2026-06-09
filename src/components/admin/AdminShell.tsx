import { Link, Outlet, useNavigate, useRouterState } from "@tanstack/react-router";
import {
  Activity,
  Bell,
  Eye,
  EyeOff,
  FolderTree,
  LayoutDashboard,
  Lock,
  LogOut,
  Mail,
  Package,
  Phone,
  Presentation,
  ShoppingBag,
  Tag,
  Users,
  Wrench,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { useAuth } from "@/lib/auth";
import {
  acknowledgeAdminNotifications,
  getUnreadAdminNotificationCount,
} from "@/lib/admin-notifications";
import { useI18n } from "@/lib/i18n";
import { cn } from "@/lib/utils";
import { useProducts } from "@/lib/products-context";
import { formatNumber } from "@/lib/format";
import { getAdminPasswordPlain } from "@/lib/auth-store";

const navItems: {
  to: string;
  key:
    | "admin_overview"
    | "admin_notifications"
    | "admin_sections"
    | "admin_hero"
    | "admin_brands"
    | "nav_products"
    | "recent_orders"
    | "registered_users"
    | "activity_log"
    | "service_requests";
  icon: LucideIcon;
  exact?: boolean;
}[] = [
  { to: "/admin", key: "admin_overview", icon: LayoutDashboard, exact: true },
  { to: "/admin/notifications", key: "admin_notifications", icon: Bell },
  { to: "/admin/sections", key: "admin_sections", icon: FolderTree },
  { to: "/admin/hero", key: "admin_hero", icon: Presentation },
  { to: "/admin/brands", key: "admin_brands", icon: Tag },
  { to: "/admin/products", key: "nav_products", icon: Package },
  { to: "/admin/orders", key: "recent_orders", icon: ShoppingBag },
  { to: "/admin/users", key: "registered_users", icon: Users },
  { to: "/admin/activity", key: "activity_log", icon: Activity },
  { to: "/admin/services", key: "service_requests", icon: Wrench },
];

export function AdminShell() {
  const { t } = useI18n();
  const { user, logout, isLoading } = useAuth();
  const { products } = useProducts();
  const nav = useNavigate();
  const pathname = useRouterState({ select: s => s.location.pathname });
  const [ackTick, setAckTick] = useState(0);
  const [showPassword, setShowPassword] = useState(false);
  const adminPassword = user && user.role === "admin" ? getAdminPasswordPlain(user.id) : "";

  useEffect(() => {
    const refresh = () => setAckTick(v => v + 1);
    window.addEventListener("erad-notifications-ack", refresh);
    return () => window.removeEventListener("erad-notifications-ack", refresh);
  }, []);

  useEffect(() => {
    if (pathname.startsWith("/admin/notifications")) {
      acknowledgeAdminNotifications(products);
    }
  }, [pathname, products]);

  const notificationCount = useMemo(
    () => getUnreadAdminNotificationCount(products),
    [products, ackTick],
  );

  if (isLoading || !user || user.role !== "admin") {
    return (
      <div className="container mx-auto px-4 py-20 flex justify-center">
        <div className="h-10 w-48 rounded-lg bg-muted animate-pulse" />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 lg:py-10">
      <div className="flex flex-col lg:flex-row gap-6 lg:gap-8">
        <aside className="lg:w-64 shrink-0">
          <div className="rounded-2xl border border-border bg-card shadow-card overflow-hidden lg:sticky lg:top-24">
            <div className="px-5 py-5 border-b border-border">
              <h1 className="text-xl font-bold">{t("dashboard")}</h1>
              <div className="flex items-start gap-3 mt-4">
                <div className="size-10 rounded-xl bg-primary text-primary-foreground text-sm font-bold flex items-center justify-center shrink-0 shadow-glow">
                  {user.name
                    .split(" ")
                    .map(w => w[0])
                    .join("")
                    .slice(0, 2)
                    .toUpperCase()}
                </div>
                <div className="min-w-0 flex-1 space-y-1">
                  <p className="font-semibold text-sm truncate">{user.name}</p>
                  <p className="text-xs text-muted-foreground truncate inline-flex items-center gap-1.5 max-w-full">
                    <Mail className="size-3 shrink-0" />
                    <span className="truncate">{user.email}</span>
                  </p>
                  <p className="text-xs text-muted-foreground truncate inline-flex items-center gap-1.5 max-w-full">
                    <Phone className="size-3 shrink-0" />
                    <span className="truncate">{user.phone || "—"}</span>
                  </p>
                  <div className="text-xs text-muted-foreground inline-flex items-center gap-1.5 max-w-full pt-0.5">
                    <Lock className="size-3 shrink-0" />
                    <span className="truncate font-mono">
                      {showPassword && adminPassword ? adminPassword : "••••••••"}
                    </span>
                    {adminPassword && (
                      <button
                        type="button"
                        onClick={() => setShowPassword(v => !v)}
                        className="shrink-0 ms-auto text-muted-foreground hover:text-foreground transition"
                        aria-label={showPassword ? t("hide_password") : t("show_password")}
                      >
                        {showPassword ? <EyeOff className="size-3.5" /> : <Eye className="size-3.5" />}
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
            <nav className="p-2 flex lg:flex-col gap-1 overflow-x-auto">
              {navItems.map(item => {
                const active = item.exact ? pathname === item.to : pathname.startsWith(item.to);
                return (
                  <Link
                    key={item.to}
                    to={item.to}
                    className={cn(
                      "inline-flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm font-semibold whitespace-nowrap transition",
                      active
                        ? "bg-primary text-primary-foreground shadow-glow"
                        : "text-muted-foreground hover:bg-accent hover:text-foreground",
                    )}
                  >
                    <item.icon className="size-4 shrink-0" />
                    {t(item.key)}
                    {item.to === "/admin/notifications" && notificationCount > 0 && (
                      <span className="ms-auto min-w-5 h-5 px-1 rounded-full bg-amber-500 text-white text-[10px] font-bold inline-flex items-center justify-center">
                        {formatNumber(notificationCount)}
                      </span>
                    )}
                  </Link>
                );
              })}
            </nav>
            <div className="p-2 border-t border-border">
              <button
                type="button"
                onClick={() => {
                  logout();
                  nav({ to: "/" });
                }}
                className="w-full inline-flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm font-semibold text-muted-foreground hover:bg-destructive/10 hover:text-destructive transition"
              >
                <LogOut className="size-4" />
                {t("logout")}
              </button>
            </div>
          </div>
        </aside>

        <main className="flex-1 min-w-0">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

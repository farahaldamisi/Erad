import { Link, Outlet, useNavigate, useRouterState } from "@tanstack/react-router";
import {
  Activity,
  FolderTree,
  LayoutDashboard,
  LogOut,
  Package,
  ShoppingBag,
  Users,
  Wrench,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { useAuth } from "@/lib/auth";
import { useI18n } from "@/lib/i18n";
import { cn } from "@/lib/utils";

const navItems: { to: string; key: "admin_overview" | "admin_sections" | "nav_products" | "recent_orders" | "registered_users" | "activity_log" | "service_requests"; icon: LucideIcon; exact?: boolean }[] = [
  { to: "/admin", key: "admin_overview", icon: LayoutDashboard, exact: true },
  { to: "/admin/sections", key: "admin_sections", icon: FolderTree },
  { to: "/admin/products", key: "nav_products", icon: Package },
  { to: "/admin/orders", key: "recent_orders", icon: ShoppingBag },
  { to: "/admin/users", key: "registered_users", icon: Users },
  { to: "/admin/activity", key: "activity_log", icon: Activity },
  { to: "/admin/services", key: "service_requests", icon: Wrench },
];

export function AdminShell() {
  const { t } = useI18n();
  const { user, logout, isLoading } = useAuth();
  const nav = useNavigate();
  const pathname = useRouterState({ select: s => s.location.pathname });

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
              <p className="text-xs text-muted-foreground mt-1">{user.name}</p>
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

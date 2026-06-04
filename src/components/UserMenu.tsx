import { Link, useNavigate, useRouterState } from "@tanstack/react-router";
import { LayoutDashboard, LogIn, LogOut, User } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { useAuth } from "@/lib/auth";
import { useI18n } from "@/lib/i18n";
import { cn } from "@/lib/utils";

export function UserMenu({ overHero = false }: { overHero?: boolean }) {
  const { t } = useI18n();
  const { user, isLoading, isAuthenticated, isAdmin, logout } = useAuth();
  const nav = useNavigate();
  const pathname = useRouterState({ select: s => s.location.pathname });
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const isAccountActive =
    pathname === "/account" || pathname === "/login" || pathname.startsWith("/admin");

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("click", onClick);
    return () => document.removeEventListener("click", onClick);
  }, []);

  if (isLoading) {
    return (
      <div
        className={cn(
          "h-10 w-10 rounded-full border animate-pulse",
          overHero ? "border-white/25 bg-white/10" : "border-border bg-muted/50",
        )}
        aria-hidden
      />
    );
  }

  const pillClass = (active: boolean) =>
    cn(
      "inline-flex items-center gap-1.5 h-11 rounded-full border text-base font-semibold transition",
      active
        ? overHero
          ? "border-white bg-white text-black shadow-md ring-2 ring-white/40"
          : "border-primary bg-primary text-primary-foreground shadow-glow"
        : overHero
          ? "border-white/25 bg-white/10 text-white hover:bg-white/20"
          : "border-border bg-card hover:bg-accent",
    );

  if (!isAuthenticated || !user) {
    return (
      <Link
        to="/login"
        aria-current={pathname === "/login" ? "page" : undefined}
        className={cn(pillClass(pathname === "/login"), "px-3.5")}
      >
        <LogIn className="size-4" />
        <span className="hidden sm:inline">{t("login")}</span>
      </Link>
    );
  }

  const initials = user.name
    .split(" ")
    .map(w => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        onClick={() => setOpen(o => !o)}
        aria-current={isAccountActive ? "page" : undefined}
        className={cn(pillClass(isAccountActive), "gap-2 ps-1 pe-3.5")}
        aria-expanded={open}
        aria-haspopup="menu"
      >
        <span
          className={cn(
            "size-8 rounded-full text-xs font-bold inline-flex items-center justify-center",
            isAccountActive && !overHero
              ? "bg-primary-foreground text-primary"
              : "bg-primary text-primary-foreground",
          )}
        >
          {initials}
        </span>
        <span className="hidden sm:inline text-base font-semibold max-w-[140px] truncate">{user.name}</span>
      </button>

      {open && (
        <div
          role="menu"
          className="absolute end-0 top-full mt-2 w-56 rounded-2xl border border-border bg-card shadow-elegant py-2 z-50"
        >
          <div className="px-4 py-2 border-b border-border">
            <p className="font-semibold text-sm truncate">{user.name}</p>
            <p className="text-xs text-muted-foreground truncate">{user.email}</p>
          </div>
          <Link
            to="/account"
            role="menuitem"
            onClick={() => setOpen(false)}
            className="flex items-center gap-2 px-4 py-2.5 text-sm hover:bg-accent transition"
          >
            <User className="size-4" />
            {t("my_account")}
          </Link>
          {isAdmin && (
            <Link
              to="/admin"
              role="menuitem"
              onClick={() => setOpen(false)}
              className="flex items-center gap-2 px-4 py-2.5 text-sm hover:bg-accent transition"
            >
              <LayoutDashboard className="size-4" />
              {t("dashboard")}
            </Link>
          )}
          <button
            type="button"
            role="menuitem"
            onClick={() => {
              logout();
              setOpen(false);
              nav({ to: "/" });
            }}
            className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-destructive hover:bg-destructive/10 transition"
          >
            <LogOut className="size-4" />
            {t("logout")}
          </button>
        </div>
      )}
    </div>
  );
}

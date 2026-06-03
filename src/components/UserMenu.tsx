import { Link, useNavigate } from "@tanstack/react-router";
import { LayoutDashboard, LogIn, LogOut, User } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { useAuth } from "@/lib/auth";
import { useI18n } from "@/lib/i18n";
import { cn } from "@/lib/utils";

export function UserMenu({ overHero = false }: { overHero?: boolean }) {
  const { t } = useI18n();
  const { user, isLoading, isAuthenticated, isAdmin, logout } = useAuth();
  const nav = useNavigate();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

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

  if (!isAuthenticated || !user) {
    return (
      <Link
        to="/login"
        className={cn(
          "inline-flex items-center gap-1.5 h-10 px-3 rounded-full border text-sm font-semibold transition",
          overHero
            ? "border-white/25 bg-white/10 text-white hover:bg-white/20"
            : "border-border bg-card hover:bg-accent",
        )}
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
        className={cn(
          "inline-flex items-center gap-2 h-10 ps-1 pe-3 rounded-full border transition",
          overHero
            ? "border-white/25 bg-white/10 text-white hover:bg-white/20"
            : "border-border bg-card hover:bg-accent",
        )}
        aria-expanded={open}
        aria-haspopup="menu"
      >
        <span className="size-8 rounded-full bg-primary text-primary-foreground text-xs font-bold inline-flex items-center justify-center">
          {initials}
        </span>
        <span className="hidden sm:inline text-sm font-semibold max-w-[120px] truncate">{user.name}</span>
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

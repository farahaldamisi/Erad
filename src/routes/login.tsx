import { createFileRoute, Link, redirect, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { motion } from "framer-motion";
import { Eye, EyeOff, Lock, UserPlus } from "lucide-react";
import { AddressFieldsEditor } from "@/components/AddressFields";
import { useAuth, type AuthErrorCode } from "@/lib/auth";
import { getSessionUser } from "@/lib/auth-store";
import { useI18n } from "@/lib/i18n";

interface LoginSearch {
  redirect?: string;
  mode?: "signin" | "register";
}

export const Route = createFileRoute("/login")({
  validateSearch: (s: Record<string, unknown>): LoginSearch => ({
    redirect: typeof s.redirect === "string" ? s.redirect : undefined,
    mode: s.mode === "register" ? "register" : "signin",
  }),
  beforeLoad: () => {
    if (typeof window === "undefined") return;
    const user = getSessionUser();
    if (user) {
      throw redirect({ to: user.role === "admin" ? "/admin" : "/account" });
    }
  },
  head: () => ({ meta: [{ title: "Sign in — ERAD" }] }),
  component: LoginPage,
});

function LoginPage() {
  const { t } = useI18n();
  const { login, register } = useAuth();
  const nav = useNavigate();
  const { redirect: redirectTo, mode: initialMode } = Route.useSearch();
  const [mode, setMode] = useState<"signin" | "register">(initialMode ?? "signin");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [addresses, setAddresses] = useState([{ label: "", address: "" }]);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [err, setErr] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const errorMessage = (code: AuthErrorCode) => {
    const map: Record<AuthErrorCode, string> = {
      invalid_credentials: t("auth_invalid"),
      not_found: t("auth_invalid"),
      email_exists: t("auth_email_exists"),
      weak_password: t("auth_weak_password"),
      password_mismatch: t("auth_password_mismatch"),
      invalid_email: t("auth_invalid_email"),
      name_required: t("auth_name_required"),
      phone_required: t("auth_phone_required"),
      address_required: t("auth_address_required"),
    };
    return map[code] ?? t("auth_invalid");
  };

  const afterAuth = (role: "admin" | "customer") => {
    const safe =
      redirectTo?.startsWith("/") && !redirectTo.startsWith("//") ? redirectTo : undefined;
    if (safe) {
      window.location.href = safe;
      return;
    }
    nav({ to: role === "admin" ? "/admin" : "/account" });
  };

  const onSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setErr("");
    setSubmitting(true);
    const result = await login(email, password, rememberMe);
    setSubmitting(false);
    if (!result.ok) {
      setErr(errorMessage(result.code));
      return;
    }
    const { getSessionUser } = await import("@/lib/auth-store");
    const user = getSessionUser();
    afterAuth(user?.role ?? "customer");
  };

  const onRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setErr("");
    setSubmitting(true);
    const result = await register({ name, email, password, confirmPassword, phone, addresses });
    setSubmitting(false);
    if (!result.ok) {
      setErr(errorMessage(result.code));
      return;
    }
    afterAuth("customer");
  };

  const switchMode = (next: "signin" | "register") => {
    setMode(next);
    setErr("");
    nav({ search: { redirect: redirectTo, mode: next === "register" ? "register" : undefined } });
  };

  return (
    <div className="container mx-auto px-4 py-16 flex justify-center">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className={`w-full bg-card border border-border rounded-3xl p-8 shadow-elegant ${mode === "register" ? "max-w-lg" : "max-w-md"}`}
      >
        <div className="size-14 rounded-2xl bg-primary text-primary-foreground flex items-center justify-center mb-4 shadow-glow">
          {mode === "signin" ? <Lock className="size-6" /> : <UserPlus className="size-6" />}
        </div>

        <h1 className="text-3xl font-bold mb-1">
          {mode === "signin" ? t("sign_in_title") : t("register_title")}
        </h1>
        <p className="text-muted-foreground text-sm mb-6">
          {mode === "signin" ? t("sign_in_sub") : t("register_sub")}
        </p>

        <div className="flex gap-1 p-1 rounded-full bg-muted mb-6">
          <button
            type="button"
            onClick={() => switchMode("signin")}
            className={`flex-1 py-2 text-sm font-semibold rounded-full transition ${mode === "signin" ? "bg-card shadow-card text-primary" : "text-muted-foreground"}`}
          >
            {t("login")}
          </button>
          <button
            type="button"
            onClick={() => switchMode("register")}
            className={`flex-1 py-2 text-sm font-semibold rounded-full transition ${mode === "register" ? "bg-card shadow-card text-primary" : "text-muted-foreground"}`}
          >
            {t("create_account")}
          </button>
        </div>

        {mode === "signin" ? (
          <form onSubmit={onSignIn} className="space-y-4">
            <Field label={t("email")}>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
                autoComplete="email"
                className="auth-input"
              />
            </Field>
            <Field label={t("password")}>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  required
                  autoComplete="current-password"
                  className="auth-input pe-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(s => !s)}
                  className="absolute top-1/2 -translate-y-1/2 end-3 text-muted-foreground hover:text-foreground"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                </button>
              </div>
            </Field>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={e => setRememberMe(e.target.checked)}
                className="size-4 accent-primary"
              />
              <span className="text-sm">{t("remember_me")}</span>
            </label>
            {err && <p className="text-sm text-destructive">{err}</p>}
            <button
              type="submit"
              disabled={submitting}
              className="w-full h-12 rounded-full bg-primary text-primary-foreground font-semibold shadow-glow hover:opacity-90 disabled:opacity-60"
            >
              {submitting ? t("auth_loading") : t("login")}
            </button>
          </form>
        ) : (
          <form onSubmit={onRegister} className="space-y-4">
            <Field label={t("name_label")}>
              <input
                type="text"
                value={name}
                onChange={e => setName(e.target.value)}
                required
                autoComplete="name"
                className="auth-input"
              />
            </Field>
            <Field label={t("email")}>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
                autoComplete="email"
                className="auth-input"
              />
            </Field>
            <Field label={t("phone")}>
              <input
                type="tel"
                value={phone}
                onChange={e => setPhone(e.target.value)}
                required
                autoComplete="tel"
                className="auth-input"
              />
            </Field>
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">{t("my_addresses")}</p>
              <AddressFieldsEditor addresses={addresses} onChange={setAddresses} />
            </div>
            <Field label={t("password")}>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  required
                  minLength={8}
                  autoComplete="new-password"
                  className="auth-input pe-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(s => !s)}
                  className="absolute top-1/2 -translate-y-1/2 end-3 text-muted-foreground hover:text-foreground"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                </button>
              </div>
              <p className="text-xs text-muted-foreground mt-1">{t("auth_password_hint")}</p>
            </Field>
            <Field label={t("confirm_password")}>
              <input
                type={showPassword ? "text" : "password"}
                value={confirmPassword}
                onChange={e => setConfirmPassword(e.target.value)}
                required
                autoComplete="new-password"
                className="auth-input"
              />
            </Field>
            {err && <p className="text-sm text-destructive">{err}</p>}
            <button
              type="submit"
              disabled={submitting}
              className="w-full h-12 rounded-full bg-primary text-primary-foreground font-semibold shadow-glow hover:opacity-90 disabled:opacity-60"
            >
              {submitting ? t("auth_loading") : t("create_account")}
            </button>
          </form>
        )}

        <p className="text-center text-sm text-muted-foreground mt-6">
          <Link to="/" className="text-primary font-semibold hover:underline">
            ← {t("nav_home")}
          </Link>
        </p>

        <style>{`
          .auth-input {
            width: 100%;
            height: 2.75rem;
            border-radius: 0.5rem;
            border: 1px solid var(--border);
            background: var(--background);
            padding: 0 0.75rem;
            font-size: 0.875rem;
            outline: none;
          }
          .auth-input:focus {
            border-color: var(--primary);
            box-shadow: 0 0 0 3px oklch(0.55 0.22 25 / 0.18);
          }
        `}</style>
      </motion.div>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1.5 block">
        {label}
      </span>
      {children}
    </label>
  );
}

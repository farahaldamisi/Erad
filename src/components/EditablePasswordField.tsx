import { useState, type ReactNode } from "react";
import { Check, Eye, EyeOff, Pencil, X } from "lucide-react";
import type { AuthErrorCode } from "@/lib/auth";
import { useI18n, type DictKey } from "@/lib/i18n";
import { cn } from "@/lib/utils";

const errorKeys: Partial<Record<AuthErrorCode, DictKey>> = {
  weak_password: "auth_weak_password",
  password_mismatch: "auth_password_mismatch",
};

interface EditablePasswordFieldProps {
  icon: ReactNode;
  label: string;
  displayValue: string;
  onSave: (
    password: string,
    confirmPassword: string,
  ) =>
    | Promise<{ ok: true } | { ok: false; code: AuthErrorCode }>
    | { ok: true }
    | { ok: false; code: AuthErrorCode };
}

export function EditablePasswordField({ icon, label, displayValue, onSave }: EditablePasswordFieldProps) {
  const { t } = useI18n();
  const [editing, setEditing] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  const cancel = () => {
    setPassword("");
    setConfirmPassword("");
    setError("");
    setEditing(false);
  };

  const save = async () => {
    setSaving(true);
    const result = await Promise.resolve(onSave(password, confirmPassword));
    setSaving(false);
    if (!result.ok) {
      const key = errorKeys[result.code];
      setError(key ? t(key) : t("auth_invalid"));
      return;
    }
    setPassword("");
    setConfirmPassword("");
    setError("");
    setShowPassword(false);
    setEditing(false);
  };

  return (
    <div
      className={cn(
        "rounded-xl border border-border bg-subtle transition",
        editing ? "ring-2 ring-primary/25 border-primary/30" : "hover:border-primary/30",
      )}
    >
      {!editing ? (
        <div className="flex w-full items-center gap-3 p-4">
          <span className="shrink-0">{icon}</span>
          <div className="min-w-0 flex-1">
            <p className="text-xs text-muted-foreground uppercase tracking-wider">{label}</p>
            <p className="font-medium truncate font-mono">
              {showPassword && displayValue ? displayValue : "••••••••"}
            </p>
            <button
              type="button"
              onClick={() => {
                setEditing(true);
                setShowPassword(false);
              }}
              className="text-[11px] text-muted-foreground mt-1 hover:text-primary transition-colors"
            >
              {t("change_password")}
            </button>
          </div>
          {displayValue && (
            <button
              type="button"
              onClick={() => setShowPassword(v => !v)}
              className="shrink-0 text-muted-foreground hover:text-foreground transition"
              aria-label={showPassword ? t("hide_password") : t("show_password")}
            >
              {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
            </button>
          )}
          <button
            type="button"
            onClick={() => {
              setEditing(true);
              setShowPassword(false);
            }}
            className="shrink-0 text-muted-foreground hover:text-foreground transition sm:opacity-70"
            aria-label={t("change_password")}
          >
            <Pencil className="size-4" />
          </button>
        </div>
      ) : (
        <div className="p-4 space-y-3">
          <div className="flex items-start gap-3">
            <span className="shrink-0 mt-1">{icon}</span>
            <div className="min-w-0 flex-1 space-y-3">
              <div>
                <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1.5">{t("password")}</p>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={e => {
                      setPassword(e.target.value);
                      if (error) setError("");
                    }}
                    autoFocus
                    autoComplete="new-password"
                    className="w-full h-10 rounded-lg border border-border bg-background px-3 pe-10 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(v => !v)}
                    className="absolute top-1/2 -translate-y-1/2 end-3 text-muted-foreground hover:text-foreground"
                    aria-label={showPassword ? t("hide_password") : t("show_password")}
                  >
                    {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                  </button>
                </div>
              </div>
              <div>
                <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1.5">
                  {t("confirm_password")}
                </p>
                <input
                  type={showPassword ? "text" : "password"}
                  value={confirmPassword}
                  onChange={e => {
                    setConfirmPassword(e.target.value);
                    if (error) setError("");
                  }}
                  autoComplete="new-password"
                  onKeyDown={e => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      save();
                    }
                    if (e.key === "Escape") cancel();
                  }}
                  className="w-full h-10 rounded-lg border border-border bg-background px-3 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
                />
              </div>
              <p className="text-xs text-muted-foreground">{t("auth_password_hint")}</p>
            </div>
          </div>
          {error && <p className="text-xs text-destructive ps-11">{error}</p>}
          <div className="flex gap-2 ps-11">
            <button
              type="button"
              onClick={() => void save()}
              disabled={saving}
              className="inline-flex items-center gap-1.5 h-9 px-4 rounded-full bg-primary text-primary-foreground text-xs font-semibold disabled:opacity-60"
            >
              <Check className="size-3.5" />
              {t("save")}
            </button>
            <button
              type="button"
              onClick={cancel}
              className="inline-flex items-center gap-1.5 h-9 px-4 rounded-full border border-border text-xs font-semibold hover:bg-accent"
            >
              <X className="size-3.5" />
              {t("cancel")}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

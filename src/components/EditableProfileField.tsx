import { useEffect, useState, type ReactNode } from "react";
import { Check, Pencil, X } from "lucide-react";
import type { AuthErrorCode } from "@/lib/auth";
import { useI18n, type DictKey } from "@/lib/i18n";
import { cn } from "@/lib/utils";

const errorKeys: Partial<Record<AuthErrorCode, DictKey>> = {
  invalid_email: "auth_invalid_email",
  email_exists: "auth_email_exists",
  phone_required: "auth_phone_required",
  name_required: "auth_name_required",
};

interface EditableProfileFieldProps {
  icon: ReactNode;
  label: string;
  value: string;
  emptyLabel?: string;
  inputType?: "text" | "email" | "tel";
  onSave: (value: string) => { ok: true } | { ok: false; code: AuthErrorCode };
}

export function EditableProfileField({
  icon,
  label,
  value,
  emptyLabel = "—",
  inputType = "text",
  onSave,
}: EditableProfileFieldProps) {
  const { t } = useI18n();
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(value);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!editing) setDraft(value);
  }, [value, editing]);

  const cancel = () => {
    setDraft(value);
    setError("");
    setEditing(false);
  };

  const save = () => {
    if (draft.trim() === value.trim()) {
      setEditing(false);
      setError("");
      return;
    }
    const result = onSave(draft.trim());
    if (!result.ok) {
      const key = errorKeys[result.code];
      setError(key ? t(key) : t("auth_invalid"));
      return;
    }
    setError("");
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
        <button
          type="button"
          onClick={() => setEditing(true)}
          className="flex w-full items-center gap-3 p-4 text-start group"
        >
          <span className="shrink-0">{icon}</span>
          <div className="min-w-0 flex-1">
            <p className="text-xs text-muted-foreground uppercase tracking-wider">{label}</p>
            <p className="font-medium truncate">{value.trim() || emptyLabel}</p>
            <p className="text-[11px] text-muted-foreground mt-1 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity">
              {t("tap_to_edit")}
            </p>
          </div>
          <Pencil className="size-4 text-muted-foreground shrink-0 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity" />
        </button>
      ) : (
        <div className="p-4 space-y-3">
          <div className="flex items-center gap-3">
            <span className="shrink-0">{icon}</span>
            <div className="min-w-0 flex-1">
              <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1.5">{label}</p>
              <input
                type={inputType}
                value={draft}
                onChange={e => {
                  setDraft(e.target.value);
                  if (error) setError("");
                }}
                autoFocus
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
          </div>
          {error && <p className="text-xs text-destructive ps-11">{error}</p>}
          <div className="flex gap-2 ps-11">
            <button
              type="button"
              onClick={save}
              className="inline-flex items-center gap-1.5 h-9 px-4 rounded-full bg-primary text-primary-foreground text-xs font-semibold"
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

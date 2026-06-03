import { createFileRoute, redirect, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { motion } from "framer-motion";
import { LayoutDashboard, LogOut, Mail, MapPin, Phone, User } from "lucide-react";
import { AddressFieldsEditor } from "@/components/AddressFields";
import { useAuth } from "@/lib/auth";
import { getSessionUser } from "@/lib/auth-store";
import { useI18n } from "@/lib/i18n";

export const Route = createFileRoute("/account")({
  beforeLoad: () => {
    if (typeof window === "undefined") return;
    if (!getSessionUser()) {
      throw redirect({ to: "/login", search: { redirect: "/account" } });
    }
  },
  head: () => ({ meta: [{ title: "My Account — ERAD" }] }),
  component: AccountPage,
});

function AccountPage() {
  const { t } = useI18n();
  const { user, isAdmin, logout, isLoading, addAddress, removeAddress } = useAuth();
  const nav = useNavigate();
  const [newAddr, setNewAddr] = useState([{ label: "", address: "" }]);
  const [showAddForm, setShowAddForm] = useState(false);

  if (isLoading || !user) {
    return (
      <div className="container mx-auto px-4 py-20 flex justify-center">
        <div className="h-10 w-48 rounded-lg bg-muted animate-pulse" />
      </div>
    );
  }

  const saveNewAddress = () => {
    const draft = newAddr[0];
    if (!draft?.address.trim()) return;
    addAddress(draft.label, draft.address);
    setNewAddr([{ label: "", address: "" }]);
    setShowAddForm(false);
  };

  return (
    <div className="container mx-auto px-4 py-16 max-w-lg">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-card border border-border rounded-3xl p-8 shadow-elegant"
      >
        <div className="flex items-center gap-4 mb-8">
          <div className="size-16 rounded-2xl bg-primary text-primary-foreground text-xl font-bold flex items-center justify-center shadow-glow">
            {user.name
              .split(" ")
              .map(w => w[0])
              .join("")
              .slice(0, 2)
              .toUpperCase()}
          </div>
          <div>
            <h1 className="text-2xl font-bold">{t("welcome_back")}</h1>
            <p className="text-muted-foreground text-sm">{user.name}</p>
          </div>
        </div>

        <div className="space-y-3 mb-8">
          <div className="flex items-center gap-3 p-4 rounded-xl bg-subtle border border-border">
            <User className="size-5 text-primary shrink-0" />
            <div>
              <p className="text-xs text-muted-foreground uppercase tracking-wider">{t("name_label")}</p>
              <p className="font-medium">{user.name}</p>
            </div>
          </div>
          <div className="flex items-center gap-3 p-4 rounded-xl bg-subtle border border-border">
            <Mail className="size-5 text-primary shrink-0" />
            <div>
              <p className="text-xs text-muted-foreground uppercase tracking-wider">{t("email")}</p>
              <p className="font-medium">{user.email}</p>
            </div>
          </div>
          <div className="flex items-center gap-3 p-4 rounded-xl bg-subtle border border-border">
            <Phone className="size-5 text-primary shrink-0" />
            <div>
              <p className="text-xs text-muted-foreground uppercase tracking-wider">{t("phone")}</p>
              <p className="font-medium">{user.phone || "—"}</p>
            </div>
          </div>
        </div>

        <div className="mb-8">
          <h2 className="font-bold text-lg mb-3 flex items-center gap-2">
            <MapPin className="size-5 text-primary" />
            {t("my_addresses")}
          </h2>
          {user.addresses.length === 0 ? (
            <p className="text-sm text-muted-foreground mb-3">{t("no_addresses")}</p>
          ) : (
            <div className="space-y-2 mb-3">
              {user.addresses.map(addr => (
                <div key={addr.id} className="flex items-start justify-between gap-3 p-4 rounded-xl bg-subtle border border-border">
                  <div>
                    <p className="font-semibold text-sm">{addr.label}</p>
                    <p className="text-sm text-muted-foreground whitespace-pre-line">{addr.address}</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => removeAddress(addr.id)}
                    className="text-xs font-semibold text-destructive hover:underline shrink-0"
                  >
                    {t("delete_address")}
                  </button>
                </div>
              ))}
            </div>
          )}

          {showAddForm ? (
            <div className="space-y-3">
              <AddressFieldsEditor addresses={newAddr} onChange={setNewAddr} minCount={1} />
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={saveNewAddress}
                  className="h-10 px-5 rounded-full bg-primary text-primary-foreground text-sm font-semibold"
                >
                  {t("save")}
                </button>
                <button
                  type="button"
                  onClick={() => setShowAddForm(false)}
                  className="h-10 px-5 rounded-full border border-border text-sm font-semibold"
                >
                  {t("cancel")}
                </button>
              </div>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => setShowAddForm(true)}
              className="text-sm font-semibold text-primary hover:underline"
            >
              + {t("add_address")}
            </button>
          )}
        </div>

        <div className="flex flex-col gap-2">
          {isAdmin && (
            <button
              type="button"
              onClick={() => nav({ to: "/admin" })}
              className="w-full inline-flex items-center justify-center gap-2 h-11 rounded-full bg-primary text-primary-foreground font-semibold shadow-glow hover:opacity-90"
            >
              <LayoutDashboard className="size-4" />
              {t("dashboard")}
            </button>
          )}
          <button
            type="button"
            onClick={() => {
              logout();
              nav({ to: "/" });
            }}
            className="w-full inline-flex items-center justify-center gap-2 h-11 rounded-full border border-border font-semibold hover:bg-accent"
          >
            <LogOut className="size-4" />
            {t("logout")}
          </button>
        </div>
      </motion.div>
    </div>
  );
}

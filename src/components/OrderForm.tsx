import { Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { AddressPicker } from "@/components/AddressFields";
import { useAuth } from "@/lib/auth";
import { logActivity } from "@/lib/activity";
import { formatPrice } from "@/lib/currency";
import { formatNumber } from "@/lib/format";
import { useI18n } from "@/lib/i18n";

interface OrderFormProps {
  inStock: boolean;
  onSuccess: () => void;
  productId?: string;
  productName?: string;
  cartSummary?: {
    items: { productId: string; name: string; quantity: number; lineTotal: number }[];
    total: number;
  };
}

export function OrderForm({ inStock, onSuccess, productId, productName, cartSummary }: OrderFormProps) {
  const { t, lang } = useI18n();
  const { user, isAuthenticated, addAddress, updateAddress, updateProfile } = useAuth();
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [selectedAddressId, setSelectedAddressId] = useState("");
  const [selectedAddressDraft, setSelectedAddressDraft] = useState({ label: "", address: "" });
  const [useNewAddress, setUseNewAddress] = useState(false);
  const [newAddress, setNewAddress] = useState({ label: "", address: "" });
  const [saveNewAddress, setSaveNewAddress] = useState(true);
  const [guestAddress, setGuestAddress] = useState("");

  useEffect(() => {
    if (!user) return;
    setName(user.name);
    setPhone(user.phone);
    if (user.addresses.length > 0) {
      const first = user.addresses[0];
      setSelectedAddressId(first.id);
      setSelectedAddressDraft({ label: first.label, address: first.address });
      setUseNewAddress(false);
    } else {
      setUseNewAddress(true);
    }
  }, [user]);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();

    if (isAuthenticated && user) {
      if (name.trim() !== user.name || phone.trim() !== user.phone) {
        updateProfile(name.trim(), phone.trim());
      }

      if (!useNewAddress && selectedAddressId) {
        const saved = user.addresses.find(a => a.id === selectedAddressId);
        if (
          saved &&
          (selectedAddressDraft.label !== saved.label || selectedAddressDraft.address !== saved.address)
        ) {
          updateAddress(selectedAddressId, selectedAddressDraft.label, selectedAddressDraft.address);
        }
      }

      if (useNewAddress && saveNewAddress && newAddress.address.trim()) {
        addAddress(newAddress.label, newAddress.address);
      }
    }

    logActivity({
      type: "order_submit",
      userId: user?.id,
      userName: name.trim(),
      userEmail: user?.email,
      label: cartSummary ? t("cart_order") : (productName ?? name.trim()),
      meta: {
        phone: phone.trim(),
        ...(productId ? { productId } : {}),
        ...(productName ? { productName } : {}),
        ...(cartSummary
          ? {
              cartTotal: String(cartSummary.total),
              items: cartSummary.items.map(i => `${i.name} x${i.quantity}`).join(", "),
            }
          : {}),
        ...(!isAuthenticated && guestAddress.trim() ? { address: guestAddress.trim() } : {}),
      },
    });
    onSuccess();
  };

  const inputClass =
    "w-full h-11 rounded-lg border border-border bg-background px-3 text-sm focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none";

  return (
    <form onSubmit={submit} className="space-y-3">
      {cartSummary && (
        <div className="rounded-xl border border-border bg-subtle/50 p-4 space-y-2">
          <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">{t("order_summary")}</p>
          {cartSummary.items.map(item => (
            <div key={item.productId} className="flex items-center justify-between gap-3 text-sm">
              <span className="line-clamp-1">
                {item.name} × {formatNumber(item.quantity)}
              </span>
              <span className="font-semibold shrink-0">{formatPrice(item.lineTotal, lang)}</span>
            </div>
          ))}
          <div className="flex items-center justify-between pt-2 border-t border-border font-bold">
            <span>{t("cart_total")}</span>
            <span className="text-primary">{formatPrice(cartSummary.total, lang)}</span>
          </div>
        </div>
      )}

      {!isAuthenticated && (
        <p className="text-xs text-muted-foreground bg-subtle rounded-lg px-3 py-2">
          {t("login_to_order_hint")}{" "}
          <Link to="/login" className="text-primary font-semibold hover:underline">
            {t("login")}
          </Link>
        </p>
      )}

      {isAuthenticated && (
        <p className="text-xs text-muted-foreground">{t("order_edit_hint")}</p>
      )}

      <input
        required
        value={name}
        onChange={e => setName(e.target.value)}
        placeholder={t("full_name")}
        className={inputClass}
      />
      <input
        required
        type="tel"
        value={phone}
        onChange={e => setPhone(e.target.value)}
        placeholder={t("phone")}
        className={inputClass}
      />

      {isAuthenticated ? (
        <AddressPicker
          addresses={user?.addresses ?? []}
          selectedId={selectedAddressId}
          onSelect={id => {
            setSelectedAddressId(id);
            const addr = user?.addresses.find(a => a.id === id);
            if (addr) setSelectedAddressDraft({ label: addr.label, address: addr.address });
          }}
          selectedDraft={selectedAddressDraft}
          onSelectedDraftChange={setSelectedAddressDraft}
          newAddress={newAddress}
          onNewAddressChange={setNewAddress}
          useNewAddress={useNewAddress}
          onUseNewAddress={setUseNewAddress}
        />
      ) : (
        <textarea
          required
          value={guestAddress}
          onChange={e => setGuestAddress(e.target.value)}
          placeholder={t("address")}
          rows={2}
          className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none"
        />
      )}

      {isAuthenticated && useNewAddress && (
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={saveNewAddress}
            onChange={e => setSaveNewAddress(e.target.checked)}
            className="size-4 accent-primary"
          />
          <span className="text-sm">{t("save_address_to_profile")}</span>
        </label>
      )}

      <div>
        <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2 block">
          {t("payment")}
        </label>
        <div className="grid grid-cols-2 gap-2">
          <label className="flex items-center gap-2 p-3 border border-border rounded-lg cursor-pointer has-[:checked]:border-primary has-[:checked]:bg-primary/5">
            <input type="radio" name="pay" defaultChecked className="accent-primary" />
            <span className="text-sm">{t("cash")}</span>
          </label>
          <label className="flex items-center gap-2 p-3 border border-border rounded-lg cursor-pointer has-[:checked]:border-primary has-[:checked]:bg-primary/5">
            <input type="radio" name="pay" className="accent-primary" />
            <span className="text-sm">{t("visa")}</span>
          </label>
        </div>
      </div>

      <button
        disabled={!inStock}
        type="submit"
        className="w-full h-12 rounded-full bg-primary text-primary-foreground font-semibold shadow-glow hover:opacity-90 disabled:opacity-40 disabled:cursor-not-allowed transition"
      >
        {t("submit_order")}
      </button>
    </form>
  );
}

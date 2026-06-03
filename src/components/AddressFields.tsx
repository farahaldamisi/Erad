import { MapPin, Plus, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import { useI18n } from "@/lib/i18n";
import type { UserAddress } from "@/lib/auth-store";

export type AddressDraft = { label: string; address: string };

interface AddressFieldsEditorProps {
  addresses: AddressDraft[];
  onChange: (addresses: AddressDraft[]) => void;
  minCount?: number;
}

export function AddressFieldsEditor({ addresses, onChange, minCount = 1 }: AddressFieldsEditorProps) {
  const { t } = useI18n();

  const update = (index: number, field: keyof AddressDraft, value: string) => {
    onChange(addresses.map((a, i) => (i === index ? { ...a, [field]: value } : a)));
  };

  const add = () => {
    onChange([...addresses, { label: "", address: "" }]);
  };

  const remove = (index: number) => {
    if (addresses.length <= minCount) return;
    onChange(addresses.filter((_, i) => i !== index));
  };

  return (
    <div className="space-y-3">
      {addresses.map((addr, index) => (
        <div key={index} className="p-4 rounded-xl border border-border bg-subtle/50 space-y-3">
          <div className="flex items-center justify-between gap-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
              <MapPin className="size-3.5" />
              {t("address")} {addresses.length > 1 ? index + 1 : ""}
            </span>
            {addresses.length > minCount && (
              <button
                type="button"
                onClick={() => remove(index)}
                className="size-8 rounded-lg hover:bg-destructive/10 text-destructive inline-flex items-center justify-center"
                aria-label={t("delete_address")}
              >
                <Trash2 className="size-4" />
              </button>
            )}
          </div>
          <input
            type="text"
            value={addr.label}
            onChange={e => update(index, "label", e.target.value)}
            placeholder={t("address_label_placeholder")}
            className="auth-input"
          />
          <textarea
            value={addr.address}
            onChange={e => update(index, "address", e.target.value)}
            placeholder={t("address")}
            required
            rows={2}
            className="auth-input resize-none"
          />
        </div>
      ))}
      <button
        type="button"
        onClick={add}
        className="w-full inline-flex items-center justify-center gap-2 h-10 rounded-lg border border-dashed border-border text-sm font-semibold hover:bg-accent transition"
      >
        <Plus className="size-4" />
        {t("add_address")}
      </button>
      <style>{`
        .auth-input {
          width: 100%;
          min-height: 2.75rem;
          border-radius: 0.5rem;
          border: 1px solid var(--border);
          background: var(--background);
          padding: 0.5rem 0.75rem;
          font-size: 0.875rem;
          outline: none;
        }
        .auth-input:focus {
          border-color: var(--primary);
          box-shadow: 0 0 0 3px oklch(0.55 0.22 25 / 0.18);
        }
      `}</style>
    </div>
  );
}

interface AddressPickerProps {
  addresses: UserAddress[];
  selectedId: string;
  onSelect: (id: string) => void;
  selectedDraft: AddressDraft;
  onSelectedDraftChange: (draft: AddressDraft) => void;
  newAddress: AddressDraft;
  onNewAddressChange: (draft: AddressDraft) => void;
  useNewAddress: boolean;
  onUseNewAddress: (useNew: boolean) => void;
}

const fieldClass =
  "w-full rounded-lg border border-border bg-background px-3 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20";

export function AddressPicker({
  addresses,
  selectedId,
  onSelect,
  selectedDraft,
  onSelectedDraftChange,
  newAddress,
  onNewAddressChange,
  useNewAddress,
  onUseNewAddress,
}: AddressPickerProps) {
  const { t } = useI18n();
  const [showNewFields, setShowNewFields] = useState(useNewAddress || addresses.length === 0);

  useEffect(() => {
    setShowNewFields(useNewAddress || addresses.length === 0);
  }, [useNewAddress, addresses.length]);

  return (
    <div className="space-y-3">
      <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground block">
        {t("delivery_address")}
      </label>

      {addresses.length > 0 && (
        <div className="space-y-2">
          {addresses.map(addr => {
            const isSelected = !showNewFields && selectedId === addr.id;
            return (
              <div
                key={addr.id}
                className={`rounded-lg border transition ${
                  isSelected ? "border-primary bg-primary/5" : "border-border"
                }`}
              >
                <label className="flex items-start gap-3 p-3 cursor-pointer">
                  <input
                    type="radio"
                    name="saved-address"
                    checked={isSelected}
                    onChange={() => {
                      setShowNewFields(false);
                      onUseNewAddress(false);
                      onSelect(addr.id);
                      onSelectedDraftChange({ label: addr.label, address: addr.address });
                    }}
                    className="mt-1 accent-primary"
                  />
                  <div className="text-sm flex-1">
                    {!isSelected ? (
                      <>
                        <p className="font-semibold">{addr.label}</p>
                        <p className="text-muted-foreground whitespace-pre-line">{addr.address}</p>
                      </>
                    ) : (
                      <p className="font-semibold text-primary">{t("delivery_address")}</p>
                    )}
                  </div>
                </label>
                {isSelected && (
                  <div className="space-y-2 px-3 pb-3 ps-10">
                    <input
                      type="text"
                      value={selectedDraft.label}
                      onChange={e => onSelectedDraftChange({ ...selectedDraft, label: e.target.value })}
                      placeholder={t("address_label_placeholder")}
                      className={`${fieldClass} h-11`}
                    />
                    <textarea
                      value={selectedDraft.address}
                      onChange={e => onSelectedDraftChange({ ...selectedDraft, address: e.target.value })}
                      placeholder={t("address")}
                      required
                      rows={2}
                      className={`${fieldClass} py-2 resize-none`}
                    />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      <label
        className={`flex items-center gap-2 p-3 border rounded-lg cursor-pointer transition ${
          showNewFields ? "border-primary bg-primary/5" : "border-border hover:border-primary/40"
        }`}
      >
        <input
          type="radio"
          name="saved-address"
          checked={showNewFields}
          onChange={() => {
            setShowNewFields(true);
            onUseNewAddress(true);
          }}
          className="accent-primary"
        />
        <span className="text-sm font-semibold">{t("add_new_address")}</span>
      </label>

      {showNewFields && (
        <div className="space-y-2 ps-1">
          <input
            type="text"
            value={newAddress.label}
            onChange={e => onNewAddressChange({ ...newAddress, label: e.target.value })}
            placeholder={t("address_label_placeholder")}
            className={`${fieldClass} h-11`}
          />
          <textarea
            value={newAddress.address}
            onChange={e => onNewAddressChange({ ...newAddress, address: e.target.value })}
            placeholder={t("address")}
            required={showNewFields}
            rows={2}
            className={`${fieldClass} py-2 resize-none`}
          />
        </div>
      )}
    </div>
  );
}

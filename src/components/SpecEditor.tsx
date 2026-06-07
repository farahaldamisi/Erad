import { ChevronDown, Plus, Trash2 } from "lucide-react";
import { useState } from "react";
import type { SpecGroup } from "@/lib/products";
import { useI18n } from "@/lib/i18n";

interface SpecEditorProps {
  specs: SpecGroup[];
  onChange: (specs: SpecGroup[]) => void;
}

const LONG_TEXT_LABELS = new Set(["Ports", "Communications", "Audio", "Mobile Printing", "Wireless"]);

function isLongTextField(label: string) {
  return LONG_TEXT_LABELS.has(label) || label.toLowerCase().includes("port");
}

export function SpecEditor({ specs, onChange }: SpecEditorProps) {
  const { t } = useI18n();
  const [openGroups, setOpenGroups] = useState<Record<string, boolean>>(() =>
    Object.fromEntries(specs.map((g, i) => [g.group, i < 3])),
  );

  const updateGroupName = (groupIndex: number, group: string) => {
    onChange(specs.map((g, gi) => (gi !== groupIndex ? g : { ...g, group })));
  };

  const updateLabel = (groupIndex: number, itemIndex: number, label: string) => {
    onChange(
      specs.map((g, gi) =>
        gi !== groupIndex
          ? g
          : {
              ...g,
              items: g.items.map((item, ii) => (ii !== itemIndex ? item : { ...item, label })),
            },
      ),
    );
  };

  const updateValue = (groupIndex: number, itemIndex: number, value: string) => {
    onChange(
      specs.map((g, gi) =>
        gi !== groupIndex
          ? g
          : {
              ...g,
              items: g.items.map((item, ii) => (ii !== itemIndex ? item : { ...item, value })),
            },
      ),
    );
  };

  const removeGroup = (groupIndex: number) => {
    onChange(specs.filter((_, i) => i !== groupIndex));
  };

  const removeItem = (groupIndex: number, itemIndex: number) => {
    onChange(
      specs
        .map((g, gi) =>
          gi !== groupIndex ? g : { ...g, items: g.items.filter((_, ii) => ii !== itemIndex) },
        )
        .filter(g => g.items.length > 0),
    );
  };

  const addGroup = () => {
    const next = [...specs, { group: t("spec_editor_new_group"), items: [{ label: t("spec_editor_new_field"), value: "" }] }];
    onChange(next);
    setOpenGroups(prev => ({ ...prev, [next[next.length - 1].group]: true }));
  };

  const addItem = (groupIndex: number) => {
    onChange(
      specs.map((g, gi) =>
        gi !== groupIndex ? g : { ...g, items: [...g.items, { label: t("spec_editor_new_field"), value: "" }] },
      ),
    );
  };

  const toggleGroup = (group: string) => {
    setOpenGroups(prev => ({ ...prev, [group]: !prev[group] }));
  };

  if (specs.length === 0) {
    return (
      <div className="rounded-xl border border-dashed border-border bg-subtle/40 p-6 text-center space-y-3">
        <p className="text-sm text-muted-foreground">{t("spec_editor_empty")}</p>
        <button
          type="button"
          onClick={addGroup}
          className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-full border border-border hover:bg-accent transition"
        >
          <Plus className="size-3.5" />
          {t("spec_editor_add_group")}
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div className="space-y-2 border border-border rounded-xl overflow-hidden">
        {specs.map((group, groupIndex) => {
          const isOpen = openGroups[group.group] ?? false;
          return (
            <div key={`${group.group}-${groupIndex}`} className="border-b border-border last:border-b-0">
              <div className="flex items-center gap-2 px-3 py-2 bg-subtle">
                <button
                  type="button"
                  onClick={() => toggleGroup(group.group)}
                  className="flex flex-1 items-center justify-between gap-2 text-start min-w-0"
                >
                  <input
                    type="text"
                    value={group.group}
                    onClick={e => e.stopPropagation()}
                    onChange={e => updateGroupName(groupIndex, e.target.value)}
                    className="flex-1 min-w-0 h-8 rounded-md border border-border bg-background px-2 text-sm font-bold"
                  />
                  <ChevronDown
                    className={`size-4 shrink-0 text-muted-foreground transition-transform ${isOpen ? "rotate-180" : ""}`}
                  />
                </button>
                <button
                  type="button"
                  onClick={() => removeGroup(groupIndex)}
                  className="size-8 shrink-0 inline-flex items-center justify-center rounded-md text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition"
                  aria-label={t("spec_editor_remove_group")}
                >
                  <Trash2 className="size-3.5" />
                </button>
              </div>
              {isOpen && (
                <div className="px-4 pb-4 pt-2 space-y-3">
                  {group.items.map((item, itemIndex) => (
                    <div key={`${item.label}-${itemIndex}`} className="grid sm:grid-cols-[minmax(0,11rem)_1fr_auto] gap-2 items-start">
                      <input
                        type="text"
                        value={item.label}
                        onChange={e => updateLabel(groupIndex, itemIndex, e.target.value)}
                        className="spec-input font-semibold"
                        placeholder={t("spec_editor_field_name")}
                      />
                      {isLongTextField(item.label) ? (
                        <textarea
                          value={item.value}
                          onChange={e => updateValue(groupIndex, itemIndex, e.target.value)}
                          rows={3}
                          className="spec-input resize-y min-h-[4.5rem]"
                          placeholder="—"
                        />
                      ) : (
                        <input
                          type="text"
                          value={item.value}
                          onChange={e => updateValue(groupIndex, itemIndex, e.target.value)}
                          className="spec-input"
                          placeholder="—"
                        />
                      )}
                      <button
                        type="button"
                        onClick={() => removeItem(groupIndex, itemIndex)}
                        className="size-9 shrink-0 inline-flex items-center justify-center rounded-md text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition"
                        aria-label={t("spec_editor_remove_field")}
                      >
                        <Trash2 className="size-3.5" />
                      </button>
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={() => addItem(groupIndex)}
                    className="inline-flex items-center gap-1.5 text-xs font-semibold text-primary hover:underline"
                  >
                    <Plus className="size-3.5" />
                    {t("spec_editor_add_field")}
                  </button>
                </div>
              )}
            </div>
          );
        })}
      </div>

      <button
        type="button"
        onClick={addGroup}
        className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-full border border-border hover:bg-accent transition"
      >
        <Plus className="size-3.5" />
        {t("spec_editor_add_group")}
      </button>

      <style>{`
        .spec-input {
          width: 100%;
          min-height: 2.5rem;
          border-radius: 0.5rem;
          border: 1px solid var(--border);
          background: var(--background);
          padding: 0.4rem 0.65rem;
          font-size: 0.8125rem;
          outline: none;
        }
        .spec-input:focus {
          border-color: var(--primary);
          box-shadow: 0 0 0 2px oklch(0.55 0.22 25 / 0.15);
        }
      `}</style>
    </div>
  );
}

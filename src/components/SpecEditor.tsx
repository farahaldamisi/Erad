import { ChevronDown } from "lucide-react";
import { useState } from "react";
import type { SpecGroup } from "@/lib/products";

interface SpecEditorProps {
  specs: SpecGroup[];
  onChange: (specs: SpecGroup[]) => void;
}

export function SpecEditor({ specs, onChange }: SpecEditorProps) {
  const [openGroups, setOpenGroups] = useState<Record<string, boolean>>(() =>
    Object.fromEntries(specs.map((g, i) => [g.group, i < 3])),
  );

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

  const toggleGroup = (group: string) => {
    setOpenGroups(prev => ({ ...prev, [group]: !prev[group] }));
  };

  if (specs.length === 0) {
    return (
      <p className="text-sm text-muted-foreground py-4 text-center">
        No specification groups. Load the laptop template to start.
      </p>
    );
  }

  return (
    <div className="space-y-2 border border-border rounded-xl overflow-hidden">
      {specs.map((group, groupIndex) => {
        const isOpen = openGroups[group.group] ?? false;
        return (
          <div key={group.group} className="border-b border-border last:border-b-0">
            <button
              type="button"
              onClick={() => toggleGroup(group.group)}
              className="w-full flex items-center justify-between gap-2 px-4 py-3 bg-subtle hover:bg-accent/50 text-start transition"
            >
              <span className="font-bold text-sm">{group.group}</span>
              <ChevronDown
                className={`size-4 shrink-0 text-muted-foreground transition-transform ${isOpen ? "rotate-180" : ""}`}
              />
            </button>
            {isOpen && (
              <div className="px-4 pb-4 pt-1 grid sm:grid-cols-2 gap-3">
                {group.items.map((item, itemIndex) => (
                  <label key={item.label} className="block sm:col-span-1">
                    <span className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground mb-1 block leading-tight">
                      {item.label}
                    </span>
                    {item.label === "Ports" || item.label === "Communications" || item.label === "Audio" ? (
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
                  </label>
                ))}
              </div>
            )}
          </div>
        );
      })}
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

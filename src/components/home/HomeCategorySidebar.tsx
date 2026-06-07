import { Link } from "@tanstack/react-router";
import { ChevronRight } from "lucide-react";
import { useState } from "react";
import type { Section } from "@/lib/sections";
import { getSectionLabel } from "@/lib/sections";
import {
  getSubcategoryCatalogForSection,
  sectionHasSubcategoryNav,
} from "@/lib/subcategories";
import { useI18n } from "@/lib/i18n";
import { cn } from "@/lib/utils";

function categorySearch(sectionId: string, sub?: string) {
  return {
    category: sectionId,
    sort: "newest" as const,
    ...(sub ? { sub } : {}),
  };
}

export function HomeCategorySidebar({ sections, className }: { sections: Section[]; className?: string }) {
  const { t, lang } = useI18n();
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const openSection = (sectionId: string) => setExpandedId(sectionId);
  const closeSection = () => setExpandedId(null);
  const toggleSection = (sectionId: string) => {
    setExpandedId(current => (current === sectionId ? null : sectionId));
  };

  return (
    <aside className={cn("rounded-2xl border border-border bg-card shadow-card overflow-hidden flex flex-col", className)}>
      <div className="px-3 py-2.5 border-b border-border bg-subtle/40">
        <h2 className="font-bold text-xs uppercase tracking-wide">{t("browse_categories")}</h2>
      </div>
      <nav className="divide-y divide-border overflow-y-auto flex-1 max-h-[400px]">
        {sections.map(section => {
          const subs = getSubcategoryCatalogForSection(section.id);
          const expandable = sectionHasSubcategoryNav(section.id) && subs.length > 0;
          const isOpen = expandedId === section.id;

          return (
            <div
              key={section.id}
              onMouseLeave={expandable ? closeSection : undefined}
            >
              <div
                className={cn(
                  "flex items-center gap-1 px-2.5 py-2.5 transition group",
                  isOpen ? "bg-accent/50" : "hover:bg-accent/50",
                )}
              >
                <Link
                  to="/products"
                  search={categorySearch(section.id)}
                  className={cn(
                    "flex-1 min-w-0 text-xs font-semibold leading-snug py-0.5 transition-colors",
                    isOpen ? "text-primary" : "text-foreground/90 group-hover:text-primary",
                  )}
                >
                  {getSectionLabel(section, lang)}
                </Link>
                {expandable ? (
                  <button
                    type="button"
                    onMouseEnter={() => openSection(section.id)}
                    onFocus={() => openSection(section.id)}
                    onClick={() => toggleSection(section.id)}
                    aria-expanded={isOpen}
                    aria-label={getSectionLabel(section, lang)}
                    className={cn(
                      "size-7 shrink-0 inline-flex items-center justify-center rounded-md transition",
                      isOpen
                        ? "text-primary bg-accent"
                        : "text-muted-foreground hover:text-primary hover:bg-accent",
                    )}
                  >
                    <ChevronRight
                      className={cn(
                        "size-3.5 transition-transform rtl:rotate-180",
                        isOpen && "rotate-90 rtl:rotate-90",
                      )}
                    />
                  </button>
                ) : (
                  <Link
                    to="/products"
                    search={categorySearch(section.id)}
                    className="size-7 shrink-0 inline-flex items-center justify-center rounded-md text-muted-foreground hover:text-primary hover:bg-accent transition"
                    aria-label={getSectionLabel(section, lang)}
                  >
                    <ChevronRight className="size-3.5 rtl:rotate-180" />
                  </Link>
                )}
              </div>

              {expandable && isOpen && (
                <div
                  className="px-2.5 pb-2.5 pt-0 space-y-0.5 border-t border-border/60 bg-subtle/30"
                  onMouseEnter={() => openSection(section.id)}
                >
                  <Link
                    to="/products"
                    search={categorySearch(section.id)}
                    className="block rounded-md px-2.5 py-2 text-[11px] font-semibold text-muted-foreground hover:text-primary hover:bg-accent transition"
                  >
                    {t("category_all_types")}
                  </Link>
                  {subs.map(sub => (
                    <Link
                      key={sub.slug}
                      to="/products"
                      search={categorySearch(section.id, sub.slug)}
                      className="block rounded-md px-2.5 py-2 text-[11px] font-medium text-foreground/85 hover:text-primary hover:bg-accent transition"
                    >
                      {lang === "ar" ? sub.labelAr : sub.labelEn}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </nav>
    </aside>
  );
}

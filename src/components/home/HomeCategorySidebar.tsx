import { Link } from "@tanstack/react-router";
import { ChevronRight } from "lucide-react";
import type { Section } from "@/lib/sections";
import { getSectionLabel } from "@/lib/sections";
import { useI18n } from "@/lib/i18n";
import { cn } from "@/lib/utils";

export function HomeCategorySidebar({ sections, className }: { sections: Section[]; className?: string }) {
  const { t, lang } = useI18n();

  return (
    <aside className={cn("rounded-2xl border border-border bg-card shadow-card overflow-hidden flex flex-col", className)}>
      <div className="px-4 py-3.5 border-b border-border bg-subtle/40">
        <h2 className="font-bold text-sm">{t("browse_categories")}</h2>
      </div>
      <nav className="divide-y divide-border overflow-y-auto flex-1 max-h-[420px]">
        {sections.map(section => (
          <Link
            key={section.id}
            to="/products"
            search={{ category: section.id, sort: "newest" }}
            className="flex items-center gap-3 px-3 py-3 hover:bg-accent transition group"
          >
            <div className="size-10 shrink-0 rounded-lg bg-subtle border border-border/60 p-1.5 flex items-center justify-center">
              <img
                src={section.image}
                alt=""
                className="max-w-full max-h-full object-contain opacity-90 group-hover:opacity-100 transition"
              />
            </div>
            <span className="flex-1 text-sm font-semibold text-foreground/90 group-hover:text-primary transition-colors">
              {getSectionLabel(section, lang)}
            </span>
            <ChevronRight className="size-4 text-muted-foreground shrink-0 rtl:rotate-180 group-hover:text-primary transition-colors" />
          </Link>
        ))}
      </nav>
    </aside>
  );
}

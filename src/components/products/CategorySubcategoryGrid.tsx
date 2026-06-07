import type { Section } from "@/lib/sections";
import { getSectionLabel } from "@/lib/sections";
import { getSectionSubcategoryCards, getSubcategoryLabel } from "@/lib/subcategories";
import type { Product } from "@/lib/products";
import { useI18n } from "@/lib/i18n";
import { formatNumber } from "@/lib/format";
import { cn } from "@/lib/utils";

interface CategorySubcategoryGridProps {
  section: Section;
  products: Product[];
  activeSub?: string;
  onSelect: (sub?: string) => void;
}

function SubcategoryCard({
  active,
  onClick,
  image,
  imageFallback,
  title,
  count,
  countLabel,
  emptyLabel,
}: {
  active: boolean;
  onClick: () => void;
  image?: string;
  imageFallback?: string;
  title: string;
  count: number;
  countLabel: string;
  emptyLabel?: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "group flex flex-1 min-w-[6.5rem] sm:min-w-[7.5rem] flex-col items-center justify-center gap-2 px-3 py-4 sm:px-4 sm:py-5 text-center transition hover:bg-accent/40",
        active && "bg-primary/5",
        count === 0 && "opacity-80",
      )}
    >
      <div
        className={cn(
          "size-14 sm:size-16 rounded-xl bg-subtle border flex items-center justify-center overflow-hidden p-2",
          active ? "border-primary ring-2 ring-primary/20" : "border-border group-hover:border-primary/30",
        )}
      >
        {image || imageFallback ? (
          <img src={image ?? imageFallback} alt="" className="max-h-full max-w-full object-contain" />
        ) : (
          <span className="text-[10px] text-muted-foreground px-1">{emptyLabel}</span>
        )}
      </div>
      <p className="font-bold text-xs sm:text-sm leading-snug line-clamp-2 min-h-[2.5rem]">{title}</p>
      <p className="text-[10px] sm:text-xs text-muted-foreground whitespace-nowrap">
        {formatNumber(count)} {countLabel}
      </p>
    </button>
  );
}

export function CategorySubcategoryGrid({
  section,
  products,
  activeSub,
  onSelect,
}: CategorySubcategoryGridProps) {
  const { t, lang } = useI18n();
  const cards = getSectionSubcategoryCards(products, section.id, section.image);
  const categoryTotal = products.filter(p => p.category === section.id).length;

  return (
    <section className="mb-8">
      <div className="mb-5">
        <h2 className="text-3xl sm:text-4xl font-bold">{getSectionLabel(section, lang)}</h2>
        <p className="text-muted-foreground mt-1">{t("category_subcategories_hint")}</p>
      </div>

      <div className="w-full rounded-2xl border border-border bg-card shadow-card overflow-hidden">
        <div className="flex items-stretch divide-x divide-border overflow-x-auto scrollbar-none w-full">
          <SubcategoryCard
            active={!activeSub}
            onClick={() => onSelect(undefined)}
            image={section.image}
            title={t("category_all_types")}
            count={categoryTotal}
            countLabel={t("products_found")}
          />

          {cards.map(card => (
            <SubcategoryCard
              key={card.slug}
              active={activeSub === card.slug}
              onClick={() => onSelect(card.slug)}
              image={card.image}
              imageFallback={section.image}
              title={getSubcategoryLabel(card, lang)}
              count={card.count}
              countLabel={t("products_found")}
              emptyLabel={t("no_products")}
            />
          ))}
        </div>
      </div>

      {activeSub && (
        <p className="mt-4 text-sm font-semibold text-primary">
          {t("category_selected_type")}:{" "}
          {getSubcategoryLabel(
            cards.find(card => card.slug === activeSub) ?? {
              slug: activeSub,
              labelEn: activeSub,
              labelAr: activeSub,
              count: 0,
            },
            lang,
          )}
        </p>
      )}
    </section>
  );
}

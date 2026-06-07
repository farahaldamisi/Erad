import { Gamepad2 } from "lucide-react";
import { useMemo } from "react";
import { GamingPcCard } from "@/components/home/GamingPcCard";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { getGamingPcProducts } from "@/lib/home-spotlights";
import { useProducts } from "@/lib/products-context";
import { useI18n } from "@/lib/i18n";
import { cn } from "@/lib/utils";

export function HomeGamingPcSection({ className }: { className?: string }) {
  const { t, lang } = useI18n();
  const { products } = useProducts();
  const gamingPcs = useMemo(() => getGamingPcProducts(products), [products]);

  if (gamingPcs.length === 0) return null;

  const arrowClass =
    "static translate-x-0 translate-y-0 top-auto left-auto right-auto size-9 sm:size-10 rounded-full border-border bg-card shadow-md hover:bg-accent disabled:opacity-30 [&_svg]:rtl:rotate-180";

  return (
    <section
      className={cn(
        "rounded-2xl border border-violet-500/25 bg-gradient-to-br from-violet-500/[0.07] via-card to-card shadow-card overflow-hidden",
        className,
      )}
    >
      <Carousel
        opts={{
          align: "start",
          slidesToScroll: 1,
          direction: lang === "ar" ? "rtl" : "ltr",
        }}
      >
        <div className="px-4 sm:px-6 pt-5 sm:pt-6 pb-4 flex items-end justify-between gap-3 border-b border-violet-500/10">
          <div>
            <span className="inline-flex items-center gap-1.5 text-violet-600 mb-1">
              <Gamepad2 className="size-4" />
              <span className="text-xs font-bold uppercase tracking-wider">{t("home_gaming_pc_badge")}</span>
            </span>
            <h2 className="text-xl sm:text-2xl font-bold">{t("home_gaming_pc_title")}</h2>
            <p className="text-sm text-muted-foreground mt-0.5">{t("home_gaming_pc_sub")}</p>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <CarouselPrevious variant="outline" className={arrowClass} />
            <CarouselNext variant="outline" className={arrowClass} />
          </div>
        </div>

        <div className="px-4 sm:px-6 py-4 sm:py-5">
          <CarouselContent className="-ml-3 sm:-ml-4">
            {gamingPcs.map(product => (
              <CarouselItem
                key={product.id}
                className="pl-3 sm:pl-4 basis-full sm:basis-1/2 lg:basis-1/3"
              >
                <GamingPcCard product={product} />
              </CarouselItem>
            ))}
          </CarouselContent>
        </div>
      </Carousel>
    </section>
  );
}

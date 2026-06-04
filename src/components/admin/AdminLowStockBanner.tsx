import { Link } from "@tanstack/react-router";
import { AlertTriangle } from "lucide-react";
import { formatNumber } from "@/lib/format";
import { useI18n } from "@/lib/i18n";
import { getProductName } from "@/lib/products";
import { useProducts } from "@/lib/products-context";
import { formatLowStockAlertLabel, getLowStockProducts } from "@/lib/stock-alerts";

export function AdminLowStockBanner({ compact = false }: { compact?: boolean }) {
  const { t } = useI18n();
  const { products } = useProducts();
  const lowStock = getLowStockProducts(products);

  if (lowStock.length === 0) return null;

  return (
    <div className="rounded-2xl border border-amber-500/40 bg-amber-500/10 px-4 py-4 sm:px-5 sm:py-5 mb-6">
      <div className="flex items-start gap-3">
        <span className="inline-flex size-10 shrink-0 items-center justify-center rounded-full bg-amber-500/20 text-amber-700">
          <AlertTriangle className="size-5" />
        </span>
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
            <h3 className="font-bold text-sm sm:text-base">{t("admin_low_stock_alerts")}</h3>
            <Link to="/admin/products" className="text-xs font-semibold text-primary hover:underline shrink-0">
              {t("nav_products")}
            </Link>
          </div>
          {!compact && (
            <p className="text-xs text-muted-foreground mb-3">{t("admin_low_stock_alerts_sub")}</p>
          )}
          <ul className="space-y-1.5">
            {(compact ? lowStock.slice(0, 3) : lowStock).map(product => (
              <li key={product.id} className="text-sm font-medium">
                {formatLowStockAlertLabel(getProductName(product), product.stock, t)}
                {!compact && product.stock > 1 && (
                  <span className="text-muted-foreground font-normal">
                    {" "}
                    · {t("stock")}: {formatNumber(product.stock)}
                  </span>
                )}
              </li>
            ))}
          </ul>
          {compact && lowStock.length > 3 && (
            <p className="text-xs text-muted-foreground mt-2">
              +{formatNumber(lowStock.length - 3)} {t("admin_items")}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

export function formatActivityEventLabel(
  event: { type: string; label?: string; meta?: Record<string, string> },
  t: (key: import("@/lib/i18n").DictKey) => string,
): string | undefined {
  if (event.type === "low_stock" && event.label && event.meta?.stock) {
    return formatLowStockAlertLabel(event.label, Number(event.meta.stock), t);
  }
  return event.label;
}

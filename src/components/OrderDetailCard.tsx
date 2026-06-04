import { Link } from "@tanstack/react-router";
import { formatOrderNumber, type Order } from "@/lib/orders";
import { formatPrice } from "@/lib/currency";
import { formatDateTime, formatNumber } from "@/lib/format";
import { useProducts } from "@/lib/products-context";
import { useI18n } from "@/lib/i18n";
import { OrderStatusBadge } from "@/components/OrderStatusBadge";

export function OrderDetailCard({ order, compact }: { order: Order; compact?: boolean }) {
  const { t, lang } = useI18n();
  const { products } = useProducts();

  const resolveBrand = (productId: string, stored?: string) =>
    stored ?? products.find(p => p.id === productId)?.brand;

  return (
    <div className="rounded-2xl border border-border bg-card shadow-card overflow-hidden">
      <div className="flex flex-wrap items-start justify-between gap-3 px-5 py-4 border-b border-border bg-subtle/40">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">{t("admin_order_id")}</p>
          <p className="font-bold text-lg">{formatOrderNumber(order.id)}</p>
          <p className="text-xs text-muted-foreground mt-1">{formatDateTime(order.createdAt, lang)}</p>
        </div>
        <OrderStatusBadge status={order.status} />
      </div>

      <div className="p-5 space-y-4">
        {order.status === "received" && (
          <p className="text-sm font-medium text-primary bg-primary/10 rounded-xl px-4 py-3 text-center sm:text-start">
            {t("order_received_note")}
          </p>
        )}

        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">{t("order_summary")}</p>
          <div className="space-y-3">
            {order.items.map(item => {
              const brand = resolveBrand(item.productId, item.brand);
              return (
                <div
                  key={`${order.id}-${item.productId}`}
                  className="flex items-start justify-between gap-3 text-sm rounded-xl border border-border bg-subtle/30 px-3 py-2.5"
                >
                  <div className="min-w-0">
                    {brand && (
                      <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground mb-0.5">
                        {brand}
                      </p>
                    )}
                    <p className="font-semibold line-clamp-2">{item.name}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">× {formatNumber(item.quantity)}</p>
                  </div>
                  <span className="font-semibold shrink-0">{formatPrice(item.lineTotal, lang)}</span>
                </div>
              );
            })}
          </div>
          <div className="flex items-center justify-between pt-3 mt-3 border-t border-border font-bold">
            <span>{t("cart_total")}</span>
            <span className="text-primary">{formatPrice(order.total, lang)}</span>
          </div>
        </div>

        {!compact && (
          <>
            <div className="grid sm:grid-cols-2 gap-3 text-sm">
              <InfoBlock label={t("full_name")} value={order.customerName} />
              <InfoBlock label={t("phone")} value={order.phone} />
              {order.customerEmail && <InfoBlock label={t("email")} value={order.customerEmail} />}
              <InfoBlock label={t("payment")} value={t(order.paymentMethod as "cash" | "visa")} />
            </div>
            <InfoBlock label={t("delivery_address")} value={order.address} />
          </>
        )}

        {compact && (
          <Link
            to="/orders/$orderId"
            params={{ orderId: order.id }}
            className="inline-flex text-sm font-semibold text-primary hover:underline"
          >
            {t("invoice_title")}
          </Link>
        )}
      </div>
    </div>
  );
}

function InfoBlock({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl bg-subtle border border-border px-3 py-2.5">
      <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground mb-0.5">{label}</p>
      <p className="font-medium whitespace-pre-line">{value}</p>
    </div>
  );
}

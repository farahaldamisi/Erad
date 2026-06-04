import { createFileRoute, Link } from "@tanstack/react-router";
import { Trash2 } from "lucide-react";
import { OrderStatusBadge } from "@/components/OrderStatusBadge";
import { formatOrderNumber, ORDER_STATUSES, sortOrdersNewestFirst, type OrderStatus } from "@/lib/orders";
import { useOrdersCtx } from "@/lib/orders-context";
import { formatPrice } from "@/lib/currency";
import { formatDateTime, formatNumber } from "@/lib/format";
import { useI18n } from "@/lib/i18n";

export const Route = createFileRoute("/admin/orders")({
  head: () => ({ meta: [{ title: "Orders — ERAD Admin" }] }),
  component: AdminOrdersPage,
});

function AdminOrdersPage() {
  const { t, lang } = useI18n();
  const { orders, updateStatus, removeOrder } = useOrdersCtx();
  const sorted = sortOrdersNewestFirst(orders);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold">{t("recent_orders")}</h2>
        <p className="text-muted-foreground mt-1">{formatNumber(sorted.length)} {t("admin_items")}</p>
      </div>

      <div className="bg-card border border-border rounded-2xl shadow-card overflow-hidden">
        {sorted.length === 0 ? (
          <p className="px-5 py-10 text-center text-muted-foreground text-sm">{t("orders_empty")}</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-subtle">
                <tr>
                  <th className="text-start px-4 py-3 font-semibold text-xs uppercase tracking-wider">{t("admin_order_id")}</th>
                  <th className="text-start px-4 py-3 font-semibold text-xs uppercase tracking-wider">{t("full_name")}</th>
                  <th className="text-start px-4 py-3 font-semibold text-xs uppercase tracking-wider">{t("order_summary")}</th>
                  <th className="text-start px-4 py-3 font-semibold text-xs uppercase tracking-wider">{t("phone")}</th>
                  <th className="text-start px-4 py-3 font-semibold text-xs uppercase tracking-wider">{t("price")}</th>
                  <th className="text-start px-4 py-3 font-semibold text-xs uppercase tracking-wider">{t("status")}</th>
                  <th className="px-4 py-3" />
                </tr>
              </thead>
              <tbody>
                {sorted.map(order => (
                  <tr key={order.id} className="border-t border-border align-top hover:bg-accent/30">
                    <td className="px-4 py-3">
                      <p className="font-semibold">{formatOrderNumber(order.id)}</p>
                      <p className="text-[10px] text-muted-foreground mt-1">{formatDateTime(order.createdAt, lang)}</p>
                    </td>
                    <td className="px-4 py-3">
                      <p className="font-semibold">{order.customerName}</p>
                      {order.customerEmail && <p className="text-xs text-muted-foreground">{order.customerEmail}</p>}
                    </td>
                    <td className="px-4 py-3 max-w-xs">
                      <p className="line-clamp-3">
                        {order.items.map(item => `${item.name} × ${item.quantity}`).join(" · ")}
                      </p>
                      <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{order.address}</p>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">{order.phone}</td>
                    <td className="px-4 py-3 font-semibold whitespace-nowrap">{formatPrice(order.total, lang)}</td>
                    <td className="px-4 py-3">
                      <select
                        value={order.status}
                        onChange={e => updateStatus(order.id, e.target.value as OrderStatus)}
                        className="h-9 rounded-lg border border-border bg-background px-2 text-xs font-semibold mb-2"
                      >
                        {ORDER_STATUSES.map(status => (
                          <option key={status} value={status}>
                            {t(`order_status_${status}` as "order_status_received" | "order_status_completed" | "order_status_cancelled")}
                          </option>
                        ))}
                      </select>
                      <div>
                        <OrderStatusBadge status={order.status} />
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <button
                        type="button"
                        onClick={() => removeOrder(order.id)}
                        className="size-8 rounded-lg hover:bg-destructive/10 text-destructive inline-flex items-center justify-center"
                        title={t("delete")}
                      >
                        <Trash2 className="size-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

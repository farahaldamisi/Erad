import { createFileRoute } from "@tanstack/react-router";
import { mockOrders } from "@/lib/admin-route";
import { formatPrice } from "@/lib/currency";
import { formatNumber } from "@/lib/format";
import { useI18n } from "@/lib/i18n";

export const Route = createFileRoute("/admin/orders")({
  head: () => ({ meta: [{ title: "Orders — ERAD Admin" }] }),
  component: AdminOrdersPage,
});

function AdminOrdersPage() {
  const { t, lang } = useI18n();

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold">{t("recent_orders")}</h2>
        <p className="text-muted-foreground mt-1">{formatNumber(mockOrders.length)} {t("admin_items")}</p>
      </div>

      <div className="bg-card border border-border rounded-2xl shadow-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-subtle">
              <tr>
                <th className="text-start px-4 py-3 font-semibold text-xs uppercase tracking-wider">{t("admin_order_id")}</th>
                <th className="text-start px-4 py-3 font-semibold text-xs uppercase tracking-wider">{t("full_name")}</th>
                <th className="text-start px-4 py-3 font-semibold text-xs uppercase tracking-wider">{t("product_name")}</th>
                <th className="text-start px-4 py-3 font-semibold text-xs uppercase tracking-wider">{t("price")}</th>
                <th className="text-start px-4 py-3 font-semibold text-xs uppercase tracking-wider">{t("status")}</th>
              </tr>
            </thead>
            <tbody>
              {mockOrders.map(order => (
                <tr key={order.id} className="border-t border-border hover:bg-accent/30">
                  <td className="px-4 py-3 font-semibold">{order.id}</td>
                  <td className="px-4 py-3">{order.customer}</td>
                  <td className="px-4 py-3 text-muted-foreground">{order.product}</td>
                  <td className="px-4 py-3 font-semibold">{formatPrice(order.total, lang)}</td>
                  <td className="px-4 py-3">
                    <span
                      className={`text-[10px] uppercase tracking-wider font-semibold px-2 py-0.5 rounded-full ${
                        order.status === "Delivered"
                          ? "bg-green-100 text-green-700"
                          : order.status === "Shipped"
                            ? "bg-blue-100 text-blue-700"
                            : "bg-orange-100 text-orange-700"
                      }`}
                    >
                      {order.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

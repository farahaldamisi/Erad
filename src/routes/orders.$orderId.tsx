import { createFileRoute, Link } from "@tanstack/react-router";
import { useAuth } from "@/lib/auth";
import { OrderInvoice } from "@/components/OrderInvoice";
import { getOrderById } from "@/lib/order-store";
import { useOrdersCtx } from "@/lib/orders-context";
import { useI18n } from "@/lib/i18n";

export const Route = createFileRoute("/orders/$orderId")({
  head: () => ({ meta: [{ title: "Order — ERAD" }] }),
  component: OrderDetailPage,
});

function OrderDetailPage() {
  const { t } = useI18n();
  const { orderId } = Route.useParams();
  const { orders } = useOrdersCtx();
  const order = orders.find(o => o.id === orderId) ?? getOrderById(orderId);

  if (!order) {
    return (
      <div className="container mx-auto px-4 py-16 max-w-lg text-center">
        <p className="text-muted-foreground mb-6">{t("order_not_found")}</p>
        <Link to="/products" className="text-primary font-semibold hover:underline">
          {t("continue_shopping")}
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12 max-w-3xl">
      <Link
        to="/my-orders"
        className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary mb-6"
      >
        ← {t("my_orders")}
      </Link>

      <OrderInvoice order={order} />
    </div>
  );
}

import { createFileRoute, Link } from "@tanstack/react-router";
import { Package } from "lucide-react";
import { OrderInvoice } from "@/components/OrderInvoice";
import { useAuth } from "@/lib/auth";
import { loadMyOrderIds } from "@/lib/order-store";
import { getMyOrders } from "@/lib/orders";
import { useOrdersCtx } from "@/lib/orders-context";
import { useI18n } from "@/lib/i18n";

export const Route = createFileRoute("/my-orders")({
  head: () => ({ meta: [{ title: "My Orders — ERAD" }] }),
  component: MyOrdersPage,
});

function MyOrdersPage() {
  const { t } = useI18n();
  const { user } = useAuth();
  const { orders } = useOrdersCtx();
  const myOrders = getMyOrders(orders, {
    user: user ?? undefined,
    rememberedIds: typeof window !== "undefined" ? loadMyOrderIds() : [],
  });

  return (
    <div className="container mx-auto px-4 py-12 max-w-3xl">
      <div className="flex items-center gap-3 mb-2">
        <span className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-glow">
          <Package className="size-5" />
        </span>
        <h1 className="text-3xl sm:text-4xl font-bold">{t("my_orders")}</h1>
      </div>
      <p className="text-muted-foreground mb-8">{t("my_orders_sub")}</p>

      {myOrders.length === 0 ? (
        <div className="rounded-3xl border border-dashed border-border bg-subtle/30 px-6 py-16 text-center">
          <Package className="size-10 mx-auto text-muted-foreground/50 mb-4" />
          <p className="text-muted-foreground mb-4">{t("orders_empty")}</p>
          <Link to="/products" className="text-primary font-semibold hover:underline">
            {t("continue_shopping")}
          </Link>
        </div>
      ) : (
        <div className="space-y-10">
          {myOrders.map(order => (
            <OrderInvoice key={order.id} order={order} />
          ))}
        </div>
      )}
    </div>
  );
}

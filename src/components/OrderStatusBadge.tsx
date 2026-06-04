import type { OrderStatus } from "@/lib/orders";
import { useI18n } from "@/lib/i18n";

const styles: Record<OrderStatus, string> = {
  received: "bg-orange-100 text-orange-700",
  completed: "bg-green-100 text-green-700",
  cancelled: "bg-red-100 text-red-700",
};

export function OrderStatusBadge({ status }: { status: OrderStatus }) {
  const { t } = useI18n();
  return (
    <span
      className={`inline-flex text-[10px] uppercase tracking-wider font-semibold px-2.5 py-1 rounded-full ${styles[status]}`}
    >
      {t(`order_status_${status}` as never)}
    </span>
  );
}

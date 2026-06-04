export type OrderStatus = "received" | "completed" | "cancelled";

export const ORDER_STATUSES: OrderStatus[] = ["received", "completed", "cancelled"];

export function normalizeOrderStatus(status: string): OrderStatus {
  if (status === "completed" || status === "cancelled") return status;
  if (status === "approved") return "received";
  return "received";
}

export type PaymentMethod = "cash" | "visa";

export interface OrderItem {
  productId: string;
  name: string;
  brand?: string;
  quantity: number;
  unitPrice: number;
  lineTotal: number;
}

export interface Order {
  id: string;
  userId?: string;
  customerName: string;
  customerEmail?: string;
  phone: string;
  address: string;
  paymentMethod: PaymentMethod;
  items: OrderItem[];
  subtotal?: number;
  discount?: number;
  tax?: number;
  total: number;
  notes?: string;
  status: OrderStatus;
  createdAt: string;
  updatedAt: string;
}

export function computeOrderSubtotal(order: Pick<Order, "items">): number {
  return order.items.reduce((sum, item) => sum + item.lineTotal, 0);
}

export function getOrderTotals(order: Order) {
  const subtotal = order.subtotal ?? computeOrderSubtotal(order);
  const discount = order.discount ?? 0;
  const tax = order.tax ?? 0;
  const total = order.total;
  return { subtotal, discount, tax, total };
}

export function createOrder(
  data: Omit<Order, "id" | "status" | "createdAt" | "updatedAt">,
): Order {
  const now = new Date().toISOString();
  return {
    ...data,
    id: `ord-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    status: "received",
    createdAt: now,
    updatedAt: now,
  };
}

export function formatOrderNumber(id: string): string {
  const digits = id.replace(/\D/g, "");
  return `#${digits.slice(-5).padStart(5, "0")}`;
}

export function getOrdersForUser(orders: Order[], user: { id: string; email: string }): Order[] {
  const email = user.email.toLowerCase();
  return orders.filter(
    o => o.userId === user.id || (o.customerEmail && o.customerEmail.toLowerCase() === email),
  );
}

export function sortOrdersNewestFirst(orders: Order[]): Order[] {
  return [...orders].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
  );
}

export function getMyOrders(
  orders: Order[],
  ctx: { user?: { id: string; email: string }; rememberedIds?: string[] },
): Order[] {
  const remembered = new Set(ctx.rememberedIds ?? []);
  const matched = new Map<string, Order>();

  if (ctx.user) {
    for (const order of getOrdersForUser(orders, ctx.user)) {
      matched.set(order.id, order);
    }
  }

  for (const order of orders) {
    if (remembered.has(order.id)) {
      matched.set(order.id, order);
    }
  }

  return sortOrdersNewestFirst([...matched.values()]);
}

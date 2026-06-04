import type { Order, OrderStatus } from "./orders";
import { normalizeOrderStatus } from "./orders";

const STORAGE_KEY = "erad_orders_v1";
const MY_ORDERS_KEY = "erad_my_order_ids_v1";

export const ORDERS_UPDATE_EVENT = "erad-orders-update";

export function loadOrders(): Order[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const orders = JSON.parse(raw) as Order[];
    return orders.map(o => ({
      ...o,
      status: normalizeOrderStatus(o.status),
    }));
  } catch {
    return [];
  }
}

export function saveOrders(orders: Order[]) {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(orders));
  window.dispatchEvent(new Event(ORDERS_UPDATE_EVENT));
}

export function addOrder(order: Order) {
  saveOrders([order, ...loadOrders()]);
  rememberOrderId(order.id);
}

export function loadMyOrderIds(): string[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(MY_ORDERS_KEY);
    if (!raw) return [];
    return JSON.parse(raw) as string[];
  } catch {
    return [];
  }
}

export function rememberOrderId(orderId: string) {
  if (typeof window === "undefined") return;
  const ids = loadMyOrderIds();
  if (ids.includes(orderId)) return;
  localStorage.setItem(MY_ORDERS_KEY, JSON.stringify([orderId, ...ids]));
}

export function updateOrderStatus(orderId: string, status: OrderStatus): Order | null {
  const orders = loadOrders();
  const idx = orders.findIndex(o => o.id === orderId);
  if (idx === -1) return null;
  orders[idx] = { ...orders[idx], status, updatedAt: new Date().toISOString() };
  saveOrders(orders);
  return orders[idx];
}

export function getOrderById(orderId: string): Order | undefined {
  return loadOrders().find(o => o.id === orderId);
}

export function removeOrder(orderId: string) {
  saveOrders(loadOrders().filter(o => o.id !== orderId));
}

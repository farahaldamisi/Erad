import { useCallback, useEffect, useState } from "react";
import type { Order, OrderStatus } from "@/lib/orders";
import {
  addOrder as persistOrder,
  loadOrders,
  ORDERS_UPDATE_EVENT,
  removeOrder as persistRemoveOrder,
  saveOrders,
  updateOrderStatus as persistUpdateStatus,
} from "@/lib/order-store";

export function useOrdersState() {
  const [orders, setOrdersState] = useState<Order[]>([]);

  const refresh = useCallback(() => setOrdersState(loadOrders()), []);

  useEffect(() => {
    refresh();
    const handler = () => refresh();
    window.addEventListener(ORDERS_UPDATE_EVENT, handler);
    return () => window.removeEventListener(ORDERS_UPDATE_EVENT, handler);
  }, [refresh]);

  const setOrders = useCallback((next: Order[] | ((prev: Order[]) => Order[])) => {
    setOrdersState(prev => {
      const updated = typeof next === "function" ? next(prev) : next;
      saveOrders(updated);
      return updated;
    });
  }, []);

  const addOrder = useCallback((order: Order) => {
    persistOrder(order);
    refresh();
  }, [refresh]);

  const updateStatus = useCallback((orderId: string, status: OrderStatus) => {
    persistUpdateStatus(orderId, status);
    refresh();
  }, [refresh]);

  const removeOrder = useCallback((orderId: string) => {
    persistRemoveOrder(orderId);
    refresh();
  }, [refresh]);

  return { orders, setOrders, addOrder, updateStatus, removeOrder, refresh };
}

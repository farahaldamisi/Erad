import { createContext, useContext, type ReactNode } from "react";
import { useOrdersState } from "@/hooks/use-orders";
import type { Order, OrderStatus } from "@/lib/orders";

interface OrdersCtx {
  orders: Order[];
  addOrder: (order: Order) => void;
  updateStatus: (orderId: string, status: OrderStatus) => void;
  removeOrder: (orderId: string) => void;
  refresh: () => void;
}

const Ctx = createContext<OrdersCtx | null>(null);

export function OrdersProvider({ children }: { children: ReactNode }) {
  const { orders, addOrder, updateStatus, removeOrder, refresh } = useOrdersState();
  return (
    <Ctx.Provider value={{ orders, addOrder, updateStatus, removeOrder, refresh }}>
      {children}
    </Ctx.Provider>
  );
}

export function useOrdersCtx() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useOrdersCtx must be inside OrdersProvider");
  return ctx;
}

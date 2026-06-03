import { redirect } from "@tanstack/react-router";
import { getSessionUser } from "@/lib/auth-store";

export function requireAdmin() {
  if (typeof window === "undefined") return;
  const user = getSessionUser();
  if (!user) {
    throw redirect({ to: "/login", search: { redirect: "/admin" } });
  }
  if (user.role !== "admin") {
    throw redirect({ to: "/account" });
  }
}

export const mockOrders = [
  { id: "#10234", customer: "Ahmad Khaled", product: "ProBook Gaming X1", total: 1299, status: "Pending" },
  { id: "#10233", customer: "Sara M.", product: "OfficeJet Pro M404", total: 249, status: "Shipped" },
  { id: "#10232", customer: "Omar A.", product: "Mech RGB Keyboard", total: 149, status: "Delivered" },
  { id: "#10231", customer: "Layla H.", product: "TouchSlim 14 OLED", total: 999, status: "Pending" },
] as const;

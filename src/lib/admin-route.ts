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

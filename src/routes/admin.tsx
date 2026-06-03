import { createFileRoute } from "@tanstack/react-router";
import { requireAdmin } from "@/lib/admin-route";
import { AdminShell } from "@/components/admin/AdminShell";

export const Route = createFileRoute("/admin")({
  beforeLoad: requireAdmin,
  head: () => ({ meta: [{ title: "Dashboard — ERAD" }] }),
  component: AdminShell,
});

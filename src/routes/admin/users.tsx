import { createFileRoute } from "@tanstack/react-router";
import { listRegisteredCustomers } from "@/lib/auth-store";
import { formatDateTime, formatNumber } from "@/lib/format";
import { useI18n } from "@/lib/i18n";

export const Route = createFileRoute("/admin/users")({
  head: () => ({ meta: [{ title: "Users — ERAD Admin" }] }),
  component: AdminUsersPage,
});

function AdminUsersPage() {
  const { t, lang } = useI18n();
  const registeredCustomers = listRegisteredCustomers();

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold">{t("registered_users")}</h2>
        <p className="text-muted-foreground mt-1">{formatNumber(registeredCustomers.length)} {t("admin_items")}</p>
      </div>

      <div className="bg-card border border-border rounded-2xl shadow-card overflow-hidden">
        {registeredCustomers.length === 0 ? (
          <p className="px-5 py-10 text-center text-muted-foreground text-sm">{t("registered_users_empty")}</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-subtle">
                <tr>
                  <th className="text-start px-4 py-3 font-semibold text-xs uppercase tracking-wider">{t("full_name")}</th>
                  <th className="text-start px-4 py-3 font-semibold text-xs uppercase tracking-wider">{t("email")}</th>
                  <th className="text-start px-4 py-3 font-semibold text-xs uppercase tracking-wider">{t("phone")}</th>
                  <th className="text-start px-4 py-3 font-semibold text-xs uppercase tracking-wider">{t("registered_at")}</th>
                </tr>
              </thead>
              <tbody>
                {registeredCustomers.map(customer => (
                  <tr key={customer.id} className="border-t border-border hover:bg-accent/30">
                    <td className="px-4 py-3 font-semibold">{customer.name}</td>
                    <td className="px-4 py-3 text-muted-foreground">{customer.email}</td>
                    <td className="px-4 py-3 whitespace-nowrap">{customer.phone}</td>
                    <td className="px-4 py-3 whitespace-nowrap text-xs text-muted-foreground">
                      {formatDateTime(customer.createdAt, lang)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

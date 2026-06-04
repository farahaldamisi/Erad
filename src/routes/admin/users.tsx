import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Trash2 } from "lucide-react";
import { deleteUser, listRegisteredCustomers } from "@/lib/auth-store";
import { logActivity } from "@/lib/activity";
import { formatDateTime, formatNumber } from "@/lib/format";
import { useI18n } from "@/lib/i18n";
import { useAuth } from "@/lib/auth";

export const Route = createFileRoute("/admin/users")({
  head: () => ({ meta: [{ title: "Users — ERAD Admin" }] }),
  component: AdminUsersPage,
});

function AdminUsersPage() {
  const { t, lang } = useI18n();
  const { user: adminUser } = useAuth();
  const [refreshKey, setRefreshKey] = useState(0);
  const registeredCustomers = useMemo(() => listRegisteredCustomers(), [refreshKey]);

  const removeCustomer = (customerId: string, customerName: string, customerEmail: string) => {
    if (!window.confirm(t("delete_user_confirm").replace("{name}", customerName))) return;

    const result = deleteUser(customerId);
    if (!result.ok) {
      window.alert(result.code === "cannot_delete_admin" ? t("cannot_delete_admin") : t("auth_invalid"));
      return;
    }

    logActivity({
      type: "user_delete",
      userId: adminUser?.id,
      userName: adminUser?.name,
      userEmail: adminUser?.email,
      label: customerEmail,
      meta: { deletedUserId: customerId, deletedUserName: customerName },
    });

    setRefreshKey(key => key + 1);
  };

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
                  <th className="px-4 py-3" />
                </tr>
              </thead>
              <tbody>
                {registeredCustomers.map(customer => (
                  <tr key={customer.id} className="border-t border-border hover:bg-accent/30">
                    <td className="px-4 py-3 font-semibold">{customer.name}</td>
                    <td className="px-4 py-3 text-muted-foreground">{customer.email}</td>
                    <td className="px-4 py-3 whitespace-nowrap">{customer.phone || "—"}</td>
                    <td className="px-4 py-3 whitespace-nowrap text-xs text-muted-foreground">
                      {formatDateTime(customer.createdAt, lang)}
                    </td>
                    <td className="px-4 py-3">
                      <button
                        type="button"
                        onClick={() => removeCustomer(customer.id, customer.name, customer.email)}
                        className="size-8 rounded-lg hover:bg-destructive/10 text-destructive inline-flex items-center justify-center ms-auto"
                        aria-label={t("delete_user")}
                        title={t("delete_user")}
                      >
                        <Trash2 className="size-4" />
                      </button>
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

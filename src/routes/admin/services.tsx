import { createFileRoute } from "@tanstack/react-router";
import { Trash2 } from "lucide-react";
import { formatDateTime, formatNumber } from "@/lib/format";
import { useServiceRequestsCtx } from "@/lib/service-requests-context";
import type { ServiceRequestStatus } from "@/lib/services";
import { useI18n } from "@/lib/i18n";

export const Route = createFileRoute("/admin/services")({
  head: () => ({ meta: [{ title: "Services — ERAD Admin" }] }),
  component: AdminServicesPage,
});

function AdminServicesPage() {
  const { t, lang } = useI18n();
  const { requests: serviceRequests, setRequests: setServiceRequests } = useServiceRequestsCtx();

  const updateServiceStatus = (id: string, status: ServiceRequestStatus) => {
    setServiceRequests(list => list.map(r => (r.id === id ? { ...r, status } : r)));
  };
  const removeService = (id: string) => setServiceRequests(list => list.filter(r => r.id !== id));

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold">{t("service_requests")}</h2>
        <p className="text-muted-foreground mt-1">{formatNumber(serviceRequests.length)} {t("admin_items")}</p>
      </div>

      <div className="bg-card border border-border rounded-2xl shadow-card overflow-hidden">
        {serviceRequests.length === 0 ? (
          <p className="px-5 py-10 text-center text-muted-foreground text-sm">{t("service_requests_empty")}</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-subtle">
                <tr>
                  <th className="text-start px-4 py-3 font-semibold text-xs uppercase tracking-wider">{t("full_name")}</th>
                  <th className="text-start px-4 py-3 font-semibold text-xs uppercase tracking-wider">{t("service_type")}</th>
                  <th className="text-start px-4 py-3 font-semibold text-xs uppercase tracking-wider">{t("service_description")}</th>
                  <th className="text-start px-4 py-3 font-semibold text-xs uppercase tracking-wider">{t("phone")}</th>
                  <th className="text-start px-4 py-3 font-semibold text-xs uppercase tracking-wider">{t("status")}</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {serviceRequests.map(request => (
                  <tr key={request.id} className="border-t border-border align-top hover:bg-accent/30">
                    <td className="px-4 py-3">
                      <p className="font-semibold">{request.customerName}</p>
                      {request.email && <p className="text-xs text-muted-foreground">{request.email}</p>}
                      <p className="text-[10px] text-muted-foreground mt-1">
                        {formatDateTime(request.createdAt, lang)}
                      </p>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">{t(`service_${request.serviceType}` as never)}</td>
                    <td className="px-4 py-3 max-w-xs">
                      <p className="line-clamp-3">{request.description}</p>
                      {request.address && <p className="text-xs text-muted-foreground mt-1">{request.address}</p>}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">{request.phone}</td>
                    <td className="px-4 py-3">
                      <select
                        value={request.status}
                        onChange={e => updateServiceStatus(request.id, e.target.value as ServiceRequestStatus)}
                        className="h-9 rounded-lg border border-border bg-background px-2 text-xs font-semibold"
                      >
                        <option value="pending">{t("service_status_pending")}</option>
                        <option value="in_progress">{t("service_status_in_progress")}</option>
                        <option value="completed">{t("service_status_completed")}</option>
                        <option value="cancelled">{t("service_status_cancelled")}</option>
                      </select>
                    </td>
                    <td className="px-4 py-3">
                      <button
                        type="button"
                        onClick={() => removeService(request.id)}
                        className="size-8 rounded-lg hover:bg-destructive/10 text-destructive inline-flex items-center justify-center"
                        title={t("delete")}
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

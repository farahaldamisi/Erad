import { createFileRoute } from "@tanstack/react-router";
import { getActivityStats } from "@/lib/activity";
import { formatActivityEventLabel } from "@/components/admin/AdminLowStockBanner";
import { formatDateTime, formatNumber } from "@/lib/format";
import { useActivityLog } from "@/hooks/use-activity-log";
import { useI18n } from "@/lib/i18n";

export const Route = createFileRoute("/admin/activity")({
  head: () => ({ meta: [{ title: "Activity — ERAD Admin" }] }),
  component: AdminActivityPage,
});

function AdminActivityPage() {
  const { t, lang } = useI18n();
  const { activities } = useActivityLog();
  const activityStats = getActivityStats(activities);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold">{t("activity_log")}</h2>
        <p className="text-muted-foreground mt-1">{formatNumber(activityStats.total)} {t("total_activities")}</p>
      </div>

      <div className="flex flex-wrap gap-2">
        <span className="px-3 py-1.5 rounded-full bg-subtle text-xs font-semibold">
          {t("page_views")}: {formatNumber(activityStats.pageViews)}
        </span>
        <span className="px-3 py-1.5 rounded-full bg-subtle text-xs font-semibold">
          {t("total_visitors")}: {formatNumber(activityStats.uniqueVisitors)}
        </span>
        <span className="px-3 py-1.5 rounded-full bg-subtle text-xs font-semibold">
          {t("admin_new_accounts")}: {formatNumber(activityStats.registrations)}
        </span>
        <span className="px-3 py-1.5 rounded-full bg-subtle text-xs font-semibold">
          {t("admin_logins")}: {formatNumber(activityStats.logins)}
        </span>
      </div>

      <div className="bg-card border border-border rounded-2xl shadow-card overflow-hidden">
        {activities.length === 0 ? (
          <p className="px-5 py-10 text-center text-muted-foreground text-sm">{t("activity_empty")}</p>
        ) : (
          <div className="divide-y divide-border max-h-[70vh] overflow-y-auto">
            {activities.map(event => (
              <div key={event.id} className="px-5 py-4 hover:bg-accent/20">
                <div className="flex flex-wrap items-start justify-between gap-2 mb-1">
                  <span className="text-xs font-bold uppercase tracking-wider text-primary">
                    {t(`activity_${event.type}` as never)}
                  </span>
                  <span className="text-[10px] text-muted-foreground">
                    {formatDateTime(event.createdAt, lang)}
                  </span>
                </div>
                <p className="font-semibold text-sm">
                  {event.userName ?? t("guest_visitor")}
                  {event.userEmail ? ` · ${event.userEmail}` : ""}
                </p>
                {event.label && (
                  <p className="text-sm text-muted-foreground mt-0.5">
                    {formatActivityEventLabel(event, t) ?? event.label}
                  </p>
                )}
                {event.path && <p className="text-xs text-muted-foreground mt-0.5">{event.path}</p>}
                {event.meta && Object.keys(event.meta).length > 0 && (
                  <p className="text-xs text-muted-foreground mt-1">
                    {Object.entries(event.meta)
                      .map(([key, value]) => `${key}: ${value}`)
                      .join(" · ")}
                  </p>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

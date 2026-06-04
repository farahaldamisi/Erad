import { createFileRoute, Link } from "@tanstack/react-router";
import { AlertTriangle, Bell, PackageX } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { formatActivityEventLabel } from "@/components/admin/AdminLowStockBanner";
import {
  buildActiveAdminNotifications,
  getAdminNotificationCount,
  getAdminNotificationHistory,
  type AdminNotificationItem,
  type AdminNotificationKind,
} from "@/lib/admin-notifications";
import { resolveSectionLabel, type Section } from "@/lib/sections";
import { formatLowStockAlertLabel } from "@/lib/stock-alerts";
import { formatDateTime, formatNumber } from "@/lib/format";
import type { Lang } from "@/lib/i18n";
import { useActivityLog } from "@/hooks/use-activity-log";
import { useProducts } from "@/lib/products-context";
import { useI18n } from "@/lib/i18n";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/admin/notifications")({
  head: () => ({ meta: [{ title: "Notifications — ERAD Admin" }] }),
  component: AdminNotificationsPage,
});

const kindMeta: Record<
  AdminNotificationKind,
  { icon: LucideIcon; tone: string; labelKey: "admin_notif_low_stock" | "admin_notif_out_of_stock" }
> = {
  low_stock: { icon: AlertTriangle, tone: "text-amber-600 bg-amber-500/15", labelKey: "admin_notif_low_stock" },
  out_of_stock: { icon: PackageX, tone: "text-destructive bg-destructive/10", labelKey: "admin_notif_out_of_stock" },
};

function AdminNotificationsPage() {
  const { t, lang } = useI18n();
  const { products, sections } = useProducts();
  const { activities } = useActivityLog();

  const active = buildActiveAdminNotifications(products);
  const history = getAdminNotificationHistory(activities, products);
  const totalCount = getAdminNotificationCount(products);
  const productById = new Map(products.map(p => [p.id, p]));

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h2 className="text-3xl font-bold flex items-center gap-2">
            <Bell className="size-8 text-primary" />
            {t("admin_notifications")}
          </h2>
          <p className="text-muted-foreground mt-1">{t("admin_notifications_sub")}</p>
        </div>
        {totalCount > 0 && (
          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-amber-500/15 text-amber-700 text-sm font-bold">
            {formatNumber(totalCount)} {t("admin_notifications_active_count")}
          </span>
        )}
      </div>

      <section className="bg-card border border-border rounded-2xl shadow-card overflow-hidden">
        <div className="px-5 py-4 border-b border-border">
          <h3 className="font-bold">{t("admin_notifications_active")}</h3>
        </div>
        {active.length === 0 ? (
          <p className="px-5 py-12 text-center text-muted-foreground text-sm">{t("admin_notifications_empty")}</p>
        ) : (
          <div className="divide-y divide-border">
            {active.map(item => (
              <ActiveNotificationRow key={item.id} item={item} sections={sections} lang={lang} />
            ))}
          </div>
        )}
      </section>

      <section className="bg-card border border-border rounded-2xl shadow-card overflow-hidden">
        <div className="px-5 py-4 border-b border-border">
          <h3 className="font-bold">{t("admin_notifications_history")}</h3>
        </div>
        {history.length === 0 ? (
          <p className="px-5 py-12 text-center text-muted-foreground text-sm">{t("admin_notifications_history_empty")}</p>
        ) : (
          <div className="divide-y divide-border max-h-[480px] overflow-y-auto">
            {history.map(event => {
              const product = event.meta?.productId ? productById.get(event.meta.productId) : undefined;
              return (
                <div key={event.id} className="px-5 py-4 hover:bg-accent/20">
                  <div className="flex flex-wrap items-start justify-between gap-2 mb-1">
                    <span className="text-xs font-bold uppercase tracking-wider text-primary">
                      {t("activity_low_stock")}
                    </span>
                    <span className="text-[10px] text-muted-foreground">{formatDateTime(event.createdAt, lang)}</span>
                  </div>
                  <p className="text-sm font-semibold">
                    {formatActivityEventLabel(event, t) ?? event.label ?? t("guest_visitor")}
                  </p>
                  <StockNotificationMeta
                    sections={sections}
                    lang={lang}
                    brand={product?.brand ?? event.meta?.brand}
                    category={product?.category ?? event.meta?.category}
                    subcategory={product?.subcategory}
                    subcategoryAr={product?.subcategoryAr ?? event.meta?.subcategory}
                  />
                </div>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
}

function StockNotificationMeta({
  sections,
  lang,
  brand,
  category,
  subcategory,
  subcategoryAr,
}: {
  sections: Section[];
  lang: Lang;
  brand?: string;
  category?: string;
  subcategory?: string;
  subcategoryAr?: string;
}) {
  const { t } = useI18n();
  const typeLabel = lang === "ar" ? subcategoryAr ?? subcategory : subcategory ?? subcategoryAr;
  const sectionLabel = category ? resolveSectionLabel(sections, category, lang) : "";

  if (!brand && !typeLabel && !sectionLabel) return null;

  return (
    <dl className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted-foreground">
      {sectionLabel && (
        <div>
          <dt className="inline font-semibold text-foreground/70">{t("admin_notif_section")}: </dt>
          <dd className="inline">{sectionLabel}</dd>
        </div>
      )}
      {typeLabel && (
        <div>
          <dt className="inline font-semibold text-foreground/70">{t("admin_notif_type")}: </dt>
          <dd className="inline">{typeLabel}</dd>
        </div>
      )}
      {brand && (
        <div>
          <dt className="inline font-semibold text-foreground/70">{t("brand_label")}: </dt>
          <dd className="inline">{brand}</dd>
        </div>
      )}
    </dl>
  );
}

function ActiveNotificationRow({
  item,
  sections,
  lang,
}: {
  item: AdminNotificationItem;
  sections: Section[];
  lang: Lang;
}) {
  const { t } = useI18n();
  const meta = kindMeta[item.kind];
  const Icon = meta.icon;

  const message =
    item.kind === "low_stock" && item.subtitle
      ? formatLowStockAlertLabel(item.title, Number(item.subtitle), t)
      : t("admin_out_of_stock_alert").replace("{name}", item.title);

  return (
    <Link
      to={item.href ?? "/admin/products"}
      className="flex items-start gap-3 px-5 py-4 hover:bg-accent/30 transition"
    >
      <span className={cn("inline-flex size-10 shrink-0 items-center justify-center rounded-xl", meta.tone)}>
        <Icon className="size-5" />
      </span>
      <div className="min-w-0 flex-1">
        <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground mb-0.5">
          {t(meta.labelKey)}
        </p>
        <p className="text-sm font-semibold">{message}</p>
        {item.kind === "low_stock" && item.subtitle && (
          <p className="text-xs text-muted-foreground mt-0.5">
            {t("stock")}: {formatNumber(Number(item.subtitle))}
          </p>
        )}
        <StockNotificationMeta
          sections={sections}
          lang={lang}
          brand={item.brand}
          category={item.category}
          subcategory={item.subcategory}
          subcategoryAr={item.subcategoryAr}
        />
      </div>
    </Link>
  );
}

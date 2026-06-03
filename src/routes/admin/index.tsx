import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import {
  Activity,
  Eye,
  Package,
  ShoppingBag,
  TrendingUp,
  Users,
  Wrench,
} from "lucide-react";
import { listRegisteredCustomers } from "@/lib/auth-store";
import { getSiteAnalytics } from "@/lib/admin-analytics";
import { mockOrders } from "@/lib/admin-route";
import { resolveSectionLabel } from "@/lib/sections";
import { formatPrice } from "@/lib/currency";
import { formatDateTime, formatNumber } from "@/lib/format";
import { useActivityLog } from "@/hooks/use-activity-log";
import { useProducts } from "@/lib/products-context";
import { useServiceRequestsCtx } from "@/lib/service-requests-context";
import { useI18n } from "@/lib/i18n";

export const Route = createFileRoute("/admin/")({
  head: () => ({ meta: [{ title: "Overview — ERAD Admin" }] }),
  component: AdminOverviewPage,
});

function AdminOverviewPage() {
  const { t, lang } = useI18n();
  const { products, sections } = useProducts();
  const { requests: serviceRequests } = useServiceRequestsCtx();
  const { activities } = useActivityLog();
  const registeredCustomers = listRegisteredCustomers();
  const pendingMockOrders = mockOrders.filter(o => o.status === "Pending").length;

  const analytics = getSiteAnalytics(
    activities,
    products,
    serviceRequests,
    registeredCustomers.length,
    mockOrders.length,
    pendingMockOrders,
  );

  const statCards = [
    { icon: Eye, label: t("total_visitors"), value: analytics.visitors, color: "from-sky-500 to-blue-700" },
    { icon: Activity, label: t("page_views"), value: analytics.pageViews, color: "from-indigo-500 to-violet-700" },
    { icon: Users, label: t("registered_accounts"), value: analytics.registeredUsers, color: "from-emerald-500 to-teal-700" },
    { icon: Package, label: t("total_products"), value: analytics.totalProducts, color: "from-red-500 to-red-700" },
    { icon: TrendingUp, label: t("admin_product_views"), value: analytics.productViews, color: "from-orange-500 to-amber-700" },
    { icon: ShoppingBag, label: t("admin_orders_submitted"), value: analytics.ordersSubmitted, color: "from-pink-500 to-rose-700" },
    { icon: Wrench, label: t("pending_services"), value: analytics.pendingServices, color: "from-cyan-500 to-sky-700" },
    { icon: Activity, label: t("total_activities"), value: analytics.totalActivities, color: "from-violet-500 to-purple-700" },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold">{t("admin_overview")}</h2>
        <p className="text-muted-foreground mt-1">{t("admin_overview_sub")}</p>
      </div>

      <div className="grid sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {statCards.map((card, idx) => (
          <motion.div
            key={card.label}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.04 }}
            className={`relative overflow-hidden rounded-2xl p-5 text-white bg-gradient-to-br ${card.color} shadow-elegant`}
          >
            <card.icon className="absolute -right-2 -bottom-2 size-20 opacity-15" />
            <p className="text-xs uppercase tracking-wider opacity-90">{card.label}</p>
            <p className="text-3xl font-bold mt-2">{formatNumber(card.value)}</p>
          </motion.div>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <section className="bg-card border border-border rounded-2xl shadow-card overflow-hidden">
          <div className="px-5 py-4 border-b border-border">
            <h3 className="font-bold">{t("admin_store_summary")}</h3>
          </div>
          <div className="p-5 grid sm:grid-cols-2 gap-3 text-sm">
            <SummaryRow label={t("admin_in_stock")} value={analytics.inStockProducts} />
            <SummaryRow label={t("admin_out_of_stock")} value={analytics.outOfStockProducts} />
            <SummaryRow label={t("admin_low_stock")} value={analytics.lowStockProducts} />
            <SummaryRow label={t("admin_logins")} value={analytics.logins} />
            <SummaryRow label={t("admin_new_accounts")} value={analytics.registrations} />
            <SummaryRow label={t("admin_service_requests")} value={analytics.totalServiceRequests} />
            <SummaryRow label={t("admin_services_in_progress")} value={analytics.inProgressServices} />
            <SummaryRow label={t("admin_services_completed")} value={analytics.completedServices} />
          </div>
        </section>

        <section className="bg-card border border-border rounded-2xl shadow-card overflow-hidden">
          <div className="px-5 py-4 border-b border-border flex items-center justify-between">
            <h3 className="font-bold">{t("admin_by_category")}</h3>
            <Link to="/admin/products" className="text-xs font-semibold text-primary hover:underline">
              {t("nav_products")}
            </Link>
          </div>
          {analytics.productsByCategory.length === 0 ? (
            <p className="px-5 py-10 text-center text-muted-foreground text-sm">{t("admin_no_data")}</p>
          ) : (
            <div className="p-5 space-y-3">
              {analytics.productsByCategory.map(row => (
                <div key={row.category} className="flex items-center justify-between gap-3">
                  <span className="text-sm">{resolveSectionLabel(sections, row.category, lang)}</span>
                  <span className="text-sm font-bold">{formatNumber(row.count)}</span>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <section className="bg-card border border-border rounded-2xl shadow-card overflow-hidden">
          <div className="px-5 py-4 border-b border-border">
            <h3 className="font-bold">{t("admin_top_products")}</h3>
          </div>
          {analytics.topProducts.length === 0 ? (
            <p className="px-5 py-10 text-center text-muted-foreground text-sm">{t("admin_no_product_views")}</p>
          ) : (
            <div className="divide-y divide-border">
              {analytics.topProducts.map((product, idx) => (
                <div key={product.productId} className="px-5 py-3 flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3 min-w-0">
                    <span className="size-7 rounded-full bg-primary/10 text-primary text-xs font-bold inline-flex items-center justify-center shrink-0">
                      {formatNumber(idx + 1)}
                    </span>
                    <span className="font-medium text-sm truncate">{product.name}</span>
                  </div>
                  <span className="text-xs font-semibold text-muted-foreground whitespace-nowrap">
                    {formatNumber(product.views)} {t("admin_views")}
                  </span>
                </div>
              ))}
            </div>
          )}
        </section>

        <section className="bg-card border border-border rounded-2xl shadow-card overflow-hidden">
          <div className="px-5 py-4 border-b border-border flex items-center justify-between">
            <h3 className="font-bold">{t("admin_recent_activity")}</h3>
            <Link to="/admin/activity" className="text-xs font-semibold text-primary hover:underline">
              {t("activity_log")}
            </Link>
          </div>
          {analytics.recentActivities.length === 0 ? (
            <p className="px-5 py-10 text-center text-muted-foreground text-sm">{t("activity_empty")}</p>
          ) : (
            <div className="divide-y divide-border max-h-[320px] overflow-y-auto">
              {analytics.recentActivities.map(event => (
                <div key={event.id} className="px-5 py-3">
                  <div className="flex flex-wrap items-start justify-between gap-2 mb-1">
                    <span className="text-xs font-bold uppercase tracking-wider text-primary">
                      {t(`activity_${event.type}` as never)}
                    </span>
                    <span className="text-[10px] text-muted-foreground">
                      {formatDateTime(event.createdAt, lang)}
                    </span>
                  </div>
                  <p className="text-sm font-medium">{event.label ?? event.path ?? t("guest_visitor")}</p>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>

      <section className="bg-card border border-border rounded-2xl shadow-card overflow-hidden">
        <div className="px-5 py-4 border-b border-border flex items-center justify-between">
          <h3 className="font-bold">{t("recent_orders")}</h3>
          <Link to="/admin/orders" className="text-xs font-semibold text-primary hover:underline">
            {t("admin_view_all")}
          </Link>
        </div>
        <div className="divide-y divide-border">
          {mockOrders.slice(0, 4).map(order => (
            <div key={order.id} className="px-5 py-4 flex items-center justify-between gap-3">
              <div>
                <p className="font-semibold text-sm">{order.customer}</p>
                <p className="text-xs text-muted-foreground">{order.product}</p>
              </div>
              <div className="text-end">
                <p className="font-bold text-sm">{formatPrice(order.total, lang)}</p>
                <span className="text-[10px] uppercase tracking-wider font-semibold px-2 py-0.5 rounded-full bg-orange-100 text-orange-700">
                  {order.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

function SummaryRow({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-xl border border-border bg-subtle/50 px-4 py-3 flex items-center justify-between gap-3">
      <span className="text-muted-foreground">{label}</span>
      <span className="font-bold">{formatNumber(value)}</span>
    </div>
  );
}

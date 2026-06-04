import type { ActivityEvent } from "@/lib/activity";
import { getActivityStats } from "@/lib/activity";
import type { Order } from "@/lib/orders";
import type { Product } from "@/lib/products";
import type { ServiceRequest } from "@/lib/services";

export interface TopProductView {
  productId: string;
  name: string;
  views: number;
}

export interface CategoryCount {
  category: string;
  count: number;
}

export interface SiteAnalytics {
  visitors: number;
  pageViews: number;
  dailyVisits: number;
  registrations: number;
  logins: number;
  totalActivities: number;
  productViews: number;
  ordersSubmitted: number;
  totalSales: number;
  serviceRequestsLogged: number;
  totalProducts: number;
  inStockProducts: number;
  outOfStockProducts: number;
  lowStockProducts: number;
  registeredUsers: number;
  totalServiceRequests: number;
  pendingServices: number;
  inProgressServices: number;
  completedServices: number;
  totalOrders: number;
  pendingOrders: number;
  topProducts: TopProductView[];
  productsByCategory: CategoryCount[];
  recentActivities: ActivityEvent[];
}

export function getSiteAnalytics(
  activities: ActivityEvent[],
  products: Product[],
  serviceRequests: ServiceRequest[],
  orders: Order[],
  registeredUsersCount: number,
): SiteAnalytics {
  const base = getActivityStats(activities);
  const productViewEvents = activities.filter(a => a.type === "product_view");
  const viewCountByProduct = new Map<string, number>();

  for (const event of productViewEvents) {
    const id = event.meta?.productId;
    if (!id) continue;
    viewCountByProduct.set(id, (viewCountByProduct.get(id) ?? 0) + 1);
  }

  const productById = new Map(products.map(p => [p.id, p]));
  const topProducts = [...viewCountByProduct.entries()]
    .map(([productId, views]) => ({
      productId,
      name: productById.get(productId)?.name ?? productId,
      views,
    }))
    .sort((a, b) => b.views - a.views)
    .slice(0, 5);

  const categoryMap = new Map<string, number>();
  for (const product of products) {
    categoryMap.set(product.category, (categoryMap.get(product.category) ?? 0) + 1);
  }

  const todayStart = new Date();
  todayStart.setHours(0, 0, 0, 0);
  const dailyVisits = activities.filter(
    a => a.type === "page_view" && new Date(a.createdAt) >= todayStart,
  ).length;

  const totalSales = orders
    .filter(o => o.status !== "cancelled")
    .reduce((sum, o) => sum + o.total, 0);

  return {
    visitors: base.uniqueVisitors,
    pageViews: base.pageViews,
    dailyVisits,
    registrations: base.registrations,
    logins: base.logins,
    totalActivities: base.total,
    productViews: productViewEvents.length,
    ordersSubmitted: orders.length,
    totalSales,
    serviceRequestsLogged: activities.filter(a => a.type === "service_request").length,
    totalProducts: products.length,
    inStockProducts: products.filter(p => p.stock > 0).length,
    outOfStockProducts: products.filter(p => p.stock === 0).length,
    lowStockProducts: products.filter(p => p.stock > 0 && p.stock <= 5).length,
    registeredUsers: registeredUsersCount,
    totalServiceRequests: serviceRequests.length,
    pendingServices: serviceRequests.filter(r => r.status === "pending").length,
    inProgressServices: serviceRequests.filter(r => r.status === "in_progress").length,
    completedServices: serviceRequests.filter(r => r.status === "completed").length,
    totalOrders: orders.length,
    pendingOrders: orders.filter(o => o.status === "received").length,
    topProducts,
    productsByCategory: [...categoryMap.entries()].map(([category, count]) => ({ category, count })),
    recentActivities: activities.slice(0, 8),
  };
}

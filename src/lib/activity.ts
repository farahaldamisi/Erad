const STORAGE_KEY = "erad_activity_v1";
const VISITOR_KEY = "erad_visitor_id";
const MAX_EVENTS = 500;

export type ActivityType =
  | "page_view"
  | "register"
  | "login"
  | "logout"
  | "service_request"
  | "order_submit"
  | "product_view"
  | "address_add"
  | "user_delete"
  | "low_stock";

export interface ActivityEvent {
  id: string;
  type: ActivityType;
  visitorId: string;
  userId?: string;
  userName?: string;
  userEmail?: string;
  path?: string;
  label?: string;
  meta?: Record<string, string>;
  createdAt: string;
}

export const ACTIVITY_UPDATE_EVENT = "erad-activity-update";

export function getVisitorId(): string {
  if (typeof window === "undefined") return "server";
  let id = localStorage.getItem(VISITOR_KEY);
  if (!id) {
    id = `vis-${crypto.randomUUID()}`;
    localStorage.setItem(VISITOR_KEY, id);
  }
  return id;
}

export function loadActivities(): ActivityEvent[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as ActivityEvent[]) : [];
  } catch {
    return [];
  }
}

function saveActivities(events: ActivityEvent[]) {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(events.slice(0, MAX_EVENTS)));
}

export function logActivity(
  event: Omit<ActivityEvent, "id" | "createdAt" | "visitorId"> & { visitorId?: string },
) {
  if (typeof window === "undefined") return;
  const entry: ActivityEvent = {
    ...event,
    id: `act-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    visitorId: event.visitorId ?? getVisitorId(),
    createdAt: new Date().toISOString(),
  };
  saveActivities([entry, ...loadActivities()]);
  window.dispatchEvent(new Event(ACTIVITY_UPDATE_EVENT));
}

export function getActivityStats(activities: ActivityEvent[]) {
  const pageViews = activities.filter(a => a.type === "page_view").length;
  const uniqueVisitors = new Set(activities.map(a => a.visitorId)).size;
  const registrations = activities.filter(a => a.type === "register").length;
  const logins = activities.filter(a => a.type === "login").length;
  return { pageViews, uniqueVisitors, registrations, logins, total: activities.length };
}

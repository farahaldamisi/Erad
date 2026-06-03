import { useRouterState } from "@tanstack/react-router";
import { useEffect, useRef } from "react";
import { logActivity } from "@/lib/activity";
import { useAuth } from "@/lib/auth";

export function ActivityTracker() {
  const pathname = useRouterState({ select: s => s.location.pathname });
  const { user } = useAuth();
  const lastPath = useRef("");

  useEffect(() => {
    if (pathname === lastPath.current) return;
    lastPath.current = pathname;
    logActivity({
      type: "page_view",
      path: pathname,
      label: pathname,
      userId: user?.id,
      userName: user?.name,
      userEmail: user?.email,
    });
  }, [pathname, user?.id, user?.name, user?.email]);

  return null;
}

import { useCallback, useEffect, useState } from "react";
import { ACTIVITY_UPDATE_EVENT, loadActivities, type ActivityEvent } from "@/lib/activity";

export function useActivityLog() {
  const [activities, setActivities] = useState<ActivityEvent[]>([]);

  const refresh = useCallback(() => setActivities(loadActivities()), []);

  useEffect(() => {
    refresh();
    const handler = () => refresh();
    window.addEventListener(ACTIVITY_UPDATE_EVENT, handler);
    return () => window.removeEventListener(ACTIVITY_UPDATE_EVENT, handler);
  }, [refresh]);

  return { activities, refresh };
}

import { useCallback, useEffect, useState } from "react";
import type { ServiceRequest } from "@/lib/services";
import { loadServiceRequests, saveServiceRequests } from "@/lib/service-request-store";

export function useServiceRequests() {
  const [requests, setRequestsState] = useState<ServiceRequest[]>([]);

  useEffect(() => {
    setRequestsState(loadServiceRequests());
  }, []);

  const setRequests = useCallback((next: ServiceRequest[] | ((prev: ServiceRequest[]) => ServiceRequest[])) => {
    setRequestsState(prev => {
      const updated = typeof next === "function" ? next(prev) : next;
      saveServiceRequests(updated);
      return updated;
    });
  }, []);

  return { requests, setRequests };
}

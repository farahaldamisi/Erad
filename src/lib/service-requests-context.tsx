import { createContext, useContext, type ReactNode } from "react";
import { useServiceRequests } from "@/hooks/use-service-requests";
import type { ServiceRequest } from "@/lib/services";

interface ServiceRequestsCtx {
  requests: ServiceRequest[];
  setRequests: (next: ServiceRequest[] | ((prev: ServiceRequest[]) => ServiceRequest[])) => void;
}

const Ctx = createContext<ServiceRequestsCtx | null>(null);

export function ServiceRequestsProvider({ children }: { children: ReactNode }) {
  const { requests, setRequests } = useServiceRequests();
  return <Ctx.Provider value={{ requests, setRequests }}>{children}</Ctx.Provider>;
}

export function useServiceRequestsCtx() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useServiceRequestsCtx must be inside ServiceRequestsProvider");
  return ctx;
}

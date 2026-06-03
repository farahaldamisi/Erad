import type { ServiceRequest } from "./services";

const STORAGE_KEY = "erad_service_requests_v1";

export function loadServiceRequests(): ServiceRequest[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    return JSON.parse(raw) as ServiceRequest[];
  } catch {
    return [];
  }
}

export function saveServiceRequests(requests: ServiceRequest[]) {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(requests));
}

export function addServiceRequest(request: ServiceRequest) {
  const list = loadServiceRequests();
  saveServiceRequests([request, ...list]);
}

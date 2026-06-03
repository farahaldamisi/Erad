export type ServiceType =
  | "maintenance"
  | "networking"
  | "upgrades"
  | "cabling"
  | "wifi"
  | "support";

export type ServiceRequestStatus = "pending" | "in_progress" | "completed" | "cancelled";

export interface ServiceRequest {
  id: string;
  serviceType: ServiceType;
  customerName: string;
  phone: string;
  email?: string;
  description: string;
  address?: string;
  userId?: string;
  status: ServiceRequestStatus;
  createdAt: string;
}

export const SERVICE_TYPES: ServiceType[] = [
  "maintenance",
  "networking",
  "upgrades",
  "cabling",
  "wifi",
  "support",
];

export function createServiceRequest(
  data: Omit<ServiceRequest, "id" | "status" | "createdAt">,
): ServiceRequest {
  return {
    ...data,
    id: `svc-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    status: "pending",
    createdAt: new Date().toISOString(),
  };
}

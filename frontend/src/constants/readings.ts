import type { Status } from "@/components/Station";

export const statusLabels: Record<Status, string> = {
  good: "Good",
  caution: "Caution",
  unhealthy: "Unhealthy",
  missing: "No data",
};

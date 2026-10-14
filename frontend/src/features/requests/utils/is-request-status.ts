import { REQUEST_STATUSES, type RequestStatus } from "@/features/requests/types";

export function isRequestStatus(value: string | null): value is RequestStatus {
  return REQUEST_STATUSES.some((status) => status === value);
}

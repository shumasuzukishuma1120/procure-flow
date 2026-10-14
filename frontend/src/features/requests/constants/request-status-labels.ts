import type { RequestStatus } from "@/features/requests/types";

export const REQUEST_STATUS_LABELS = {
  DRAFT: "下書き",
  SUBMITTED: "申請中",
  CANCELED: "取消済み",
  REJECTED: "却下",
  APPROVED: "承認済み",
  ORDERED: "発注済み",
  COMPLETED: "完了",
  REAPPLICATION_REQUIRED: "再申請必要",
} satisfies Record<RequestStatus, string>;

export function getRequestStatusLabel(status:RequestStatus){
  return REQUEST_STATUS_LABELS[status];
}

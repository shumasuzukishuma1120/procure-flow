import { Badge } from "@/components/ui/badge";
import { REQUEST_STATUS_LABELS } from "@/features/requests/constants/request-status-labels";
import type { RequestStatus } from "@/features/requests/types";

const REQUEST_STATUS_CLASS_NAMES = {
  DRAFT:
    "bg-slate-100 text-slate-700 dark:bg-slate-700 dark:text-slate-300 font-bold w-18 justify-center",
  SUBMITTED:
    "bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300 font-bold w-18 justify-center",
  CANCELED:
    "bg-gray-100 text-gray-700 outline dark:bg-gray-800 dark:text-gray-300 font-bold w-18 justify-center",
  REJECTED:
    "bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300 font-bold w-18 justify-center",
  APPROVED:
    "bg-green-100 text-green-700 dark:bg-green-950 dark:text-green-300 font-bold w-18 justify-center",
  ORDERED:
    "bg-violet-200 text-violet-700 dark:bg-violet-900 dark:text-violet-300 font-bold w-18 justify-center",
  COMPLETED:
    "bg-teal-100 text-teal-700 dark:bg-teal-900 dark:text-teal-300 font-bold w-18 justify-center",
  REAPPLICATION_REQUIRED:
    "bg-orange-100 text-orange-700 dark:bg-orange-900 dark:text-orange-300 font-bold w-18 justify-center",
} satisfies Record<RequestStatus, string>;

export default function RequestStatusBadge({ status }: { status: RequestStatus }) {
  const className = REQUEST_STATUS_CLASS_NAMES[status];
  const label = REQUEST_STATUS_LABELS[status];
  return <Badge className={className}>{label}</Badge>;
}

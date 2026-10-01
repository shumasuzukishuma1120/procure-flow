import { Badge } from "@/components/ui/badge";
import type { RequestStatus } from "@/features/requests/types";

type StatusConfig = {
  label: string;
  className: string;
};

const REQUEST_STATUS_CONFIG = {
  DRAFT: {
    label: "下書き",
    className: "bg-slate-100 text-slate-700 dark:bg-slate-700 dark:text-slate-300 font-bold w-18 justify-center",
  },
  SUBMITTED: {
    label: "申請中",
    className: "bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300 font-bold w-18 justify-center",
  },
  CANCELED: {
    label: "取消済み",
    className: "bg-gray-100 text-gray-700 outline dark:bg-gray-800 dark:text-gray-300 font-bold w-18 justify-center",
  },
  REJECTED: {
    label: "却下",
    className: "bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300 font-bold w-18 justify-center",
  },
  APPROVED: {
    label: "承認済み",
    className: "bg-green-100 text-green-700 dark:bg-green-950 dark:text-green-300 font-bold w-18 justify-center",
  },
  ORDERED: {
    label: "発注済み",
    className: "bg-violet-200 text-violet-700 dark:bg-violet-900 dark:text-violet-300 font-bold w-18 justify-center",
  },
  COMPLETED: {
    label: "完了",
    className: "bg-teal-100 text-teal-700 dark:bg-teal-900 dark:text-teal-300 font-bold w-18 justify-center",
  },
  REAPPLICATION_REQUIRED: {
    label: "再申請必要",
    className: "bg-orange-100 text-orange-700 dark:bg-orange-900 dark:text-orange-300 font-bold w-18 justify-center",
  },
} satisfies Record<RequestStatus, StatusConfig>;

export default function RequestStatusBadge({ status }: { status: RequestStatus }) {
  const config = REQUEST_STATUS_CONFIG[status];
  return <Badge className={config.className}>{config.label}</Badge>;
}

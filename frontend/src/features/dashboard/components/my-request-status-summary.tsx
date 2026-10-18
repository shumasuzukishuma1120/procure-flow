import type { DashboardStatusCount } from "@/features/dashboard/types";
import { getRequestStatusLabel } from "@/features/requests/constants/request-status-labels";
import type { RequestStatus } from "@/features/requests/types";
import { cn } from "cn";
import {
  BadgeCheck,
  Ban,
  CircleCheck,
  CircleX,
  FilePenLine,
  type LucideIcon,
  PackageCheck,
  RotateCcw,
  Send,
} from "lucide-react";
import Link from "next/link";

type MyRequestStatusSummaryProps = {
  statusCounts: DashboardStatusCount[];
};

const REQUEST_STATUS_ICONS = {
  DRAFT: FilePenLine,
  SUBMITTED: Send,
  CANCELED: Ban,
  APPROVED: CircleCheck,
  REJECTED: CircleX,
  ORDERED: PackageCheck,
  COMPLETED: BadgeCheck,
  REAPPLICATION_REQUIRED: RotateCcw,
} satisfies Record<RequestStatus, LucideIcon>;

const REQUEST_STATUS_STYLES = {
  DRAFT: {
    tile: "border-slate-200 bg-slate-50/70 dark:border-slate-800 dark:bg-slate-950/30",
    icon: "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300",
  },
  SUBMITTED: {
    tile: "border-blue-200 bg-blue-50/70 dark:border-blue-900 dark:bg-blue-950/30",
    icon: "bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300",
  },
  CANCELED: {
    tile: "border-gray-200 bg-gray-50/70 dark:border-gray-800 dark:bg-gray-950/30",
    icon: "bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-300",
  },
  APPROVED: {
    tile: "border-green-200 bg-green-50/70 dark:border-green-900 dark:bg-green-950/30",
    icon: "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300",
  },
  REJECTED: {
    tile: "border-red-200 bg-red-50/70 dark:border-red-900 dark:bg-red-950/30",
    icon: "bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300",
  },
  ORDERED: {
    tile: "border-violet-200 bg-violet-50/70 dark:border-violet-900 dark:bg-violet-950/30",
    icon: "bg-violet-100 text-violet-700 dark:bg-violet-900 dark:text-violet-300",
  },
  COMPLETED: {
    tile: "border-teal-200 bg-teal-50/70 dark:border-teal-900 dark:bg-teal-950/30",
    icon: "bg-teal-100 text-teal-700 dark:bg-teal-900 dark:text-teal-300",
  },
  REAPPLICATION_REQUIRED: {
    tile: "border-orange-200 bg-orange-50/70 dark:border-orange-900 dark:bg-orange-950/30",
    icon: "bg-orange-100 text-orange-700 dark:bg-orange-900 dark:text-orange-300",
  },
} satisfies Record<RequestStatus, { tile: string; icon: string }>;

export default function MyRequestStatusSummary({ statusCounts }: MyRequestStatusSummaryProps) {
  if (statusCounts.length === 0) {
    return <p className="text-muted-foreground text-sm">申請はまだありません。</p>;
  }

  return (
    <dl className="grid grid-cols-2 gap-3 md:grid-cols-4">
      {statusCounts.map((statusCount) => {
        const StatusIcon = REQUEST_STATUS_ICONS[statusCount.status];
        const statusStyles = REQUEST_STATUS_STYLES[statusCount.status];
        const statusLabel = getRequestStatusLabel(statusCount.status);

        return (
          <div
            key={statusCount.status}
            className={cn(
              "relative flex items-center gap-3 overflow-hidden rounded-lg border p-4",
              statusStyles.tile,
            )}
          >
            <Link
              href={`/requests?status=${statusCount.status}`}
              aria-label={`${statusLabel}の申請一覧を表示`}
              className="absolute inset-0 z-0 rounded-lg transition-colors hover:bg-foreground/[0.03] focus-visible:bg-foreground/[0.03] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-ring"
            />
            <span
              className={cn(
                "pointer-events-none relative z-10 flex size-9 shrink-0 items-center justify-center rounded-md",
                statusStyles.icon,
              )}
            >
              <StatusIcon className="size-5" aria-hidden="true" />
            </span>
            <div className="pointer-events-none relative z-10 min-w-0">
              <dt className="truncate text-sm text-muted-foreground">
                {statusLabel}
              </dt>
              <dd className="mt-1 text-2xl font-semibold tabular-nums">
                {statusCount.count}
                <span className="ml-1 text-sm font-normal text-muted-foreground">件</span>
              </dd>
            </div>
          </div>
        );
      })}
    </dl>
  );
}

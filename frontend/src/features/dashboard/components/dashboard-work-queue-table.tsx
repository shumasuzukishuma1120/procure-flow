import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { DashboardRequestSummary } from "@/features/dashboard/types";
import RequestStatusBadge from "@/features/requests/components/request-status-badge";
import Link from "next/link";

type DashboardWorkQueueTableProps = {
  requests: DashboardRequestSummary[];
  caption: string;
  emptyMessage: string;
  detailBasePath: "/approvals" | "/purchases";
};

const yenFormatter = new Intl.NumberFormat("ja-JP", {
  style: "currency",
  currency: "JPY",
  maximumFractionDigits: 0,
});

function formatDateOnly(value: string) {
  const [year, month, day] = value.split("-");
  return `${year}/${month}/${day}`;
}

export default function DashboardWorkQueueTable({
  requests,
  caption,
  emptyMessage,
  detailBasePath,
}: DashboardWorkQueueTableProps) {
  if (requests.length === 0) {
    return <p className="text-sm text-muted-foreground">{emptyMessage}</p>;
  }

  return (
    <Table className="table-fixed">
      <TableCaption className="sr-only">{caption}</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead>申請</TableHead>
          <TableHead className="hidden w-36 md:table-cell">申請者</TableHead>
          <TableHead className="w-24">ステータス</TableHead>
          <TableHead className="hidden w-28 text-right lg:table-cell">合計金額</TableHead>
          <TableHead className="hidden w-32 xl:table-cell">希望納期</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {requests.map((request) => (
          <TableRow key={request.requestId} className="relative cursor-pointer hover:bg-muted/50">
            <TableCell className="max-w-0">
              <Link
                href={`${detailBasePath}/${encodeURIComponent(request.requestId)}`}
                className="absolute inset-0 z-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-ring"
              >
                <span className="sr-only">
                  {request.requestNumber ?? "未採番"} {request.title}の詳細を表示
                </span>
              </Link>
              <span className="block truncate font-medium">{request.title}</span>
              <span className="block truncate text-xs text-muted-foreground">
                {request.requestNumber ?? "未採番"}
              </span>
            </TableCell>
            <TableCell className="hidden max-w-0 md:table-cell">
              <span className="block truncate">{request.applicantName}</span>
              <span className="block truncate text-xs text-muted-foreground">
                {request.departmentName}
              </span>
            </TableCell>
            <TableCell>
              <RequestStatusBadge status={request.status} />
            </TableCell>
            <TableCell className="hidden text-right tabular-nums lg:table-cell">
              {yenFormatter.format(request.totalAmount)}
            </TableCell>
            <TableCell className="hidden tabular-nums xl:table-cell">
              {formatDateOnly(request.desiredDeliveryDate)}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}

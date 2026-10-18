import type { DashboardRequestSummary } from "@/features/dashboard/types";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import RequestStatusBadge from "@/features/requests/components/request-status-badge";
import Link from "next/link";

type MyRecentRequestsTableProps = {
  requests: DashboardRequestSummary[];
};

const yenFormatter = new Intl.NumberFormat("ja-JP", {
  style: "currency",
  currency: "JPY",
  maximumFractionDigits: 0,
});

const dateTimeFormatter = new Intl.DateTimeFormat("ja-JP", {
  timeZone: "Asia/Tokyo",
  year: "numeric",
  month: "2-digit",
  day: "2-digit",
  hour: "2-digit",
  minute: "2-digit",
  hour12: false,
});

export default function MyRecentRequestsTable({ requests }: MyRecentRequestsTableProps) {
  if (requests.length === 0) {
    return (
      <p className="text-sm text-muted-foreground">最近更新された申請はありません。</p>
    );
  }

  return (
    <Table className="table-fixed">
      <TableCaption className="sr-only">最近の申請一覧</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead className="hidden w-40 lg:table-cell">申請番号</TableHead>
          <TableHead>タイトル</TableHead>
          <TableHead className="w-24">ステータス</TableHead>
          <TableHead className="hidden w-28 md:table-cell">合計金額</TableHead>
          <TableHead className="hidden w-40 xl:table-cell">最終更新日時</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {requests.map((request) => (
          <TableRow key={request.requestId} className="relative cursor-pointer hover:bg-muted/50">
            <TableCell className="hidden lg:table-cell">
              <span className="font-medium">{request.requestNumber ?? "未採番"}</span>
            </TableCell>
            <TableCell className="max-w-0">
              <Link
                className="absolute inset-0 z-0"
                href={`/requests/${encodeURIComponent(request.requestId)}`}
              >
                <span className="sr-only">
                  {request.requestNumber ?? "未採番"} {request.title}
                  の詳細ページを表示
                </span>
              </Link>
              <span className="block truncate">{request.title}</span>
            </TableCell>
            <TableCell>
              <RequestStatusBadge status={request.status} />
            </TableCell>
            <TableCell className="hidden text-right md:table-cell">
              {yenFormatter.format(request.totalAmount)}
            </TableCell>
            <TableCell className="hidden xl:table-cell">
              {dateTimeFormatter.format(new Date(request.updatedAt))}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}

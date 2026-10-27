import { type PurchaseListItemResponse } from "@/features/purchases/types";
import Link from "next/link";
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
import { Badge } from "@/components/ui/badge";

type PurchaseListTableProps = {
  items: PurchaseListItemResponse[];
};

const yenFormatter = new Intl.NumberFormat("ja-JP", {
  style: "currency",
  currency: "JPY",
  maximumFractionDigits: 0,
});
const dateTimeFormatter = new Intl.DateTimeFormat("ja-JP", {
  timeZone: "Asia/Tokyo",
  dateStyle: "short",
  timeStyle: "short",
});
function formatDateOnly(value: string) {
  const [year, month, day] = value.split("-");
  return `${year}/${month}/${day}`;
}

export default function PurchaseListTable({ items }: PurchaseListTableProps) {
  if (items.length === 0) {
    return (
      <p className="py-12 text-center text-sm text-muted-foreground">
        条件に一致する購買対象の申請はありません
      </p>
    );
  }

  return (
    <div className="overflow-x-auto">
          <Table>
            <TableCaption className="sr-only">購買対象の申請一覧</TableCaption>
            <TableHeader>
              <TableRow>
                <TableHead>申請</TableHead>
                <TableHead>申請者</TableHead>
                <TableHead>仕入先</TableHead>
                <TableHead>ステータス</TableHead>
                <TableHead className="text-right">合計金額</TableHead>
                <TableHead>承認日時</TableHead>
                <TableHead>希望納期</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {items.map((item) => (
                <TableRow
                  key={item.requestId}
                  className="relative cursor-pointer hover:bg-muted/50"
                >
                  <TableCell>
                    <Link
                      className="absolute inset-0"
                      href={`/purchases/${encodeURIComponent(item.requestId)}`}
                    >
                      <span className="sr-only">
                        {item.requestNumber} {item.title}の購買詳細を表示
                      </span>
                    </Link>
                    <div className="font-medium">{item.title}</div>
                    <div className="text-xs text-muted-foreground">{item.requestNumber}</div>
                  </TableCell>
                  <TableCell>
                    <div>{item.applicantName}</div>
                    <div className="text-xs text-muted-foreground">{item.departmentName}</div>
                  </TableCell>
                  <TableCell>{item.supplierName}</TableCell>
                  <TableCell>
                    <RequestStatusBadge status={item.status} />
                  </TableCell>
                  <TableCell className="text-right tabular-nums">
                    {yenFormatter.format(item.totalAmount)}
                  </TableCell>
                  <TableCell>{dateTimeFormatter.format(new Date(item.approvedAt))}</TableCell>
                  <TableCell>
                    <div className={item.overdue ? "font-medium text-destructive" : undefined}>
                      {formatDateOnly(item.desiredDeliveryDate)}
                    </div>
                    {item.overdue && (
                      <Badge variant="destructive" className="mt-1">
                        期限超過
                      </Badge>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
    </div>
  );
}

import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import type { ApprovalListItemResponse } from "@/features/approvals/types";

const yenFormatter = new Intl.NumberFormat("ja-JP", { style: "currency", currency: "JPY", maximumFractionDigits: 0 });
const dateTimeFormatter = new Intl.DateTimeFormat("ja-JP", { timeZone: "Asia/Tokyo", dateStyle: "short", timeStyle: "short" });

function formatDateOnly(value: string) {
  const [year, month, day] = value.split("-");
  return `${year}/${month}/${day}`;
}

export default function ApprovalListTable({ items }: { items: ApprovalListItemResponse[] }) {
  if (items.length === 0) {
    return <p className="py-12 text-center text-sm text-muted-foreground">条件に一致する承認待ちの申請はありません</p>;
  }

  return (
    <div className="overflow-x-auto">
      <Table>
        <TableCaption className="sr-only">承認待ちの申請一覧</TableCaption>
        <TableHeader><TableRow>
          <TableHead>申請</TableHead>
          <TableHead>申請者</TableHead>
          <TableHead>希望仕入先</TableHead>
          <TableHead className="text-right">合計金額</TableHead>
          <TableHead>提出日時</TableHead>
          <TableHead>希望納期</TableHead>
        </TableRow></TableHeader>
        <TableBody>
          {items.map((item) => (
            <TableRow key={item.requestId} className="relative cursor-pointer hover:bg-muted/50">
              <TableCell>
                <Link className="absolute inset-0" href={`/approvals/${encodeURIComponent(item.requestId)}`}>
                  <span className="sr-only">{item.requestNumber} {item.title}の承認詳細を表示</span>
                </Link>
                <div className="font-medium">{item.title}</div>
                <div className="text-xs text-muted-foreground">{item.requestNumber}</div>
              </TableCell>
              <TableCell>
                <div>{item.applicantName}</div>
                <div className="text-xs text-muted-foreground">{item.departmentName}</div>
              </TableCell>
              <TableCell>{item.requestedSupplierName}</TableCell>
              <TableCell className="text-right tabular-nums">{yenFormatter.format(item.totalAmount)}</TableCell>
              <TableCell>{dateTimeFormatter.format(new Date(item.submittedAt))}</TableCell>
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

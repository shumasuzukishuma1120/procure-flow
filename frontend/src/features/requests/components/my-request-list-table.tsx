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
import type { MyRequestListItemResponse } from "@/features/requests/types";

const yenFormatter = new Intl.NumberFormat("ja-JP", {
  style:"currency",
  currency:"JPY",
  maximumFractionDigits:0
})

const dateTimeFormatter = new Intl.DateTimeFormat("ja-JP",{
  timeZone:"Asia/Tokyo",
  year:"numeric",
  month:"2-digit",
  day:"2-digit",
  hour:"2-digit",
  minute:"2-digit",
  hour12:false
})

export default function MyRequestListTable({ items }: { items: MyRequestListItemResponse[] }) {
  return (
    <div className="p-4">
      {items.length === 0 ? (
        "条件に一致する申請はありません"
      ) : (
        <Table>
          <TableCaption className="sr-only">自分の申請一覧</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead>申請番号</TableHead>
              <TableHead>タイトル</TableHead>
              <TableHead>ステータス</TableHead>
              <TableHead>明細概要</TableHead>
              <TableHead>希望仕入先</TableHead>
              <TableHead>合計金額</TableHead>
              <TableHead>最終更新日時</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {items.map((item) => (
              <TableRow key={item.requestId}>
                <TableCell>{item.requestNumber ?? "未採番"}</TableCell>
                <TableCell>{item.title ?? "タイトル未入力"}</TableCell>
                <TableCell>
                  <RequestStatusBadge status={item.status} />
                </TableCell>
                <TableCell>
                  {!item.firstItemName ? (
                    "明細未入力"
                  ) : item.additionalItemCount === 0 ? (
                    <span>{item.firstItemName}</span>
                  ) : (
                    <>
                      <span>{item.firstItemName}</span>{" "}
                      <span className="text-xs text-muted-foreground">他{item.additionalItemCount}点</span>
                    </>
                  )}
                </TableCell>
                <TableCell>{item.requestedSupplierName ?? "未選択"}</TableCell>
                <TableCell>{yenFormatter.format(item.totalAmount)}</TableCell>
                <TableCell>{dateTimeFormatter.format(new Date(item.updatedAt))}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </div>
  );
}

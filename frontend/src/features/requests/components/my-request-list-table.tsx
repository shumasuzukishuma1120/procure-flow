import { Button } from "@/components/ui/button";
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
import { Pencil } from "lucide-react";
import Link from "next/link";
import DeleteDraftRequestDialog from "@/features/requests/components/delete-draft-request-dialog";
import CancelSubmittedRequestDialog from "@/features/requests/components/cancel-submitted-request-dialog";

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

export default function MyRequestListTable({ items }: { items: MyRequestListItemResponse[] }) {
  return (
    <>
      {items.length === 0 ? (
        "条件に一致する申請はありません"
      ) : (
        <>
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
                <TableHead className="sr-only">操作</TableHead>
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
                      className="absolute inset-0 z-0"
                      href={`/requests/${encodeURIComponent(item.requestId)}`}
                    >
                      <span className="sr-only">
                        {item.requestNumber ?? "未採番"} {item.title ?? "タイトル未入力"}
                        の詳細ページを表示
                      </span>
                    </Link>
                    <span className="font-medium ">{item.requestNumber ?? "未採番"}</span>
                  </TableCell>
                  <TableCell>
                    <span>{item.title ?? "タイトル未入力"}</span>
                  </TableCell>
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
                        <span className="text-xs text-muted-foreground">
                          他{item.additionalItemCount}点
                        </span>
                      </>
                    )}
                  </TableCell>
                  <TableCell>{item.requestedSupplierName ?? "未選択"}</TableCell>
                  <TableCell>{yenFormatter.format(item.totalAmount)}</TableCell>
                  <TableCell>{dateTimeFormatter.format(new Date(item.updatedAt))}</TableCell>
                  <TableCell className="relative z-10">
                    <div className="flex items-center justify-end gap-2">
                      {item.status === "DRAFT" && (
                        <>
                          <Button
                            variant="outline"
                            size="default"
                            nativeButton={false}
                            render={<Link href={`/requests/${item.requestId}/edit`} />}
                          >
                            <Pencil aria-hidden="true" />
                            編集
                          </Button>
                          <DeleteDraftRequestDialog
                            requestId={item.requestId}
                            requestTitle={item.title}
                            version={item.version}
                          />
                        </>
                      )}
                      {item.status === "SUBMITTED" && (
                        <CancelSubmittedRequestDialog
                          requestId={item.requestId}
                          requestTitle={item.title}
                          version={item.version}
                        />
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </>
      )}
    </>
  );
}

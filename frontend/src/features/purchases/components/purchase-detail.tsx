import { ExternalLink } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import PurchaseActions from "@/features/purchases/components/purchase-actions";
import type { PurchaseDetailResponse } from "@/features/purchases/types";
import RequestStatusBadge from "@/features/requests/components/request-status-badge";
import type { SupplierOption } from "@/features/suppliers/types";

const yenFormatter = new Intl.NumberFormat("ja-JP", { style: "currency", currency: "JPY", maximumFractionDigits: 0 });
const dateTimeFormatter = new Intl.DateTimeFormat("ja-JP", { timeZone: "Asia/Tokyo", dateStyle: "medium", timeStyle: "short" });

function formatDateOnly(value: string | null) {
  if (!value) return "なし";
  const [year, month, day] = value.split("-");
  return `${year}年${Number(month)}月${Number(day)}日`;
}

function formatDateTime(value: string | null) {
  return value ? dateTimeFormatter.format(new Date(value)) : "なし";
}

function safeUrl(value: string | null) {
  if (!value) return null;
  try {
    const url = new URL(value);
    return ["http:", "https:"].includes(url.protocol) ? url.toString() : null;
  } catch {
    return null;
  }
}

export default function PurchaseDetail({
  request,
  supplierOptions,
}: {
  request: PurchaseDetailResponse;
  supplierOptions: SupplierOption[];
}) {
  return (
    <div className="space-y-5 pb-8">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3"><h2 className="text-xl font-bold">購買処理詳細</h2><RequestStatusBadge status={request.status} /></div>
        <PurchaseActions request={request} supplierOptions={supplierOptions} />
      </div>

      <Card>
        <CardHeader><CardTitle>{request.title}</CardTitle></CardHeader>
        <CardContent><dl className="grid gap-x-8 gap-y-4 sm:grid-cols-2 lg:grid-cols-3">
          <div><dt className="text-xs text-muted-foreground">申請番号</dt><dd className="mt-1 font-medium">{request.requestNumber}</dd></div>
          <div><dt className="text-xs text-muted-foreground">申請者</dt><dd className="mt-1 font-medium">{request.applicantName}</dd></div>
          <div><dt className="text-xs text-muted-foreground">所属部署</dt><dd className="mt-1 font-medium">{request.departmentName}</dd></div>
          <div><dt className="text-xs text-muted-foreground">希望仕入先</dt><dd className="mt-1 font-medium">{request.requestedSupplierName}</dd></div>
          <div><dt className="text-xs text-muted-foreground">希望納期</dt><dd className="mt-1 font-medium">{formatDateOnly(request.desiredDeliveryDate)}</dd></div>
          <div><dt className="text-xs text-muted-foreground">承認日時</dt><dd className="mt-1 font-medium">{formatDateTime(request.approvedAt)}</dd></div>
          <div className="sm:col-span-2 lg:col-span-3"><dt className="text-xs text-muted-foreground">申請理由</dt><dd className="mt-1 whitespace-pre-wrap">{request.reason}</dd></div>
          <div className="sm:col-span-2 lg:col-span-3"><dt className="text-xs text-muted-foreground">備考</dt><dd className="mt-1 whitespace-pre-wrap">{request.note ?? "なし"}</dd></div>
        </dl></CardContent>
      </Card>

      {request.purchaseOrderId && (
        <Card>
          <CardHeader><CardTitle>発注情報</CardTitle></CardHeader>
          <CardContent><dl className="grid gap-x-8 gap-y-4 sm:grid-cols-2 lg:grid-cols-3">
            <div><dt className="text-xs text-muted-foreground">発注番号</dt><dd className="mt-1 font-medium">{request.purchaseOrderNumber}</dd></div>
            <div><dt className="text-xs text-muted-foreground">実際の仕入先</dt><dd className="mt-1 font-medium">{request.actualSupplierName}</dd></div>
            <div><dt className="text-xs text-muted-foreground">納品予定日</dt><dd className="mt-1 font-medium">{formatDateOnly(request.promisedDeliveryDate)}</dd></div>
            <div><dt className="text-xs text-muted-foreground">発注担当者</dt><dd className="mt-1">{request.orderedByName ?? "なし"}</dd></div>
            <div><dt className="text-xs text-muted-foreground">発注日時</dt><dd className="mt-1">{formatDateTime(request.orderedAt)}</dd></div>
            <div><dt className="text-xs text-muted-foreground">実発注額</dt><dd className="mt-1 font-bold">{request.actualTotalAmount === null ? "なし" : yenFormatter.format(request.actualTotalAmount)}</dd></div>
            <div className="sm:col-span-2 lg:col-span-3"><dt className="text-xs text-muted-foreground">購買担当者メモ</dt><dd className="mt-1 whitespace-pre-wrap">{request.purchaserNote ?? "なし"}</dd></div>
          </dl></CardContent>
        </Card>
      )}

      {request.completedAt && (
        <Card>
          <CardHeader><CardTitle>受領情報</CardTitle></CardHeader>
          <CardContent><dl className="grid gap-x-8 gap-y-4 sm:grid-cols-3">
            <div><dt className="text-xs text-muted-foreground">受領日</dt><dd className="mt-1 font-medium">{formatDateOnly(request.receivedDate)}</dd></div>
            <div><dt className="text-xs text-muted-foreground">受領担当者</dt><dd className="mt-1 font-medium">{request.receivedByName}</dd></div>
            <div><dt className="text-xs text-muted-foreground">登録日時</dt><dd className="mt-1 font-medium">{formatDateTime(request.completedAt)}</dd></div>
            <div className="sm:col-span-3"><dt className="text-xs text-muted-foreground">受領メモ</dt><dd className="mt-1 whitespace-pre-wrap">{request.receiptNote ?? "なし"}</dd></div>
          </dl></CardContent>
        </Card>
      )}

      <section aria-labelledby="purchase-items-title" className="space-y-3">
        <div className="flex items-baseline justify-between gap-3"><h3 id="purchase-items-title" className="text-lg font-bold">申請明細</h3><p className="font-bold">承認額 {yenFormatter.format(request.approvedTotalAmount)}</p></div>
        <div className="grid grid-cols-[repeat(auto-fit,minmax(min(100%,25rem),1fr))] gap-4">
          {request.items.map((item) => {
            const productUrl = safeUrl(item.productUrl);
            return (
              <Card key={item.requestItemId}>
                <CardHeader><CardTitle>明細 {item.lineNumber}</CardTitle></CardHeader>
                <CardContent><dl className="grid gap-3 sm:grid-cols-2">
                  <div className="sm:col-span-2"><dt className="text-xs text-muted-foreground">商品名</dt><dd className="mt-1 font-medium">{item.productName}</dd></div>
                  <div><dt className="text-xs text-muted-foreground">型番</dt><dd className="mt-1">{item.modelNumber ?? "なし"}</dd></div>
                  <div><dt className="text-xs text-muted-foreground">カテゴリ</dt><dd className="mt-1">{item.categoryName}</dd></div>
                  <div><dt className="text-xs text-muted-foreground">数量</dt><dd className="mt-1">{item.quantity}</dd></div>
                  <div><dt className="text-xs text-muted-foreground">予定単価</dt><dd className="mt-1">{yenFormatter.format(item.plannedUnitPrice)}</dd></div>
                  <div><dt className="text-xs text-muted-foreground">実単価</dt><dd className="mt-1">{item.actualUnitPrice === null ? "未登録" : yenFormatter.format(item.actualUnitPrice)}</dd></div>
                  <div><dt className="text-xs text-muted-foreground">金額</dt><dd className="mt-1 font-medium">{yenFormatter.format(item.actualAmount ?? item.plannedAmount)}</dd></div>
                  <div><dt className="text-xs text-muted-foreground">商品URL</dt><dd className="mt-1">{productUrl ? <a className="inline-flex items-center gap-1 text-primary hover:underline" href={productUrl} target="_blank" rel="noreferrer">商品ページ<ExternalLink aria-hidden="true" className="size-3" /></a> : item.productUrl ? "無効なURL" : "なし"}</dd></div>
                </dl></CardContent>
              </Card>
            );
          })}
        </div>
      </section>
    </div>
  );
}

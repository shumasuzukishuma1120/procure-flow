import { ExternalLink } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import ApprovalActions from "@/features/approvals/components/approval-actions";
import type { ApprovalDetailResponse } from "@/features/approvals/types";
import RequestStatusBadge from "@/features/requests/components/request-status-badge";

const yenFormatter = new Intl.NumberFormat("ja-JP", { style: "currency", currency: "JPY", maximumFractionDigits: 0 });
const dateTimeFormatter = new Intl.DateTimeFormat("ja-JP", { timeZone: "Asia/Tokyo", dateStyle: "medium", timeStyle: "short" });

function formatDateOnly(value: string) {
  const [year, month, day] = value.split("-");
  return `${year}年${Number(month)}月${Number(day)}日`;
}

function safeUrl(value: string | null) {
  if (!value) return null;
  try { const url = new URL(value); return ["http:", "https:"].includes(url.protocol) ? url.toString() : null; }
  catch { return null; }
}

export default function ApprovalDetail({ request }: { request: ApprovalDetailResponse }) {
  return (
    <div className="space-y-5 pb-8">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <h2 className="text-xl font-bold">承認申請詳細</h2>
          <RequestStatusBadge status={request.status} />
        </div>
        <ApprovalActions request={request} />
      </div>

      <Card>
        <CardHeader><CardTitle>{request.title}</CardTitle></CardHeader>
        <CardContent>
          <dl className="grid gap-x-8 gap-y-4 sm:grid-cols-2 lg:grid-cols-3">
            <div><dt className="text-xs text-muted-foreground">申請番号</dt><dd className="mt-1 font-medium">{request.requestNumber}</dd></div>
            <div><dt className="text-xs text-muted-foreground">申請者</dt><dd className="mt-1 font-medium">{request.applicantName}</dd></div>
            <div><dt className="text-xs text-muted-foreground">所属部署</dt><dd className="mt-1 font-medium">{request.departmentName}</dd></div>
            <div><dt className="text-xs text-muted-foreground">希望納期</dt><dd className="mt-1 font-medium">{formatDateOnly(request.desiredDeliveryDate)}</dd></div>
            <div><dt className="text-xs text-muted-foreground">希望仕入先</dt><dd className="mt-1 font-medium">{request.requestedSupplierName}</dd></div>
            <div><dt className="text-xs text-muted-foreground">提出日時</dt><dd className="mt-1 font-medium">{dateTimeFormatter.format(new Date(request.submittedAt))}</dd></div>
            <div className="sm:col-span-2 lg:col-span-3"><dt className="text-xs text-muted-foreground">申請理由</dt><dd className="mt-1 whitespace-pre-wrap">{request.reason}</dd></div>
            <div className="sm:col-span-2 lg:col-span-3"><dt className="text-xs text-muted-foreground">備考</dt><dd className="mt-1 whitespace-pre-wrap">{request.note ?? "なし"}</dd></div>
          </dl>
        </CardContent>
      </Card>

      {request.decision && (
        <Card>
          <CardHeader><CardTitle>承認結果</CardTitle></CardHeader>
          <CardContent>
            <dl className="grid gap-4 sm:grid-cols-3">
              <div><dt className="text-xs text-muted-foreground">結果</dt><dd className="mt-1"><RequestStatusBadge status={request.decision.decision} /></dd></div>
              <div><dt className="text-xs text-muted-foreground">対応者</dt><dd className="mt-1 font-medium">{request.decision.decidedByName}</dd></div>
              <div><dt className="text-xs text-muted-foreground">対応日時</dt><dd className="mt-1 font-medium">{dateTimeFormatter.format(new Date(request.decision.decidedAt))}</dd></div>
              {request.decision.reason && <div className="sm:col-span-3"><dt className="text-xs text-muted-foreground">却下理由</dt><dd className="mt-1 whitespace-pre-wrap">{request.decision.reason}</dd></div>}
            </dl>
          </CardContent>
        </Card>
      )}

      <section aria-labelledby="approval-items-title" className="space-y-3">
        <div className="flex items-baseline justify-between gap-3">
          <h3 id="approval-items-title" className="text-lg font-bold">申請明細</h3>
          <p className="font-bold">合計 {yenFormatter.format(request.totalAmount)}</p>
        </div>
        <div className="grid grid-cols-[repeat(auto-fit,minmax(min(100%,25rem),1fr))] gap-4">
          {request.items.map((item) => {
            const productUrl = safeUrl(item.productUrl);
            return (
              <Card key={item.lineNumber}>
                <CardHeader><CardTitle>明細 {item.lineNumber}</CardTitle></CardHeader>
                <CardContent><dl className="grid gap-3 sm:grid-cols-2">
                  <div className="sm:col-span-2"><dt className="text-xs text-muted-foreground">商品名</dt><dd className="mt-1 font-medium">{item.productName}</dd></div>
                  <div><dt className="text-xs text-muted-foreground">型番</dt><dd className="mt-1">{item.modelNumber ?? "なし"}</dd></div>
                  <div><dt className="text-xs text-muted-foreground">カテゴリ</dt><dd className="mt-1">{item.categoryName}</dd></div>
                  <div><dt className="text-xs text-muted-foreground">数量</dt><dd className="mt-1">{item.quantity}</dd></div>
                  <div><dt className="text-xs text-muted-foreground">予定単価</dt><dd className="mt-1">{yenFormatter.format(item.plannedUnitPrice)}</dd></div>
                  <div><dt className="text-xs text-muted-foreground">金額</dt><dd className="mt-1 font-medium">{yenFormatter.format(item.amount)}</dd></div>
                  <div><dt className="text-xs text-muted-foreground">商品URL</dt><dd className="mt-1">{productUrl ? <a className="inline-flex items-center gap-1 text-primary hover:underline" href={productUrl} target="_blank" rel="noreferrer">商品ページ<ExternalLink aria-hidden="true" className="size-3" /></a> : item.productUrl ? "無効なURL" : "なし"}</dd></div>
                </dl></CardContent>
              </Card>
            );
          })}
        </div>
      </section>

      <p className="text-right text-xs text-muted-foreground">
        作成: {dateTimeFormatter.format(new Date(request.createdAt))} / 最終更新: {dateTimeFormatter.format(new Date(request.updatedAt))}
      </p>
    </div>
  );
}

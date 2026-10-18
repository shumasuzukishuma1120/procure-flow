import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import RequestStatusBadge from "@/features/requests/components/request-status-badge";
import type { RequestDetailResponse } from "@/features/requests/types";
import type { CategoryOption } from "@/features/categories/types";
import type { SupplierOption } from "@/features/suppliers/types";
import RequestDetailActions from "@/features/requests/components/request-detail-actions";
import { ExternalLink } from "lucide-react";

const yenFormatter = new Intl.NumberFormat("ja-JP", {
  style: "currency",
  currency: "JPY",
  maximumFractionDigits: 0,
});

const dateTimeFormatter = new Intl.DateTimeFormat("ja-JP", {
  timeZone: "Asia/Tokyo",
  dateStyle: "medium",
  timeStyle: "short",
});

function formatDateOnly(value: string | null): string {
  if (value === null) return "未選択";
  const [year, month, day] = value.split("-");
  return `${year}年${Number(month)}月${Number(day)}日`;
}

function toSafeHttpUrl(value: string | null): string | null {
  if (value === null) return null;
  try {
    const url = new URL(value);
    return url.protocol === "http:" || url.protocol === "https:" ? url.toString() : null;
  } catch {
    return null;
  }
}

type RequestDetailProps = {
  request: RequestDetailResponse;
  supplierOptions: SupplierOption[];
  categoryOptions: CategoryOption[];
};

export default function RequestDetail({
  request,
  supplierOptions,
  categoryOptions,
}: RequestDetailProps) {
  const supplierName =
    supplierOptions.find((supplier) => supplier.id === request.requestedSupplierId)?.name ??
    "未選択";
  const categoryNames = new Map(categoryOptions.map((category) => [category.id, category.name]));

  return (
    <div className="space-y-5 pb-8">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <h2 className="text-xl font-bold">申請詳細</h2>
          <RequestStatusBadge status={request.status} />
        </div>
        <RequestDetailActions request={request} />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>{request.title ?? "タイトル未入力"}</CardTitle>
        </CardHeader>
        <CardContent>
          <dl className="grid gap-x-8 gap-y-4 sm:grid-cols-2 lg:grid-cols-3">
            <div>
              <dt className="text-xs text-muted-foreground">申請番号</dt>
              <dd className="mt-1 font-medium">{request.requestNumber ?? "未採番"}</dd>
            </div>
            <div>
              <dt className="text-xs text-muted-foreground">希望納期</dt>
              <dd className="mt-1 font-medium">{formatDateOnly(request.desiredDeliveryDate)}</dd>
            </div>
            <div>
              <dt className="text-xs text-muted-foreground">希望仕入先</dt>
              <dd className="mt-1 font-medium">{supplierName}</dd>
            </div>
            <div className="sm:col-span-2 lg:col-span-3">
              <dt className="text-xs text-muted-foreground">申請理由</dt>
              <dd className="mt-1 whitespace-pre-wrap">{request.reason ?? "未入力"}</dd>
            </div>
            <div className="sm:col-span-2 lg:col-span-3">
              <dt className="text-xs text-muted-foreground">備考</dt>
              <dd className="mt-1 whitespace-pre-wrap">{request.note ?? "なし"}</dd>
            </div>
          </dl>
        </CardContent>
      </Card>

      <section aria-labelledby="request-items-title" className="space-y-3">
        <div className="flex items-baseline justify-between gap-3">
          <h3 id="request-items-title" className="text-lg font-bold">
            申請明細
          </h3>
          <p className="font-bold">合計 {yenFormatter.format(request.totalAmount)}</p>
        </div>

        {request.items.length === 0 ? (
          <Card>
            <CardContent className="text-muted-foreground">
              明細はまだ入力されていません。
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-[repeat(auto-fit,minmax(min(100%,25rem),1fr))] gap-4">
            {request.items.map((item, index) => {
              const productUrl = toSafeHttpUrl(item.productUrl);
              const amount =
                item.quantity !== null && item.plannedUnitPrice !== null
                  ? item.quantity * item.plannedUnitPrice
                  : null;

              return (
                <Card key={`${index}-${item.productName ?? "item"}`}>
                  <CardHeader>
                    <CardTitle>明細 {index + 1}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <dl className="grid gap-3 sm:grid-cols-2">
                      <div className="sm:col-span-2">
                        <dt className="text-xs text-muted-foreground">商品名</dt>
                        <dd className="mt-1 font-medium">{item.productName ?? "未入力"}</dd>
                      </div>
                      <div>
                        <dt className="text-xs text-muted-foreground">型番</dt>
                        <dd className="mt-1">{item.modelNumber ?? "なし"}</dd>
                      </div>
                      <div>
                        <dt className="text-xs text-muted-foreground">カテゴリ</dt>
                        <dd className="mt-1">
                          {item.categoryId === null
                            ? "未選択"
                            : (categoryNames.get(item.categoryId) ?? "不明なカテゴリ")}
                        </dd>
                      </div>
                      <div>
                        <dt className="text-xs text-muted-foreground">数量</dt>
                        <dd className="mt-1">{item.quantity ?? "未入力"}</dd>
                      </div>
                      <div>
                        <dt className="text-xs text-muted-foreground">予定単価</dt>
                        <dd className="mt-1">
                          {item.plannedUnitPrice === null
                            ? "未入力"
                            : yenFormatter.format(item.plannedUnitPrice)}
                        </dd>
                      </div>
                      <div>
                        <dt className="text-xs text-muted-foreground">金額</dt>
                        <dd className="mt-1 font-medium">
                          {amount === null ? "-" : yenFormatter.format(amount)}
                        </dd>
                      </div>
                      <div>
                        <dt className="text-xs text-muted-foreground">商品URL</dt>
                        <dd className="mt-1">
                          {productUrl === null ? (
                            item.productUrl === null ? (
                              "なし"
                            ) : (
                              "無効なURL"
                            )
                          ) : (
                            <a
                              className="inline-flex items-center gap-1 text-primary underline-offset-4 hover:underline"
                              href={productUrl}
                              target="_blank"
                              rel="noreferrer"
                            >
                              商品ページ
                              <ExternalLink aria-hidden="true" className="size-3" />
                            </a>
                          )}
                        </dd>
                      </div>
                    </dl>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </section>

      <p className="text-right text-xs text-muted-foreground">
        作成: {dateTimeFormatter.format(new Date(request.createdAt))} / 最終更新:{" "}
        {dateTimeFormatter.format(new Date(request.updatedAt))}
      </p>
    </div>
  );
}

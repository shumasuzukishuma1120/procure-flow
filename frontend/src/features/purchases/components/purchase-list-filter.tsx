import { useCallback, useEffect, useState } from "react";
import { Search } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { InputGroup, InputGroupAddon, InputGroupInput } from "@/components/ui/input-group";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import PurchaseApprovedDateRangeFilter from "@/features/purchases/components/purchase-approved-date-range-filter";
import type {
  PurchaseDepartmentResponse,
  PurchaseListStatus,
  PurchaseSort,
} from "@/features/purchases/types";
import type { SupplierOption } from "@/features/suppliers/types";

const ALL = "ALL";
const FILTER_KEYS = [
  "keyword",
  "status",
  "departmentId",
  "supplierId",
  "approvedFrom",
  "approvedTo",
] as const;
const STATUS_OPTIONS: Array<{ value: PurchaseListStatus | typeof ALL; label: string }> = [
  { value: ALL, label: "ステータス: すべて" },
  { value: "APPROVED", label: "承認済み" },
  { value: "ORDERED", label: "発注済み" },
  { value: "COMPLETED", label: "完了" },
];
const SORT_OPTIONS: Array<{ value: PurchaseSort; label: string }> = [
  { value: "DELIVERY_DATE_ASC", label: "希望納期が近い順" },
  { value: "APPROVED_AT_ASC", label: "承認日時が古い順" },
  { value: "APPROVED_AT_DESC", label: "承認日時が新しい順" },
  { value: "AMOUNT_DESC", label: "金額が高い順" },
];

type PurchaseListFilterProps = {
  keyword?: string;
  status?: PurchaseListStatus;
  departmentId?: string;
  supplierId?: string;
  sort: PurchaseSort;
  supplierOptions: SupplierOption[];
  departments: PurchaseDepartmentResponse[];
};

export default function PurchaseListFilter({
  keyword,
  status,
  departmentId,
  supplierId,
  sort,
  supplierOptions,
  departments,
}: PurchaseListFilterProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [keywordInput, setKeywordInput] = useState(keyword ?? "");
  const hasActiveFilters = FILTER_KEYS.some((key) => searchParams.has(key));
  const suppliers = [
    { value: ALL, label: "仕入先: すべて" },
    ...supplierOptions.map((supplier) => ({ value: supplier.id, label: supplier.name })),
  ];
  const departmentOptions = [
    { value: ALL, label: "部署: すべて" },
    ...departments.map((department) => ({ value: department.id, label: department.name })),
  ];

  const replaceParam = useCallback((key: string, value?: string) => {
    const next = new URLSearchParams(searchParams.toString());
    if (value) next.set(key, value);
    else next.delete(key);
    next.set("page", "0");
    router.replace(`/purchases?${next.toString()}`);
  }, [router, searchParams]);

  useEffect(() => {
    const normalized = keywordInput.trim();
    if (normalized === (keyword ?? "")) return;
    const timer = setTimeout(() => replaceParam("keyword", normalized || undefined), 500);
    return () => clearTimeout(timer);
  }, [keywordInput, keyword, replaceParam]);

  function handleClear() {
    setKeywordInput("");
    const next = new URLSearchParams(searchParams.toString());
    FILTER_KEYS.forEach((key) => next.delete(key));
    next.set("page", "0");
    router.replace(`/purchases?${next.toString()}`);
  }

  return (
    <div className="flex w-full flex-col gap-3 md:flex-row md:flex-wrap md:items-center">
      <div className="w-full flex-1 md:min-w-72">
        <Label htmlFor="purchase-keyword-filter" className="sr-only">キーワード検索</Label>
        <InputGroup>
          <InputGroupAddon><Search aria-hidden="true" className="size-4 text-muted-foreground" /></InputGroupAddon>
          <InputGroupInput
            id="purchase-keyword-filter"
            type="search"
            placeholder="申請番号・タイトル・申請者・商品名で検索"
            value={keywordInput}
            onChange={(event) => setKeywordInput(event.target.value)}
          />
        </InputGroup>
      </div>
      <PurchaseApprovedDateRangeFilter />
      <Select items={STATUS_OPTIONS} value={status ?? ALL} onValueChange={(value) => replaceParam("status", value === ALL ? undefined : value ?? undefined)}>
        <SelectTrigger className="w-full md:w-44" aria-label="ステータスで絞り込み"><SelectValue placeholder="ステータス" /></SelectTrigger>
        <SelectContent><SelectGroup>
          {STATUS_OPTIONS.map((option) => <SelectItem key={option.value} value={option.value}>{option.label}</SelectItem>)}
        </SelectGroup></SelectContent>
      </Select>
      <Select items={departmentOptions} value={departmentId ?? ALL} onValueChange={(value) => replaceParam("departmentId", value === ALL ? undefined : value ?? undefined)}>
        <SelectTrigger className="w-full md:w-48" aria-label="部署で絞り込み"><SelectValue placeholder="部署" /></SelectTrigger>
        <SelectContent><SelectGroup>
          {departmentOptions.map((option) => <SelectItem key={option.value} value={option.value}>{option.label}</SelectItem>)}
        </SelectGroup></SelectContent>
      </Select>
      <Select items={suppliers} value={supplierId ?? ALL} onValueChange={(value) => replaceParam("supplierId", value === ALL ? undefined : value ?? undefined)}>
        <SelectTrigger className="w-full md:w-64" aria-label="仕入先で絞り込み"><SelectValue placeholder="仕入先" /></SelectTrigger>
        <SelectContent><SelectGroup>
          {suppliers.map((option) => <SelectItem key={option.value} value={option.value}>{option.label}</SelectItem>)}
        </SelectGroup></SelectContent>
      </Select>
      <Select items={SORT_OPTIONS} value={sort} onValueChange={(value) => value && replaceParam("sort", value)}>
        <SelectTrigger className="w-full md:w-48" aria-label="並び順"><SelectValue placeholder="並び順" /></SelectTrigger>
        <SelectContent><SelectGroup>
          {SORT_OPTIONS.map((option) => <SelectItem key={option.value} value={option.value}>{option.label}</SelectItem>)}
        </SelectGroup></SelectContent>
      </Select>
      <Button type="button" variant="outline" disabled={!hasActiveFilters} onClick={handleClear}>条件をクリア</Button>
    </div>
  );
}

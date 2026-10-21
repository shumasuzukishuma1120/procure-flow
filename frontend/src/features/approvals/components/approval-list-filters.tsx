import { useCallback, useEffect, useState } from "react";
import { Search } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { InputGroup, InputGroupAddon, InputGroupInput } from "@/components/ui/input-group";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import ApprovalSubmittedDateRangeFilter from "@/features/approvals/components/approval-submitted-date-range-filter";
import type { ApprovalSort, ApproverDepartmentResponse } from "@/features/approvals/types";

const ALL_DEPARTMENTS = "ALL";
const ALL_DEADLINES = "ALL";
const OVERDUE_ONLY = "OVERDUE";
const FILTER_KEYS = ["keyword", "submittedFrom", "submittedTo", "departmentId", "overdueOnly"] as const;
const SORT_OPTIONS: { value: ApprovalSort; label: string }[] = [
  { value: "OLDEST", label: "提出日時が古い順" },
  { value: "NEWEST", label: "提出日時が新しい順" },
  { value: "DELIVERY_DATE_ASC", label: "希望納期が近い順" },
  { value: "AMOUNT_DESC", label: "金額が高い順" },
];

type ApprovalListFiltersProps = {
  keyword?: string;
  departmentId?: string;
  overdueOnly: boolean;
  sort: ApprovalSort;
  departments: ApproverDepartmentResponse[];
};

export default function ApprovalListFilters({ keyword, departmentId, overdueOnly, sort, departments }: ApprovalListFiltersProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [keywordInput, setKeywordInput] = useState(keyword ?? "");
  const hasActiveFilters = FILTER_KEYS.some((key) => searchParams.has(key));
  const departmentOptions = [
    { value: ALL_DEPARTMENTS, label: "所属部署: すべて" },
    ...departments.map((department) => ({
      value: department.id,
      label: department.name,
    })),
  ];

  const replaceParam = useCallback((key: string, value?: string) => {
    const next = new URLSearchParams(searchParams.toString());
    if (value) next.set(key, value);
    else next.delete(key);
    next.set("page", "0");
    router.replace(`/approvals?${next.toString()}`);
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
    router.replace(`/approvals?${next.toString()}`);
  }

  return (
    <div className="flex w-full flex-col gap-3 md:flex-row md:flex-wrap md:items-center">
      <div className="w-full flex-1 md:min-w-72">
        <Label htmlFor="approval-keyword-filter" className="sr-only">キーワード検索</Label>
        <InputGroup>
          <InputGroupAddon><Search aria-hidden="true" className="size-4 text-muted-foreground" /></InputGroupAddon>
          <InputGroupInput
            id="approval-keyword-filter"
            type="search"
            placeholder="申請番号・タイトル・申請者で検索"
            value={keywordInput}
            onChange={(event) => setKeywordInput(event.target.value)}
          />
        </InputGroup>
      </div>
      <ApprovalSubmittedDateRangeFilter />
      <Select
        items={[
          { value: ALL_DEADLINES, label: "期限: すべて" },
          { value: OVERDUE_ONLY, label: "期限: 期限超過" },
        ]}
        value={overdueOnly ? OVERDUE_ONLY : ALL_DEADLINES}
        onValueChange={(value) => replaceParam(
          "overdueOnly",
          value === OVERDUE_ONLY ? "true" : undefined,
        )}
      >
        <SelectTrigger className="w-full md:w-40" aria-label="期限で絞り込み">
          <SelectValue placeholder="期限" />
        </SelectTrigger>
        <SelectContent><SelectGroup>
          <SelectItem value={ALL_DEADLINES}>期限: すべて</SelectItem>
          <SelectItem value={OVERDUE_ONLY}>期限: 期限超過</SelectItem>
        </SelectGroup></SelectContent>
      </Select>
      <Select
        items={departmentOptions}
        value={departmentId ?? ALL_DEPARTMENTS}
        onValueChange={(value) => replaceParam("departmentId", value === ALL_DEPARTMENTS ? undefined : value ?? undefined)}
      >
        <SelectTrigger className="w-full md:w-52" aria-label="所属部署で絞り込み">
          <SelectValue placeholder="所属部署" />
        </SelectTrigger>
        <SelectContent><SelectGroup>
          <SelectItem value={ALL_DEPARTMENTS}>所属部署: すべて</SelectItem>
          {departments.map((department) => (
            <SelectItem key={department.id} value={department.id}>{department.name}</SelectItem>
          ))}
        </SelectGroup></SelectContent>
      </Select>
      <Select items={SORT_OPTIONS} value={sort} onValueChange={(value) => value && replaceParam("sort", value)}>
        <SelectTrigger className="w-full md:w-48" aria-label="並び順">
          <SelectValue placeholder="並び順" />
        </SelectTrigger>
        <SelectContent><SelectGroup>
          {SORT_OPTIONS.map((option) => (
            <SelectItem key={option.value} value={option.value}>{option.label}</SelectItem>
          ))}
        </SelectGroup></SelectContent>
      </Select>
      <Button type="button" variant="outline" disabled={!hasActiveFilters} onClick={handleClear}>
        条件をクリア
      </Button>
    </div>
  );
}

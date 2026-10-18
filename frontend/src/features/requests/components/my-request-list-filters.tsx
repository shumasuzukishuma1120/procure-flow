import { REQUEST_STATUSES, type RequestStatus } from "@/features/requests/types";

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { getRequestStatusLabel } from "@/features/requests/constants/request-status-labels";
import { useRouter, useSearchParams } from "next/navigation";
import { isRequestStatus } from "@/features/requests/utils/is-request-status";
import { Label } from "@/components/ui/label";
import { Search } from "lucide-react";
import { InputGroup, InputGroupAddon, InputGroupInput } from "@/components/ui/input-group";
import { useEffect, useState } from "react";
import { MyRequestCreatedDateRangeFilter } from "@/features/requests/components/my-request-created-date-range-filter";
import { MyRequestCategoryFilter } from "@/features/requests/components/my-request-category-filter";
import { MyRequestSupplierFilter } from "@/features/requests/components/my-request-supplier-filter";
import type { CategoryOption } from "@/features/categories/types";
import type { SupplierOption } from "@/features/suppliers/types";
import { Button } from "@/components/ui/button";

const ALL_STATUSES = "ALL" as const;
const FILTER_PARAM_KEYS = [
  "keyword",
  "status",
  "createdFrom",
  "createdTo",
  "categoryId",
  "supplierId",
] as const;

type MyRequestListFiltersProps = {
  status?: RequestStatus;
  keyword?: string;
  categoryId?: string;
  supplierId?: string;
  categoryOptions: CategoryOption[];
  supplierOptions: SupplierOption[];
};

export default function MyRequestListFilters({
  status,
  keyword,
  categoryId,
  supplierId,
  categoryOptions,
  supplierOptions,
}: MyRequestListFiltersProps) {
  const router = useRouter();

  const searchParams = useSearchParams();

  const statusOption = [
    { value: ALL_STATUSES, label: "すべて" },
    ...REQUEST_STATUSES.map((status) => ({
      value: status,
      label: getRequestStatusLabel(status),
    })),
  ];

  const handleValueChange = (value: string | null) => {
    if (value === null) return;
    const nextSearchParams = new URLSearchParams(searchParams.toString());
    if (value === ALL_STATUSES) {
      nextSearchParams.delete("status");
    } else if (isRequestStatus(value)) {
      nextSearchParams.set("status", value);
    } else {
      return;
    }

    nextSearchParams.set("page", "0");
    router.replace(`/requests?${nextSearchParams.toString()}`);
  };

  const [keywordInput, setKeywordInput] = useState(keyword ?? "");

  const hasActiveFilters = FILTER_PARAM_KEYS.some((key) => searchParams.has(key));

  const handleInputChange = (text: string) => {
    setKeywordInput(text);
  };

  const handleClear = () => {
    setKeywordInput("");
    const nextSearchParams = new URLSearchParams(searchParams.toString());

    FILTER_PARAM_KEYS.forEach((key) => nextSearchParams.delete(key));

    nextSearchParams.set("page", "0");

    router.replace(`/requests?${nextSearchParams.toString()}`);
  };

  useEffect(() => {
    const normalizedKeyword = keywordInput.trim();

    if (normalizedKeyword === (keyword ?? "")) return;

    const timer = setTimeout(() => {
      const nextSearchParams = new URLSearchParams(searchParams.toString());

      if (!normalizedKeyword) {
        nextSearchParams.delete("keyword");
      } else {
        nextSearchParams.set("keyword", normalizedKeyword);
      }
      nextSearchParams.set("page", "0");

      router.replace(`/requests?${nextSearchParams.toString()}`);
    }, 500);

    return () => {
      clearTimeout(timer);
    };
  }, [keywordInput, keyword, router, searchParams]);

  return (
    <div className="flex w-full flex-col items-center gap-3 md:flex-row md:flex-wrap">
      <div className="flex w-full flex-1 items-center gap-2 md:min-w-72">
        <Label htmlFor="my-request-keyword-filter" className="sr-only">
          キーワード検索
        </Label>

        <InputGroup>
          <InputGroupAddon>
            <Search aria-hidden="true" className="size-4 text-muted-foreground" />
          </InputGroupAddon>
          <InputGroupInput
            id="my-request-keyword-filter"
            type="search"
            placeholder="申請番号・タイトルで検索"
            className="flex-1"
            value={keywordInput}
            onChange={(e) => handleInputChange(e.target.value)}
          />
        </InputGroup>
      </div>

      <div>
        <MyRequestCreatedDateRangeFilter />
      </div>

      <MyRequestCategoryFilter categoryId={categoryId} categoryOptions={categoryOptions} />

      <MyRequestSupplierFilter supplierId={supplierId} supplierOptions={supplierOptions} />

      <div className="flex h-8 w-fit items-center rounded-lg border pl-3">
        <Label htmlFor="my-request-status-filter">ステータス:</Label>
        <Select
          value={status ?? ALL_STATUSES}
          items={statusOption}
          onValueChange={handleValueChange}
        >
          <SelectTrigger
            id="my-request-status-filter"
            className="h-full w-fit min-w-15 border-0 py-0 hover:bg-accent"
          >
            <SelectValue className={"font-medium"} placeholder={"ステータスを選択"} />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              {statusOption.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>

      <Button
        variant="outline"
        type="button"
        disabled={!hasActiveFilters}
        onClick={handleClear}
      >
        条件をクリア
      </Button>
    </div>
  );
}

"use client";

import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { CategoryOption } from "@/features/categories/types";
import { useRouter, useSearchParams } from "next/navigation";

const ALL_CATEGORIES = "ALL" as const;

type MyRequestCategoryFilterProps = {
  categoryId?: string;
  categoryOptions: CategoryOption[];
};

export function MyRequestCategoryFilter({
  categoryId,
  categoryOptions,
}: MyRequestCategoryFilterProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const selectItems = [
    { value: ALL_CATEGORIES, label: "すべて" },
    ...categoryOptions.map((category) => ({
      value: category.id,
      label: category.name,
    })),
  ];

  const handleValueChange = (value: string | null) => {
    if (value === null) return;

    const nextSearchParams = new URLSearchParams(searchParams.toString());

    if (value === ALL_CATEGORIES) {
      nextSearchParams.delete("categoryId");
    } else if (categoryOptions.some((category) => category.id === value)) {
      nextSearchParams.set("categoryId", value);
    } else {
      return;
    }

    nextSearchParams.set("page", "0");
    router.replace(`/requests?${nextSearchParams.toString()}`);
  };

  return (
    <div className="flex h-8 w-full items-center rounded-lg border pl-3 md:w-fit">
      <Label htmlFor="my-request-category-filter">カテゴリ:</Label>
      <Select
        items={selectItems}
        value={categoryId ?? ALL_CATEGORIES}
        onValueChange={handleValueChange}
      >
        <SelectTrigger
          id="my-request-category-filter"
          className="w-full border-0 py-0 data-[size=default]:h-full md:w-fit"
        >
          <SelectValue placeholder="カテゴリを選択" />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            {selectItems.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>
    </div>
  );
}

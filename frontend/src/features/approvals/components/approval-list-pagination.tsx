import { useRouter, useSearchParams } from "next/navigation";
import { Label } from "@/components/ui/label";
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { APPROVAL_LIST_PAGE_SIZES, type ApprovalListPageSize } from "@/features/approvals/types";

type ApprovalListPaginationProps = {
  page: number;
  size: ApprovalListPageSize;
  totalPages: number;
  totalElements: number;
};

export default function ApprovalListPagination({ page, size, totalPages, totalElements }: ApprovalListPaginationProps) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const hasPrevious = page > 0;
  const hasNext = page + 1 < totalPages;
  const sizeOptions = APPROVAL_LIST_PAGE_SIZES.map((option) => ({
    value: String(option),
    label: `${option}件`,
  }));

  function href(targetPage: number) {
    const next = new URLSearchParams(searchParams.toString());
    next.set("page", String(targetPage));
    return `/approvals?${next.toString()}`;
  }

  function handleSizeChange(value: string | null) {
    const parsed = Number(value);
    if (!APPROVAL_LIST_PAGE_SIZES.some((option) => option === parsed)) return;
    const next = new URLSearchParams(searchParams.toString());
    next.set("size", String(parsed));
    next.set("page", "0");
    router.replace(`/approvals?${next.toString()}`);
  }

  return (
    <>
      <Separator />
      <div className="flex items-center justify-center gap-10 pt-4">
        <div>
          <Pagination><PaginationContent>
            <PaginationItem>
              <PaginationPrevious href={href(Math.max(page - 1, 0))} aria-disabled={!hasPrevious} tabIndex={hasPrevious ? undefined : -1} className={hasPrevious ? undefined : "pointer-events-none opacity-50"} />
            </PaginationItem>
            {totalPages > 0 && <PaginationItem><PaginationLink href={href(page)} isActive>{page + 1}</PaginationLink></PaginationItem>}
            <PaginationItem><span className="px-2 text-sm text-muted-foreground">（全{totalElements}件）</span></PaginationItem>
            <PaginationItem>
              <PaginationNext href={href(Math.min(page + 1, Math.max(totalPages - 1, 0)))} aria-disabled={!hasNext} tabIndex={hasNext ? undefined : -1} className={hasNext ? undefined : "pointer-events-none opacity-50"} />
            </PaginationItem>
          </PaginationContent></Pagination>
        </div>
        <div className="flex items-center gap-2">
          <Label htmlFor="approval-list-page-size" className="whitespace-nowrap">表示件数</Label>
          <Select items={sizeOptions} value={String(size)} onValueChange={handleSizeChange}>
            <SelectTrigger id="approval-list-page-size" className="w-fit min-w-18"><SelectValue placeholder="表示件数を選択" /></SelectTrigger>
            <SelectContent><SelectGroup>
              {sizeOptions.map((option) => <SelectItem key={option.value} value={option.value}>{option.label}</SelectItem>)}
            </SelectGroup></SelectContent>
          </Select>
        </div>
      </div>
    </>
  );
}

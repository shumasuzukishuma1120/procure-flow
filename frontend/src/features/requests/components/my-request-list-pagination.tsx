import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { Separator } from "@/components/ui/separator";
import { MY_REQUEST_LIST_PAGE_SIZES, type MyRequestListPageSize } from "@/features/requests/types";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { isMyRequestListPageSize } from "@/features/requests/utils/is-my-request-list-page-size";
import { Label } from "@/components/ui/label";

type MyRequestListPaginationProps = {
  page: number;
  size: MyRequestListPageSize;
  totalPages: number;
  totalElements: number;
};

export default function MyRequestListPagination({
  page,
  size,
  totalPages,
  totalElements,
}: MyRequestListPaginationProps) {
  const searchParams = useSearchParams();
  const router = useRouter();

  const currentPage = page + 1;
  const lastPage = Math.max(totalPages - 1, 0);
  const hasPages = totalPages > 0;
  const isFirstPage = hasPages && page === 0;
  const isLastPage = hasPages && page === lastPage;
  const isMiddlePage = hasPages && page > 0 && page < lastPage;
  const hasPreviousPage = hasPages && page > 0;
  const hasNextPage = hasPages && page < lastPage;
  const previousPage = Math.max(page - 1, 0);
  const nextPage = Math.min(page + 1, lastPage);
  function createPageHref(targetPage: number) {
    const nextSearchParams = new URLSearchParams(searchParams.toString());
    nextSearchParams.set("page", String(targetPage));
    return `/requests?${nextSearchParams.toString()}`;
  }

  const sizeOptions = MY_REQUEST_LIST_PAGE_SIZES.map((option) => ({
    value: String(option),
    label: `${option}件`,
  }));

  const handleSizeChange = (value: string | null) => {
    if (value === null) return;
    const parsedSize = Number(value);

    if (!isMyRequestListPageSize(parsedSize)) return;

    const nextSearchParams = new URLSearchParams(searchParams.toString());
    nextSearchParams.set("size", String(parsedSize));
    nextSearchParams.set("page", "0");

    router.replace(`/requests?${nextSearchParams.toString()}`);
  };

  return (
    <>
      <Separator />
      <div className="flex justify-center items-center gap-10 pt-4">
        <div>
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  href={createPageHref(previousPage)}
                  aria-disabled={!hasPreviousPage}
                  tabIndex={hasPreviousPage ? undefined : -1}
                  className={hasPreviousPage ? undefined : "pointer-events-none opacity-50"}
                />
              </PaginationItem>

              {!hasPages ? null : isFirstPage ? (
                <>
                  <PaginationItem>
                    <PaginationLink href={createPageHref(page)} isActive>
                      {currentPage}
                    </PaginationLink>
                  </PaginationItem>
                  {totalPages > 1 && (
                    <PaginationItem>
                      <PaginationLink href={createPageHref(page + 1)}>
                        {currentPage + 1}
                      </PaginationLink>
                    </PaginationItem>
                  )}
                  {totalPages > 2 && (
                    <PaginationItem>
                      <PaginationLink href={createPageHref(page + 2)}>
                        {currentPage + 2}
                      </PaginationLink>
                    </PaginationItem>
                  )}
                  {totalPages > 3 && (
                    <PaginationItem>
                      <PaginationEllipsis />
                    </PaginationItem>
                  )}
                </>
              ) : isMiddlePage ? (
                <>
                  {currentPage > 2 && (
                    <PaginationItem>
                      <PaginationEllipsis />
                    </PaginationItem>
                  )}
                  <PaginationItem>
                    <PaginationLink href={createPageHref(page - 1)}>
                      {currentPage - 1}
                    </PaginationLink>
                  </PaginationItem>
                  <PaginationItem>
                    <PaginationLink href={createPageHref(page)} isActive>
                      {currentPage}
                    </PaginationLink>
                  </PaginationItem>
                  <PaginationItem>
                    <PaginationLink href={createPageHref(page + 1)}>
                      {currentPage + 1}
                    </PaginationLink>
                  </PaginationItem>
                  {currentPage < totalPages - 1 && (
                    <PaginationItem>
                      <PaginationEllipsis />
                    </PaginationItem>
                  )}
                </>
              ) : isLastPage ? (
                <>
                  {totalPages > 3 && (
                    <PaginationItem>
                      <PaginationEllipsis />
                    </PaginationItem>
                  )}
                  {totalPages > 2 && (
                    <PaginationItem>
                      <PaginationLink href={createPageHref(page - 2)}>
                        {currentPage - 2}
                      </PaginationLink>
                    </PaginationItem>
                  )}
                  <PaginationItem>
                    <PaginationLink href={createPageHref(page - 1)}>
                      {currentPage - 1}
                    </PaginationLink>
                  </PaginationItem>
                  <PaginationItem>
                    <PaginationLink href={createPageHref(page)} isActive>
                      {currentPage}
                    </PaginationLink>
                  </PaginationItem>
                </>
              ) : null}
              <PaginationItem>
                <p className="text-sm text-muted-foreground">{`（全${totalElements}件）`}</p>
              </PaginationItem>
              <PaginationItem>
                <PaginationNext
                  href={createPageHref(nextPage)}
                  aria-disabled={!hasNextPage}
                  tabIndex={hasNextPage ? undefined : -1}
                  className={hasNextPage ? undefined : "pointer-events-none opacity-50"}
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
        <div className="flex items-center gap-2">
          <Label htmlFor="my-request-list-page-size">表示件数</Label>

          <Select items={sizeOptions} value={String(size)} onValueChange={handleSizeChange}>
            <SelectTrigger id="my-request-list-page-size" className="w-fit min-w-18">
              <SelectValue placeholder={"表示件数を選択"} />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                {sizeOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
      </div>
    </>
  );
}

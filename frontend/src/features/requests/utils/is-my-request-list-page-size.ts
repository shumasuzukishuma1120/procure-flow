import { MY_REQUEST_LIST_PAGE_SIZES, type MyRequestListPageSize } from "@/features/requests/types";

export function isMyRequestListPageSize(value: number): value is MyRequestListPageSize {
  return MY_REQUEST_LIST_PAGE_SIZES.some((pageSize) => pageSize === value);
}

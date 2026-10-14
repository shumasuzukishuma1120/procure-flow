import type { MyRequestListQuery } from "@/features/requests/types";

export function toMyRequestListSearchParams(query: MyRequestListQuery): URLSearchParams {
  const params = new URLSearchParams();
  params.set("page", String(query.page));
  params.set("size", String(query.size));
  params.set("sort", query.sort);

  if (query.status) {
    params.set("status", query.status);
  }
  if (query.keyword) {
    params.set("keyword", query.keyword);
  }
  if (query.createdFrom) {
    params.set("createdFrom", query.createdFrom);
  }
  if (query.createdTo) {
    params.set("createdTo", query.createdTo);
  }
  if (query.categoryId) {
    params.set("categoryId", query.categoryId);
  }
  if (query.supplierId) {
    params.set("supplierId", query.supplierId);
  }

  return params;
}

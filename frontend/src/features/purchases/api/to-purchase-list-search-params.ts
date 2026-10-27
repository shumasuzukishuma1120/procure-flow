import type { PurchaseListQuery } from "@/features/purchases/types";

export function toPurchaseListSearchParams(query: PurchaseListQuery): URLSearchParams {
  const params = new URLSearchParams({
    page: String(query.page),
    size: String(query.size),
    sort: query.sort
  })

  if(query.keyword) params.set("keyword", query.keyword);
  if(query.status) params.set("status", query.status);
  if(query.departmentId) params.set("departmentId", query.departmentId);
  if(query.supplierId) params.set("supplierId", query.supplierId);
  if(query.approvedFrom) params.set("approvedFrom", query.approvedFrom);
  if(query.approvedTo) params.set("approvedTo", query.approvedTo);

  return params;
}
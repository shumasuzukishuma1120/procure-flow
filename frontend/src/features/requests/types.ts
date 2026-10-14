export const MY_REQUEST_LIST_PAGE_SIZES = [20, 50, 100] as const;
export type MyRequestListPageSize = (typeof MY_REQUEST_LIST_PAGE_SIZES)[number];

export const MY_REQUEST_SORTS = [
  "UPDATED_DESC",
  "UPDATED_ASC",
  "CREATED_DESC",
  "CREATED_ASC",
] as const;
export type MyRequestSort = (typeof MY_REQUEST_SORTS)[number];

export type MyRequestListQuery = {
  page: number;
  size: MyRequestListPageSize;
  sort: MyRequestSort;
  status?: RequestStatus;
  keyword?: string;
  createdFrom?: string;
  createdTo?: string;
  categoryId?: string;
  supplierId?: string;
};

export const REQUEST_STATUSES = [
  "DRAFT",
  "SUBMITTED",
  "CANCELED",
  "REJECTED",
  "APPROVED",
  "ORDERED",
  "COMPLETED",
  "REAPPLICATION_REQUIRED",
] as const;

export type RequestStatus = (typeof REQUEST_STATUSES)[number];

export type MyRequestListItemResponse = {
  requestId: string;
  requestNumber: string | null;
  title: string | null;
  status: RequestStatus;
  firstItemName: string | null;
  additionalItemCount: number;
  requestedSupplierName: string | null;
  totalAmount: number;
  updatedAt: string;
  version: number;
};

export type MyRequestListResponse = {
  items: MyRequestListItemResponse[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
};

export type CancelRequestResponse = {
  requestId: string;
  status: "CANCELED";
  version: number;
  canceledAt: string;
};

// リクエストDTO
// 対象API：
// POST /api/request-submissions
// Idempotency-Key: <unique-key>
export type CreateRequestSubmissionItemRequest = {
  productName: string;
  modelNumber: string | null;
  productUrl: string | null;
  categoryId: string;
  quantity: number;
  plannedUnitPrice: number;
};
export type CreateRequestSubmissionRequest = {
  title: string;
  reason: string;
  desiredDeliveryDate: string;
  requestedSupplierId: string;
  note: string | null;
  items: CreateRequestSubmissionItemRequest[];
};

// レスポンスDTO
// 対象API：
// POST /api/request-submissions
export type RequestSubmissionResponse = {
  requestId: string;
  requestNumber: string;
  status: "SUBMITTED";
  version: number;
  submittedAt: string;
};

// リクエストDTO
// 対象API:
// POST /api/requests
export type CreateDraftRequestItemRequest = {
  productName: string | null;
  modelNumber: string | null;
  productUrl: string | null;
  categoryId: string | null;
  quantity: number | null;
  plannedUnitPrice: number | null;
};

// リクエストDTO
// 対象API:
// POST /api/requests
export type CreateDraftRequest = {
  title: string | null;
  reason: string | null;
  desiredDeliveryDate: string | null;
  requestedSupplierId: string | null;
  note: string | null;
  items: CreateDraftRequestItemRequest[];
};

// レスポンスDTO
// 対象API:
// POST /api/requests
export type DraftRequestResponse = {
  requestId: string;
  requestNumber: null;
  status: "DRAFT";
  title: string | null;
  reason: string | null;
  desiredDeliveryDate: string | null;
  requestedSupplierId: string | null;
  note: string | null;
  items: CreateDraftRequestItemRequest[];
  totalAmount: number;
  version: number;
  createdAt: string;
  updatedAt: string;
};

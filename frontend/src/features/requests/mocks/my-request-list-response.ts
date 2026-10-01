import type { MyRequestListItemResponse, MyRequestListResponse } from "@/features/requests/types";

const draftRequest = {
  requestId: "087d7c3f-e367-4fca-abf2-e3721e0fb604",
  requestNumber: null,
  title: "入力途中の申請",
  status: "DRAFT",
  firstItemName: null,
  additionalItemCount: 0,
  requestedSupplierName: null,
  totalAmount: 0,
  updatedAt: "2026-09-22T10:30:00+09:00",
  version: 1,
} satisfies MyRequestListItemResponse

const submittedRequest = {
  requestId: "02b3006f-4df1-431e-8f21-0538da91389e",
  requestNumber: "REQ-2026-000001",
  title: "提出済みの申請",
  status: "SUBMITTED",
  firstItemName: "ノートPC 25L Desktop",
  additionalItemCount: 2,
  requestedSupplierName: "坂の上電気店",
  totalAmount: 130000,
  updatedAt: "2026-09-30T11:30:00+09:00",
  version: 1,
} satisfies MyRequestListItemResponse;

const approvedRequest = {
  requestId: "ed3135bf-dce5-4203-8847-85903bbcaad0",
  requestNumber: "REQ-2026-000002",
  title: "承認済みの申請",
  status: "APPROVED",
  firstItemName: "ワイヤレス軽量マウス",
  additionalItemCount: 1,
  requestedSupplierName: "川下電気店",
  totalAmount: 9000,
  updatedAt: "2026-09-28T10:30:00+09:00",
  version: 3,
} satisfies MyRequestListItemResponse;

const canceledRequest = {
  requestId: "4cb6e64e-b8ad-42f8-a5b7-a9484de343f9",
  requestNumber: "REQ-2026-000003",
  title: "申請者が取り消した申請",
  status: "CANCELED",
  firstItemName: "USB-Cドッキングステーション",
  additionalItemCount: 0,
  requestedSupplierName: "東都オフィス用品",
  totalAmount: 18000,
  updatedAt: "2026-09-27T16:45:00+09:00",
  version: 2,
} satisfies MyRequestListItemResponse;

const rejectedRequest = {
  requestId: "70d87dc7-4de6-48c1-9ec7-4e33db616842",
  requestNumber: "REQ-2026-000004",
  title: "却下された備品購入申請",
  status: "REJECTED",
  firstItemName: "高機能オフィスチェア",
  additionalItemCount: 0,
  requestedSupplierName: "中央オフィス家具",
  totalAmount: 85000,
  updatedAt: "2026-09-26T14:20:00+09:00",
  version: 2,
} satisfies MyRequestListItemResponse;

const orderedRequest = {
  requestId: "93cbda69-2c0e-42b0-a381-06feb91cb88c",
  requestNumber: "REQ-2026-000005",
  title: "発注済みの開発用機材",
  status: "ORDERED",
  firstItemName: "27インチ4Kモニター",
  additionalItemCount: 1,
  requestedSupplierName: "坂の上電気店",
  totalAmount: 94000,
  updatedAt: "2026-09-25T09:15:00+09:00",
  version: 4,
} satisfies MyRequestListItemResponse;

const completedRequest = {
  requestId: "bd03532f-2cda-4fd1-9085-92c76e77f500",
  requestNumber: "REQ-2026-000006",
  title: "受領完了した消耗品申請",
  status: "COMPLETED",
  firstItemName: "コピー用紙 A4 500枚",
  additionalItemCount: 2,
  requestedSupplierName: "東都オフィス用品",
  totalAmount: 12500,
  updatedAt: "2026-09-24T17:10:00+09:00",
  version: 5,
} satisfies MyRequestListItemResponse;

const reapplicationRequiredRequest = {
  requestId: "f0fd475a-f8dd-477f-b880-691534ca2655",
  requestNumber: "REQ-2026-000007",
  title: "金額超過により再申請が必要な申請",
  status: "REAPPLICATION_REQUIRED",
  firstItemName: "業務用タブレット",
  additionalItemCount: 3,
  requestedSupplierName: "川下電気店",
  totalAmount: 248000,
  updatedAt: "2026-09-23T13:05:00+09:00",
  version: 4,
} satisfies MyRequestListItemResponse;

export const myRequestListResponse = {
  items: [
    draftRequest,
    submittedRequest,
    canceledRequest,
    rejectedRequest,
    approvedRequest,
    orderedRequest,
    completedRequest,
    reapplicationRequiredRequest,
  ],
  page: 0,
  size: 20,
  totalElements: 8,
  totalPages: 1,
} satisfies MyRequestListResponse;

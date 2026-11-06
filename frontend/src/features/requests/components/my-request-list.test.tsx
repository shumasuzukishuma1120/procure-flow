import { screen, within } from "@testing-library/react";
import { delay, http, HttpResponse } from "msw";
import { beforeEach, describe, expect, it, vi } from "vitest";
import MyRequestList from "@/features/requests/components/my-request-list";
import { server } from "@/test/msw/server";
import { renderWithQueryClient } from "@/test/render-with-query-client";

const searchParamsMock = vi.hoisted(() => vi.fn());

vi.mock("next/navigation", () => ({
  useSearchParams: () => searchParamsMock(),
  useRouter: () => ({
    replace: vi.fn(),
  }),
}));

describe("MyRequestList", () => {
  beforeEach(() => {
    searchParamsMock.mockReturnValue(new URLSearchParams());
  });

  it("申請一覧の取得中はスケルトンを表示する", () => {
    server.use(
      http.get("/api/requests", async () => {
        await delay("infinite");

        return HttpResponse.json({
          items: [],
          page: 0,
          size: 20,
          totalElements: 0,
          totalPages: 0,
        });
      }),
    );
    renderWithQueryClient(<MyRequestList categoryOptions={[]} supplierOptions={[]} />);

    expect(screen.getByRole("status", { name: "申請一覧を読み込んでいます" })).toBeInTheDocument();
  });

  it("取得した申請を一覧に表示する", async () => {
    server.use(
      http.get("/api/requests", () => {
        return HttpResponse.json({
          items: [
            {
              requestId: "00000000-0000-0000-0000-000000000001",
              requestNumber: "REQ-2026-000001",
              title: "開発用ノートPCの購入",
              status: "APPROVED",
              firstItemName: "ノートPC",
              additionalItemCount: 1,
              requestedSupplierName: "株式会社大和ソリューションズ",
              totalAmount: 250000,
              updatedAt: "2026-10-28T01:00:00Z",
              version: 2,
            },
          ],
          page: 0,
          size: 20,
          totalElements: 1,
          totalPages: 1,
        });
      }),
    );

    renderWithQueryClient(<MyRequestList categoryOptions={[]} supplierOptions={[]} />);

    const table = await screen.findByRole("table", {
      name: "自分の申請一覧",
    });
    expect(table).toBeInTheDocument();
    expect(within(table).getByText("REQ-2026-000001")).toBeInTheDocument();

    expect(within(table).getByText("開発用ノートPCの購入")).toBeInTheDocument();

    expect(within(table).getByText("承認済み")).toBeInTheDocument();

    expect(within(table).getByText("株式会社大和ソリューションズ")).toBeInTheDocument();

    expect(within(table).getByText("￥250,000")).toBeInTheDocument();

    expect(
      screen.queryByRole("status", { name: "申請一覧を読み込んでいます" }),
    ).not.toBeInTheDocument();
  });

  it("申請一覧の取得に失敗するとエラーメッセージを表示する", async () => {
    server.use(
      http.get("/api/requests", () => {
        return HttpResponse.json(
          {
            status: 500,
            code: "INTERNAL_SERVER_ERROR",
            title: "申請一覧を取得できませんでした",
            detail: "申請一覧の取得に失敗しました。時間をおいて再度お試しください。",
          },
          {
            status: 500,
          },
        );
      }),
    );
    renderWithQueryClient(<MyRequestList categoryOptions={[]} supplierOptions={[]} />);

    const errorMessage = await screen.findByRole("alert");
    expect(errorMessage).toHaveTextContent(
      "申請一覧の取得に失敗しました。時間をおいて再度お試しください。",
    );

    const table = screen.queryByRole("table", {
      name: "自分の申請一覧",
    });
    expect(table).not.toBeInTheDocument();
  });

  it("URLの検索条件をAPIリクエストに引き継ぐ", async () => {
    searchParamsMock.mockReturnValue(
      new URLSearchParams({
        page: "2",
        size: "50",
        status: "APPROVED",
        keyword: "ノートPC",
        createdFrom: "2026-10-01",
        createdTo: "2026-10-31",
      }),
    );

    server.use(
      http.get("/api/requests", ({ request }) => {
        const requestUrl = new URL(request.url);

        expect(Object.fromEntries(requestUrl.searchParams)).toEqual({
          page: "2",
          size: "50",
          sort: "UPDATED_DESC",
          status: "APPROVED",
          keyword: "ノートPC",
          createdFrom: "2026-10-01",
          createdTo: "2026-10-31",
        });

        return HttpResponse.json({
          items: [],
          page: 2,
          size: 50,
          totalElements: 0,
          totalPages: 0,
        });
      }),
    );

    renderWithQueryClient(<MyRequestList categoryOptions={[]} supplierOptions={[]} />);

    expect(await screen.findByText("条件に一致する申請はありません")).toBeInTheDocument();
  });
});

import { screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { http, HttpResponse } from "msw";
import { beforeEach, describe, expect, it, vi } from "vitest";
import CreateRequestForm from "@/features/requests/components/create-request-form";
import { renderWithQueryClient } from "@/test/render-with-query-client";
import { server } from "@/test/msw/server";

const replaceMock = vi.hoisted(() => vi.fn());

vi.mock("next/navigation", () => ({
  useRouter: () => ({
    replace: replaceMock,
  }),
}));

describe("CreateRequestForm", () => {
  beforeEach(() => {
    replaceMock.mockClear();
  });

  it("何も入力せず下書き保存するとエラーメッセージを表示する", async () => {
    const user = userEvent.setup();
    const requestMock = vi.fn();

    server.use(
      http.post("/api/requests", () => {
        requestMock();
        return HttpResponse.json({}, { status: 201 });
      }),
    );

    renderWithQueryClient(<CreateRequestForm supplierOptions={[]} categoryOptions={[]} />);

    await user.click(screen.getByRole("button", { name: "下書き保存" }));

    expect(
      await screen.findByText("下書き保存するには、いずれかの項目を入力してください"),
    ).toBeInTheDocument();
    expect(requestMock).not.toHaveBeenCalled();
    expect(replaceMock).not.toHaveBeenCalled();
  });

  it("タイトルだけ入力した下書きを保存し、編集画面へ遷移する", async () => {
    const user = userEvent.setup();
    const requestId = "00000000-0000-4000-8000-000000000001";

    server.use(
      http.post("/api/requests", async ({ request }) => {
        expect(request.headers.get("Idempotency-Key")).toBeTruthy();
        expect(await request.json()).toEqual({
          title: "開発用モニターの購入",
          reason: null,
          desiredDeliveryDate: null,
          requestedSupplierId: null,
          note: null,
          items: [],
        });

        return HttpResponse.json(
          {
            requestId,
            requestNumber: null,
            status: "DRAFT",
            title: "開発用モニターの購入",
            reason: null,
            desiredDeliveryDate: null,
            requestedSupplierId: null,
            note: null,
            items: [],
            totalAmount: 0,
            version: 1,
            createdAt: "2026-10-29T00:00:00Z",
            updatedAt: "2026-10-29T00:00:00Z",
          },
          { status: 201 },
        );
      }),
    );

    renderWithQueryClient(<CreateRequestForm supplierOptions={[]} categoryOptions={[]} />);

    await user.type(screen.getByRole("textbox", { name: "タイトル" }), "開発用モニターの購入");
    await user.click(screen.getByRole("button", { name: "下書き保存" }));

    await waitFor(() => {
      expect(replaceMock).toHaveBeenCalledWith(`/requests/${requestId}/edit`);
    });
  });

  it("必須項目が空のまま申請すると各入力欄にエラーを表示する", async () => {
    const user = userEvent.setup();

    renderWithQueryClient(<CreateRequestForm supplierOptions={[]} categoryOptions={[]} />);

    await user.click(screen.getByRole("button", { name: "申請する" }));

    expect(await screen.findByText("タイトルは必須です")).toBeInTheDocument();
    expect(screen.getByText("申請理由を入力してください")).toBeInTheDocument();
    expect(screen.getByText("商品名は必須です")).toBeInTheDocument();
    expect(replaceMock).not.toHaveBeenCalled();
  });
});

import userEvent from "@testing-library/user-event";
import { screen, waitFor, within } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { renderWithQueryClient } from "@/test/render-with-query-client";
import RejectRequestDialog from "@/features/approvals/components/reject-request-dialog";
import { server } from "@/test/msw/server";
import { http, HttpResponse } from "msw";

const REQUEST_ID = "00000000-0000-0000-0000-000000000001";
const REQUEST_TITLE = "開発用PCの購入";

const refreshMock = vi.hoisted(() => vi.fn());

vi.mock("next/navigation", () => ({
  useRouter: () => ({
    refresh: refreshMock,
  }),
}));

describe("RejectRequestDialog", () => {
  beforeEach(() => {
    refreshMock.mockClear();
  });

  it("却下理由を入力すると却下ボタンが有効になる", async () => {
    const user = userEvent.setup();

    renderWithQueryClient(
      <RejectRequestDialog requestId={REQUEST_ID} requestTitle={REQUEST_TITLE} version={1} />,
    );

    await user.click(
      screen.getByRole("button", {
        name: "却下する",
      }),
    );

    const dialog = screen.getByRole("dialog");

    expect(
      within(dialog).getByRole("heading", {
        name: "この申請を却下しますか？",
      }),
    ).toBeInTheDocument();

    const reasonInput = within(dialog).getByRole("textbox", {
      name: "却下理由",
    });

    const submitButton = within(dialog).getByRole("button", {
      name: "却下する",
    });

    expect(submitButton).toBeDisabled();

    await user.type(reasonInput, "予算上限を超えているため");

    expect(submitButton).toBeEnabled();
  });

  it("却下に成功するとDialogを閉じて画面を再取得する", async () => {
    const user = userEvent.setup();

    server.use(
      http.post("/api/approvals/:requestId/reject", async ({ request, params }) => {
        expect(params.requestId).toBe(REQUEST_ID);

        expect(request.headers.get("Idempotency-key")).toEqual(expect.any(String));

        expect(await request.json()).toEqual({
          version: 1,
          reason: "予算上限を超えているため",
        });
        return HttpResponse.json({
          requestId: REQUEST_ID,
          status: "REJECTED",
          version: 2,
          decidedAt: "2026-10-25T10:00:00Z",
        });
      }),
    );

    renderWithQueryClient(
      <RejectRequestDialog requestId={REQUEST_ID} requestTitle={REQUEST_TITLE} version={1} />,
    );

    await user.click(
      screen.getByRole("button", {
        name: "却下する",
      }),
    );

    const dialog = screen.getByRole("dialog");

    await user.type(
      within(dialog).getByRole("textbox", {
        name: "却下理由",
      }),
      "予算上限を超えているため",
    );

    await user.click(
      within(dialog).getByRole("button", {
        name: "却下する",
      }),
    );

    await waitFor(() => {
      expect(refreshMock).toHaveBeenCalledOnce();
    });

    await waitFor(() => {
      expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    });
  });

  it("申請の更新が競合した場合はエラーを表示してDialogを閉じない", async () => {
    const user = userEvent.setup();

    server.use(
      http.post(`/api/approvals/:requestId/reject`, async ({ request, params }) => {
        expect(params.requestId).toBe(REQUEST_ID);

        expect(request.headers.get("Idempotency-key")).toEqual(expect.any(String));

        expect(await request.json()).toEqual({
          version: 1,
          reason: "予算上限を超えているため",
        });
        return HttpResponse.json(
          {
            status: 409,
            code: "REQUEST_VERSION_CONFLICT",
            title: "申請の更新が競合しました",
            detail:
              "申請が他の操作によって更新されています。再読み込みしてからやり直してください。",
          },
          {
            status: 409,
          },
        );
      }),
    );

    renderWithQueryClient(
      <RejectRequestDialog requestId={REQUEST_ID} requestTitle={REQUEST_TITLE} version={1} />,
    );

    await user.click(
      screen.getByRole("button", {
        name: "却下する",
      }),
    );

    const dialog = screen.getByRole("dialog");

    await user.type(
      within(dialog).getByRole("textbox", {
        name: "却下理由",
      }),
      "予算上限を超えているため",
    );

    await user.click(
      within(dialog).getByRole("button", {
        name: "却下する",
      }),
    );

    const errorMessage = await within(dialog).findByRole("alert");

    expect(errorMessage).toHaveTextContent(
      "申請が他の操作によって更新されています。再読み込みしてからやり直してください。",
    );
    expect(screen.getByRole("dialog")).toBeInTheDocument();
    expect(refreshMock).not.toHaveBeenCalled();
  });

  it("同じ却下理由で再試行すると同じIdempotencyKeyを使用する", async () => {
    const user = userEvent.setup();

    const idempotencyKeys: Array<string | null> = [];
    let requestCount = 0;

    server.use(
      http.post("/api/approvals/:requestId/reject", async ({ request }) => {
        idempotencyKeys.push(request.headers.get("Idempotency-key"));

        requestCount += 1;

        if (requestCount === 1) {
          return HttpResponse.error();
        }
        return HttpResponse.json({
          requestId: REQUEST_ID,
          status: "REJECTED",
          version: 2,
          decidedAt: "2026-10-25T10:00:00Z",
        });
      }),
    );

    renderWithQueryClient(
      <RejectRequestDialog requestId={REQUEST_ID} requestTitle={REQUEST_TITLE} version={1} />,
    );

    await user.click(
      screen.getByRole("button", {
        name: "却下する",
      }),
    );

    const dialog = screen.getByRole("dialog");

    await user.type(
      within(dialog).getByRole("textbox", {
        name: "却下理由",
      }),
      "予算上限を超えているため",
    );

    const rejectButton = within(dialog).getByRole("button", {
      name: "却下する",
    });

    await user.click(rejectButton);

    const errorMessage = await within(dialog).findByRole("alert");

    expect(errorMessage).toBeInTheDocument();
    expect(screen.getByRole("dialog")).toBeInTheDocument();
    expect(refreshMock).not.toHaveBeenCalled();
    expect(idempotencyKeys).toHaveLength(1);
    expect(idempotencyKeys[0]).not.toBeNull();

    await user.click(rejectButton);

    await waitFor(() => {
      expect(refreshMock).toHaveBeenCalledOnce();
    });
    expect(idempotencyKeys).toHaveLength(2);
    expect(idempotencyKeys[1]).toBe(idempotencyKeys[0]);
  });
});

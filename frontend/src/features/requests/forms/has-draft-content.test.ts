import { describe, expect, it } from "vitest";
import { hasDraftContent } from "@/features/requests/forms/has-draft-content";
import { createDraftRequestFormDefaultValues } from "@/features/requests/forms/request-form-default-values";

describe("hasDraftContent", () => {
  it("すべての項目が空の場合はfalseを返す", () => {
    const values = createDraftRequestFormDefaultValues();

    expect(hasDraftContent(values)).toBe(false);
  });

  it("申請の基本項目に入力がある場合はtrueを返す", () => {
    const values = createDraftRequestFormDefaultValues();
    values.title = "開発用モニターの購入";

    expect(hasDraftContent(values)).toBe(true);
  });

  it("明細の文字項目に入力がある場合はtrueを返す", () => {
    const values = createDraftRequestFormDefaultValues();
    values.items[0].productName = "27インチモニター";

    expect(hasDraftContent(values)).toBe(true);
  });

  it("明細の数値項目に入力がある場合はtrueを返す", () => {
    const values = createDraftRequestFormDefaultValues();
    values.items[0].quantity = 1;

    expect(hasDraftContent(values)).toBe(true);
  });
});

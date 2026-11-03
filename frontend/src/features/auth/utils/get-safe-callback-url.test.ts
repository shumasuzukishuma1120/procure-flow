import { describe, expect, it } from "vitest";
import { getSafeCallbackUrl } from "@/features/auth/utils/get-safe-callback-url";

const REQUEST_ORIGIN = "http://localhost:3000";

describe("getSafeCallbackUrl", () => {
  it("callbackUrlがない場合はダッシュボードを返す", () => {
    expect(getSafeCallbackUrl(undefined, REQUEST_ORIGIN)).toBe("/dashboard");
  });

  it("同一OriginのURLはPathとQueryを保持する", () => {
    expect(
      getSafeCallbackUrl("http://localhost:3000/requests?page=1", REQUEST_ORIGIN),
    ).toBe("/requests?page=1");
  });

  it("相対URLをそのまま利用できる", () => {
    expect(getSafeCallbackUrl("/requests/new", REQUEST_ORIGIN)).toBe("/requests/new");
  });

  it("外部OriginのURLはダッシュボードへ置き換える", () => {
    expect(getSafeCallbackUrl("https://example.com/phishing", REQUEST_ORIGIN)).toBe(
      "/dashboard",
    );
  });

  it("認証Endpointへ戻るURLはダッシュボードへ置き換える", () => {
    expect(getSafeCallbackUrl("/api/auth/signin", REQUEST_ORIGIN)).toBe("/dashboard");
  });
});

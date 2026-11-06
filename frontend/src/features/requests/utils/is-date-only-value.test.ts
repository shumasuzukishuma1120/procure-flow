import { describe, expect, it } from "vitest";
import { isDateOnlyValue } from "@/features/requests/utils/is-date-only-value";

describe("isDateOnlyValue", () => {
  it("実在するYYYY-MM-DD形式の日付はtrueを返す", () => {
    expect(isDateOnlyValue("2026-10-29")).toBe(true);
  });

  it("うるう年の2月29日はtrueを返す", () => {
    expect(isDateOnlyValue("2024-02-29")).toBe(true);
  });

  it("実在しない日付はfalseを返す", () => {
    expect(isDateOnlyValue("2025-02-29")).toBe(false);
    expect(isDateOnlyValue("2026-02-30")).toBe(false);
  });

  it("YYYY-MM-DD形式でない値とnullはfalseを返す", () => {
    expect(isDateOnlyValue("2026/10/29")).toBe(false);
    expect(isDateOnlyValue("2026-1-1")).toBe(false);
    expect(isDateOnlyValue(null)).toBe(false);
  });
});

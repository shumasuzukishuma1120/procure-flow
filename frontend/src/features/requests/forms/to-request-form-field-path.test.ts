import { toRequestFormFieldPath } from "@/features/requests/forms/to-request-form-field-path";
import { describe, expect, it } from "vitest";

describe("toRequestFormFieldPath", () => {
  describe("変換できるフィールド", () => {
    it("titleをtitleへ変換する", () => {
      const apiField = "title";
      const itemCount = 1;
      const result = toRequestFormFieldPath(apiField, itemCount);

      expect(result).toBe("title");
    });

    it("items[0].productNameをitems.0.productNameへ変換する", () => {
      const apiField = "items[0].productName";
      const itemCount = 1;

      const result = toRequestFormFieldPath(apiField, itemCount);

      expect(result).toBe("items.0.productName");
    });

    it("items[1].productNameをitems.1.productNameへ変換する", () => {
      const apiField = "items[1].productName";
      const itemCount = 2;
      const result = toRequestFormFieldPath(apiField, itemCount);

      expect(result).toBe("items.1.productName");
    });
  });

  describe("変換できないフィールド", () => {
    it("明細数の範囲外のインデックスの場合はnullを返す", () => {
      const apiField = "items[1].productName";
      const itemCount = 1;
      const result = toRequestFormFieldPath(apiField, itemCount);

      expect(result).toBeNull();
    });

    it("フィールドパスに負のインデックスが含まれる場合はnullを返す", () => {
      const apiField = "items[-1].productName";
      const itemCount = 1;
      const result = toRequestFormFieldPath(apiField, itemCount);

      expect(result).toBeNull();
    });

    it("未対応の明細フィールドの場合はnullを返す", () => {
      const apiField = "items[0].quantity";
      const itemCount = 1;
      const result = toRequestFormFieldPath(apiField, itemCount);

      expect(result).toBeNull();
    });

    it("未対応のトップレベルフィールドの場合はnullを返す", () => {
      const apiField = "reason";
      const itemCount = 1;
      const result = toRequestFormFieldPath(apiField, itemCount);

      expect(result).toBeNull();
    });

    it("インデックスが不正な値の場合nullを返す", () => {
      const apiField = "items[abc].productName";
      const itemCount = 1;
      const result = toRequestFormFieldPath(apiField, itemCount);

      expect(result).toBeNull();
    });
  });
});

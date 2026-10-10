package com.example.procureflow.request.presentation.dto;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

import java.util.UUID;

public record CreateDraftRequestItem(
        @Size(max = 200, message = "商品名は200文字以内で入力してください。")
        String productName,

        @Size(max = 100, message = "型番は100文字以内で入力してください。")
        String modelNumber,

        @Size(max = 2048, message = "商品URLは2048文字以内で入力してください。")
        @Pattern(regexp = "^https?://.+", message = "商品URLにはhttpまたはhttpsから始まるURLを入力してください。")
        String productUrl,

        UUID categoryId,

        @Min(value = 1, message = "数量は1以上で入力してください。")
        @Max(value = 9999, message = "数量は9,999以下で入力してください。")
        Integer quantity,

        @Min(value = 1, message = "予定単価は1円以上で入力してください。")
        @Max(value = 99999999, message = "予定単価は99,999,999円以下で入力してください。")
        Long plannedUnitPrice
) {
}

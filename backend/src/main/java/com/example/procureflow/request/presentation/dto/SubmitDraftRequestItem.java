package com.example.procureflow.request.presentation.dto;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

import java.util.UUID;

public record SubmitDraftRequestItem(
        @NotBlank(message = "商品名は必須です。")
        @Size(max = 200, message = "商品名は200文字以内で入力してください。")
        String productName,

        @Size(max = 100, message = "型番は100文字以内で入力してください。")
        String modelNumber,

        @Size(max = 2048, message = "商品URLは2048文字以内で入力してください。")
        @Pattern(regexp = "^https?://.+", message = "商品URLにはhttpまたはhttpsから始まるURLを入力してください。")
        String productUrl,

        @NotNull(message = "カテゴリは必須です。")
        UUID categoryId,

        @NotNull(message = "数量は必須です。")
        @Min(value = 1, message = "数量は1以上で入力してください。")
        @Max(value = 9999, message = "数量は9,999以下で入力してください。")
        Integer quantity,

        @NotNull(message = "予定単価は必須です。")
        @Min(value = 1, message = "予定単価は1円以上で入力してください。")
        @Max(value = 99999999, message = "予定単価は99,999,999円以下で入力してください。")
        Long plannedUnitPrice
) {
}

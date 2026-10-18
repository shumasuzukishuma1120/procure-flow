package com.example.procureflow.request.presentation.dto;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.PositiveOrZero;
import jakarta.validation.constraints.Size;

import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

public record SubmitDraftRequest(
        @NotBlank(message = "タイトルは必須です。")
        @Size(max = 100, message = "タイトルは100文字以内で入力してください。")
        String title,

        @NotBlank(message = "申請理由は必須です。")
        @Size(max = 1000, message = "申請理由は1,000文字以内で入力してください。")
        String reason,

        @NotNull(message = "希望納期は必須です。")
        LocalDate desiredDeliveryDate,

        @NotNull(message = "希望仕入先は必須です。")
        UUID requestedSupplierId,

        @Size(max = 1000, message = "備考は1,000文字以内で入力してください。")
        String note,

        @NotEmpty(message = "申請明細を1件以上追加してください。")
        @Size(max = 20, message = "申請明細は20件以下にしてください。")
        List<@Valid SubmitDraftRequestItem> items,

        @NotNull(message = "versionは必須です。")
        @PositiveOrZero(message = "versionは0以上で指定してください。")
        Long version
) {
    public SubmitDraftRequest {
        items = items == null ? List.of() : List.copyOf(items);
    }
}

package com.example.procureflow.request.presentation.dto;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.PositiveOrZero;
import jakarta.validation.constraints.Size;

import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

public record UpdateDraftRequest(
        @NotNull(message = "versionは必須です。")
        @PositiveOrZero(message = "versionは0以上で指定してください。")
        Long version,

        @Size(max = 100, message = "タイトルは100文字以内で入力してください。")
        String title,

        @Size(max = 1000, message = "申請理由は1,000文字以内で入力してください。")
        String reason,

        LocalDate desiredDeliveryDate,

        UUID requestedSupplierId,

        @Size(max = 1000, message = "備考は1,000文字以内で入力してください。")
        String note,

        @Size(max = 20, message = "申請明細は20件以下にしてください。")
        List<@Valid CreateDraftRequestItem> items
) {
    public UpdateDraftRequest {
        items = items == null ? List.of() : List.copyOf(items);
    }
}

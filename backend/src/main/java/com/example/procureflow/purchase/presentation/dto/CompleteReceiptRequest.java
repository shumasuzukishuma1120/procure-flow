package com.example.procureflow.purchase.presentation.dto;

import jakarta.validation.constraints.AssertTrue;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.PositiveOrZero;
import jakarta.validation.constraints.Size;

import java.time.LocalDate;

public record CompleteReceiptRequest(
        @PositiveOrZero long version,
        @NotNull LocalDate receivedDate,
        @Size(max = 1000) String receiptNote,
        @AssertTrue(message = "全商品を受領したことを確認してください。") boolean allItemsReceived
) {
}

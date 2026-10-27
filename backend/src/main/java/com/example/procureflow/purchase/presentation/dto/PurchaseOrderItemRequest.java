package com.example.procureflow.purchase.presentation.dto;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;

import java.util.UUID;

public record PurchaseOrderItemRequest(
        @NotNull UUID requestItemId,
        @Min(1) @Max(99999999) long actualUnitPrice
) {
}

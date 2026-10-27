package com.example.procureflow.purchase.presentation.dto;

import java.util.UUID;

public record PurchaseItemResponse(
        UUID requestItemId,
        int lineNumber,
        String productName,
        String modelNumber,
        String productUrl,
        UUID categoryId,
        String categoryName,
        int quantity,
        long plannedUnitPrice,
        Long actualUnitPrice,
        long plannedAmount,
        Long actualAmount
) {
}

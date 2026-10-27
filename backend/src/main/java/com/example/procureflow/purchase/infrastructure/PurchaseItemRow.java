package com.example.procureflow.purchase.infrastructure;

import java.util.UUID;

public record PurchaseItemRow(
        UUID requestItemId,
        int lineNumber,
        String productName,
        String modelNumber,
        String productUrl,
        UUID categoryId,
        String categoryName,
        int quantity,
        long plannedUnitPrice,
        Long actualUnitPrice
) {
}

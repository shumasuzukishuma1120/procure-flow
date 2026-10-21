package com.example.procureflow.approval.infrastructure;

import java.util.UUID;

public record ApprovalItemRow(
        int lineNumber,
        String productName,
        String modelNumber,
        String productUrl,
        UUID categoryId,
        String categoryName,
        Integer quantity,
        Long plannedUnitPrice
) {
}

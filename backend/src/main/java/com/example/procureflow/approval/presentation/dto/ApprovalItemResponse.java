package com.example.procureflow.approval.presentation.dto;

import java.util.UUID;

public record ApprovalItemResponse(
        int lineNumber,
        String productName,
        String modelNumber,
        String productUrl,
        UUID categoryId,
        String categoryName,
        Integer quantity,
        Long plannedUnitPrice,
        long amount
) {
}

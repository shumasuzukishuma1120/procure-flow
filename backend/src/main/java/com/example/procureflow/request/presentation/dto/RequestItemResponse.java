package com.example.procureflow.request.presentation.dto;

import java.util.UUID;

public record RequestItemResponse(
        String productName,
        String modelNumber,
        String productUrl,
        UUID categoryId,
        Integer quantity,
        Long plannedUnitPrice
) {
}

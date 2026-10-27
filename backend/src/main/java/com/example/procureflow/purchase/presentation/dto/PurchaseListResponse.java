package com.example.procureflow.purchase.presentation.dto;

import java.util.List;

public record PurchaseListResponse(
        List<PurchaseListItemResponse> items,
        int page,
        int size,
        long totalElements,
        int totalPages
) {
}

package com.example.procureflow.request.presentation.dto;

import java.util.List;

public record MyRequestListResponse(
        List<MyRequestListItemResponse> items,
        int page,
        int size,
        long totalElements,
        int totalPages
) {
    public MyRequestListResponse {
        items = List.copyOf(items);
    }
}

package com.example.procureflow.approval.presentation.dto;

import java.util.List;

public record ApprovalListResponse(
        List<ApprovalListItemResponse> items,
        int page,
        int size,
        long totalElements,
        int totalPages
) {
    public ApprovalListResponse {
        items = List.copyOf(items);
    }
}

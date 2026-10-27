package com.example.procureflow.purchase.infrastructure;

import com.example.procureflow.purchase.application.PurchaseSort;
import com.example.procureflow.request.domain.RequestStatus;

import java.time.Instant;
import java.util.UUID;

public record PurchaseSearchCriteria(
        RequestStatus status,
        String keyword,
        UUID departmentId,
        UUID supplierId,
        Instant approvedFrom,
        Instant approvedToExclusive,
        PurchaseSort sort,
        int limit,
        long offset
) {
}

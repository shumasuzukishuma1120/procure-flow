package com.example.procureflow.request.infrastructure;

import com.example.procureflow.request.application.MyRequestSort;
import com.example.procureflow.request.domain.RequestStatus;

import java.time.Instant;
import java.util.UUID;

public record MyRequestSearchCriteria(
        UUID applicantId,
        RequestStatus status,
        String keyword,
        Instant createdFrom,
        Instant createdToExclusive,
        UUID categoryId,
        UUID supplierId,
        MyRequestSort sort,
        int limit,
        long offset
) {
}

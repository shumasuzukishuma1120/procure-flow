package com.example.procureflow.approval.presentation.dto;

import com.example.procureflow.request.domain.RequestStatus;

import java.time.Instant;
import java.util.UUID;

public record ApprovalActionResponse(
        UUID requestId,
        RequestStatus status,
        long version,
        Instant decidedAt
) {
}

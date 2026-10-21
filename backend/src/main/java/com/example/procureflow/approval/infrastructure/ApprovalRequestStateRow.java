package com.example.procureflow.approval.infrastructure;

import com.example.procureflow.request.domain.RequestStatus;

public record ApprovalRequestStateRow(
        RequestStatus status,
        long version
) {
}

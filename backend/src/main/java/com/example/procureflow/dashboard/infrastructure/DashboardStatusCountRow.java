package com.example.procureflow.dashboard.infrastructure;

import com.example.procureflow.request.domain.RequestStatus;

public record DashboardStatusCountRow(
        RequestStatus status,
        long count
) {
}

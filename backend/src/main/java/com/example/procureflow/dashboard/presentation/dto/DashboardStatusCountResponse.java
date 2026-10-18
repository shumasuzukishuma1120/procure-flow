package com.example.procureflow.dashboard.presentation.dto;

import com.example.procureflow.request.domain.RequestStatus;

public record DashboardStatusCountResponse(
        RequestStatus status,
        long count
) {
}

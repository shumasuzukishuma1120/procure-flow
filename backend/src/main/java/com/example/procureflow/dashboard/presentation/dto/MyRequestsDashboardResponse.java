package com.example.procureflow.dashboard.presentation.dto;

import java.util.List;

public record MyRequestsDashboardResponse(
        List<DashboardStatusCountResponse> statusCounts,
        List<DashboardRequestSummaryResponse> recentRequests
) {
}

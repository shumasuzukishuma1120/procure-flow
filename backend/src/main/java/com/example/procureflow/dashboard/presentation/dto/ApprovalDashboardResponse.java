package com.example.procureflow.dashboard.presentation.dto;

import java.util.List;

public record ApprovalDashboardResponse(
        long pendingCount,
        long overdueCount,
        List<DashboardRequestSummaryResponse> oldestRequests
) {
}

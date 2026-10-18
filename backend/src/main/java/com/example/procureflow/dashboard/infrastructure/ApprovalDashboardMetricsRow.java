package com.example.procureflow.dashboard.infrastructure;

public record ApprovalDashboardMetricsRow(
        long pendingCount,
        long overdueCount
) {
}

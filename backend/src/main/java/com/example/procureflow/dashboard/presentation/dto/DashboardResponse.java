package com.example.procureflow.dashboard.presentation.dto;

public record DashboardResponse(
        MyRequestsDashboardResponse myRequests,
        ApprovalDashboardResponse approvals,
        PurchaseDashboardResponse purchases
) {
}

package com.example.procureflow.dashboard.presentation.dto;

import java.util.List;

public record PurchaseDashboardResponse(
        long awaitingOrderCount,
        long awaitingReceiptCount,
        List<DashboardRequestSummaryResponse> upcomingRequests
) {
}
